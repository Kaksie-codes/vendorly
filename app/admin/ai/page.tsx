// -----------------------------------------------------------------------------
// File: page.tsx
// Path: app/admin/ai/page.tsx
// -----------------------------------------------------------------------------

'use client'

import React, { useState, useRef, useEffect } from 'react'

type ChatMessage = {
  role: 'user' | 'assistant'
  text: string
  cards?: { label: string; value: string; trend: string; up: boolean }[]
}

const QUICK_QUESTIONS = [
  'Which vendor had the most returns last month?',
  'Show me revenue anomalies this week',
  'Which categories are underperforming?',
  'Which vendors need attention?',
  'What is the platform revenue trend?',
  'Show me fraud risk orders',
]

const ANOMALY_ALERTS = [
  {
    severity: 'high',
    title: 'Unusual refund spike — Vendor: ArtisanHub',
    detail: 'Refund rate jumped from 1.2% to 14.8% in 48 hours. 23 refunds processed. Possible product quality issue.',
    time: '2 hours ago',
    action: 'Review vendor',
    href: '/admin/vendors/vendor-3',
  },
  {
    severity: 'medium',
    title: 'Order velocity anomaly — 3× normal rate',
    detail: '847 orders placed in the last 6 hours vs. daily average of 290. Traffic source: unknown referrer. Monitor for card testing.',
    time: '4 hours ago',
    action: 'View orders',
    href: '/admin/orders',
  },
  {
    severity: 'medium',
    title: 'Vendor CraftHouse — 5 day payout delay',
    detail: 'Payout for ₦284,000 has been pending for 5 days. Likely a bank verification issue. Vendor has messaged twice.',
    time: '1 day ago',
    action: 'Review payout',
    href: '/admin/payouts',
  },
  {
    severity: 'low',
    title: 'Category "Electronics" product count dropped 40%',
    detail: '18 products were delisted in the last 3 days. 12 by the same vendor (NijaGadgets). May indicate a policy violation.',
    time: '2 days ago',
    action: 'Investigate',
    href: '/admin/products',
  },
]

