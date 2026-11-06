'use client';

import React from 'react';
import { clsx } from 'clsx';
import { Zone } from '@/types';
import { MapPin, AlertTriangle, Shield, Users } from 'lucide-react';

const zoneStatusStyles: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  safe: { bg: 'bg-green-500/5', border: 'border-green-500/30', text: 'text-green-500', glow: '' },
  caution: { bg: 'bg-yellow-500/5', border: 'border-yellow-500/30', text: 'text-yellow-500', glow: '' },
  danger: { bg: 'bg-orange-500/5', border: 'border-orange-500/30', text: 'text-orange-500', glow: 'shadow-orange-500/20 shadow-lg' },
  evacuate: { bg: 'bg-red-500/10', border: 'border-red-500/40', text: 'text-red-500', glow: 'shadow-red-500/30 shadow-xl animate-pulse-slow' },
};

interface ZoneMapProps {
  zones: Zone[];
  onTriggerExplosion: (zone: string) => void;
}

export default function ZoneMap({ zones, onTriggerExplosion }: ZoneMapProps) {
  return (
    <div className="bg-surface rounded-xl border border-surface-border p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-brand-500" />
          <h3 className="text-sm font-semibold text-white">Zone Monitor</h3>
        </div>
        <div className="flex items-center gap-3 text-[10px]">
          <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500" /> Safe</div>
          <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-yellow-500" /> Caution</div>
          <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-orange-500" /> Danger</div>
          <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500" /> Evacuate</div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {zones.map((zone) => {
          const styles = zoneStatusStyles[zone.status];
          return (
            <div
              key={zone.id}
              className={clsx(
                'rounded-lg border p-4 transition-all duration-500 relative overflow-hidden group',
                styles.bg,
                styles.border,
                styles.glow
              )}
            >
              {/* Decorative background */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                  backgroundImage: 'radial-gradient(circle at 50% 50%, currentColor 1px, transparent 1px)',
                  backgroundSize: '20px 20px',
                }} />
              </div>

              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-bold text-white">{zone.name}</h4>
                  <span className={clsx('text-[10px] font-bold uppercase tracking-wider', styles.text)}>
                    {zone.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="text-center p-2 rounded bg-black/20">
                    <div className="text-lg font-bold text-white">{zone.sensorCount}</div>
                    <div className="text-[10px] text-gray-500">Sensors</div>
                  </div>
                  <div className="text-center p-2 rounded bg-black/20">
                    <div className={clsx('text-lg font-bold', zone.activeAlerts > 0 ? 'text-red-400' : 'text-white')}>
                      {zone.activeAlerts}
                    </div>
                    <div className="text-[10px] text-gray-500">Alerts</div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    const zoneName = zone.name.replace('Zone ', '');
                    onTriggerExplosion(zoneName);
                  }}
                  className="w-full py-2 px-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium hover:bg-red-500/20 hover:border-red-500/40 transition-all flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100"
                >
                  <AlertTriangle className="w-3 h-3" />
                  Simulate Explosion
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
