'use client';

import React from 'react';
import { useSensorData } from '@/hooks/useSensorData';
import Header from '@/components/Header';
import AlertPanel from '@/components/AlertPanel';
import StatsCard from '@/components/StatsCard';
import { Bell, AlertTriangle, CheckCircle, XOctagon } from 'lucide-react';

export default function AlertsPage() {
  const { stats, alerts, lastUpdate, acknowledgeAlert, acknowledgeAllAlerts, refreshData } = useSensorData(2000);

  const criticalCount = alerts.filter(a => a.severity === 'critical' && !a.acknowledged).length;
  const warningCount = alerts.filter(a => a.severity === 'warning' && !a.acknowledged).length;
  const resolvedCount = alerts.filter(a => a.acknowledged).length;

  return (
    <div className="min-h-screen bg-dark-400 bg-grid">
      <Header
        stats={stats}
        unresolvedAlerts={stats?.unresolvedAlerts || 0}
        onRefresh={refreshData}
        lastUpdate={lastUpdate}
      />

      <div className="p-6 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Alert Management</h2>
          <p className="text-sm text-gray-500 mt-1">Monitor, review, and manage system alerts</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatsCard title="Total Alerts" value={alerts.length} icon={Bell} variant="brand" />
          <StatsCard title="Critical" value={criticalCount} icon={XOctagon} variant="danger" />
          <StatsCard title="Warnings" value={warningCount} icon={AlertTriangle} variant="warning" />
          <StatsCard title="Resolved" value={resolvedCount} icon={CheckCircle} variant="success" />
        </div>

        <AlertPanel
          alerts={alerts}
          onAcknowledge={acknowledgeAlert}
          onAcknowledgeAll={acknowledgeAllAlerts}
          maxHeight="calc(100vh - 350px)"
        />
      </div>
    </div>
  );
}
