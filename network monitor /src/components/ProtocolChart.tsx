import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { ProtocolStats } from '../types/network';
import { BarChart3, PieChart as PieChartIcon } from 'lucide-react';

interface ProtocolChartProps {
  protocolStats: ProtocolStats[];
}

/**
 * Protocol distribution visualization component
 */
export const ProtocolChart: React.FC<ProtocolChartProps> = ({ protocolStats }) => {
  const [chartType, setChartType] = React.useState<'pie' | 'bar'>('pie');

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{data.protocol}</p>
          <p className="text-sm text-gray-600">
            Count: <span className="font-medium">{data.count.toLocaleString()}</span>
          </p>
          <p className="text-sm text-gray-600">
            Percentage: <span className="font-medium">{data.percentage.toFixed(1)}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  if (protocolStats.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="text-center">
          <PieChartIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Protocol Data</h3>
          <p className="text-gray-500">Start monitoring to see protocol distribution</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Protocol Distribution</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setChartType('pie')}
              className={`p-2 rounded-md transition-colors ${
                chartType === 'pie' 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
              title="Pie Chart"
            >
              <PieChartIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setChartType('bar')}
              className={`p-2 rounded-md transition-colors ${
                chartType === 'bar' 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
              title="Bar Chart"
            >
              <BarChart3 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'pie' ? (
              <PieChart>
                <Pie
                  data={protocolStats}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ protocol, percentage }) => `${protocol} (${percentage.toFixed(1)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {protocolStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            ) : (
              <BarChart data={protocolStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="protocol" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Protocol Statistics Table */}
        <div className="mt-6 border-t border-gray-200 pt-6">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Protocol Breakdown</h4>
          <div className="space-y-2">
            {protocolStats.map((stat) => (
              <div key={stat.protocol} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: stat.color }}
                  />
                  <span className="text-sm font-medium text-gray-900">{stat.protocol}</span>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>{stat.count.toLocaleString()} packets</span>
                  <span className="font-medium">{stat.percentage.toFixed(1)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};