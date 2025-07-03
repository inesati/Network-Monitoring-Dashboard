import React from 'react';
import { SecurityAlert } from '../types/network';
import { AlertTriangle, Shield, Clock, MapPin } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface AlertsPanelProps {
  alerts: SecurityAlert[];
  maxAlerts?: number;
}

/**
 * Security alerts display panel
 */
export const AlertsPanel: React.FC<AlertsPanelProps> = ({ 
  alerts, 
  maxAlerts = 20 
}) => {
  const displayAlerts = alerts.slice(0, maxAlerts);

  const getSeverityColor = (severity: SecurityAlert['severity']) => {
    const colors = {
      LOW: 'bg-blue-50 text-blue-700 border-blue-200',
      MEDIUM: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      HIGH: 'bg-orange-50 text-orange-700 border-orange-200',
      CRITICAL: 'bg-red-50 text-red-700 border-red-200'
    };
    return colors[severity];
  };

  const getSeverityIcon = (severity: SecurityAlert['severity']) => {
    switch (severity) {
      case 'CRITICAL':
      case 'HIGH':
        return <AlertTriangle className="w-4 h-4" />;
      case 'MEDIUM':
        return <Shield className="w-4 h-4" />;
      default:
        return <Shield className="w-4 h-4" />;
    }
  };

  const getAlertTypeDescription = (type: SecurityAlert['type']) => {
    const descriptions = {
      DOS_ATTACK: 'Potential Denial of Service attack detected',
      PORT_SCAN: 'Port scanning activity identified',
      UNUSUAL_TRAFFIC: 'Unusual traffic pattern observed',
      SUSPICIOUS_PROTOCOL: 'Suspicious protocol usage detected'
    };
    return descriptions[type];
  };

  if (displayAlerts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="text-center">
          <Shield className="w-12 h-12 text-green-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Security Alerts</h3>
          <p className="text-gray-500">Your network traffic appears normal</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Security Alerts</h3>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <AlertTriangle className="w-4 h-4" />
            <span>{displayAlerts.length} active alerts</span>
          </div>
        </div>
      </div>

      <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
        {displayAlerts.map((alert, index) => (
          <div 
            key={alert.id} 
            className={`p-6 hover:bg-gray-50 transition-colors ${
              index === 0 ? 'bg-red-50' : ''
            }`}
          >
            <div className="flex items-start space-x-4">
              {/* Severity Badge */}
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium border ${getSeverityColor(alert.severity)}`}>
                {getSeverityIcon(alert.severity)}
                <span>{alert.severity}</span>
              </div>

              {/* Alert Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-900">
                    {getAlertTypeDescription(alert.type)}
                  </h4>
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>{formatDistanceToNow(alert.timestamp, { addSuffix: true })}</span>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-3">
                  {alert.description}
                </p>

                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-3 h-3" />
                    <span>Source: {alert.sourceIp}</span>
                  </div>
                  {alert.packetCount && (
                    <div className="flex items-center space-x-1">
                      <span>Packets: {alert.packetCount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-1">
                    <span>Type: {alert.type.replace('_', ' ')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {alerts.length > maxAlerts && (
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
          <p className="text-sm text-gray-600 text-center">
            Showing {maxAlerts} of {alerts.length} alerts
          </p>
        </div>
      )}
    </div>
  );
};