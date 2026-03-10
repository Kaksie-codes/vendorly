// -----------------------------------------------------------------------------
// File: AdminChart.tsx
// Path: components/admin/AdminChart.tsx
// -----------------------------------------------------------------------------

'use client'

import React, { useState } from 'react'

interface DataPoint {
  date: string
  revenue: number
  orders: number
}

interface AdminChartProps {
  data: DataPoint[]
  height?: number
}

export function AdminChart({ data, height = 200 }: AdminChartProps) {
  const [hovered, setHovered] = useState<number | null>(null)

  if (!data || data.length === 0) return null

  const W = 640
  const H = height
  const PAD = { top: 16, right: 16, bottom: 28, left: 52 }
  const chartW = W - PAD.left - PAD.right
  const chartH = H - PAD.top - PAD.bottom

  const maxRev = Math.max(...data.map((d) => d.revenue))
  const yMax   = Math.ceil(maxRev / 1000) * 1000 || 1000

  const px = (i: number) => PAD.left + (i / (data.length - 1)) * chartW
  const py = (v: number) => PAD.top + chartH - (v / yMax) * chartH

  const linePath = data.map((d, i) => `${i === 0 ? 'M' : 'L'}${px(i)},${py(d.revenue)}`).join(' ')
  const areaPath = `${linePath} L${px(data.length - 1)},${PAD.top + chartH} L${px(0)},${PAD.top + chartH} Z`

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((t) => yMax * t)
  const xStep  = Math.ceil(data.length / 6)

  const fmt = (v: number) => v >= 1000 ? `₦${(v / 1000).toFixed(0)}k` : `₦${v}`
  const fmtDate = (s: string) => {
    const d = new Date(s)
    return d.toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })
  }

  return (
    <div className="relative w-full" style={{ paddingBottom: `${(H / W) * 100}%` }}>
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        onMouseLeave={() => setHovered(null)}
      >
        <defs>
          <linearGradient id="adminGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#ef4444" stopOpacity="0.15"/>
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0"/>
          </linearGradient>
        </defs>

        {/* Y grid */}
        {yTicks.map((t) => (
          <g key={t}>
            <line x1={PAD.left} y1={py(t)} x2={W - PAD.right} y2={py(t)} stroke="#e5e5e5" strokeWidth="1" strokeDasharray="3,3"/>
            <text x={PAD.left - 6} y={py(t) + 4} textAnchor="end" fontSize="9" fill="#9ca3af">{fmt(t)}</text>
          </g>
        ))}

        {/* Area fill */}
        <path d={areaPath} fill="url(#adminGrad)"/>

        {/* Line */}
        <path d={linePath} fill="none" stroke="#ef4444" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"/>

        {/* X labels */}
        {data.map((d, i) => {
          if (i % xStep !== 0 && i !== data.length - 1) return null
          return (
            <text key={i} x={px(i)} y={H - 4} textAnchor="middle" fontSize="9" fill="#9ca3af">
              {fmtDate(d.date)}
            </text>
          )
        })}

        {/* Hover targets */}
        {data.map((d, i) => (
          <rect
            key={i}
            x={px(i) - (chartW / data.length) / 2}
            y={PAD.top}
            width={chartW / data.length}
            height={chartH}
            fill="transparent"
            onMouseEnter={() => setHovered(i)}
          />
        ))}

        {/* Hover crosshair + dot */}
        {hovered !== null && (
          <>
            <line
              x1={px(hovered)} y1={PAD.top}
              x2={px(hovered)} y2={PAD.top + chartH}
              stroke="#ef4444" strokeWidth="1" strokeDasharray="4,3" opacity="0.5"
            />
            <circle cx={px(hovered)} cy={py(data[hovered].revenue)} r="4" fill="#ef4444" stroke="white" strokeWidth="2"/>
            {/* Tooltip */}
            {(() => {
              const tx = Math.min(Math.max(px(hovered) - 52, 2), W - 110)
              const ty = py(data[hovered].revenue) - 54
              return (
                <g>
                  <rect x={tx} y={ty > 0 ? ty : 4} width={108} height={44} rx="6" fill="#111111" opacity="0.92"/>
                  <text x={tx + 8} y={(ty > 0 ? ty : 4) + 14} fontSize="9" fill="#9ca3af">{fmtDate(data[hovered].date)}</text>
                  <text x={tx + 8} y={(ty > 0 ? ty : 4) + 27} fontSize="11" fill="white" fontWeight="600">₦{data[hovered].revenue.toLocaleString()}</text>
                  <text x={tx + 8} y={(ty > 0 ? ty : 4) + 39} fontSize="9" fill="#6b6b6b">{data[hovered].orders} orders</text>
                </g>
              )
            })()}
          </>
        )}
      </svg>
    </div>
  )
}