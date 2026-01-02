export interface SystemMetrics {
  // AI/ML Metrics
  accuracy: number;
  throughput: number;
  latency: number;
  gpuUtilization: number;
  memoryUsage: number;
  activeModels: number;
  
  // System Performance
  uptime: number;
  cpuUsage: number;
  diskUsage: number;
  networkTraffic: number;
  
  // Business Metrics
  activeUsers: number;
  globalReach: number;
  dataProcessed: number;
  totalProcessed: number;
  successRate: number;
  
  // Executive Metrics (CEO)
  revenue: number;
  growth: number;
  customers: number;
  marketShare: number;
  satisfaction: number;
  employees: number;
  
  // Financial Metrics (CFO)
  profit: number;
  cashFlow: number;
  expenses: number;
  roi: number;
  burnRate: number;
  
  // Marketing Metrics (CMO)
  cac: number; // Customer Acquisition Cost
  ltv: number; // Lifetime Value
  conversion: number;
  engagement: number;
  reach: number;
  brandAwareness: number;
  
  // Technology Metrics (CTO)
  deployments: number;
  codeQuality: number;
  security: number;
  performance: number;
  infrastructure: number;
  
  // Operations Metrics (COO)
  efficiency: number;
  quality: number;
  onTime: number;
  utilization: number;
  incidents: number;
}

export interface SystemComponent {
  name: string;
  status: 'online' | 'warning' | 'offline';
  uptime: string;
  load: number;
}

export interface PipelineStage {
  id: string;
  name: string;
  status: 'processing' | 'completed' | 'waiting' | 'error';
  progress: number;
  throughput: number;
}

export interface BudgetItem {
  category: string;
  allocated: number;
  spent: number;
  variance: number;
}

export interface Investment {
  investment: string;
  value: number;
  return: number;
}

export interface Campaign {
  name: string;
  budget: number;
  spent: number;
  performance: number;
  status: string;
}

export interface Channel {
  channel: string;
  traffic: number;
  conversion: number;
  roi: number;
}

export interface BrandMetric {
  metric: string;
  value: number;
  trend: 'up' | 'down';
}

export interface ProductionLine {
  line: string;
  efficiency: number;
  output: number;
  status: string;
}

export interface Supplier {
  supplier: string;
  delivery: number;
  quality: number;
  cost: string;
}

export interface PerformanceMetric {
  metric: string;
  value: number;
  target: number;
}

export interface TechService {
  service: string;
  status: string;
  load: number;
}

export interface SecurityCheck {
  check: string;
  status: string;
  lastRun: string;
}

export interface CodeStat {
  metric: string;
  value: string;
  change: string;
}

export interface TeamProductivity {
  metric: string;
  value: string;
  change: string;
}

export interface StrategicInitiative {
  name: string;
  progress: number;
  status: string;
}

export interface RegionalData {
  region: string;
  revenue: number;
  growth: number;
}

export interface KPI {
  metric: string;
  value: string;
  trend: 'up' | 'down';
}

class MetricsService {
  private baseUrl: string;
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private cacheTimeout = 30000; // 30 seconds

  constructor(baseUrl: string = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000') {
    this.baseUrl = baseUrl;
  }

