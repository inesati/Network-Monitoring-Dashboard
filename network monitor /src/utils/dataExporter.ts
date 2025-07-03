import { NetworkPacket, SecurityAlert } from '../types/network';

/**
 * Data export utilities for network monitoring data
 */
export class DataExporter {
  /**
   * Export packets to CSV format
   */
  static exportPacketsToCSV(packets: NetworkPacket[]): string {
    const headers = ['ID', 'Timestamp', 'Source IP', 'Destination IP', 'Protocol', 'Port', 'Size (bytes)', 'Flags'];
    const csvContent = [
      headers.join(','),
      ...packets.map(packet => [
        packet.id,
        packet.timestamp.toISOString(),
        packet.sourceIp,
        packet.destinationIp,
        packet.protocol,
        packet.port.toString(),
        packet.size.toString(),
        packet.flags?.join('|') || ''
      ].join(','))
    ].join('\n');

    return csvContent;
  }

  /**
   * Export alerts to CSV format
   */
  static exportAlertsToCSV(alerts: SecurityAlert[]): string {
    const headers = ['ID', 'Timestamp', 'Type', 'Severity', 'Source IP', 'Description', 'Packet Count'];
    const csvContent = [
      headers.join(','),
      ...alerts.map(alert => [
        alert.id,
        alert.timestamp.toISOString(),
        alert.type,
        alert.severity,
        alert.sourceIp,
        `"${alert.description}"`, // Wrap description in quotes for CSV safety
        alert.packetCount?.toString() || ''
      ].join(','))
    ].join('\n');

    return csvContent;
  }

  /**
   * Export packets to JSON format
   */
  static exportPacketsToJSON(packets: NetworkPacket[]): string {
    return JSON.stringify({
      exportDate: new Date().toISOString(),
      totalPackets: packets.length,
      packets: packets
    }, null, 2);
  }

  /**
   * Export alerts to JSON format
   */
  static exportAlertsToJSON(alerts: SecurityAlert[]): string {
    return JSON.stringify({
      exportDate: new Date().toISOString(),
      totalAlerts: alerts.length,
      alerts: alerts
    }, null, 2);
  }

  /**
   * Download data as file
   */
  static downloadFile(content: string, filename: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  }

  /**
   * Generate filename with timestamp
   */
  static generateFilename(prefix: string, extension: string): string {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    return `${prefix}_${timestamp}.${extension}`;
  }
}