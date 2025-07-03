import React, { useMemo } from 'react';
import { NetworkPacket } from '../types/network';
import { Clock, Globe, ArrowRight } from 'lucide-react';

interface PacketTableProps {
  packets: NetworkPacket[];
  maxRows?: number;
}

/**
 * Real-time packet display table
 */
export const PacketTable: React.FC<PacketTableProps> = ({ 
  packets, 
  maxRows = 50 
}) => {
  const displayPackets = useMemo(() => {
    return packets.slice(0, maxRows);
  }, [packets, maxRows]);

  const getProtocolColor = (protocol: string) => {
    const colors = {
      TCP: 'bg-blue-100 text-blue-800',
      UDP: 'bg-green-100 text-green-800',
      HTTP: 'bg-yellow-100 text-yellow-800',
      HTTPS: 'bg-red-100 text-red-800',
      DNS: 'bg-purple-100 text-purple-800',
      ICMP: 'bg-cyan-100 text-cyan-800'
    };
    return colors[protocol as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const formatTimestamp = (timestamp: Date) => {
    return timestamp.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      fractionalSecondDigits: 3
    });
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (displayPackets.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="text-center">
          <Globe className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Packets Captured</h3>
          <p className="text-gray-500">Start monitoring to see network traffic in real-time</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Live Packet Stream</h3>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            <span>Showing latest {displayPackets.length} packets</span>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Timestamp
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Source → Destination
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Protocol
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Port
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Size
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Flags
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {displayPackets.map((packet, index) => (
              <tr 
                key={packet.id}
                className={`hover:bg-gray-50 transition-colors ${
                  index === 0 ? 'bg-blue-50' : ''
                }`}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                  {formatTimestamp(packet.timestamp)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono">{packet.sourceIp}</span>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                    <span className="font-mono">{packet.destinationIp}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getProtocolColor(packet.protocol)}`}>
                    {packet.protocol}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                  {packet.port}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatSize(packet.size)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {packet.flags?.join(', ') || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};