const ADMIN_RESPONSES: { keywords: string[]; response: string; cards?: { label: string; value: string; trend: string; up: boolean }[] }[] = [
  {
    keywords: ['return', 'refund', 'return rate'],
    response: `**Vendor with most returns last month: ArtisanHub**\n\nBreakdown of top 5 vendors by return rate:\n\n1. **ArtisanHub** — 14.8% return rate (23 returns on 155 orders)\n2. NijaGadgets — 6.2% (8 returns on 129 orders)\n3. LeatherCo — 3.1% (4 returns on 129 orders)\n4. AdireCraft — 2.4% (3 returns on 125 orders)\n5. CraftHouse — 1.8% (2 returns on 111 orders)\n\n**Platform average:** 2.9%\n\nArtisanHub's spike started 4 days ago — customers are citing "product not as described" in 87% of cases. Recommend a vendor review call before processing any new payouts.`,
    cards: [
      { label: 'Platform avg return rate', value: '2.9%', trend: '+0.4% vs last month', up: false },
      { label: 'Highest vendor', value: 'ArtisanHub', trend: '14.8% return rate', up: false },
      { label: 'Total returns this month', value: '47', trend: '+31% vs last month', up: false },
    ],
  },
  {
    keywords: ['anomaly', 'anomalies', 'spike', 'unusual', 'fraud'],
    response: `I've detected **3 active anomalies** on the platform that need your attention:\n\n**High Priority:**\n• ArtisanHub refund rate spiked 12× in 48 hours — likely a product quality issue or listing misrepresentation\n\n**Medium Priority:**\n• Order velocity is 3× the daily average today — elevated fraud risk. 12 orders flagged for card testing patterns (multiple small orders, same address, different cards)\n• ₦284,000 payout to CraftHouse has been delayed 5 days — bank verification issue\n\n**Low Priority:**\n• 18 products delisted from Electronics category by one vendor in 3 days\n\nRecommend addressing the ArtisanHub situation first — it has the highest financial exposure.`,
    cards: [
      { label: 'Active anomalies', value: '4', trend: '1 high severity', up: false },
      { label: 'Orders flagged', value: '12', trend: 'Potential card testing', up: false },
      { label: 'Revenue at risk', value: '₦184,000', trend: 'From flagged activity', up: false },
    ],
  },
  {
    keywords: ['underperform', 'weak', 'category', 'categories'],
    response: `Based on platform benchmarks, these categories are underperforming vs. expected revenue:\n\n**Significantly below benchmark:**\n• **Electronics** — ₦48,000 revenue vs ₦320,000 benchmark (–85%)\n• **Books & Stationery** — ₦22,000 vs ₦95,000 benchmark (–77%)\n\n**Moderately below benchmark:**\n• **Health & Wellness** — ₦118,000 vs ₦200,000 (–41%)\n• **Toys & Games** — ₦67,000 vs ₦110,000 (–39%)\n\n**Root cause analysis:**\nElectronics has only 7 active listings after the recent NijaGadgets delistings. Books & Stationery has no vendor actively stocking it. Recommend recruiting vendors for these categories.`,
    cards: [
      { label: 'Underperforming categories', value: '4', trend: 'vs platform benchmark', up: false },
      { label: 'Biggest gap', value: 'Electronics', trend: '–85% of benchmark', up: false },
      { label: 'Revenue opportunity', value: '₦437,000/mo', trend: 'If gaps are closed', up: true },
    ],
  },
  {
    keywords: ['vendor', 'attention', 'watch', 'problem'],
    response: `These vendors need immediate attention based on combined performance signals:\n\n**Urgent:**\n• **ArtisanHub** — Return rate 14.8%, 3 unresolved customer complaints, payout paused\n• **NijaGadgets** — Bulk-delisted 18 products, account activity dropped 90%\n\n**Monitor:**\n• **FastShip NG** — Average dispatch time increased from 1.2 to 4.8 days (customers complaining)\n• **GlobaStyle** — 0 orders in 14 days despite 40 active listings (may be abandoning store)\n\n**Performing well:**\n• CraftHouse, AdireCraft, and LeatherCo are all above-benchmark and need no action.`,
    cards: [
      { label: 'Vendors needing action', value: '4', trend: '2 urgent, 2 monitor', up: false },
      { label: 'Complaints (7 days)', value: '11', trend: '8 from ArtisanHub', up: false },
      { label: 'Healthy vendors', value: '14/18', trend: '78% performing well', up: true },
    ],
  },
  {
    keywords: ['revenue', 'trend', 'growth', 'platform'],
    response: `**Platform revenue trend: Positive, with seasonal softening**\n\nLast 90 days summary:\n\n• **Total revenue:** ₦18.4M (+22% vs prior period)\n• **Platform fees collected:** ₦1.84M\n• **Fastest growing category:** Home & Living (+67%)\n• **Most consistent vendor:** CraftHouse (12 consecutive weeks of growth)\n\n**Trend analysis:**\nRevenue peaked in Week 7 (₦2.8M) and has softened slightly over the last 2 weeks — this is consistent with the seasonal pattern from last year. Expect a recovery starting next week as the upcoming long weekend drives gifting purchases.\n\n**Forecast:** ₦6.2–7.1M for next 30 days (with high confidence).`,
    cards: [
      { label: 'Revenue (90 days)', value: '₦18.4M', trend: '+22% vs prior', up: true },
      { label: 'Platform fees', value: '₦1.84M', trend: '10% commission rate', up: true },
      { label: '30-day forecast', value: '₦6.2–7.1M', trend: 'High confidence', up: true },
    ],
  },
]

const ADMIN_FALLBACK = (q: string) =>
  `I've searched the platform data for "${q}".\n\nAcross **18 active vendors**, **2,847 orders** this month, and **₦18.4M in gross revenue**, here's what I found most relevant:\n\nPlatform health is generally strong — 14 of 18 vendors are meeting SLA targets for dispatch time and customer satisfaction. The main areas of risk are concentrated in 2 vendors.\n\n**Data snapshot (last 30 days):**\n• Order fulfilment rate: 94.2%\n• Average customer rating: 4.6★\n• Dispute resolution time: 2.1 days avg\n• Active listings: 642\n\nWould you like me to drill into a specific metric, vendor, or time period?`

function getAdminResponse(input: string): { text: string; cards?: { label: string; value: string; trend: string; up: boolean }[] } {
  const lower = input.toLowerCase()
  for (const r of ADMIN_RESPONSES) {
    if (r.keywords.some((kw) => lower.includes(kw))) return { text: r.response, cards: r.cards }
  }
  return { text: ADMIN_FALLBACK(input) }
}

const SEVERITY_CONFIG = {
  high:   { bg: 'bg-[#fee2e2]', border: 'border-[#fecaca]', dot: 'bg-[#ef4444]', badge: 'bg-[#ef4444] text-white', label: 'High' },
  medium: { bg: 'bg-[#fff7ed]', border: 'border-[#fed7aa]', dot: 'bg-[#f97316]', badge: 'bg-[#f97316] text-white', label: 'Medium' },
  low:    { bg: 'bg-[#fefce8]', border: 'border-[#fde68a]', dot: 'bg-[#d97706]', badge: 'bg-[#d97706] text-white', label: 'Low' },
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1 py-1">
      {[0, 1, 2].map((i) => (
        <span key={i} className="w-2 h-2 rounded-full bg-[#ef4444] animate-bounce"
          style={{ animationDelay: `${i * 0.15}s`, animationDuration: '0.8s' }} />
      ))}
    </div>
  )
}

