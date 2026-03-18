// -----------------------------------------------------------------------------
// File: AIAssistant.tsx
// Path: components/ui/AIAssistant.tsx
// -----------------------------------------------------------------------------

'use client'

import React, { useState, useRef, useEffect } from 'react'

type Message = {
  role: 'user' | 'assistant'
  text: string
}

const SUGGESTIONS = [
  'Find me a handmade bag under ₦20,000',
  "What's trending this week?",
  'I need a gift for my mom',
  'Show me eco-friendly products',
  'Best sellers in fashion?',
]

const SIMULATED_RESPONSES: { keywords: string[]; response: string }[] = [
  {
    keywords: ['bag', 'handbag', 'purse'],
    response:
      "I found some great handmade bags for you! Here are top picks under ₦20,000:\n\n• **Woven Raffia Tote** by CraftHouse — ₦12,500\n• **Genuine Leather Clutch** by LeatherCo — ₦17,800\n• **Ankara Print Shoulder Bag** by AdireCraft — ₦9,200\n\nAll are handcrafted by verified vendors. Want me to filter by color or size?",
  },
  {
    keywords: ['trending', 'popular', 'top', 'best seller', 'bestseller'],
    response:
      "This week's trending items on Vendorly:\n\n🔥 **Handwoven Ankara Dress** — 142 sold this week\n🔥 **Natural Shea Butter Set** — 98 sold\n🔥 **Leather Journal Notebook** — 87 sold\n🔥 **Adire Table Runner** — 74 sold\n\nFashion and skincare are leading this week. Want to explore any of these categories?",
  },
  {
    keywords: ['gift', 'mom', 'mother', 'present', 'birthday'],
    response:
      "Lovely! Here are thoughtful gift ideas perfect for your mom:\n\n🎁 **Luxury Skincare Gift Set** — ₦24,500 (most popular gift)\n🎁 **Hand-embroidered Silk Scarf** — ₦18,000\n🎁 **Artisan Candle Collection** — ₦12,800\n🎁 **Personalised Jewellery Box** — ₦15,000\n\nAll come with free gift wrapping from the vendors. Should I narrow it down by budget?",
  },
  {
    keywords: ['eco', 'sustainable', 'green', 'organic', 'natural'],
    response:
      "Great choice! Our eco-friendly collection includes:\n\n🌿 **Organic Shea Butter Lotion** — ₦8,500\n🌿 **Beeswax Wrap Set** (replaces cling film) — ₦6,200\n🌿 **Handwoven Grass Basket** — ₦11,000\n🌿 **Natural Dye Adire Fabric** — ₦14,800\n\nAll verified as sustainably sourced. Filter by product type?",
  },
  {
    keywords: ['fashion', 'clothing', 'dress', 'wear', 'outfit'],
    response:
      "Here are our top fashion picks right now:\n\n👗 **Ankara Wrap Dress** by AsoStyle — ₦22,000\n👗 **Linen Co-ord Set** by NaturalThread — ₦31,500\n👗 **Adire Maxi Skirt** by AdireCraft — ₦18,000\n👗 **Hand-stitched Agbada** by NijaKing — ₦45,000\n\nNew arrivals drop every Friday. Want me to filter by size or price range?",
  },
  {
    keywords: ['hello', 'hi', 'hey', 'help'],
    response:
      "Hi there! I'm your Vendorly shopping assistant. I can help you:\n\n• **Find products** by description, mood, or occasion\n• **Discover deals** and trending items\n• **Compare vendors** and check reviews\n• **Track your order** status\n\nWhat are you looking for today?",
  },
]

function getSimulatedResponse(input: string): string {
  const lower = input.toLowerCase()
  for (const { keywords, response } of SIMULATED_RESPONSES) {
    if (keywords.some((kw) => lower.includes(kw))) return response
  }
  return `I searched Vendorly for "${input}" and found **24 matching products** across 8 vendors. The most popular result is the **${input.split(' ')[0]} Collection** by ArtisanHub at ₦16,500 with a 4.8★ rating.\n\nWould you like me to sort by price, rating, or newest arrivals?`
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-2 h-2 rounded-full bg-[#c8a951] animate-bounce"
          style={{ animationDelay: `${i * 0.15}s`, animationDuration: '0.8s' }}
        />
      ))}
    </div>
  )
}

function AssistantMessage({ text }: { text: string }) {
  // Render bold (**text**) and newlines
  const parts = text.split('\n').map((line, i) => {
    const segments = line.split(/\*\*(.*?)\*\*/g)
    return (
      <p key={i} className={i > 0 ? 'mt-1' : ''}>
        {segments.map((seg, j) =>
          j % 2 === 1 ? <strong key={j}>{seg}</strong> : seg
        )}
      </p>
    )
  })
  return <div className="text-sm leading-relaxed text-[#111111]">{parts}</div>
}

