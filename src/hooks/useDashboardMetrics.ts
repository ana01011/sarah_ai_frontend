import { useState, useEffect } from 'react';
import { dashboardMetricsService, MetricsData } from '../services/metricsService';

export const useDashboardMetrics = (pollingInterval: number = 5000) => {
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    dashboardMetricsService.startPolling(
      (data) => {
        setMetrics(data);
        setLoading(false);
        setError(null);
      },
      pollingInterval
    );

    return () => {
      dashboardMetricsService.stopPolling();
    };
  }, [pollingInterval]);

  return { metrics, loading, error };
};
