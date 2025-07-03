import React, { useState } from 'react';
import { Download, FileText, Database } from 'lucide-react';
import { NetworkPacket, SecurityAlert } from '../types/network';
import { DataExporter } from '../utils/dataExporter';

interface ExportPanelProps {
  packets: NetworkPacket[];
  alerts: SecurityAlert[];
}

/**
 * Data export controls panel
 */
export const ExportPanel: React.FC<ExportPanelProps> = ({ packets, alerts }) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (
    dataType: 'packets' | 'alerts',
    format: 'csv' | 'json'
  ) => {
    setIsExporting(true);
    
    try {
      let content: string;
      let filename: string;
      let mimeType: string;

      if (dataType === 'packets') {
        if (format === 'csv') {
          content = DataExporter.exportPacketsToCSV(packets);
          filename = DataExporter.generateFilename('network_packets', 'csv');
          mimeType = 'text/csv';
        } else {
          content = DataExporter.exportPacketsToJSON(packets);
          filename = DataExporter.generateFilename('network_packets', 'json');
          mimeType = 'application/json';
        }
      } else {
        if (format === 'csv') {
          content = DataExporter.exportAlertsToCSV(alerts);
          filename = DataExporter.generateFilename('security_alerts', 'csv');
          mimeType = 'text/csv';
        } else {
          content = DataExporter.exportAlertsToJSON(alerts);
          filename = DataExporter.generateFilename('security_alerts', 'json');
          mimeType = 'application/json';
        }
      }

      DataExporter.downloadFile(content, filename, mimeType);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const exportOptions = [
    {
      title: 'Network Packets',
      description: `Export ${packets.length.toLocaleString()} captured packets`,
      dataType: 'packets' as const,
      icon: Database,
      disabled: packets.length === 0
    },
    {
      title: 'Security Alerts',
      description: `Export ${alerts.length.toLocaleString()} security alerts`,
      dataType: 'alerts' as const,
      icon: FileText,
      disabled: alerts.length === 0
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <Download className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-medium text-gray-900">Export Data</h3>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Download captured network data for analysis or reporting
        </p>
      </div>

      <div className="p-6 space-y-6">
        {exportOptions.map((option) => {
          const Icon = option.icon;
          
          return (
            <div key={option.dataType} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg">
                  <Icon className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">{option.title}</h4>
                  <p className="text-xs text-gray-500">{option.description}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleExport(option.dataType, 'csv')}
                  disabled={option.disabled || isExporting}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Export CSV
                </button>
                
                <button
                  onClick={() => handleExport(option.dataType, 'json')}
                  disabled={option.disabled || isExporting}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Database className="w-4 h-4 mr-2" />
                  Export JSON
                </button>
              </div>
            </div>
          );
        })}

        {packets.length === 0 && alerts.length === 0 && (
          <div className="text-center py-8">
            <Download className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-sm font-medium text-gray-900 mb-2">No Data to Export</h4>
            <p className="text-sm text-gray-500">
              Start monitoring to capture data for export
            </p>
          </div>
        )}
      </div>
    </div>
  );
};