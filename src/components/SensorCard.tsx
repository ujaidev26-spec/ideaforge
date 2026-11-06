'use client';

import React from 'react';
import { clsx } from 'clsx';
import { Sensor } from '@/types';
import {
  Thermometer,
  Gauge,
  Volume2,
  Activity,
  Wind,
  Droplets,
  Battery,
  Wifi,
  AlertTriangle,
} from 'lucide-react';

const sensorIcons: Record<string, React.ElementType> = {
  temperature: Thermometer,
  pressure: Gauge,
  sound: Volume2,
  vibration: Activity,
  gas: Wind,
  humidity: Droplets,
};

const statusColors: Record<string, string> = {
  active: 'bg-green-500',
  warning: 'bg-yellow-500',
  critical: 'bg-red-500',
  offline: 'bg-gray-500',
  maintenance: 'bg-blue-500',
};

const statusBorders: Record<string, string> = {
  active: 'border-surface-border hover:border-green-500/30',
  warning: 'border-yellow-500/30 shadow-yellow-500/5',
  critical: 'border-red-500/30 shadow-red-500/10 animate-pulse-slow',
  offline: 'border-surface-border opacity-60',
  maintenance: 'border-blue-500/20',
};

interface SensorCardProps {
  sensor: Sensor;
  compact?: boolean;
}

export default function SensorCard({ sensor, compact = false }: SensorCardProps) {
  const Icon = sensorIcons[sensor.type] || Activity;
  const percentage = Math.min(100, Math.max(0, ((sensor.value - sensor.minThreshold) / (sensor.criticalThreshold - sensor.minThreshold)) * 100));

  const barColor = sensor.status === 'critical'
    ? 'bg-red-500'
    : sensor.status === 'warning'
    ? 'bg-yellow-500'
    : percentage > 60
    ? 'bg-brand-500'
    : 'bg-green-500';

  if (compact) {
    return (
      <div className={clsx(
        'bg-surface rounded-lg border p-3 transition-all duration-300 hover:shadow-lg',
        statusBorders[sensor.status]
      )}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Icon className="w-4 h-4 text-gray-400" />
            <span className="text-xs font-medium text-gray-300 truncate">{sensor.name}</span>
          </div>
          <div className={clsx('w-2 h-2 rounded-full', statusColors[sensor.status])} />
        </div>
        <div className="text-lg font-bold text-white">
          {sensor.value}<span className="text-xs text-gray-500 ml-1">{sensor.unit}</span>
        </div>
        <div className="mt-2 h-1 bg-surface-lighter rounded-full overflow-hidden">
          <div className={clsx('h-full rounded-full transition-all duration-500', barColor)} style={{ width: `${percentage}%` }} />
        </div>
      </div>
    );
  }

  return (
    <div className={clsx(
      'bg-surface rounded-xl border p-5 transition-all duration-300 hover:shadow-xl group',
      statusBorders[sensor.status]
    )}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={clsx(
            'p-2.5 rounded-lg',
            sensor.status === 'critical' ? 'bg-red-500/10' : 'bg-surface-lighter'
          )}>
            <Icon className={clsx(
              'w-5 h-5',
              sensor.status === 'critical' ? 'text-red-500' : 'text-brand-500'
            )} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">{sensor.name}</h3>
            <p className="text-xs text-gray-500">{sensor.location}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {sensor.status === 'critical' && (
            <AlertTriangle className="w-4 h-4 text-red-500 animate-pulse" />
          )}
          <div className={clsx('w-2.5 h-2.5 rounded-full', statusColors[sensor.status])} />
        </div>
      </div>

      <div className="mb-4">
        <span className="text-3xl font-bold text-white">{sensor.value}</span>
        <span className="text-sm text-gray-500 ml-1">{sensor.unit}</span>
      </div>

      {/* Progress bar */}
      <div className="mb-3">
        <div className="flex justify-between text-xs text-gray-600 mb-1">
          <span>{sensor.minThreshold}{sensor.unit}</span>
          <span>{sensor.criticalThreshold}{sensor.unit}</span>
        </div>
        <div className="h-2 bg-surface-lighter rounded-full overflow-hidden">
          <div
            className={clsx('h-full rounded-full transition-all duration-500', barColor)}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Footer info */}
      <div className="flex items-center justify-between pt-3 border-t border-surface-border">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Battery className="w-3 h-3 text-gray-500" />
            <span className="text-xs text-gray-500">{sensor.battery.toFixed(0)}%</span>
          </div>
          <div className="flex items-center gap-1">
            <Wifi className="w-3 h-3 text-gray-500" />
            <span className="text-xs text-gray-500">{sensor.signalStrength.toFixed(0)}%</span>
          </div>
        </div>
        <span className="text-[10px] text-gray-600">Zone {sensor.zone}</span>
      </div>
    </div>
  );
}
