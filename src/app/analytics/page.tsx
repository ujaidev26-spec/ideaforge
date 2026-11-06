'use client';

import React, { useState, useEffect } from 'react';
import { useSensorData } from '@/hooks/useSensorData';
import Header from '@/components/Header';
import LiveChart from '@/components/LiveChart';
import StatsCard from '@/components/StatsCard';
import { BarChart3, TrendingUp, Clock, Database } from 'lucide-react';
import { clsx } from 'clsx';

export default function AnalyticsPage() {
  const { sensors, stats, lastUpdate, refreshData } = useSensorData(3000);
  const [chartData, setChartData] = useState<Record<string, { time: string; value: number }[]>>({});
  const [selectedType, setSelectedType] = useState('temperature');

  useEffect(() => {
    if (sensors.length === 0) return;
    const now = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });

    setChartData(prev => {
      const updated = { ...prev };
      ['temperature', 'pressure', 'sound', 'vibration', 'gas', 'humidity'].forEach(type => {
        const typeSensors = sensors.filter(s => s.type === type);
        const avg = typeSensors.reduce((sum, s) => sum + s.value, 0) / (typeSensors.length || 1);
        const max = Math.max(...typeSensors.map(s => s.value));
        const min = Math.min(...typeSensors.map(s => s.value));
        updated[`${type}_avg`] = [...(prev[`${type}_avg`] || []).slice(-49), { time: now, value: parseFloat(avg.toFixed(2)) }];
        updated[`${type}_max`] = [...(prev[`${type}_max`] || []).slice(-49), { time: now, value: parseFloat(max.toFixed(2)) }];
        updated[`${type}_min`] = [...(prev[`${type}_min`] || []).slice(-49), { time: now, value: parseFloat(min.toFixed(2)) }];
      });
      return updated;
    });
  }, [sensors]);

  const types = ['temperature', 'pressure', 'sound', 'vibration', 'gas', 'humidity'];
  const colors: Record<string, string> = {
    temperature: '#F97316',
    pressure: '#3B82F6',
    sound: '#EAB308',
    vibration: '#22C55E',
    gas: '#A855F7',
    humidity: '#06B6D4',
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
        <div>
          <h2 className="text-2xl font-bold text-white">Analytics & Trends</h2>
          <p className="text-sm text-gray-500 mt-1">Historical data analysis and trend visualization</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatsCard title="Data Points" value="5,000+" icon={Database} variant="brand" />
          <StatsCard title="Avg Reading Interval" value="2s" icon={Clock} variant="default" />
          <StatsCard title="Trend Direction" value="Stable" icon={TrendingUp} variant="success" />
          <StatsCard title="Anomalies Detected" value={stats?.unresolvedAlerts || 0} icon={BarChart3} variant="warning" />
        </div>

        {/* Type selector */}
        <div className="flex items-center gap-2 flex-wrap">
          {types.map(t => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={clsx(
                'px-4 py-2 rounded-lg text-sm font-medium transition-all border',
                selectedType === t
                  ? 'text-white border-brand-500/30'
                  : 'bg-surface text-gray-500 border-surface-border hover:text-white'
              )}
              style={selectedType === t ? { backgroundColor: `${colors[t]}20`, borderColor: `${colors[t]}50` } : {}}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <LiveChart
            title={`${selectedType.charAt(0).toUpperCase() + selectedType.slice(1)} - Average`}
            data={chartData[`${selectedType}_avg`] || []}
            color={colors[selectedType]}
            height={250}
            maxPoints={50}
          />
          <LiveChart
            title={`${selectedType.charAt(0).toUpperCase() + selectedType.slice(1)} - Peak Values`}
            data={chartData[`${selectedType}_max`] || []}
            color="#EF4444"
            height={250}
            maxPoints={50}
            showArea={false}
          />
        </div>

        {/* All sensor types overview */}
        <h3 className="text-lg font-semibold text-white mt-8">All Sensor Types Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {types.map(type => (
            <LiveChart
              key={type}
              title={type.charAt(0).toUpperCase() + type.slice(1)}
              data={chartData[`${type}_avg`] || []}
              color={colors[type]}
              height={160}
              maxPoints={30}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