  // Helper: Simulate network delay
  private async simulateNetworkDelay(): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));
  }

  // Helper: Generate random metrics
  private generateMockMetrics(): SystemMetrics {
    return {
      // AI/ML Metrics
      accuracy: 0.92 + Math.random() * 0.08,
      throughput: 1000 + Math.random() * 500,
      latency: 50 + Math.random() * 100,
      gpuUtilization: Math.random() * 100,
      memoryUsage: 40 + Math.random() * 40,
      activeModels: 5 + Math.floor(Math.random() * 10),
      
      // System Performance
      uptime: 99.5 + Math.random() * 0.5,
      cpuUsage: 30 + Math.random() * 40,
      diskUsage: 60 + Math.random() * 20,
      networkTraffic: 500 + Math.random() * 1000,
      
      // Business Metrics
      activeUsers: 1000 + Math.floor(Math.random() * 5000),
      globalReach: 150,
      dataProcessed: 5000 + Math.random() * 10000,
      totalProcessed: 500000,
      successRate: 0.95 + Math.random() * 0.05,
      
      // Executive Metrics
      revenue: 1000000 + Math.random() * 500000,
      growth: 15 + Math.random() * 10,
      customers: 500 + Math.floor(Math.random() * 200),
      marketShare: 25 + Math.random() * 10,
      satisfaction: 4.5 + Math.random() * 0.5,
      employees: 200 + Math.floor(Math.random() * 100),
      
      // Financial Metrics
      profit: 200000 + Math.random() * 100000,
      cashFlow: 500000 + Math.random() * 200000,
      expenses: 300000 + Math.random() * 100000,
      roi: 180 + Math.random() * 50,
      burnRate: 50000 + Math.random() * 20000,
      
      // Marketing Metrics
      cac: 150 + Math.random() * 100,
      ltv: 2000 + Math.random() * 1000,
      conversion: 3.5 + Math.random() * 2,
      engagement: 65 + Math.random() * 25,
      reach: 500000 + Math.random() * 200000,
      brandAwareness: 75 + Math.random() * 15,
      
      // Tech Metrics
      deployments: 50 + Math.floor(Math.random() * 30),
      codeQuality: 8.5 + Math.random() * 1.5,
      security: 95 + Math.random() * 5,
      performance: 9.0 + Math.random() * 1,
      infrastructure: 98 + Math.random() * 2,
      
      // Operations Metrics
      efficiency: 85 + Math.random() * 10,
      quality: 99.2 + Math.random() * 0.8,
      onTime: 92 + Math.random() * 5,
      utilization: 80 + Math.random() * 15,
      incidents: Math.floor(Math.random() * 5)
    };
  }

  // MOCK: Get System Metrics
  // TODO: Replace with real API endpoint: GET ${baseUrl}/metrics/system
  async getSystemMetrics(): Promise<SystemMetrics> {
    console.log('[MOCK] Get System Metrics endpoint');
    await this.simulateNetworkDelay();
    return this.generateMockMetrics();
  }

  // MOCK: Get AI Metrics
  // TODO: Replace with real API endpoint: GET ${baseUrl}/metrics/ai
  async getAIMetrics(): Promise<Partial<SystemMetrics>> {
    console.log('[MOCK] Get AI Metrics endpoint');
    await this.simulateNetworkDelay();
    const metrics = this.generateMockMetrics();
    return {
      accuracy: metrics.accuracy,
      throughput: metrics.throughput,
      latency: metrics.latency,
      gpuUtilization: metrics.gpuUtilization,
      memoryUsage: metrics.memoryUsage,
      activeModels: metrics.activeModels
    };
  }

  // MOCK: Get System Components
  // TODO: Replace with real API endpoint: GET ${baseUrl}/metrics/components
  async getSystemComponents(): Promise<SystemComponent[]> {
    console.log('[MOCK] Get System Components endpoint');
    await this.simulateNetworkDelay();
    return [
      { name: 'API Server', status: 'online', uptime: '45 days', load: 65 },
      { name: 'Database', status: 'online', uptime: '120 days', load: 45 },
      { name: 'Cache Layer', status: 'online', uptime: '30 days', load: 32 },
      { name: 'Message Queue', status: 'online', uptime: '15 days', load: 78 },
      { name: 'AI Model Server', status: 'online', uptime: '7 days', load: 92 }
    ];
  }

  // MOCK: Get Pipeline Status
  // TODO: Replace with real API endpoint: GET ${baseUrl}/metrics/pipeline
  async getPipelineStatus(): Promise<PipelineStage[]> {
    console.log('[MOCK] Get Pipeline Status endpoint');
    await this.simulateNetworkDelay();
    return [
      { id: '1', name: 'Data Ingestion', status: 'processing', progress: 75, throughput: 1000 },
      { id: '2', name: 'Data Validation', status: 'processing', progress: 60, throughput: 950 },
      { id: '3', name: 'Model Processing', status: 'processing', progress: 45, throughput: 800 },
      { id: '4', name: 'Results Export', status: 'waiting', progress: 0, throughput: 0 }
    ];
  }

  // MOCK: Get Executive Metrics
  // TODO: Replace with real API endpoint: GET ${baseUrl}/metrics/executive
  async getExecutiveMetrics(): Promise<{
    metrics: Partial<SystemMetrics>;
    initiatives: StrategicInitiative[];
    regions: RegionalData[];
    kpis: KPI[];
  }> {
    console.log('[MOCK] Get Executive Metrics endpoint');
    await this.simulateNetworkDelay();
    const metrics = this.generateMockMetrics();
    return {
      metrics: {
        revenue: metrics.revenue,
        growth: metrics.growth,
        customers: metrics.customers,
        marketShare: metrics.marketShare
      },
      initiatives: [
        { name: 'Digital Transformation', progress: 65, status: 'In Progress' },
        { name: 'Market Expansion', progress: 40, status: 'In Progress' },
        { name: 'AI Integration', progress: 85, status: 'In Progress' }
      ],
      regions: [
        { region: 'North America', revenue: 500000, growth: 20 },
        { region: 'Europe', revenue: 300000, growth: 15 },
        { region: 'Asia Pacific', revenue: 200000, growth: 25 }
      ],
      kpis: [
        { metric: 'Revenue Growth', value: '18%', trend: 'up' },
        { metric: 'Customer Satisfaction', value: '4.7/5', trend: 'up' },
        { metric: 'Market Share', value: '28%', trend: 'up' }
      ]
    };
  }

  // MOCK: Get Financial Metrics
  // TODO: Replace with real API endpoint: GET ${baseUrl}/metrics/financial
  async getFinancialMetrics(): Promise<{
    metrics: Partial<SystemMetrics>;
    budget: BudgetItem[];
    investments: Investment[];
  }> {
    console.log('[MOCK] Get Financial Metrics endpoint');
    await this.simulateNetworkDelay();
    const metrics = this.generateMockMetrics();
    return {
      metrics: {
        profit: metrics.profit,
        cashFlow: metrics.cashFlow,
        expenses: metrics.expenses,
        roi: metrics.roi
      },
      budget: [
        { category: 'Operations', allocated: 500000, spent: 420000, variance: -80000 },
        { category: 'R&D', allocated: 300000, spent: 280000, variance: -20000 },
        { category: 'Marketing', allocated: 200000, spent: 180000, variance: -20000 }
      ],
      investments: [
        { investment: 'Cloud Infrastructure', value: 150000, return: 45000 },
        { investment: 'AI Research', value: 200000, return: 80000 },
        { investment: 'Team Development', value: 100000, return: 120000 }
      ]
    };
  }

  // MOCK: Get Marketing Metrics
  // TODO: Replace with real API endpoint: GET ${baseUrl}/metrics/marketing
  async getMarketingMetrics(): Promise<{
    metrics: Partial<SystemMetrics>;
    campaigns: Campaign[];
    channels: Channel[];
    brandMetrics: BrandMetric[];
  }> {
    console.log('[MOCK] Get Marketing Metrics endpoint');
    await this.simulateNetworkDelay();
    const metrics = this.generateMockMetrics();
    return {
      metrics: {
        cac: metrics.cac,
        conversion: metrics.conversion,
        reach: metrics.reach,
        brandAwareness: metrics.brandAwareness
      },
      campaigns: [
        { name: 'Summer Campaign', budget: 50000, spent: 45000, performance: 85, status: 'Active' },
        { name: 'Product Launch', budget: 100000, spent: 80000, performance: 92, status: 'Active' },
        { name: 'Brand Awareness', budget: 30000, spent: 25000, performance: 78, status: 'Planning' }
      ],
      channels: [
        { channel: 'Social Media', traffic: 200000, conversion: 4.5 },
        { channel: 'Email', traffic: 50000, conversion: 8.2 },
        { channel: 'Content', traffic: 150000, conversion: 3.2 }
      ],
      brandMetrics: [
        { name: 'Brand Recall', value: '78%', change: '+5%' },
        { name: 'Customer Loyalty', value: '82%', change: '+3%' },
        { name: 'Net Sentiment', value: '8.5/10', change: '+0.5' }
      ]
    };
  }

  // MOCK: Get Technology Metrics
  // TODO: Replace with real API endpoint: GET ${baseUrl}/metrics/technology
  async getTechnologyMetrics(): Promise<{
    metrics: Partial<SystemMetrics>;
    codeStats: CodeStat[];
    teamProductivity: TeamProductivity[];
    infrastructure: TechService[];
    security: SecurityCheck[];
  }> {
    console.log('[MOCK] Get Technology Metrics endpoint');
    await this.simulateNetworkDelay();
    const metrics = this.generateMockMetrics();
    return {
      metrics: {
        codeQuality: metrics.codeQuality,
        security: metrics.security,
        performance: metrics.performance,
        infrastructure: metrics.infrastructure
      },
      codeStats: [
        { metric: 'Code Coverage', percentage: 85 },
        { metric: 'Test Pass Rate', percentage: 95 },
        { metric: 'Bug Density', percentage: 12 }
      ],
      teamProductivity: [
        { name: 'Commits per Day', value: 45 },
        { name: 'Avg PR Review Time', value: '2.5 hours' },
        { name: 'Deployment Frequency', value: '3x daily' }
      ],
      infrastructure: [
        { name: 'Server Uptime', status: 'healthy', value: 99.98 },
        { name: 'API Response Time', status: 'healthy', value: 125 },
        { name: 'Database Performance', status: 'healthy', value: 98 }
      ],
      security: [
        { name: 'Vulnerability Scan', passed: true, lastChecked: '2h ago' },
        { name: 'DDoS Protection', passed: true, lastChecked: '1h ago' },
        { name: 'Data Encryption', passed: true, lastChecked: '24h ago' }
      ]
    };
  }

  // MOCK: Get Operations Metrics
  // TODO: Replace with real API endpoint: GET ${baseUrl}/metrics/operations
  async getOperationsMetrics(): Promise<{
    metrics: Partial<SystemMetrics>;
    productionLines: ProductionLine[];
    suppliers: Supplier[];
    performanceMetrics: PerformanceMetric[];
  }> {
    console.log('[MOCK] Get Operations Metrics endpoint');
    await this.simulateNetworkDelay();
    const metrics = this.generateMockMetrics();
    return {
      metrics: {
        efficiency: metrics.efficiency,
        quality: metrics.quality,
        onTime: metrics.onTime,
        utilization: metrics.utilization
      },
      productionLines: [
        { name: 'Line A', capacity: 1000, current: 850, efficiency: 85 },
        { name: 'Line B', capacity: 1200, current: 1050, efficiency: 87 },
        { name: 'Line C', capacity: 800, current: 720, efficiency: 90 }
      ],
      suppliers: [
        { name: 'Supplier A', onTimeRate: 95, qualityScore: 4.8 },
        { name: 'Supplier B', onTimeRate: 92, qualityScore: 4.5 },
        { name: 'Supplier C', onTimeRate: 98, qualityScore: 4.9 }
      ],
      performanceMetrics: [
        { metric: 'Order Fulfillment', value: 92 },
        { metric: 'Quality Rating', value: 4.7 },
        { metric: 'Safety Score', value: 96 }
      ]
    };
  }

  // MOCK: Subscribe to Metrics (Real-time simulation)
  // TODO: Replace with real WebSocket or Server-Sent Events when backend is ready
  async subscribeToMetrics(callback: (metrics: SystemMetrics) => void): Promise<() => void> {
    console.log('[MOCK] Subscribe to Metrics endpoint');
    const interval = setInterval(() => {
      callback(this.generateMockMetrics());
    }, 5000); // Update every 5 seconds

    return () => {
      clearInterval(interval);
      console.log('[MOCK] Unsubscribed from metrics');
    };
  }

  // MOCK: Health Check
  // TODO: Replace with real API endpoint: GET ${baseUrl}/health
  async healthCheck(): Promise<{ status: 'healthy' | 'unhealthy'; timestamp: number }> {
    console.log('[MOCK] Health Check endpoint');
    await this.simulateNetworkDelay();
    return {
      status: 'healthy',
      timestamp: Date.now()
    };
  }

  // Clear cache
  clearCache(): void {
    this.cache.clear();
  }

  // Update base URL
  updateBaseUrl(newUrl: string): void {
    this.baseUrl = newUrl;
    this.clearCache();
  }
}

// Create singleton instance
export const metricsService = new MetricsService();

// Export the class for custom instances
export default MetricsService;
