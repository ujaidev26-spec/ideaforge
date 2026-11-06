'use client';

import React, { useState } from 'react';
import { clsx } from 'clsx';
import { Alert, AlertSeverity } from '@/types';
import {
  Bell,
  AlertTriangle,
  XOctagon,
  Info,
  Check,
  CheckCheck,
  Filter,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const severityConfig: Record<AlertSeverity, { icon: React.ElementType; color: string; bg: string }> = {
  info: { icon: Info, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  warning: { icon: AlertTriangle, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  danger: { icon: XOctagon, color: 'text-orange-400', bg: 'bg-orange-500/10' },
  critical: { icon: Bell, color: 'text-red-400', bg: 'bg-red-500/10' },
};

interface AlertPanelProps {
  alerts: Alert[];
  onAcknowledge: (alertId: string) => void;
  onAcknowledgeAll: () => void;
  maxHeight?: string;
}

export default function AlertPanel({ alerts, onAcknowledge, onAcknowledgeAll, maxHeight = '500px' }: AlertPanelProps) {
  const [filter, setFilter] = useState<AlertSeverity | 'all'>('all');

  const filteredAlerts = filter === 'all'
    ? alerts
    : alerts.filter(a => a.severity === filter);

  const unresolvedCount = alerts.filter(a => !a.acknowledged).length;

  return (
    <div className="bg-surface rounded-xl border border-surface-border overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-surface-border">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-brand-500" />
          <h3 className="text-sm font-semibold text-white">Live Alerts</h3>
          {unresolvedCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 text-xs font-bold">
              {unresolvedCount}
            </span>
          )}
        </div>
        {unresolvedCount > 0 && (
          <button
            onClick={onAcknowledgeAll}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface-lighter border border-surface-border text-xs text-gray-400 hover:text-white hover:border-brand-500/30 transition-all"
          >
            <CheckCheck className="w-3 h-3" />
            Ack All
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-1 p-3 border-b border-surface-border">
        <Filter className="w-3 h-3 text-gray-500 mr-1" />
        {(['all', 'critical', 'danger', 'warning', 'info'] as const).map((sev) => (
          <button
            key={sev}
            onClick={() => setFilter(sev)}
            className={clsx(
              'px-2.5 py-1 rounded-md text-xs font-medium transition-all',
              filter === sev
                ? 'bg-brand-500/10 text-brand-500 border border-brand-500/30'
                : 'text-gray-500 hover:text-gray-300 border border-transparent'
            )}
          >
            {sev.charAt(0).toUpperCase() + sev.slice(1)}
          </button>
        ))}
      </div>

      {/* Alert list */}
      <div className="overflow-y-auto" style={{ maxHeight }}>
        {filteredAlerts.length === 0 ? (
          <div className="p-8 text-center text-gray-600 text-sm">
            No alerts to display
          </div>
        ) : (
          <div className="divide-y divide-surface-border">
            {filteredAlerts.map((alert) => {
              const config = severityConfig[alert.severity];
              const SevIcon = config.icon;

              return (
                <div
                  key={alert.id}
                  className={clsx(
                    'p-4 transition-all duration-200 hover:bg-surface-light',
                    !alert.acknowledged && 'border-l-2',
                    !alert.acknowledged && alert.severity === 'critical' && 'border-l-red-500 bg-red-500/5',
                    !alert.acknowledged && alert.severity === 'danger' && 'border-l-orange-500',
                    !alert.acknowledged && alert.severity === 'warning' && 'border-l-yellow-500',
                    !alert.acknowledged && alert.severity === 'info' && 'border-l-blue-500',
                    alert.acknowledged && 'opacity-50'
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className={clsx('p-1.5 rounded-lg flex-shrink-0', config.bg)}>
                      <SevIcon className={clsx('w-3.5 h-3.5', config.color)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={clsx('text-xs font-bold uppercase tracking-wider', config.color)}>
                          {alert.type.replace(/_/g, ' ')}
                        </span>
                        <span className="text-[10px] text-gray-600">Zone {alert.zone}</span>
                      </div>
                      <p className="text-xs text-gray-300 leading-relaxed">{alert.message}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-[10px] text-gray-600">
                          {formatDistanceToNow(new Date(alert.timestamp), { addSuffix: true })}
                        </span>
                        {!alert.acknowledged && (
                          <button
                            onClick={() => onAcknowledge(alert.id)}
                            className="flex items-center gap-1 px-2 py-1 rounded text-[10px] text-brand-500 hover:bg-brand-500/10 transition-all"
                          >
                            <Check className="w-3 h-3" />
                            Acknowledge
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