export function AIAssistant() {
  const [open, setOpen]           = useState(false)
  const [messages, setMessages]   = useState<Message[]>([])
  const [input, setInput]         = useState('')
  const [typing, setTyping]       = useState(false)
  const [started, setStarted]     = useState(false)
  const bottomRef                 = useRef<HTMLDivElement>(null)
  const inputRef                  = useRef<HTMLInputElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [open])

  const sendMessage = (text: string) => {
    if (!text.trim() || typing) return
    setStarted(true)
    const userMsg: Message = { role: 'user', text }
    setMessages((m) => [...m, userMsg])
    setInput('')
    setTyping(true)

    const delay = 900 + Math.random() * 800
    setTimeout(() => {
      const reply = getSimulatedResponse(text)
      setMessages((m) => [...m, { role: 'assistant', text: reply }])
      setTyping(false)
    }, delay)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  return (
    <>
      {/* ── Floating button ── */}
      <button
        onClick={() => setOpen((o) => !o)}
        className={[
          'fixed bottom-6 right-6 z-[998] flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl transition-all duration-200 font-medium text-sm',
          open
            ? 'bg-[#111111] text-white'
            : 'bg-[#c8a951] text-[#111111] hover:bg-[#b8993f] hover:scale-105 active:scale-100',
        ].join(' ')}
      >
        {open ? (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
            Close
          </>
        ) : (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
            </svg>
            Ask AI
          </>
        )}
      </button>

      {/* ── Chat panel ── */}
      {open && (
        <div className="fixed bottom-[4.5rem] right-6 z-[997] w-[360px] max-w-[calc(100vw-1.5rem)] bg-white rounded-2xl shadow-2xl border border-[#e5e5e5] flex flex-col overflow-hidden"
          style={{ height: '500px', maxHeight: 'calc(100vh - 6rem)' }}>

          {/* Header */}
          <div className="px-4 py-3.5 bg-[#111111] flex items-center gap-3 shrink-0">
            <div className="w-8 h-8 rounded-xl bg-[#c8a951] flex items-center justify-center shrink-0">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="2">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-white leading-none">Vendorly AI</p>
              <p className="text-[0.65rem] text-white/50 mt-0.5">Shopping assistant</p>
            </div>
            <div className="ml-auto flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
              <span className="text-[0.6rem] text-white/40">Online</span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">

            {/* Welcome */}
            {!started && (
              <div className="flex gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#fef3c7] flex items-center justify-center shrink-0 mt-0.5">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#c8a951" strokeWidth="2">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                  </svg>
                </div>
                <div className="bg-[#f5f5f4] rounded-2xl rounded-tl-sm px-3.5 py-2.5 max-w-[260px]">
                  <p className="text-sm text-[#111111]">
                    Hi! I'm your Vendorly shopping assistant. I can help you find products, discover deals, and explore our marketplace.
                  </p>
                </div>
              </div>
            )}

            {/* Message list */}
            {messages.map((m, i) => (
              <div key={i} className={`flex gap-2.5 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                {m.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-full bg-[#fef3c7] flex items-center justify-center shrink-0 mt-0.5">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#c8a951" strokeWidth="2">
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                    </svg>
                  </div>
                )}
                <div className={[
                  'rounded-2xl px-3.5 py-2.5 max-w-[260px]',
                  m.role === 'user'
                    ? 'bg-[#c8a951] text-[#111111] rounded-tr-sm'
                    : 'bg-[#f5f5f4] rounded-tl-sm',
                ].join(' ')}>
                  {m.role === 'assistant'
                    ? <AssistantMessage text={m.text} />
                    : <p className="text-sm font-medium">{m.text}</p>
                  }
                </div>
              </div>
            ))}

            {/* Typing */}
            {typing && (
              <div className="flex gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#fef3c7] flex items-center justify-center shrink-0">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#c8a951" strokeWidth="2">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                  </svg>
                </div>
                <div className="bg-[#f5f5f4] rounded-2xl rounded-tl-sm">
                  <TypingIndicator />
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Suggestions */}
          {!started && (
            <div className="px-4 pb-3 shrink-0">
              <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-[#9ca3af] mb-2">Try asking</p>
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    className="px-2.5 py-1 rounded-lg border border-[#e5e5e5] text-xs text-[#6b6b6b] hover:border-[#c8a951] hover:text-[#c8a951] hover:bg-[#fef9ec] transition-all"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="px-3 pb-3 pt-2 border-t border-[#f0f0f0] shrink-0">
            <div className="flex items-center gap-2 bg-[#f5f5f4] rounded-xl px-3 py-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search or ask anything…"
                className="flex-1 bg-transparent text-sm focus:outline-none text-[#111111] placeholder:text-[#9ca3af]"
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || typing}
                className="w-7 h-7 rounded-lg bg-[#c8a951] flex items-center justify-center disabled:opacity-40 hover:bg-[#b8993f] transition-colors shrink-0"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="2.5">
                  <line x1="22" y1="2" x2="11" y2="13"/>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              </button>
            </div>
            <p className="text-center text-[0.55rem] text-[#9ca3af] mt-2">Powered by Vendorly AI · Simulated responses</p>
          </div>
        </div>
      )}
    </>
  )
}
