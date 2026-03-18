// -----------------------------------------------------------------------------
// File: PricingPlans.tsx
// Path: components/vendor/PricingPlans.tsx
//
// Billing & Upgrade tab for /vendor/settings.
//
// Plans: Free → Starter ($29/mo) → Growth ($79/mo)
// Billing cycles: Monthly | Annual (20% discount)
// Currency: USD by default; extend with detectCurrency() from lib/utils/currency
// Payment: Stripe — wire up handleUpgrade() to your Stripe Checkout session
//          when the backend is ready. The UI is fully built.
// -----------------------------------------------------------------------------

'use client'

import React, { useState } from 'react'
import type { VendorPlan } from '@/types'

// ─── Plan definitions ─────────────────────────────────────────────────────────

type PlanId = 'free' | 'starter' | 'growth'

interface PlanFeature {
  label:    string
  included: boolean
  note?:    string   // extra context shown in muted text
}

interface Plan {
  id:           PlanId
  name:         string
  monthlyPrice: number
  annualPrice:  number   // total billed annually
  productLimit: number | null   // null = unlimited
  commission:   number   // platform commission %
  badge?:       string
  features:     PlanFeature[]
}

const PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    monthlyPrice: 0,
    annualPrice: 0,
    productLimit: 10,
    commission: 15,
    features: [
      { label: 'Up to 10 products',                   included: true },
      { label: '15% platform commission',              included: true },
      { label: 'Basic store dashboard',                included: true },
      { label: 'Analytics',                            included: false },
      { label: 'Coupon codes',                         included: false },
      { label: 'Featured marketplace placement',       included: false },
      { label: 'Priority support',                     included: false },
      { label: 'Custom store branding',                included: false },
    ],
  },
  {
    id: 'starter',
    name: 'Starter',
    monthlyPrice: 29,
    annualPrice: 278,   // ≈ $23.17/mo — saves ~20%
    productLimit: 50,
    commission: 8,
    badge: 'Most Popular',
    features: [
      { label: 'Up to 50 products',                   included: true },
      { label: '8% platform commission',               included: true },
      { label: 'Basic store dashboard',                included: true },
      { label: '30-day analytics',                     included: true },
      { label: 'Up to 5 coupon codes',                 included: true },
      { label: 'Featured marketplace placement',       included: false },
      { label: 'Priority support',                     included: false },
      { label: 'Custom store branding',                included: false },
    ],
  },
  {
    id: 'growth',
    name: 'Growth',
    monthlyPrice: 79,
    annualPrice: 758,   // ≈ $63.17/mo — saves ~20%
    productLimit: null,
    commission: 5,
    features: [
      { label: 'Unlimited products',                  included: true },
      { label: '5% platform commission',              included: true },
      { label: 'Full analytics + data export',        included: true },
      { label: 'Unlimited coupon codes',              included: true },
      { label: 'Featured marketplace placement',      included: true },
      { label: 'Priority support',                    included: true },
      { label: 'Custom store branding',               included: true },
      { label: 'Early access to new features',        included: true },
    ],
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function annualMonthly(plan: Plan) {
  return (plan.annualPrice / 12).toFixed(2)
}

function savingsPercent(plan: Plan) {
  if (plan.monthlyPrice === 0) return 0
  const annualIfMonthly = plan.monthlyPrice * 12
  return Math.round((1 - plan.annualPrice / annualIfMonthly) * 100)
}

// Map the old VendorPlan values from types/index.ts to our PlanId
function normalisePlan(plan?: string): PlanId {
  if (plan === 'starter' || plan === 'growth' || plan === 'free') return plan
  if (plan === 'pro' || plan === 'enterprise') return 'growth'
  if (plan === 'basic') return 'starter'
  return 'free'
}

// ─── Component ────────────────────────────────────────────────────────────────

interface PricingPlansProps {
  /** Current vendor plan from mock/API data */
  currentPlan?:   VendorPlan
  /** How many products the vendor has listed */
  productCount?:  number
  /** Billing renewal date (ISO string or undefined for free) */
  renewalDate?:   string
}

export function PricingPlans({ currentPlan, productCount = 0, renewalDate }: PricingPlansProps) {
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly')
  const planId = normalisePlan(currentPlan)
  const activePlan = PLANS.find((p) => p.id === planId) ?? PLANS[0]

  // TODO: Wire up to Stripe Checkout API when backend is ready
  const handleUpgrade = (targetPlan: Plan) => {
    const period = billing === 'annual' ? 'annual' : 'monthly'
    console.log(`[Stripe] Initiate checkout → plan: ${targetPlan.id}, billing: ${period}`)
    // Example:
    // const res = await fetch('/api/stripe/checkout', {
    //   method: 'POST',
    //   body: JSON.stringify({ planId: targetPlan.id, billing: period }),
    // })
    // const { url } = await res.json()
    // window.location.href = url
    alert(`Stripe integration coming soon!\nPlan: ${targetPlan.name} (${period})`)
  }

  const handleDowngrade = (targetPlan: Plan) => {
    // Downgrade takes effect at the end of the current billing cycle.
    // Products are NOT locked; privileges are removed when the cycle ends.
    console.log(`[Billing] Schedule downgrade → ${targetPlan.id} at end of cycle`)
    alert(`Downgrade to ${targetPlan.name} will take effect at the end of your current billing cycle.`)
  }

  return (
    <div className="flex flex-col gap-6">

      {/* ── Current plan summary ─────────────────────────────────────────── */}
      <CurrentPlanSummary
        plan={activePlan}
        productCount={productCount}
        renewalDate={renewalDate}
        billing={billing}
      />

      {/* ── Billing toggle ───────────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <span className={`text-sm font-medium ${billing === 'monthly' ? 'text-[#111111]' : 'text-[#9ca3af]'}`}>Monthly</span>
        <button
          onClick={() => setBilling((b) => b === 'monthly' ? 'annual' : 'monthly')}
          className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${billing === 'annual' ? 'bg-[#c8a951]' : 'bg-[#e5e5e5]'}`}
        >
          <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${billing === 'annual' ? 'translate-x-[26px]' : 'translate-x-0.5'}`} />
        </button>
        <span className={`text-sm font-medium ${billing === 'annual' ? 'text-[#111111]' : 'text-[#9ca3af]'}`}>
          Annual
        </span>
        <span className="text-xs font-semibold bg-[#f0fdf4] text-[#16a34a] border border-[#bbf7d0] px-2 py-0.5 rounded-full">
          Save up to 20%
        </span>
      </div>

      {/* ── Plan cards ───────────────────────────────────────────────────── */}
      <div className="grid md:grid-cols-3 gap-4">
        {PLANS.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            billing={billing}
            isCurrent={plan.id === planId}
            isUpgrade={PLANS.indexOf(plan) > PLANS.findIndex((p) => p.id === planId)}
            onUpgrade={() => handleUpgrade(plan)}
            onDowngrade={() => handleDowngrade(plan)}
          />
        ))}
      </div>

      {/* ── Footer note ──────────────────────────────────────────────────── */}
      <p className="text-xs text-[#9ca3af] text-center leading-relaxed">
        All plans include secure payments via Stripe. Prices shown in USD.{' '}
        <span className="text-[#c8a951]">Currency conversion</span> applied at checkout based on your location.
        Downgrading takes effect at the end of your current billing cycle — your products are never locked.
      </p>
    </div>
  )
}

