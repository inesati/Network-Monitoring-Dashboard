import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrafficData } from '../types/network';
import { TrendingUp, Activity } from 'lucide-react';

interface TrafficChartProps {
  trafficData: TrafficData[];
}

/**
 * Real-time traffic visualization component
 */
export const TrafficChart: React.FC<TrafficChartProps> = ({ trafficData }) => {
  const [chartType, setChartType] = React.useState<'line' | 'area'>('line');
  const [metric, setMetric] = React.useState<'packets' | 'bytes'>('packets');

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: <span className="font-medium">{entry.value.toLocaleString()}</span>
              {metric === 'bytes' ? ' bytes/s' : ' packets/s'}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const getChartData = () => {
    if (metric === 'packets') {
      return trafficData.map(data => ({
        ...data,
        total: data.packetsPerSecond,
        TCP: data.tcpCount,
        UDP: data.udpCount,
        ICMP: data.icmpCount,
        HTTP: data.httpCount
      }));
    } else {
      return trafficData.map(data => ({
        ...data,
        total: data.bytesPerSecond
      }));
    }
  };

  const chartData = getChartData();

  if (trafficData.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="text-center">
          <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Traffic Data</h3>
          <p className="text-gray-500">Start monitoring to see real-time traffic patterns</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Real-time Traffic</h3>
          <div className="flex items-center space-x-4">
            {/* Metric Toggle */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setMetric('packets')}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  metric === 'packets' 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Packets
              </button>
              <button
                onClick={() => setMetric('bytes')}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  metric === 'bytes' 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Bytes
              </button>
            </div>

            {/* Chart Type Toggle */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setChartType('line')}
                className={`p-2 rounded-md transition-colors ${
                  chartType === 'line' 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
                title="Line Chart"
              >
                <TrendingUp className="w-4 h-4" />
              </button>
              <button
                onClick={() => setChartType('area')}
                className={`p-2 rounded-md transition-colors ${
                  chartType === 'area' 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
                title="Area Chart"
              >
                <Activity className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'line' ? (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="timestamp" 
                  tick={{ fontSize: 12 }}
                  interval="preserveStartEnd"
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                {metric === 'packets' ? (
                  <>
                    <Line 
                      type="monotone" 
                      dataKey="total" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      name="Total Packets"
                      dot={false}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="TCP" 
                      stroke="#10b981" 
                      strokeWidth={1}
                      name="TCP"
                      dot={false}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="UDP" 
                      stroke="#f59e0b" 
                      strokeWidth={1}
                      name="UDP"
                      dot={false}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="HTTP" 
                      stroke="#ef4444" 
                      strokeWidth={1}
                      name="HTTP/HTTPS"
                      dot={false}
                    />
                  </>
                ) : (
                  <Line 
                    type="monotone" 
                    dataKey="total" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    name="Bytes per Second"
                    dot={false}
                  />
                )}
              </LineChart>
            ) : (
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="timestamp" 
                  tick={{ fontSize: 12 }}
                  interval="preserveStartEnd"
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                {metric === 'packets' ? (
                  <>
                    <Area 
                      type="monotone" 
                      dataKey="TCP" 
                      stackId="1"
                      stroke="#10b981" 
                      fill="#10b981"
                      fillOpacity={0.6}
                      name="TCP"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="UDP" 
                      stackId="1"
                      stroke="#f59e0b" 
                      fill="#f59e0b"
                      fillOpacity={0.6}
                      name="UDP"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="HTTP" 
                      stackId="1"
                      stroke="#ef4444" 
                      fill="#ef4444"
                      fillOpacity={0.6}
                      name="HTTP/HTTPS"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="ICMP" 
                      stackId="1"
                      stroke="#8b5cf6" 
                      fill="#8b5cf6"
                      fillOpacity={0.6}
                      name="ICMP"
                    />
                  </>
                ) : (
                  <Area 
                    type="monotone" 
                    dataKey="total" 
                    stroke="#3b82f6" 
                    fill="#3b82f6"
                    fillOpacity={0.6}
                    name="Bytes per Second"
                  />
                )}
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};