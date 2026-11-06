'use client';

import React, { useState } from 'react';
import { useSensorData } from '@/hooks/useSensorData';
import Header from '@/components/Header';
import SensorCard from '@/components/SensorCard';
import { Search, Filter, Radio, Grid, List } from 'lucide-react';
import { clsx } from 'clsx';
import { SensorType, SensorStatus } from '@/types';

export default function SensorsPage() {
  const { sensors, stats, lastUpdate, refreshData } = useSensorData(3000);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<SensorType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<SensorStatus | 'all'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const types: (SensorType | 'all')[] = ['all', 'temperature', 'pressure', 'sound', 'vibration', 'gas', 'humidity'];
  const statuses: (SensorStatus | 'all')[] = ['all', 'active', 'warning', 'critical', 'offline'];

  const filtered = sensors.filter(s => {
    const matchesSearch = search === '' || 
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.zone.toLowerCase().includes(search.toLowerCase()) ||
      s.location.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'all' || s.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-dark-400 bg-grid">
      <Header
        stats={stats}
        unresolvedAlerts={stats?.unresolvedAlerts || 0}
        onRefresh={refreshData}
        lastUpdate={lastUpdate}
      />

      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Sensor Management</h2>
            <p className="text-sm text-gray-500 mt-1">Monitor and manage all connected sensors</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={clsx(
                'p-2 rounded-lg border transition-all',
                viewMode === 'grid' ? 'bg-brand-500/10 border-brand-500/30 text-brand-500' : 'bg-surface border-surface-border text-gray-500'
              )}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={clsx(
                'p-2 rounded-lg border transition-all',
                viewMode === 'list' ? 'bg-brand-500/10 border-brand-500/30 text-brand-500' : 'bg-surface border-surface-border text-gray-500'
              )}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-surface rounded-xl border border-surface-border p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, zone, location..."
                className="w-full bg-surface-light border border-surface-border rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-500/50"
              />
            </div>

            <div className="flex items-center gap-1">
              <Filter className="w-3 h-3 text-gray-500 mr-1" />
              {types.map(t => (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  className={clsx(
                    'px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all border',
                    typeFilter === t
                      ? 'bg-brand-500/10 text-brand-500 border-brand-500/30'
                      : 'text-gray-500 hover:text-gray-300 border-transparent'
                  )}
                >
                  {t === 'all' ? 'All Types' : t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1">
              {statuses.map(s => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={clsx(
                    'px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all border',
                    statusFilter === s
                      ? 'bg-brand-500/10 text-brand-500 border-brand-500/30'
                      : 'text-gray-500 hover:text-gray-300 border-transparent'
                  )}
                >
                  {s === 'all' ? 'All Status' : s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Radio className="w-4 h-4" />
          <span>Showing {filtered.length} of {sensors.length} sensors</span>
        </div>

        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map(sensor => (
              <SensorCard key={sensor.id} sensor={sensor} />
            ))}
          </div>
        ) : (
          <div className="bg-surface rounded-xl border border-surface-border overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-border">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Sensor</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Zone</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Value</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Battery</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {filtered.map(sensor => (
                  <tr key={sensor.id} className="hover:bg-surface-light transition-colors">
                    <td className="px-4 py-3">
                      <div className="text-sm text-white font-medium">{sensor.name}</div>
                      <div className="text-xs text-gray-500">{sensor.location}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400 capitalize">{sensor.type}</td>
                    <td className="px-4 py-3 text-sm text-gray-400">{sensor.zone}</td>
                    <td className="px-4 py-3 text-sm text-white font-medium">{sensor.value} {sensor.unit}</td>
                    <td className="px-4 py-3">
                      <span className={clsx(
                        'px-2 py-1 rounded-full text-xs font-medium',
                        sensor.status === 'active' && 'bg-green-500/10 text-green-400',
                        sensor.status === 'warning' && 'bg-yellow-500/10 text-yellow-400',
                        sensor.status === 'critical' && 'bg-red-500/10 text-red-400',
                        sensor.status === 'offline' && 'bg-gray-500/10 text-gray-400',
                      )}>
                        {sensor.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400">{sensor.battery.toFixed(0)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