// ─── Current plan summary card ────────────────────────────────────────────────

function CurrentPlanSummary({
  plan, productCount, renewalDate, billing,
}: {
  plan: Plan; productCount: number; renewalDate?: string; billing: 'monthly' | 'annual'
}) {
  const limit = plan.productLimit
  const usagePct = limit ? Math.min((productCount / limit) * 100, 100) : 0
  const isNearLimit = limit ? productCount / limit >= 0.8 : false
  const price = billing === 'annual' ? plan.annualPrice : plan.monthlyPrice * 12

  return (
    <div className="bg-white rounded-2xl border border-[#e5e5e5] p-5 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#9ca3af] mb-1">Current Plan</p>
          <div className="flex items-center gap-2">
            <h3 className="font-serif text-xl font-bold text-[#111111]">{plan.name}</h3>
            {plan.id !== 'free' && (
              <span className="text-xs font-semibold bg-[#f7f1e3] text-[#a8892f] border border-[#e8d5a3] px-2 py-0.5 rounded-full">Active</span>
            )}
          </div>
          {plan.id === 'free' ? (
            <p className="text-sm text-[#9ca3af] mt-1">No billing — upgrade anytime</p>
          ) : renewalDate ? (
            <p className="text-sm text-[#9ca3af] mt-1">
              Renews {new Date(renewalDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          ) : null}
        </div>

        {/* Commission highlight */}
        <div className="text-right shrink-0">
          <p className="text-xs text-[#9ca3af] font-medium">Platform commission</p>
          <p className="font-serif text-2xl font-bold text-[#111111]">{plan.commission}%</p>
        </div>
      </div>

      {/* Product usage */}
      {limit !== null && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-xs font-medium text-[#6b6b6b]">Products used</p>
            <p className={`text-xs font-semibold ${isNearLimit ? 'text-[#d97706]' : 'text-[#111111]'}`}>
              {productCount} / {limit}
            </p>
          </div>
          <div className="h-2 bg-[#f5f5f4] rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${isNearLimit ? 'bg-[#f59e0b]' : 'bg-[#c8a951]'}`}
              style={{ width: `${usagePct}%` }}
            />
          </div>
          {isNearLimit && (
            <p className="text-xs text-[#d97706] font-medium mt-1.5">
              ⚠ You're close to your product limit. Consider upgrading.
            </p>
          )}
        </div>
      )}

      {limit === null && (
        <div className="mt-4 flex items-center gap-2 text-xs text-[#16a34a] font-medium">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          Unlimited products — no cap on your growth
        </div>
      )}
    </div>
  )
}

// ─── Individual plan card ─────────────────────────────────────────────────────

function PlanCard({
  plan, billing, isCurrent, isUpgrade, onUpgrade, onDowngrade,
}: {
  plan: Plan
  billing: 'monthly' | 'annual'
  isCurrent: boolean
  isUpgrade: boolean
  onUpgrade: () => void
  onDowngrade: () => void
}) {
  const displayPrice = billing === 'annual'
    ? Number(annualMonthly(plan))
    : plan.monthlyPrice
  const savings = savingsPercent(plan)
  const isGrowth = plan.id === 'growth'

  return (
    <div className={[
      'relative rounded-2xl border p-5 flex flex-col gap-5 transition-all',
      isGrowth
        ? 'border-[#c8a951] bg-gradient-to-b from-[#fefdf7] to-white shadow-md'
        : isCurrent
          ? 'border-[#111111] bg-white'
          : 'border-[#e5e5e5] bg-white hover:border-[#c8a951]/50',
    ].join(' ')}>

      {/* Badge */}
      {plan.badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="bg-[#c8a951] text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm whitespace-nowrap">
            {plan.badge}
          </span>
        </div>
      )}

      {/* Plan name + price */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-[#111111] text-base">{plan.name}</h4>
          {isCurrent && (
            <span className="text-xs font-semibold bg-[#111111] text-white px-2.5 py-1 rounded-full">
              Current
            </span>
          )}
        </div>

        {plan.monthlyPrice === 0 ? (
          <div>
            <span className="font-serif text-3xl font-bold text-[#111111]">$0</span>
            <span className="text-sm text-[#9ca3af] ml-1">/ month</span>
          </div>
        ) : (
          <div>
            <div className="flex items-baseline gap-1">
              <span className="font-serif text-3xl font-bold text-[#111111]">
                ${billing === 'annual' ? annualMonthly(plan) : plan.monthlyPrice}
              </span>
              <span className="text-sm text-[#9ca3af]">/ month</span>
            </div>
            {billing === 'annual' && savings > 0 && (
              <p className="text-xs text-[#16a34a] font-medium mt-0.5">
                ${plan.annualPrice} billed annually — save {savings}%
              </p>
            )}
          </div>
        )}

        <p className="text-xs text-[#9ca3af] mt-2">
          {plan.commission}% commission · {plan.productLimit === null ? 'Unlimited' : `Up to ${plan.productLimit}`} products
        </p>
      </div>

      {/* Feature list */}
      <ul className="flex flex-col gap-2.5 flex-1">
        {plan.features.map((f, i) => (
          <li key={i} className="flex items-start gap-2.5">
            {f.included
              ? <svg className="shrink-0 mt-0.5 text-[#16a34a]" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              : <svg className="shrink-0 mt-0.5 text-[#d1d5db]" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            }
            <span className={`text-sm leading-snug ${f.included ? 'text-[#111111]' : 'text-[#9ca3af]'}`}>
              {f.label}
            </span>
          </li>
        ))}
      </ul>

      {/* CTA button */}
      <div className="mt-auto">
        {isCurrent ? (
          <div className="w-full py-2.5 text-sm font-medium text-center text-[#9ca3af] border border-[#e5e5e5] rounded-xl">
            Current Plan
          </div>
        ) : isUpgrade ? (
          <button
            onClick={onUpgrade}
            className={[
              'w-full py-2.5 text-sm font-semibold rounded-xl transition-all active:scale-[0.98]',
              isGrowth
                ? 'bg-[#c8a951] text-white hover:bg-[#a8892f]'
                : 'bg-[#111111] text-white hover:bg-[#2a2a2a]',
            ].join(' ')}
          >
            Upgrade to {plan.name}
            <span className="ml-1.5 opacity-70">→</span>
          </button>
        ) : (
          <button
            onClick={onDowngrade}
            className="w-full py-2.5 text-sm font-medium text-[#6b6b6b] border border-[#e5e5e5] rounded-xl hover:bg-[#f5f5f4] transition-all"
          >
            Switch to {plan.name}
          </button>
        )}
      </div>
    </div>
  )
}
