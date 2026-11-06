'use client';

import React, { useState } from 'react';
import { clsx } from 'clsx';
import { Zap, RotateCcw, Play, Pause, Flame, AlertTriangle } from 'lucide-react';

interface SimulationControlsProps {
  onTriggerExplosion: (zone: string) => void;
  onReset: () => void;
  isSimulating: boolean;
}

const zones = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon'];

export default function SimulationControls({ onTriggerExplosion, onReset, isSimulating }: SimulationControlsProps) {
  const [selectedZone, setSelectedZone] = useState('Alpha');
  const [showConfirm, setShowConfirm] = useState(false);

  const handleExplosion = () => {
    if (!showConfirm) {
      setShowConfirm(true);
      setTimeout(() => setShowConfirm(false), 3000);
      return;
    }
    onTriggerExplosion(selectedZone);
    setShowConfirm(false);
  };

  return (
    <div className="bg-surface rounded-xl border border-surface-border p-5">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="w-4 h-4 text-brand-500" />
        <h3 className="text-sm font-semibold text-white">Simulation Controls</h3>
      </div>

      <div className="space-y-4">
        {/* Zone selector */}
        <div>
          <label className="text-xs text-gray-400 mb-2 block">Target Zone</label>
          <div className="flex flex-wrap gap-2">
            {zones.map((zone) => (
              <button
                key={zone}
                onClick={() => setSelectedZone(zone)}
                className={clsx(
                  'px-3 py-1.5 rounded-lg text-xs font-medium transition-all border',
                  selectedZone === zone
                    ? 'bg-brand-500/10 text-brand-500 border-brand-500/30'
                    : 'bg-surface-lighter text-gray-400 border-surface-border hover:text-white hover:border-brand-500/20'
                )}
              >
                Zone {zone}
              </button>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-2">
          <button
            onClick={handleExplosion}
            className={clsx(
              'flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold text-sm transition-all',
              showConfirm
                ? 'bg-red-500 text-white hover:bg-red-600 animate-pulse'
                : 'bg-gradient-to-r from-red-500/20 to-orange-500/20 text-red-400 border border-red-500/30 hover:from-red-500/30 hover:to-orange-500/30'
            )}
          >
            {showConfirm ? (
              <>
                <AlertTriangle className="w-4 h-4" />
                CONFIRM EXPLOSION - Zone {selectedZone}
              </>
            ) : (
              <>
                <Flame className="w-4 h-4" />
                Trigger Explosion Simulation
              </>
            )}
          </button>

          <button
            onClick={onReset}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-surface-lighter border border-surface-border text-gray-400 text-sm hover:text-white hover:border-brand-500/30 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            Reset All Sensors
          </button>
        </div>

        {/* Status */}
        <div className="flex items-center gap-2 pt-2 border-t border-surface-border">
          <div className={clsx(
            'w-2 h-2 rounded-full',
            isSimulating ? 'bg-green-500 animate-pulse' : 'bg-gray-500'
          )} />
          <span className="text-xs text-gray-500">
            {isSimulating ? 'Live simulation running' : 'Simulation paused'}
          </span>
        </div>
      </div>
    </div>
  );
}
