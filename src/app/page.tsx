'use client';

import React, { useState, useEffect } from 'react';
import { useSensorData } from '@/hooks/useSensorData';
import Header from '@/components/Header';
import StatsCard from '@/components/StatsCard';
import SensorCard from '@/components/SensorCard';
import RiskGauge from '@/components/RiskGauge';
import AlertPanel from '@/components/AlertPanel';
import LiveChart from '@/components/LiveChart';
import ZoneMap from '@/components/ZoneMap';
import SimulationControls from '@/components/SimulationControls';
import {
  Radio,
  ShieldAlert,
  Bell,
  Activity,
  Zap,
  TrendingUp,
  Server,
  Clock,
} from 'lucide-react';

export default function Dashboard() {
  const {
    sensors,
    stats,
    alerts,
    riskAssessment,
    zones,
    loading,
    lastUpdate,
    triggerExplosion,
    acknowledgeAlert,
    acknowledgeAllAlerts,
    resetSimulation,
    refreshData,
  } = useSensorData(2000);

  // Build chart data from sensor readings over time
  const [chartData, setChartData] = useState<Record<string, { time: string; value: number }[]>>({
    temperature: [],
    pressure: [],
    sound: [],
    vibration: [],
  });

  useEffect(() => {
    if (sensors.length === 0) return;

    const now = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });

    setChartData(prev => {
      const updated = { ...prev };
      ['temperature', 'pressure', 'sound', 'vibration'].forEach(type => {
        const typeSensors = sensors.filter(s => s.type === type);
        const avg = typeSensors.reduce((sum, s) => sum + s.value, 0) / (typeSensors.length || 1);
        const newEntry = { time: now, value: parseFloat(avg.toFixed(2)) };
        const existing = prev[type] || [];
        updated[type] = [...existing.slice(-29), newEntry];
      });
      return updated;
    });
  }, [sensors]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brand-500/20 border-t-brand-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-sm">Initializing sensor network...</p>
        </div>
      </div>
    );
  }

  const riskColors: Record<string, string> = {
    LOW: 'success',
    MEDIUM: 'warning',
    HIGH: 'danger',
    CRITICAL: 'danger',
  };

  return (
    <div className="min-h-screen bg-dark-400 bg-grid">
      <Header
        stats={stats}
        unresolvedAlerts={stats?.unresolvedAlerts || 0}
        onRefresh={refreshData}
        lastUpdate={lastUpdate}
      />

      <div className="p-6 space-y-6">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-dark-300 via-dark-200 to-dark-300 border border-surface-border p-8">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-500/5 via-transparent to-brand-500/5" />
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">
                Firecracker Safety <span className="gradient-text">Monitor</span>
              </h2>
              <p className="text-gray-400 text-sm max-w-lg">
                Real-time sensor monitoring, AI-powered risk assessment, and instant alert management 
                for firecracker storage and testing facilities.
              </p>
            </div>
            <div className="hidden lg:flex items-center gap-4">
              <div className="text-center px-6 py-3 rounded-xl bg-surface border border-surface-border">
                <div className="text-2xl font-bold text-brand-500">{stats?.totalSensors || 0}</div>
                <div className="text-[10px] text-gray-500 uppercase tracking-wider">Sensors</div>
              </div>
              <div className="text-center px-6 py-3 rounded-xl bg-surface border border-surface-border">
                <div className="text-2xl font-bold text-green-500">{stats?.activeSensors || 0}</div>
                <div className="text-[10px] text-gray-500 uppercase tracking-wider">Active</div>
              </div>
              <div className="text-center px-6 py-3 rounded-xl bg-surface border border-surface-border">
                <div className="text-2xl font-bold text-brand-500">{stats?.zonesMonitored || 0}</div>
                <div className="text-[10px] text-gray-500 uppercase tracking-wider">Zones</div>
              </div>
              <div className="text-center px-6 py-3 rounded-xl bg-surface border border-surface-border">
                <div className="text-2xl font-bold text-green-500">{stats?.uptimePercent || 0}%</div>
                <div className="text-[10px] text-gray-500 uppercase tracking-wider">Uptime</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Active Sensors"
            value={stats?.activeSensors || 0}
            subtitle={`of ${stats?.totalSensors || 0} total`}
            icon={Radio}
            variant="brand"
            trend={{ value: 2.5, label: 'vs last hour' }}
          />
          <StatsCard
            title="Risk Score"
            value={`${stats?.riskScore?.toFixed(1) || 0}%`}
            subtitle={stats?.overallRisk || 'LOW'}
            icon={ShieldAlert}
            variant={(riskColors[stats?.overallRisk || 'LOW'] || 'default') as any}
          />
          <StatsCard
            title="Active Alerts"
            value={stats?.unresolvedAlerts || 0}
            subtitle={`${stats?.totalAlerts || 0} total`}
            icon={Bell}
            variant={stats?.unresolvedAlerts && stats.unresolvedAlerts > 5 ? 'danger' : 'warning'}
          />
          <StatsCard
            title="System Uptime"
            value={`${stats?.uptimePercent || 0}%`}
            subtitle="All zones operational"
            icon={Activity}
            variant="success"
          />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Charts & Sensors */}
          <div className="lg:col-span-2 space-y-6">
            {/* Charts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <LiveChart
                title="Temperature Avg"
                data={chartData.temperature}
                color="#F97316"
                unit="°C"
                height={180}
              />
              <LiveChart
                title="Pressure Avg"
                data={chartData.pressure}
                color="#3B82F6"
                unit="kPa"
                height={180}
              />
              <LiveChart
                title="Sound Level Avg"
                data={chartData.sound}
                color="#EAB308"
                unit="dB"
                height={180}
              />
              <LiveChart
                title="Vibration Avg"
                data={chartData.vibration}
                color="#22C55E"
                unit="mm/s"
                height={180}
              />
            </div>

            {/* Zone Map */}
            <ZoneMap zones={zones} onTriggerExplosion={triggerExplosion} />

            {/* Sensor Grid - Show critical & warning first */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Sensor Grid</h3>
                <span className="text-xs text-gray-500">{sensors.length} sensors</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {[...sensors]
                  .sort((a, b) => {
                    const order: Record<string, number> = { critical: 0, warning: 1, active: 2, offline: 3, maintenance: 4 };
                    return (order[a.status] || 5) - (order[b.status] || 5);
                  })
                  .slice(0, 12)
                  .map(sensor => (
                    <SensorCard key={sensor.id} sensor={sensor} compact />
                  ))}
              </div>
            </div>
          </div>

          {/* Right Column - Risk & Alerts & Controls */}
          <div className="space-y-6">
            <RiskGauge assessment={riskAssessment} />
            <SimulationControls
              onTriggerExplosion={triggerExplosion}
              onReset={resetSimulation}
              isSimulating={true}
            />
            <AlertPanel
              alerts={alerts}
              onAcknowledge={acknowledgeAlert}
              onAcknowledgeAll={acknowledgeAllAlerts}
              maxHeight="600px"
            />
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-surface-border pt-6 pb-4 mt-8">
          <div className="flex items-center justify-between text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span>System operational • {sensors.length} sensors monitoring • {zones.length} zones active</span>
            </div>
            <span>Firecracker Sentinel v1.0 • Built for Safety</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
