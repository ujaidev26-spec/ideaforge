'use client';

import React from 'react';
import { clsx } from 'clsx';
import { RiskAssessment, RiskLevel } from '@/types';
import { Shield, AlertTriangle, XOctagon, CheckCircle } from 'lucide-react';

const riskConfig: Record<RiskLevel, { color: string; bgColor: string; borderColor: string; icon: React.ElementType; label: string }> = {
  LOW: { color: 'text-green-500', bgColor: 'bg-green-500/10', borderColor: 'border-green-500/30', icon: CheckCircle, label: 'Low Risk' },
  MEDIUM: { color: 'text-yellow-500', bgColor: 'bg-yellow-500/10', borderColor: 'border-yellow-500/30', icon: Shield, label: 'Medium Risk' },
  HIGH: { color: 'text-orange-500', bgColor: 'bg-orange-500/10', borderColor: 'border-orange-500/30', icon: AlertTriangle, label: 'High Risk' },
  CRITICAL: { color: 'text-red-500', bgColor: 'bg-red-500/10', borderColor: 'border-red-500/30', icon: XOctagon, label: 'Critical Risk' },
};

interface RiskGaugeProps {
  assessment: RiskAssessment | null;
}

export default function RiskGauge({ assessment }: RiskGaugeProps) {
  if (!assessment) {
    return (
      <div className="bg-surface rounded-xl border border-surface-border p-6 animate-pulse">
        <div className="h-40 bg-surface-lighter rounded-lg" />
      </div>
    );
  }

  const config = riskConfig[assessment.overallRisk];
  const Icon = config.icon;
  const rotation = (assessment.score / 100) * 180 - 90;

  return (
    <div className={clsx(
      'bg-surface rounded-xl border p-6 transition-all duration-500',
      config.borderColor,
      assessment.overallRisk === 'CRITICAL' && 'animate-glow'
    )}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-semibold text-white">Risk Assessment</h3>
        <div className={clsx('flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold', config.bgColor, config.color)}>
          <Icon className="w-3.5 h-3.5" />
          {config.label}
        </div>
      </div>

      {/* Gauge visualization */}
      <div className="relative flex justify-center mb-6">
        <div className="relative w-48 h-24 overflow-hidden">
          {/* Background arc */}
          <div className="absolute inset-0 rounded-t-full border-[12px] border-surface-lighter border-b-0" />
          
          {/* Colored segments */}
          <div className="absolute inset-0">
            <svg viewBox="0 0 200 100" className="w-full h-full">
              <defs>
                <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#22c55e" />
                  <stop offset="35%" stopColor="#eab308" />
                  <stop offset="65%" stopColor="#f97316" />
                  <stop offset="100%" stopColor="#ef4444" />
                </linearGradient>
              </defs>
              <path
                d="M 15 95 A 85 85 0 0 1 185 95"
                fill="none"
                stroke="url(#gaugeGrad)"
                strokeWidth="10"
                strokeLinecap="round"
                opacity="0.3"
              />
              <path
                d="M 15 95 A 85 85 0 0 1 185 95"
                fill="none"
                stroke="url(#gaugeGrad)"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={`${(assessment.score / 100) * 267} 267`}
              />
            </svg>
          </div>

          {/* Needle */}
          <div
            className="absolute bottom-0 left-1/2 w-1 h-20 origin-bottom transition-transform duration-1000 ease-out"
            style={{ transform: `translateX(-50%) rotate(${rotation}deg)` }}
          >
            <div className={clsx('w-1.5 h-full rounded-full', config.color.replace('text-', 'bg-'))} />
          </div>

          {/* Center circle */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-6 h-6 rounded-full bg-surface border-2 border-surface-border" />
        </div>
      </div>

      {/* Score */}
      <div className="text-center mb-4">
        <span className={clsx('text-4xl font-bold', config.color)}>{assessment.score.toFixed(1)}</span>
        <span className="text-gray-500 text-sm"> / 100</span>
      </div>

      {/* Risk factors */}
      <div className="space-y-2">
        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Contributing Factors</h4>
        {assessment.factors.slice(0, 4).map((factor) => (
          <div key={factor.name} className="flex items-center justify-between">
            <span className="text-xs text-gray-400">{factor.name}</span>
            <div className="flex items-center gap-2">
              <div className="w-20 h-1.5 bg-surface-lighter rounded-full overflow-hidden">
                <div
                  className={clsx(
                    'h-full rounded-full transition-all duration-500',
                    factor.score > 0.7 ? 'bg-red-500' : factor.score > 0.4 ? 'bg-yellow-500' : 'bg-green-500'
                  )}
                  style={{ width: `${factor.score * 100}%` }}
                />
              </div>
              <span className="text-xs text-gray-500 w-8 text-right">{(factor.score * 100).toFixed(0)}%</span>
            </div>
          </div>
        ))}
      </div>

      {/* Recommendation */}
      <div className={clsx('mt-4 p-3 rounded-lg text-xs', config.bgColor, config.color)}>
        {assessment.recommendation}
      </div>
    </div>
  );
}
