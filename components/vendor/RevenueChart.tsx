// -----------------------------------------------------------------------------
// File: RevenueChart.tsx
// Path: components/vendor/RevenueChart.tsx
// -----------------------------------------------------------------------------

'use client'

import React, { useState } from 'react'
import type { RevenueDataPoint } from '@/types'

type Props = {
  data: RevenueDataPoint[]
}

export function RevenueChart({ data }: Props) {
  const [hovered, setHovered] = useState<number | null>(null)

  if (!data.length) return <div className="h-48 flex items-center justify-center text-sm text-[#9ca3af]">No data</div>

  const W = 600
  const H = 180
  const PAD = { top: 12, right: 12, bottom: 28, left: 48 }
  const chartW = W - PAD.left - PAD.right
  const chartH = H - PAD.top - PAD.bottom

  const maxRev = Math.max(...data.map((d) => d.revenue))
  const minRev = 0

  const toX = (i: number) => PAD.left + (i / (data.length - 1)) * chartW
  const toY = (v: number) => PAD.top + chartH - ((v - minRev) / (maxRev - minRev || 1)) * chartH

  const points = data.map((d, i) => ({ x: toX(i), y: toY(d.revenue), ...d }))

  // SVG path
  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')
  const areaPath = `${linePath} L${points[points.length - 1].x},${PAD.top + chartH} L${PAD.left},${PAD.top + chartH} Z`

  // Y-axis ticks
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((t) => ({
    value: Math.round(minRev + t * (maxRev - minRev)),
    y: PAD.top + chartH - t * chartH,
  }))

  // X-axis labels (every ~5 points)
  const step = Math.max(1, Math.floor(data.length / 6))
  const xLabels = data
    .map((d, i) => ({ i, label: new Date(d.date).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' }) }))
    .filter((_, i) => i % step === 0 || i === data.length - 1)

  const hPoint = hovered !== null ? points[hovered] : null

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full overflow-visible"
        onMouseLeave={() => setHovered(null)}
      >
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#c8a951" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#c8a951" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {yTicks.map((t) => (
          <g key={t.value}>
            <line x1={PAD.left} y1={t.y} x2={PAD.left + chartW} y2={t.y} stroke="#f5f5f4" strokeWidth="1" />
            <text x={PAD.left - 6} y={t.y + 4} textAnchor="end" className="fill-[#9ca3af]" style={{ fontSize: 10 }}>
              {t.value >= 1000 ? `${(t.value / 1000).toFixed(0)}k` : t.value}
            </text>
          </g>
        ))}

        {/* X-axis labels */}
        {xLabels.map(({ i, label }) => (
          <text key={i} x={toX(i)} y={H - 6} textAnchor="middle" className="fill-[#9ca3af]" style={{ fontSize: 10 }}>
            {label}
          </text>
        ))}

        {/* Area fill */}
        <path d={areaPath} fill="url(#areaGrad)" />

        {/* Line */}
        <path d={linePath} fill="none" stroke="#c8a951" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

        {/* Hover regions */}
        {points.map((p, i) => (
          <rect
            key={i}
            x={i === 0 ? PAD.left : (points[i - 1].x + p.x) / 2}
            y={PAD.top}
            width={i === 0 ? (p.x - PAD.left + (points[1]?.x - p.x) / 2) : i === points.length - 1 ? (PAD.left + chartW - (points[i - 1].x + p.x) / 2) : ((points[i + 1]?.x ?? p.x) - (points[i - 1].x ?? p.x)) / 2}
            height={chartH}
            fill="transparent"
            onMouseEnter={() => setHovered(i)}
          />
        ))}

        {/* Hover indicator */}
        {hPoint && (
          <g>
            <line x1={hPoint.x} y1={PAD.top} x2={hPoint.x} y2={PAD.top + chartH} stroke="#e5e5e5" strokeWidth="1" strokeDasharray="3,3" />
            <circle cx={hPoint.x} cy={hPoint.y} r="5" fill="#c8a951" />
            <circle cx={hPoint.x} cy={hPoint.y} r="3" fill="white" />

            {/* Tooltip */}
            {(() => {
              const tx = hPoint.x > W - 100 ? hPoint.x - 110 : hPoint.x + 8
              const ty = hPoint.y > H - 50 ? hPoint.y - 52 : hPoint.y - 8
              return (
                <g>
                  <rect x={tx} y={ty} width={100} height={40} rx="6" fill="#111111" />
                  <text x={tx + 8} y={ty + 14} className="fill-white" style={{ fontSize: 10, fontWeight: 600 }}>
                    ₦{hPoint.revenue.toLocaleString()}
                  </text>
                  <text x={tx + 8} y={ty + 28} className="fill-[#9ca3af]" style={{ fontSize: 9 }}>
                    {hPoint.orders} orders · {new Date(hPoint.date).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })}
                  </text>
                </g>
              )
            })()}
          </g>
        )}
      </svg>
    </div>
  )
}