// -----------------------------------------------------------------------------
// File: page.tsx
// Path: app/vendor/ai-insights/page.tsx
// -----------------------------------------------------------------------------

'use client'

import React, { useState, useRef, useEffect } from 'react'

type Message = {
  role: 'user' | 'assistant'
  text: string
}

const QUICK_QUESTIONS = [
  'Why did my sales drop this week?',
  'Which products should I restock?',
  'How can I improve my conversion rate?',
  'What is my best performing category?',
  'Which products get the most views but fewest sales?',
  'Should I run a discount campaign?',
]

const INSIGHT_RESPONSES: { keywords: string[]; response: string; cards?: { label: string; value: string; trend: string; up: boolean }[] }[] = [
  {
    keywords: ['drop', 'decline', 'sales drop', 'down', 'lower'],
    response: `Based on your store data, here's what caused the dip this week:\n\n**Primary factors:**\n• Your top product "Woven Leather Journal" went out of stock on Day 3, removing ₦42,000/day in revenue\n• Traffic from organic search dropped 18% — likely due to a category page update on the platform\n• 2 of your 5 active coupons expired without renewal\n\n**Recommendation:** Restock the Leather Journal immediately (it drives 34% of your revenue). Re-activate the 15% off coupon — it historically lifts conversion by 2.3x during slow weeks.`,
    cards: [
      { label: 'Revenue this week', value: '₦187,400', trend: '–23% vs last week', up: false },
      { label: 'Orders this week', value: '34', trend: '–18% vs last week', up: false },
      { label: 'Out-of-stock items', value: '3', trend: '2 new this week', up: false },
    ],
  },
  {
    keywords: ['restock', 'stock', 'inventory', 'running low'],
    response: `Here are products that need restocking urgently based on your current velocity:\n\n**Critical (stock out in <3 days):**\n• Handwoven Leather Journal — 2 units left, selling 4/day\n• Adire Silk Scarf — 1 unit left, selling 2/day\n\n**Low stock (restock within a week):**\n• Natural Shea Gift Set — 8 units, selling 3/day\n• Ankara Tote Bag — 5 units, selling 2/day\n\n**Action:** Restocking the top 2 items alone will recover approximately ₦38,000 in daily revenue.`,
    cards: [
      { label: 'Items at risk', value: '4 products', trend: 'Need restock now', up: false },
      { label: 'Revenue at risk', value: '₦54,000/day', trend: 'If stock runs out', up: false },
      { label: 'Avg restock time', value: '2–3 days', trend: 'Based on your history', up: true },
    ],
  },
  {
    keywords: ['conversion', 'convert', 'improve', 'rate'],
    response: `Your current conversion rate is **2.1%** — the platform average for your category is **3.4%**. Here's how to close the gap:\n\n**Top 3 recommendations:**\n1. **Add more product images** — listings with 5+ photos convert 67% better. You average 2.3 images per listing.\n2. **Enable customer Q&A** — 78% of your product views come from buyers who hesitated. A Q&A section reduces drop-off.\n3. **Offer free shipping above ₦15,000** — your cart abandonment spikes at checkout when shipping is added. This threshold would cover 71% of your orders.\n\nImplementing all three is projected to lift conversions to ~3.2%.`,
    cards: [
      { label: 'Your conversion rate', value: '2.1%', trend: '–1.3% vs platform avg', up: false },
      { label: 'Avg product images', value: '2.3', trend: 'Platform avg: 5.1', up: false },
      { label: 'Cart abandonment', value: '68%', trend: 'At checkout stage', up: false },
    ],
  },
  {
    keywords: ['best', 'category', 'performing', 'top'],
    response: `Your **Home & Living** category is your strongest performer this month:\n\n• **₦312,000 revenue** — 47% of your total store revenue\n• **4.9★ average rating** — highest across all your categories\n• **Lowest return rate** at 1.2%\n\n**Opportunity:** You only have 4 products in Home & Living. Expanding to 8–10 SKUs in this category could double revenue. Your Woven Basket and Table Runner are the top performers — consider sourcing complementary pieces like candle holders or wall art.`,
    cards: [
      { label: 'Top category', value: 'Home & Living', trend: '47% of revenue', up: true },
      { label: 'Category revenue', value: '₦312,000', trend: '+31% vs last month', up: true },
      { label: 'Products in category', value: '4 SKUs', trend: 'Expand to 10 for 2x', up: true },
    ],
  },
  {
    keywords: ['views', 'impression', 'click', 'but', 'fewest'],
    response: `These products get high views but low conversions — they have a "window shopping" problem:\n\n| Product | Views | Sales | Conv. Rate |\n|---|---|---|---|\n| Artisan Candle Set | 1,240 | 8 | 0.6% |\n| Hand-painted Tray | 890 | 6 | 0.7% |\n| Macramé Wall Art | 740 | 9 | 1.2% |\n\n**Root cause analysis:** These items have fewer than 3 reviews and no size/dimension info in the listing. Buyers are interested but uncertain. Adding clear measurements, a 30-day return policy note, and 2–3 customer reviews could lift conversion by 3–5x.`,
    cards: [
      { label: 'Products with <1% conv.', value: '6 listings', trend: 'Need listing fixes', up: false },
      { label: 'Lost revenue estimate', value: '₦89,000/mo', trend: 'From low-conv. items', up: false },
      { label: 'Avg reviews (affected)', value: '1.4 stars', trend: 'vs 4.7 on top items', up: false },
    ],
  },
  {
    keywords: ['discount', 'campaign', 'coupon', 'sale', 'promotion'],
    response: `Based on your store data, **yes — a targeted campaign would help right now.** Here's my recommendation:\n\n**Best campaign type for you:** Flash sale on slow-moving inventory\n\n**Why now:**\n• You have 6 products with >60 days of stock sitting unsold\n• Platform traffic peaks on Fridays (tomorrow)\n• Your last coupon campaign (March) delivered 3.2x normal revenue\n\n**Suggested campaign:**\n• 20% off your 6 slow-moving products\n• Duration: 48 hours (Friday–Saturday)\n• Estimated incremental revenue: ₦67,000–₦94,000\n\nShould I draft a coupon for this?`,
    cards: [
      { label: 'Slow-moving stock', value: '6 products', trend: '>60 days unsold', up: false },
      { label: 'Last campaign ROI', value: '3.2x', trend: 'March flash sale', up: true },
      { label: 'Projected uplift', value: '₦67–94k', trend: 'For 48hr campaign', up: true },
    ],
  },
]

