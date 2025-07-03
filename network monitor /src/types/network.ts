/**
 * Network packet data structure
 */
export interface NetworkPacket {
  id: string;
  timestamp: Date;
  sourceIp: string;
  destinationIp: string;
  protocol: 'TCP' | 'UDP' | 'ICMP' | 'HTTP' | 'HTTPS' | 'DNS';
  port: number;
  size: number;
  flags?: string[];
}

/**
 * Protocol statistics for visualization
 */
export interface ProtocolStats {
  protocol: string;
  count: number;
  percentage: number;
  color: string;
}

/**
 * Traffic data for time-series charts
 */
export interface TrafficData {
  timestamp: string;
  packetsPerSecond: number;
  bytesPerSecond: number;
  tcpCount: number;
  udpCount: number;
  icmpCount: number;
  httpCount: number;
}

/**
 * Suspicious activity alert
 */
export interface SecurityAlert {
  id: string;
  timestamp: Date;
  type: 'DOS_ATTACK' | 'PORT_SCAN' | 'UNUSUAL_TRAFFIC' | 'SUSPICIOUS_PROTOCOL';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  sourceIp: string;
  description: string;
  packetCount?: number;
}

/**
 * Network interface information
 */
export interface NetworkInterface {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
}