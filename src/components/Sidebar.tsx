'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import {
  LayoutDashboard,
  Radio,
  Bell,
  BarChart3,
  Settings,
  Flame,
  ChevronLeft,
  ChevronRight,
  Shield,
  Zap,
} from 'lucide-react';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/sensors', label: 'Sensors', icon: Radio },
  { href: '/alerts', label: 'Alerts', icon: Bell },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={clsx(
        'fixed left-0 top-0 h-screen bg-dark-400 border-r border-surface-border z-50 transition-all duration-300 flex flex-col',
        collapsed ? 'w-[72px]' : 'w-[250px]'
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-surface-border">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center flex-shrink-0">
          <Flame className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="text-white font-bold text-sm tracking-wide">FIRECRACKER</span>
            <span className="text-brand-500 text-[10px] font-semibold tracking-widest">SENTINEL</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group',
                isActive
                  ? 'bg-brand-500/10 text-brand-500 border border-brand-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-surface-lighter border border-transparent'
              )}
            >
              <Icon
                className={clsx(
                  'w-5 h-5 flex-shrink-0 transition-colors',
                  isActive ? 'text-brand-500' : 'text-gray-500 group-hover:text-white'
                )}
              />
              {!collapsed && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Status indicator */}
      {!collapsed && (
        <div className="mx-3 mb-4 p-3 rounded-lg bg-surface-light border border-surface-border">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-brand-500" />
            <span className="text-xs font-semibold text-white">System Status</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-gray-400">All systems operational</span>
          </div>
        </div>
      )}

      {/* Collapse button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-center h-12 border-t border-surface-border text-gray-500 hover:text-white hover:bg-surface-lighter transition-colors"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
    </aside>
  );
}
