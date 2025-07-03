import React from 'react';
import { Header } from './components/Header';
import { StatsCards } from './components/StatsCards';
import { PacketTable } from './components/PacketTable';
import { ProtocolChart } from './components/ProtocolChart';
import { TrafficChart } from './components/TrafficChart';
import { AlertsPanel } from './components/AlertsPanel';
import { ExportPanel } from './components/ExportPanel';
import { useNetworkMonitor } from './hooks/useNetworkMonitor';

/**
 * Main Network Monitor Dashboard Application
 */
function App() {
  const {
    isMonitoring,
    packets,
    alerts,
    protocolStats,
    trafficData,
    startMonitoring,
    stopMonitoring,
    clearData,
    totalPackets,
    totalAlerts
  } = useNetworkMonitor();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header
        isMonitoring={isMonitoring}
        onStartMonitoring={startMonitoring}
        onStopMonitoring={stopMonitoring}
        onClearData={clearData}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <StatsCards
          totalPackets={totalPackets}
          totalAlerts={totalAlerts}
          isMonitoring={isMonitoring}
          protocolCount={protocolStats.length}
        />

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <ProtocolChart protocolStats={protocolStats} />
          <TrafficChart trafficData={trafficData} />
        </div>

        {/* Alerts and Export Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <AlertsPanel alerts={alerts} />
          </div>
          <div>
            <ExportPanel packets={packets} alerts={alerts} />
          </div>
        </div>

        {/* Packet Table */}
        <PacketTable packets={packets} />
      </main>
    </div>
  );
}

export default App;