function RenderText({ text }: { text: string }) {
  return (
    <div className="text-sm leading-relaxed text-[#111111] space-y-1">
      {text.split('\n').map((line, i) => {
        const parts = line.split(/\*\*(.*?)\*\*/g)
        return (
          <p key={i}>
            {parts.map((seg, j) =>
              j % 2 === 1 ? <strong key={j}>{seg}</strong> : seg
            )}
          </p>
        )
      })}
    </div>
  )
}

export default function AdminAIPage() {
  const [messages, setMessages]   = useState<ChatMessage[]>([])
  const [input,    setInput]      = useState('')
  const [typing,   setTyping]     = useState(false)
  const [dismissed, setDismissed] = useState<number[]>([])
  const bottomRef                 = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  const send = (text: string) => {
    if (!text.trim() || typing) return
    setMessages((m) => [...m, { role: 'user', text }])
    setInput('')
    setTyping(true)
    const delay = 1000 + Math.random() * 700
    setTimeout(() => {
      const { text: reply, cards } = getAdminResponse(text)
      setMessages((m) => [...m, { role: 'assistant', text: reply, cards }])
      setTyping(false)
    }, delay)
  }

  const visibleAlerts = ANOMALY_ALERTS.filter((_, i) => !dismissed.includes(i))

  return (
    <div className="p-6 lg:p-8 max-w-[1100px] flex flex-col gap-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-8 h-8 rounded-xl bg-[#ef4444] flex items-center justify-center shrink-0">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
              </svg>
            </div>
            <h1 className="font-serif text-[1.75rem] font-bold text-[#111111] leading-tight">AI Command Centre</h1>
          </div>
          <p className="text-sm text-[#9ca3af]">Platform intelligence, anomaly detection, and natural language analytics.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#dcfce7] border border-[#bbf7d0] shrink-0">
            <span className="w-2 h-2 rounded-full bg-[#16a34a] animate-pulse" />
            <span className="text-xs font-semibold text-[#16a34a]">AI Online</span>
          </div>
          {visibleAlerts.length > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#fee2e2] border border-[#fecaca] shrink-0">
              <span className="w-2 h-2 rounded-full bg-[#ef4444] animate-pulse" />
              <span className="text-xs font-semibold text-[#ef4444]">{visibleAlerts.length} alerts</span>
            </div>
          )}
        </div>
      </div>

      {/* Anomaly alerts */}
      {visibleAlerts.length > 0 && (
        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#9ca3af]">Active Alerts</p>
          {visibleAlerts.map((alert, idx) => {
            const realIdx = ANOMALY_ALERTS.indexOf(alert)
            const cfg = SEVERITY_CONFIG[alert.severity as keyof typeof SEVERITY_CONFIG]
            return (
              <div key={realIdx} className={`flex items-start gap-4 p-4 rounded-2xl border ${cfg.bg} ${cfg.border}`}>
                <div className={`w-2.5 h-2.5 rounded-full shrink-0 mt-1 ${cfg.dot} ${alert.severity === 'high' ? 'animate-pulse' : ''}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className={`text-[0.6rem] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md ${cfg.badge}`}>
                      {cfg.label}
                    </span>
                    <p className="text-sm font-semibold text-[#111111]">{alert.title}</p>
                  </div>
                  <p className="text-xs text-[#6b6b6b] leading-relaxed">{alert.detail}</p>
                  <p className="text-[0.6rem] text-[#9ca3af] mt-1">{alert.time}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={alert.href}
                    className="px-3 py-1.5 text-xs font-semibold bg-[#111111] text-white rounded-xl hover:bg-[#333] transition-colors whitespace-nowrap"
                  >
                    {alert.action}
                  </a>
                  <button
                    onClick={() => setDismissed((d) => [...d, realIdx])}
                    className="w-7 h-7 flex items-center justify-center text-[#9ca3af] hover:text-[#111111] rounded-lg hover:bg-black/5 transition-colors"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M18 6L6 18M6 6l12 12"/>
                    </svg>
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Platform stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Platform Revenue',  value: '₦18.4M',  trend: '+22% (90d)', up: true },
          { label: 'Total Orders',      value: '2,847',    trend: '+16% (90d)', up: true },
          { label: 'Active Vendors',    value: '18',       trend: '2 pending review', up: false },
          { label: 'Dispute Rate',      value: '1.8%',     trend: '–0.3% vs avg', up: true },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-[#e5e5e5] rounded-2xl p-4">
            <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-[#9ca3af] mb-1">{s.label}</p>
            <p className="text-xl font-bold text-[#111111] leading-none mb-1.5">{s.value}</p>
            <span className={`text-[0.65rem] font-semibold px-1.5 py-0.5 rounded-md ${s.up ? 'bg-[#dcfce7] text-[#16a34a]' : 'bg-[#fee2e2] text-[#dc2626]'}`}>
              {s.trend}
            </span>
          </div>
        ))}
      </div>

      {/* AI Chat */}
      <div className="bg-white border border-[#e5e5e5] rounded-2xl flex flex-col overflow-hidden" style={{ minHeight: '440px' }}>

        {/* Chat header */}
        <div className="px-5 py-3.5 border-b border-[#f5f5f4] flex items-center gap-2.5 shrink-0 bg-[#0f0f0f]">
          <div className="w-7 h-7 rounded-xl bg-[#ef4444]/20 flex items-center justify-center shrink-0">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-white leading-none">Platform Intelligence</p>
            <p className="text-[0.65rem] text-white/40 mt-0.5">Full platform data · Real-time anomaly detection</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#fafaf9]">

          {messages.length === 0 && !typing && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-[#fee2e2] flex items-center justify-center shrink-0 mt-0.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                </svg>
              </div>
              <div className="bg-white border border-[#e5e5e5] rounded-2xl rounded-tl-sm px-4 py-3 max-w-[540px]">
                <p className="text-sm text-[#111111] leading-relaxed">
                  Hello! I'm your platform intelligence assistant. I have access to all vendor performance data, order history, financial metrics, and anomaly signals across the entire Vendorly platform. What would you like to know?
                </p>
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
              {m.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-[#fee2e2] flex items-center justify-center shrink-0 mt-0.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                  </svg>
                </div>
              )}
              <div className="flex flex-col gap-2 max-w-[580px]">
                <div className={[
                  'rounded-2xl px-4 py-3',
                  m.role === 'user'
                    ? 'bg-[#111111] text-white rounded-tr-sm'
                    : 'bg-white border border-[#e5e5e5] rounded-tl-sm',
                ].join(' ')}>
                  {m.role === 'assistant'
                    ? <RenderText text={m.text} />
                    : <p className="text-sm font-medium">{m.text}</p>
                  }
                </div>
                {m.role === 'assistant' && m.cards && (
                  <div className="grid grid-cols-3 gap-2">
                    {m.cards.map((c) => (
                      <div key={c.label} className="bg-white border border-[#e5e5e5] rounded-xl p-3">
                        <p className="text-[0.6rem] font-semibold uppercase tracking-wider text-[#9ca3af] mb-1">{c.label}</p>
                        <p className="text-sm font-bold text-[#111111] leading-none mb-1">{c.value}</p>
                        <span className={`text-[0.6rem] font-semibold px-1.5 py-0.5 rounded-md ${c.up ? 'bg-[#dcfce7] text-[#16a34a]' : 'bg-[#fee2e2] text-[#dc2626]'}`}>
                          {c.trend}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {typing && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-[#fee2e2] flex items-center justify-center shrink-0">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                </svg>
              </div>
              <div className="bg-white border border-[#e5e5e5] rounded-2xl rounded-tl-sm px-4 py-3">
                <TypingDots />
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Quick questions */}
        {messages.length === 0 && (
          <div className="px-5 pb-4 shrink-0 bg-[#fafaf9]">
            <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-[#9ca3af] mb-2">Suggested queries</p>
            <div className="flex flex-wrap gap-2">
              {QUICK_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  className="px-3 py-1.5 rounded-xl border border-[#e5e5e5] bg-white text-xs text-[#6b6b6b] hover:border-[#ef4444] hover:text-[#ef4444] hover:bg-[#fff5f5] transition-all"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="px-4 pb-4 pt-3 border-t border-[#e5e5e5] shrink-0 bg-white">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input) } }}
              placeholder="Ask about vendors, revenue, anomalies, orders…"
              className="flex-1 px-4 py-2.5 text-sm border border-[#e5e5e5] rounded-xl focus:outline-none focus:border-[#ef4444] focus:ring-2 focus:ring-[#ef4444]/10 bg-white transition"
            />
            <button
              onClick={() => send(input)}
              disabled={!input.trim() || typing}
              className="px-4 py-2.5 text-sm font-semibold bg-[#ef4444] text-white rounded-xl hover:bg-[#dc2626] disabled:opacity-40 transition-colors flex items-center gap-2 shrink-0"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
              Ask
            </button>
          </div>
          <p className="text-center text-[0.55rem] text-[#9ca3af] mt-2">Powered by Vendorly AI · Simulated responses based on mock platform data</p>
        </div>
      </div>
    </div>
  )
}
