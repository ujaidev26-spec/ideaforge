'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Sensor, DashboardStats, Alert, RiskAssessment, Zone } from '@/types';

interface SensorDataState {
  sensors: Sensor[];
  stats: DashboardStats | null;
  alerts: Alert[];
  riskAssessment: RiskAssessment | null;
  zones: Zone[];
  loading: boolean;
  error: string | null;
  lastUpdate: string | null;
}

export function useSensorData(refreshInterval: number = 2000) {
  const [state, setState] = useState<SensorDataState>({
    sensors: [],
    stats: null,
    alerts: [],
    riskAssessment: null,
    zones: [],
    loading: true,
    error: null,
    lastUpdate: null,
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const [sensorsRes, riskRes, alertsRes] = await Promise.all([
        fetch('/api/sensors'),
        fetch('/api/risk'),
        fetch('/api/alerts?limit=50'),
      ]);

      const [sensorsData, riskData, alertsData] = await Promise.all([
        sensorsRes.json(),
        riskRes.json(),
        alertsRes.json(),
      ]);

      setState(prev => ({
        ...prev,
        sensors: sensorsData.sensors,
        stats: sensorsData.stats,
        alerts: alertsData.alerts,
        riskAssessment: riskData.assessment,
        zones: riskData.zones,
        loading: false,
        error: null,
        lastUpdate: new Date().toISOString(),
      }));
    } catch (err) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : 'Failed to fetch data',
      }));
    }
  }, []);

  const triggerExplosion = useCallback(async (zone: string) => {
    try {
      await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'explosion', zone }),
      });
      await fetchData();
    } catch (err) {
      console.error('Failed to trigger explosion:', err);
    }
  }, [fetchData]);

  const acknowledgeAlert = useCallback(async (alertId: string) => {
    try {
      await fetch('/api/alerts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alertId, action: 'acknowledge' }),
      });
      await fetchData();
    } catch (err) {
      console.error('Failed to acknowledge alert:', err);
    }
  }, [fetchData]);

  const acknowledgeAllAlerts = useCallback(async () => {
    try {
      await fetch('/api/alerts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'acknowledge_all' }),
      });
      await fetchData();
    } catch (err) {
      console.error('Failed to acknowledge alerts:', err);
    }
  }, [fetchData]);

  const resetSimulation = useCallback(async () => {
    try {
      await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reset' }),
      });
      await fetchData();
    } catch (err) {
      console.error('Failed to reset simulation:', err);
    }
  }, [fetchData]);

  useEffect(() => {
    fetchData();
    intervalRef.current = setInterval(fetchData, refreshInterval);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchData, refreshInterval]);

  return {
    ...state,
    triggerExplosion,
    acknowledgeAlert,
    acknowledgeAllAlerts,
    resetSimulation,
    refreshData: fetchData,
  };
}
