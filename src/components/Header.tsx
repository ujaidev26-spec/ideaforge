'use client';

import React from 'react';
import { Bell, Search, RefreshCw, User } from 'lucide-react';
import { DashboardStats } from '@/types';

interface HeaderProps {
  stats: DashboardStats | null;
  unresolvedAlerts: number;
  onRefresh: () => void;
  lastUpdate: string | null;
}

export default function Header({ stats, unresolvedAlerts, onRefresh, lastUpdate }: HeaderProps) {
  return (
    <header className="h-16 bg-dark-400/80 backdrop-blur-lg border-b border-surface-border flex items-center justify-between px-6 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-bold text-white">
          Firecracker Sentinel
        </h1>
        {lastUpdate && (
          <span className="text-xs text-gray-500">
            Last update: {new Date(lastUpdate).toLocaleTimeString()}
          </span>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search sensors, alerts..."
            className="bg-surface-light border border-surface-border rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/20 w-64 transition-all"
          />
        </div>

        {/* Refresh button */}
        <button
          onClick={onRefresh}
          className="p-2 rounded-lg bg-surface-light border border-surface-border text-gray-400 hover:text-white hover:border-brand-500/30 transition-all"
          title="Refresh data"
        >
          <RefreshCw className="w-4 h-4" />
        </button>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg bg-surface-light border border-surface-border text-gray-400 hover:text-white hover:border-brand-500/30 transition-all">
          <Bell className="w-4 h-4" />
          {unresolvedAlerts > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold animate-pulse">
              {unresolvedAlerts > 9 ? '9+' : unresolvedAlerts}
            </span>
          )}
        </button>

        {/* User avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
          <User className="w-4 h-4 text-white" />
        </div>
      </div>
    </header>
  );
}
