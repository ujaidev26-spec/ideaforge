'use client';

import React from 'react';
import { clsx } from 'clsx';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: { value: number; label: string };
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'brand';
}

const variantStyles = {
  default: {
    icon: 'bg-surface-lighter text-gray-400',
    border: 'border-surface-border',
  },
  success: {
    icon: 'bg-green-500/10 text-green-500',
    border: 'border-green-500/20',
  },
  warning: {
    icon: 'bg-yellow-500/10 text-yellow-500',
    border: 'border-yellow-500/20',
  },
  danger: {
    icon: 'bg-red-500/10 text-red-500',
    border: 'border-red-500/20',
  },
  brand: {
    icon: 'bg-brand-500/10 text-brand-500',
    border: 'border-brand-500/20',
  },
};

export default function StatsCard({ title, value, subtitle, icon: Icon, trend, variant = 'default' }: StatsCardProps) {
  const styles = variantStyles[variant];

  return (
    <div className={clsx(
      'bg-surface rounded-xl border p-5 transition-all duration-300 hover:border-brand-500/30 hover:shadow-lg hover:shadow-brand-500/5 group',
      styles.border
    )}>
      <div className="flex items-start justify-between mb-3">
        <div className={clsx('p-2.5 rounded-lg', styles.icon)}>
          <Icon className="w-5 h-5" />
        </div>
        {trend && (
          <span className={clsx(
            'text-xs font-medium px-2 py-1 rounded-full',
            trend.value >= 0
              ? 'bg-green-500/10 text-green-400'
              : 'bg-red-500/10 text-red-400'
          )}>
            {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}% {trend.label}
          </span>
        )}
      </div>
      <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-brand-400 transition-colors">
        {value}
      </h3>
      <p className="text-sm text-gray-500">{title}</p>
      {subtitle && (
        <p className="text-xs text-gray-600 mt-1">{subtitle}</p>
      )}
    </div>
  );
}
