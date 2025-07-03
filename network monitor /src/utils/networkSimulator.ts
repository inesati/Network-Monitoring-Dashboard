import { NetworkPacket, SecurityAlert } from '../types/network';

/**
 * Network traffic simulator for demonstration purposes
 * Generates realistic network packet data with various protocols and patterns
 */
export class NetworkSimulator {
  private isRunning = false;
  private intervalId: NodeJS.Timeout | null = null;
  private packetCallbacks: ((packet: NetworkPacket) => void)[] = [];
  private alertCallbacks: ((alert: SecurityAlert) => void)[] = [];
  private packetCounter = 0;
  private alertCounter = 0;

  // Common IP ranges for simulation
  private readonly ipRanges = [
    '192.168.1.',
    '10.0.0.',
    '172.16.0.',
    '203.0.113.',
    '198.51.100.',
    '8.8.8.',
    '1.1.1.'
  ];

  // Common ports by protocol
  private readonly commonPorts = {
    TCP: [80, 443, 22, 21, 25, 53, 110, 143, 993, 995],
    UDP: [53, 67, 68, 123, 161, 162, 514, 1194],
    HTTP: [80, 8080, 3000, 5000],
    HTTPS: [443, 8443],
    DNS: [53],
    ICMP: [0] // ICMP doesn't use ports, but we'll use 0 for consistency
  };

  /**
   * Start the network simulation
   */
  start(): void {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.intervalId = setInterval(() => {
      this.generatePackets();
      this.checkForSuspiciousActivity();
    }, 100); // Generate packets every 100ms
  }

  /**
   * Stop the network simulation
   */
  stop(): void {
    this.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  /**
   * Subscribe to packet events
   */
  onPacket(callback: (packet: NetworkPacket) => void): void {
    this.packetCallbacks.push(callback);
  }

  /**
   * Subscribe to alert events
   */
  onAlert(callback: (alert: SecurityAlert) => void): void {
    this.alertCallbacks.push(callback);
  }

  /**
   * Generate random network packets
   */
  private generatePackets(): void {
    const packetsToGenerate = Math.floor(Math.random() * 5) + 1; // 1-5 packets per interval
    
    for (let i = 0; i < packetsToGenerate; i++) {
      const packet = this.createRandomPacket();
      this.packetCallbacks.forEach(callback => callback(packet));
    }
  }

  /**
   * Create a random network packet
   */
  private createRandomPacket(): NetworkPacket {
    const protocols: (keyof typeof this.commonPorts)[] = ['TCP', 'UDP', 'HTTP', 'HTTPS', 'DNS', 'ICMP'];
    const protocol = protocols[Math.floor(Math.random() * protocols.length)];
    const ports = this.commonPorts[protocol];
    
    return {
      id: `packet_${++this.packetCounter}`,
      timestamp: new Date(),
      sourceIp: this.generateRandomIp(),
      destinationIp: this.generateRandomIp(),
      protocol,
      port: ports[Math.floor(Math.random() * ports.length)],
      size: Math.floor(Math.random() * 1500) + 64, // 64-1564 bytes
      flags: protocol === 'TCP' ? this.generateTcpFlags() : undefined
    };
  }

  /**
   * Generate random IP address
   */
  private generateRandomIp(): string {
    const range = this.ipRanges[Math.floor(Math.random() * this.ipRanges.length)];
    const lastOctet = Math.floor(Math.random() * 254) + 1;
    return `${range}${lastOctet}`;
  }

  /**
   * Generate TCP flags
   */
  private generateTcpFlags(): string[] {
    const allFlags = ['SYN', 'ACK', 'FIN', 'RST', 'PSH', 'URG'];
    const flagCount = Math.floor(Math.random() * 3) + 1;
    const flags: string[] = [];
    
    for (let i = 0; i < flagCount; i++) {
      const flag = allFlags[Math.floor(Math.random() * allFlags.length)];
      if (!flags.includes(flag)) {
        flags.push(flag);
      }
    }
    
    return flags;
  }

  /**
   * Check for suspicious activity patterns
   */
  private checkForSuspiciousActivity(): void {
    // Randomly generate alerts to simulate detection
    if (Math.random() < 0.02) { // 2% chance per check
      const alert = this.generateRandomAlert();
      this.alertCallbacks.forEach(callback => callback(alert));
    }
  }

  /**
   * Generate random security alert
   */
  private generateRandomAlert(): SecurityAlert {
    const alertTypes = [
      {
        type: 'DOS_ATTACK' as const,
        severity: 'HIGH' as const,
        description: 'High volume of packets detected from single source'
      },
      {
        type: 'PORT_SCAN' as const,
        severity: 'MEDIUM' as const,
        description: 'Sequential port scanning activity detected'
      },
      {
        type: 'UNUSUAL_TRAFFIC' as const,
        severity: 'LOW' as const,
        description: 'Unusual traffic pattern on non-standard port'
      },
      {
        type: 'SUSPICIOUS_PROTOCOL' as const,
        severity: 'MEDIUM' as const,
        description: 'Suspicious protocol usage detected'
      }
    ];

    const alertTemplate = alertTypes[Math.floor(Math.random() * alertTypes.length)];
    
    return {
      id: `alert_${++this.alertCounter}`,
      timestamp: new Date(),
      type: alertTemplate.type,
      severity: alertTemplate.severity,
      sourceIp: this.generateRandomIp(),
      description: alertTemplate.description,
      packetCount: Math.floor(Math.random() * 1000) + 100
    };
  }

  /**
   * Get current running status
   */
  get running(): boolean {
    return this.isRunning;
  }
}