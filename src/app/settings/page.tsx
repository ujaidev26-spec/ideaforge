'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import { useSensorData } from '@/hooks/useSensorData';
import { Settings, Bell, Shield, Clock, Palette, Database, Zap, Save } from 'lucide-react';
import { clsx } from 'clsx';

export default function SettingsPage() {
  const { stats, lastUpdate, refreshData } = useSensorData(5000);
  const [refreshRate, setRefreshRate] = useState(2);
  const [alertSound, setAlertSound] = useState(true);
  const [autoAcknowledge, setAutoAcknowledge] = useState(false);
  const [criticalNotify, setCriticalNotify] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-dark-400 bg-grid">
      <Header
        stats={stats}
        unresolvedAlerts={stats?.unresolvedAlerts || 0}
        onRefresh={refreshData}
        lastUpdate={lastUpdate}
      />

      <div className="p-6 space-y-6 max-w-4xl">
        <div>
          <h2 className="text-2xl font-bold text-white">Settings</h2>
          <p className="text-sm text-gray-500 mt-1">Configure your monitoring preferences</p>
        </div>

        {/* Refresh Rate */}
        <div className="bg-surface rounded-xl border border-surface-border p-6">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-5 h-5 text-brand-500" />
            <h3 className="text-base font-semibold text-white">Data Refresh Rate</h3>
          </div>
          <div className="flex items-center gap-3">
            {[1, 2, 5, 10].map(rate => (
              <button
                key={rate}
                onClick={() => setRefreshRate(rate)}
                className={clsx(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all border',
                  refreshRate === rate
                    ? 'bg-brand-500/10 text-brand-500 border-brand-500/30'
                    : 'bg-surface-lighter text-gray-400 border-surface-border hover:text-white'
                )}
              >
                {rate}s
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-600 mt-2">How often sensor data is fetched from the server</p>
        </div>

        {/* Notifications */}
        <div className="bg-surface rounded-xl border border-surface-border p-6">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="w-5 h-5 text-brand-500" />
            <h3 className="text-base font-semibold text-white">Notifications</h3>
          </div>
          <div className="space-y-4">
            <ToggleSetting
              label="Alert Sound"
              description="Play a sound when new alerts arrive"
              enabled={alertSound}
              onToggle={() => setAlertSound(!alertSound)}
            />
            <ToggleSetting
              label="Auto-Acknowledge Info Alerts"
              description="Automatically mark informational alerts as acknowledged"
              enabled={autoAcknowledge}
              onToggle={() => setAutoAcknowledge(!autoAcknowledge)}
            />
            <ToggleSetting
              label="Critical Alert Notifications"
              description="Show browser push notifications for critical alerts"
              enabled={criticalNotify}
              onToggle={() => setCriticalNotify(!criticalNotify)}
            />
          </div>
        </div>

        {/* Appearance */}
        <div className="bg-surface rounded-xl border border-surface-border p-6">
          <div className="flex items-center gap-3 mb-4">
            <Palette className="w-5 h-5 text-brand-500" />
            <h3 className="text-base font-semibold text-white">Appearance</h3>
          </div>
          <ToggleSetting
            label="Dark Mode"
            description="Use dark theme (recommended for monitoring dashboards)"
            enabled={darkMode}
            onToggle={() => setDarkMode(!darkMode)}
          />
        </div>

        {/* System Info */}
        <div className="bg-surface rounded-xl border border-surface-border p-6">
          <div className="flex items-center gap-3 mb-4">
            <Database className="w-5 h-5 text-brand-500" />
            <h3 className="text-base font-semibold text-white">System Information</h3>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Version</span>
              <p className="text-white font-medium">1.0.0</p>
            </div>
            <div>
              <span className="text-gray-500">API Status</span>
              <p className="text-green-400 font-medium">Connected</p>
            </div>
            <div>
              <span className="text-gray-500">Sensors Online</span>
              <p className="text-white font-medium">{stats?.activeSensors || 0} / {stats?.totalSensors || 0}</p>
            </div>
            <div>
              <span className="text-gray-500">Data Backend</span>
              <p className="text-white font-medium">In-Memory (Simulated)</p>
            </div>
          </div>
        </div>

        {/* Save */}
        <button
          onClick={handleSave}
          className={clsx(
            'flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-all',
            saved
              ? 'bg-green-500 text-white'
              : 'bg-gradient-to-r from-brand-500 to-brand-600 text-white hover:from-brand-600 hover:to-brand-700'
          )}
        >
          <Save className="w-4 h-4" />
          {saved ? 'Settings Saved!' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}

function ToggleSetting({ label, description, enabled, onToggle }: {
  label: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <p className="text-sm text-white font-medium">{label}</p>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
      <button
        onClick={onToggle}
        className={clsx(
          'relative w-11 h-6 rounded-full transition-colors',
          enabled ? 'bg-brand-500' : 'bg-surface-lighter border border-surface-border'
        )}
      >
        <div className={clsx(
          'absolute top-1 w-4 h-4 rounded-full bg-white transition-transform',
          enabled ? 'translate-x-6' : 'translate-x-1'
        )} />
      </button>
    </div>
  );
}
