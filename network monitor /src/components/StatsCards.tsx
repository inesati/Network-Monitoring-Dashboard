import React from 'react';
import { Activity, Shield, AlertTriangle, Network } from 'lucide-react';

interface StatsCardsProps {
  totalPackets: number;
  totalAlerts: number;
  isMonitoring: boolean;
  protocolCount: number;
}

/**
 * Statistics cards showing key metrics
 */
export const StatsCards: React.FC<StatsCardsProps> = ({
  totalPackets,
  totalAlerts,
  isMonitoring,
  protocolCount
}) => {
  const stats = [
    {
      name: 'Total Packets',
      value: totalPackets.toLocaleString(),
      icon: Activity,
      color: 'blue',
      description: 'Captured packets'
    },
    {
      name: 'Security Alerts',
      value: totalAlerts.toLocaleString(),
      icon: AlertTriangle,
      color: totalAlerts > 0 ? 'red' : 'green',
      description: 'Suspicious activities'
    },
    {
      name: 'Protocols Detected',
      value: protocolCount.toString(),
      icon: Network,
      color: 'purple',
      description: 'Active protocols'
    },
    {
      name: 'Monitor Status',
      value: isMonitoring ? 'Active' : 'Stopped',
      icon: Shield,
      color: isMonitoring ? 'green' : 'gray',
      description: 'Current state'
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'bg-blue-50 text-blue-600 border-blue-200',
      red: 'bg-red-50 text-red-600 border-red-200',
      green: 'bg-green-50 text-green-600 border-green-200',
      purple: 'bg-purple-50 text-purple-600 border-purple-200',
      gray: 'bg-gray-50 text-gray-600 border-gray-200'
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.gray;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat) => {
        const Icon = stat.icon;
        const colorClasses = getColorClasses(stat.color);
        
        return (
          <div
            key={stat.name}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {stat.name}
                </p>
                <p className="text-2xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </p>
                <p className="text-xs text-gray-500">
                  {stat.description}
                </p>
              </div>
              <div className={`p-3 rounded-lg border ${colorClasses}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};