// -----------------------------------------------------------------------------
// File: AdminChart.tsx
// Path: components/admin/AdminChart.tsx
// Uses Recharts — consistent with analytics pages.
// -----------------------------------------------------------------------------

'use client'

import React from 'react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'

interface DataPoint {
  date:    string
  revenue: number
  orders:  number
}

interface AdminChartProps {
  data:    DataPoint[]
  height?: number
}

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString('en', { month: 'short', day: 'numeric' })

const fmtNaira = (v: number) =>
  v >= 1000 ? `₦${(v / 1000).toFixed(0)}k` : `₦${v}`

const TooltipStyle = {
  contentStyle: {
    background: '#fff',
    border: '1px solid #e5e5e5',
    borderRadius: '12px',
    fontSize: '12px',
    boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
    padding: '10px 14px',
  },
  labelStyle: { color: '#9ca3af', marginBottom: 4, fontSize: 11 },
}

export function AdminChart({ data, height = 200 }: AdminChartProps) {
  if (!data || data.length === 0) return null

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="adminGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#ef4444" stopOpacity={0.15} />
            <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
          </linearGradient>
        </defs>

        <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f4" vertical={false} />

        <XAxis
          dataKey="date"
          tickFormatter={fmtDate}
          tick={{ fontSize: 10, fill: '#9ca3af' }}
          axisLine={false}
          tickLine={false}
          interval="preserveStartEnd"
        />

        <YAxis
          tickFormatter={fmtNaira}
          tick={{ fontSize: 10, fill: '#9ca3af' }}
          axisLine={false}
          tickLine={false}
          width={52}
        />

        <Tooltip
          {...TooltipStyle}
          labelFormatter={fmtDate}
          formatter={(value: number, name: string) => [
            name === 'revenue' ? `₦${value.toLocaleString()}` : value,
            name === 'revenue' ? 'Revenue' : 'Orders',
          ]}
        />

        <Area
          type="monotone"
          dataKey="revenue"
          stroke="#ef4444"
          strokeWidth={2}
          fill="url(#adminGrad)"
          dot={false}
          activeDot={{ r: 4, fill: '#ef4444', stroke: '#fff', strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
