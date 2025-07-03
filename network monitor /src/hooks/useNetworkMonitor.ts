import { useState, useEffect, useCallback, useRef } from 'react';
import { NetworkPacket, SecurityAlert, ProtocolStats, TrafficData } from '../types/network';
import { NetworkSimulator } from '../utils/networkSimulator';

/**
 * Custom hook for network monitoring functionality
 */
export const useNetworkMonitor = () => {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [packets, setPackets] = useState<NetworkPacket[]>([]);
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [protocolStats, setProtocolStats] = useState<ProtocolStats[]>([]);
  const [trafficData, setTrafficData] = useState<TrafficData[]>([]);
  
  const simulatorRef = useRef<NetworkSimulator | null>(null);
  const trafficIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Protocol colors for consistent visualization
  const protocolColors = {
    TCP: '#3b82f6',
    UDP: '#10b981',
    HTTP: '#f59e0b',
    HTTPS: '#ef4444',
    DNS: '#8b5cf6',
    ICMP: '#06b6d4'
  };

  /**
   * Initialize network simulator
   */
  useEffect(() => {
    simulatorRef.current = new NetworkSimulator();
    
    // Subscribe to packet events
    simulatorRef.current.onPacket((packet: NetworkPacket) => {
      setPackets(prev => {
        const updated = [packet, ...prev];
        // Keep only last 1000 packets for performance
        return updated.slice(0, 1000);
      });
    });

    // Subscribe to alert events
    simulatorRef.current.onAlert((alert: SecurityAlert) => {
      setAlerts(prev => {
        const updated = [alert, ...prev];
        // Keep only last 100 alerts
        return updated.slice(0, 100);
      });
    });

    return () => {
      if (simulatorRef.current) {
        simulatorRef.current.stop();
      }
      if (trafficIntervalRef.current) {
        clearInterval(trafficIntervalRef.current);
      }
    };
  }, []);

  /**
   * Update protocol statistics when packets change
   */
  useEffect(() => {
    const protocolCounts = packets.reduce((acc, packet) => {
      acc[packet.protocol] = (acc[packet.protocol] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const total = packets.length;
    const stats: ProtocolStats[] = Object.entries(protocolCounts).map(([protocol, count]) => ({
      protocol,
      count,
      percentage: total > 0 ? (count / total) * 100 : 0,
      color: protocolColors[protocol as keyof typeof protocolColors] || '#6b7280'
    }));

    setProtocolStats(stats.sort((a, b) => b.count - a.count));
  }, [packets]);

  /**
   * Start traffic data collection
   */
  const startTrafficCollection = useCallback(() => {
    trafficIntervalRef.current = setInterval(() => {
      const now = new Date();
      const oneSecondAgo = new Date(now.getTime() - 1000);
      
      const recentPackets = packets.filter(p => p.timestamp >= oneSecondAgo);
      
      const protocolCounts = recentPackets.reduce((acc, packet) => {
        acc[packet.protocol.toLowerCase()] = (acc[packet.protocol.toLowerCase()] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const totalBytes = recentPackets.reduce((sum, packet) => sum + packet.size, 0);

      const trafficPoint: TrafficData = {
        timestamp: now.toLocaleTimeString(),
        packetsPerSecond: recentPackets.length,
        bytesPerSecond: totalBytes,
        tcpCount: protocolCounts.tcp || 0,
        udpCount: protocolCounts.udp || 0,
        icmpCount: protocolCounts.icmp || 0,
        httpCount: (protocolCounts.http || 0) + (protocolCounts.https || 0)
      };

      setTrafficData(prev => {
        const updated = [...prev, trafficPoint];
        // Keep only last 60 data points (1 minute of data)
        return updated.slice(-60);
      });
    }, 1000);
  }, [packets]);

  /**
   * Start monitoring
   */
  const startMonitoring = useCallback(() => {
    if (simulatorRef.current && !isMonitoring) {
      simulatorRef.current.start();
      startTrafficCollection();
      setIsMonitoring(true);
    }
  }, [isMonitoring, startTrafficCollection]);

  /**
   * Stop monitoring
   */
  const stopMonitoring = useCallback(() => {
    if (simulatorRef.current && isMonitoring) {
      simulatorRef.current.stop();
      if (trafficIntervalRef.current) {
        clearInterval(trafficIntervalRef.current);
        trafficIntervalRef.current = null;
      }
      setIsMonitoring(false);
    }
  }, [isMonitoring]);

  /**
   * Clear all data
   */
  const clearData = useCallback(() => {
    setPackets([]);
    setAlerts([]);
    setProtocolStats([]);
    setTrafficData([]);
  }, []);

  /**
   * Get recent alerts (last 24 hours)
   */
  const getRecentAlerts = useCallback(() => {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return alerts.filter(alert => alert.timestamp >= oneDayAgo);
  }, [alerts]);

  return {
    isMonitoring,
    packets,
    alerts,
    protocolStats,
    trafficData,
    startMonitoring,
    stopMonitoring,
    clearData,
    getRecentAlerts,
    totalPackets: packets.length,
    totalAlerts: alerts.length
  };
};