const FALLBACK = (q: string) =>
  `I've analysed your store data for "${q}".\n\nBased on your last 30 days of activity across **${Math.floor(Math.random() * 8) + 4} active products** and **${Math.floor(Math.random() * 200) + 80} orders**, here's what I found:\n\nYour store is performing above the platform median in revenue per order (₦18,400 vs ₦14,200 avg), but has room to grow in product discoverability — only 31% of your listings appear in search results for relevant keywords.\n\n**Quick wins to action this week:**\n1. Add keyword-rich titles to your bottom 5 products\n2. Reply to all unanswered reviews (you have 3 pending)\n3. Update your store banner for better first impression\n\nWant me to drill deeper into any of these areas?`

function getResponse(input: string): { text: string; cards?: { label: string; value: string; trend: string; up: boolean }[] } {
  const lower = input.toLowerCase()
  for (const r of INSIGHT_RESPONSES) {
    if (r.keywords.some((kw) => lower.includes(kw))) {
      return { text: r.response, cards: r.cards }
    }
  }
  return { text: FALLBACK(input) }
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1 py-1">
      {[0, 1, 2].map((i) => (
        <span key={i} className="w-2 h-2 rounded-full bg-[#c8a951] animate-bounce"
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

type AssistantMessage = {
  role: 'user' | 'assistant'
  text: string
  cards?: { label: string; value: string; trend: string; up: boolean }[]
}

export default function VendorAIInsightsPage() {
  const [messages, setMessages] = useState<AssistantMessage[]>([])
  const [input,    setInput]    = useState('')
  const [typing,   setTyping]   = useState(false)
  const bottomRef               = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  const send = (text: string) => {
    if (!text.trim() || typing) return
    setMessages((m) => [...m, { role: 'user', text }])
    setInput('')
    setTyping(true)
    const delay = 1000 + Math.random() * 800
    setTimeout(() => {
      const { text: reply, cards } = getResponse(text)
      setMessages((m) => [...m, { role: 'assistant', text: reply, cards }])
      setTyping(false)
    }, delay)
  }

  return (
    <div className="p-5 lg:p-7 max-w-[900px] flex flex-col gap-5">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-8 h-8 rounded-xl bg-[#c8a951] flex items-center justify-center shrink-0">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
              </svg>
            </div>
            <h1 className="font-serif text-2xl font-bold text-[#111111]">AI Insights</h1>
          </div>
          <p className="text-sm text-[#9ca3af]">Ask questions about your store performance and get intelligent, data-driven answers.</p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#dcfce7] border border-[#bbf7d0] shrink-0">
          <span className="w-2 h-2 rounded-full bg-[#16a34a] animate-pulse" />
          <span className="text-xs font-semibold text-[#16a34a]">AI Online</span>
        </div>
      </div>

      {/* Quick metric cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Revenue (30d)', value: '₦662,800', trend: '+18%', up: true },
          { label: 'Orders (30d)',  value: '124',        trend: '+12%', up: true },
          { label: 'Conversion',   value: '2.1%',        trend: '–1.3% vs avg', up: false },
          { label: 'Avg Rating',   value: '4.7★',        trend: '12 reviews',  up: true },
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

      {/* Chat area */}
      <div className="bg-white border border-[#e5e5e5] rounded-2xl flex flex-col overflow-hidden" style={{ minHeight: '420px' }}>

        {/* Chat header */}
        <div className="px-5 py-3.5 border-b border-[#f5f5f4] flex items-center gap-2.5 shrink-0">
          <div className="w-7 h-7 rounded-xl bg-[#fef9ec] border border-[#e8d5a3] flex items-center justify-center shrink-0">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#c8a951" strokeWidth="2">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-[#111111] leading-none">Store Intelligence</p>
            <p className="text-[0.65rem] text-[#9ca3af] mt-0.5">Analysing your last 90 days of data</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">

          {/* Welcome */}
          {messages.length === 0 && !typing && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-[#fef9ec] border border-[#e8d5a3] flex items-center justify-center shrink-0 mt-0.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c8a951" strokeWidth="2">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                </svg>
              </div>
              <div className="bg-[#f5f5f4] rounded-2xl rounded-tl-sm px-4 py-3 max-w-[520px]">
                <p className="text-sm text-[#111111] leading-relaxed">
                  Hi! I'm your store intelligence assistant. I've analysed your last 90 days of sales, product performance, and customer behaviour. Ask me anything about your store — I'll give you specific, actionable insights.
                </p>
              </div>
            </div>
          )}

          {/* Message list */}
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
              {m.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-[#fef9ec] border border-[#e8d5a3] flex items-center justify-center shrink-0 mt-0.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c8a951" strokeWidth="2">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                  </svg>
                </div>
              )}
              <div className="flex flex-col gap-2 max-w-[560px]">
                <div className={[
                  'rounded-2xl px-4 py-3',
                  m.role === 'user'
                    ? 'bg-[#111111] text-white rounded-tr-sm'
                    : 'bg-[#f5f5f4] rounded-tl-sm',
                ].join(' ')}>
                  {m.role === 'assistant'
                    ? <RenderText text={m.text} />
                    : <p className="text-sm font-medium">{m.text}</p>
                  }
                </div>
                {/* Inline stat cards for AI messages */}
                {m.role === 'assistant' && m.cards && (
                  <div className="grid grid-cols-3 gap-2">
                    {m.cards.map((c) => (
                      <div key={c.label} className="bg-white border border-[#e5e5e5] rounded-xl p-3">
                        <p className="text-[0.6rem] font-semibold uppercase tracking-wider text-[#9ca3af] mb-1">{c.label}</p>
                        <p className="text-base font-bold text-[#111111] leading-none mb-1">{c.value}</p>
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

          {/* Typing indicator */}
          {typing && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-[#fef9ec] border border-[#e8d5a3] flex items-center justify-center shrink-0">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c8a951" strokeWidth="2">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                </svg>
              </div>
              <div className="bg-[#f5f5f4] rounded-2xl rounded-tl-sm px-4 py-3">
                <TypingDots />
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Quick questions */}
        {messages.length === 0 && (
          <div className="px-5 pb-4 shrink-0">
            <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-[#9ca3af] mb-2">Suggested questions</p>
            <div className="flex flex-wrap gap-2">
              {QUICK_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  className="px-3 py-1.5 rounded-xl border border-[#e5e5e5] text-xs text-[#6b6b6b] hover:border-[#c8a951] hover:text-[#c8a951] hover:bg-[#fef9ec] transition-all"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="px-4 pb-4 pt-3 border-t border-[#f0f0f0] shrink-0">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input) } }}
              placeholder="Ask about sales, products, customers, trends…"
              className="flex-1 px-4 py-2.5 text-sm border border-[#e5e5e5] rounded-xl focus:outline-none focus:border-[#c8a951] focus:ring-2 focus:ring-[#c8a951]/10 bg-white transition"
            />
            <button
              onClick={() => send(input)}
              disabled={!input.trim() || typing}
              className="px-4 py-2.5 text-sm font-semibold bg-[#c8a951] text-white rounded-xl hover:bg-[#b8993f] disabled:opacity-40 transition-colors flex items-center gap-2 shrink-0"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
              Ask
            </button>
          </div>
          <p className="text-center text-[0.55rem] text-[#9ca3af] mt-2">Powered by Vendorly AI · Simulated responses based on mock store data</p>
        </div>
      </div>
    </div>
  )
}
