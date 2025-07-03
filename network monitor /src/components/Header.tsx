import React from 'react';
import { Shield, Activity, Wifi } from 'lucide-react';

interface HeaderProps {
  isMonitoring: boolean;
  onStartMonitoring: () => void;
  onStopMonitoring: () => void;
  onClearData: () => void;
}

/**
 * Application header with monitoring controls
 */
export const Header: React.FC<HeaderProps> = ({
  isMonitoring,
  onStartMonitoring,
  onStopMonitoring,
  onClearData
}) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Network Monitor</h1>
              <p className="text-sm text-gray-500">Real-time Traffic Analysis</p>
            </div>
          </div>

          {/* Status Indicator */}
          <div className="flex items-center space-x-2">
            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${
              isMonitoring 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-600'
            }`}>
              {isMonitoring ? (
                <>
                  <Activity className="w-4 h-4 animate-pulse" />
                  <span>Monitoring Active</span>
                </>
              ) : (
                <>
                  <Wifi className="w-4 h-4" />
                  <span>Monitoring Stopped</span>
                </>
              )}
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center space-x-3">
            {!isMonitoring ? (
              <button
                onClick={onStartMonitoring}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <Activity className="w-4 h-4 mr-2" />
                Start Monitoring
              </button>
            ) : (
              <button
                onClick={onStopMonitoring}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              >
                <Activity className="w-4 h-4 mr-2" />
                Stop Monitoring
              </button>
            )}
            
            <button
              onClick={onClearData}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Clear Data
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};