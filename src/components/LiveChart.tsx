'use client';

import React, { useState, useEffect, useRef } from 'react';
import { clsx } from 'clsx';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';

interface DataPoint {
  time: string;
  value: number;
  label?: string;
}

interface LiveChartProps {
  title: string;
  data: DataPoint[];
  color?: string;
  unit?: string;
  height?: number;
  showArea?: boolean;
  maxPoints?: number;
}

const CustomTooltip = ({ active, payload, label, unit }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-dark-300 border border-surface-border rounded-lg p-3 shadow-xl">
        <p className="text-xs text-gray-400 mb-1">{label}</p>
        <p className="text-sm font-bold text-white">
          {payload[0].value.toFixed(2)} <span className="text-gray-500">{unit}</span>
        </p>
      </div>
    );
  }
  return null;
};

export default function LiveChart({
  title,
  data,
  color = '#F97316',
  unit = '',
  height = 200,
  showArea = true,
  maxPoints = 30,
}: LiveChartProps) {
  const displayData = data.slice(-maxPoints);

  return (
    <div className="bg-surface rounded-xl border border-surface-border p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white">{title}</h3>
        {displayData.length > 0 && (
          <span className="text-xs text-gray-500">
            Current: <span className="text-white font-medium">{displayData[displayData.length - 1]?.value.toFixed(2)}{unit}</span>
          </span>
        )}
      </div>

      <ResponsiveContainer width="100%" height={height}>
        {showArea ? (
          <AreaChart data={displayData}>
            <defs>
              <linearGradient id={`grad-${title.replace(/\s/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1A1A1A" />
            <XAxis
              dataKey="time"
              tick={{ fill: '#555', fontSize: 10 }}
              axisLine={{ stroke: '#222' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#555', fontSize: 10 }}
              axisLine={{ stroke: '#222' }}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip unit={unit} />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              fill={`url(#grad-${title.replace(/\s/g, '')})`}
              dot={false}
              animationDuration={300}
            />
          </AreaChart>
        ) : (
          <LineChart data={displayData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1A1A1A" />
            <XAxis
              dataKey="time"
              tick={{ fill: '#555', fontSize: 10 }}
              axisLine={{ stroke: '#222' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#555', fontSize: 10 }}
              axisLine={{ stroke: '#222' }}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip unit={unit} />} />
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              dot={false}
              animationDuration={300}
            />
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
