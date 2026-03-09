// -----------------------------------------------------------------------------
// File: page.tsx
// Path: app/(storefront)/checkout/page.tsx
// -----------------------------------------------------------------------------

'use client'

import React, { useState } from 'react'
import Link  from 'next/link'
import Image from 'next/image'
import { useCart } from '@/components/storefront/CartProvider'

// ─── Step types ───────────────────────────────────────────────────────────────

type Step = 'address' | 'shipping' | 'payment' | 'review'
const STEPS: Step[] = ['address', 'shipping', 'payment', 'review']
const STEP_LABELS: Record<Step, string> = {
  address:  'Address',
  shipping: 'Shipping',
  payment:  'Payment',
  review:   'Review',
}

type AddressForm = {
  firstName: string; lastName: string; email: string; phone: string
  line1: string; line2: string; city: string; state: string
  postalCode: string; country: string
}

const EMPTY_ADDRESS: AddressForm = {
  firstName: '', lastName: '', email: '', phone: '',
  line1: '', line2: '', city: '', state: '', postalCode: '', country: 'NG',
}

const SHIPPING_OPTIONS = [
  { id: 'standard', label: 'Standard Delivery',  subtitle: '5–7 business days',  price: 2500 },
  { id: 'express',  label: 'Express Delivery',   subtitle: '2–3 business days',  price: 5000 },
  { id: 'same-day', label: 'Same-Day (Lagos)',    subtitle: 'Order before 12 pm', price: 8000 },
]

const PAYMENT_OPTIONS = [
  { id: 'card',          label: 'Credit / Debit Card',  icon: '💳' },
  { id: 'bank_transfer', label: 'Bank Transfer',         icon: '🏦' },
  { id: 'payondelivery', label: 'Pay on Delivery',       icon: '📦' },
]

export default function CheckoutPage() {
  const { items, subtotal } = useCart()
  const [step,        setStep]        = useState<Step>('address')
  const [address,     setAddress]     = useState<AddressForm>(EMPTY_ADDRESS)
  const [sameAsBilling, setSame]      = useState(true)
  const [shippingOpt, setShippingOpt] = useState('standard')
  const [paymentOpt,  setPaymentOpt]  = useState('card')
  const [cardNum,     setCardNum]     = useState('')
  const [cardExpiry,  setCardExpiry]  = useState('')
  const [cardCvc,     setCardCvc]     = useState('')
  const [cardName,    setCardName]    = useState('')
  const [placed,      setPlaced]      = useState(false)

  const shipping = SHIPPING_OPTIONS.find((o) => o.id === shippingOpt)!
  const total    = subtotal + shipping.price

  const stepIdx  = STEPS.indexOf(step)
  const goNext   = () => setStep(STEPS[stepIdx + 1])
  const goBack   = () => setStep(STEPS[stepIdx - 1])

  if (placed) return <OrderPlaced />

  if (items.length === 0) return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
      <p className="text-[#9ca3af] mb-4">Your cart is empty.</p>
      <Link href="/products" className="text-sm font-medium text-[#c8a951] underline">Browse products</Link>
    </div>
  )

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* ── Progress ───────────────────────────────────────────────────── */}
      <div className="flex items-center gap-0 mb-10 max-w-lg mx-auto">
        {STEPS.map((s, i) => {
          const done    = i < stepIdx
          const current = i === stepIdx
          return (
            <React.Fragment key={s}>
              <div className="flex flex-col items-center gap-1.5">
                <div className={[
                  'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all',
                  done    ? 'bg-[#16a34a] text-white' :
                  current ? 'bg-[#111111] text-white' :
                            'bg-[#f5f5f4] text-[#9ca3af]',
                ].join(' ')}>
                  {done ? '✓' : i + 1}
                </div>
                <span className={`text-[0.65rem] font-medium ${current ? 'text-[#111111]' : 'text-[#9ca3af]'}`}>
                  {STEP_LABELS[s]}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-px mx-2 mb-5 ${i < stepIdx ? 'bg-[#16a34a]' : 'bg-[#e5e5e5]'}`} />
              )}
            </React.Fragment>
          )
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* ── Left: Step Forms ─────────────────────────────────────────── */}
        <div className="lg:col-span-2">

          {/* ADDRESS */}
          {step === 'address' && (
            <div className="flex flex-col gap-6">
              <h2 className="font-serif text-2xl font-bold text-[#111111]">Shipping Address</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="First Name" value={address.firstName} onChange={(v) => setAddress((a) => ({ ...a, firstName: v }))} />
                <Field label="Last Name"  value={address.lastName}  onChange={(v) => setAddress((a) => ({ ...a, lastName: v }))} />
                <Field label="Email"      value={address.email}     onChange={(v) => setAddress((a) => ({ ...a, email: v }))}     type="email" span />
                <Field label="Phone"      value={address.phone}     onChange={(v) => setAddress((a) => ({ ...a, phone: v }))}     type="tel" />
                <Field label="Address Line 1" value={address.line1} onChange={(v) => setAddress((a) => ({ ...a, line1: v }))}    span />
                <Field label="Address Line 2 (optional)" value={address.line2} onChange={(v) => setAddress((a) => ({ ...a, line2: v }))} span />
                <Field label="City"       value={address.city}      onChange={(v) => setAddress((a) => ({ ...a, city: v }))} />
                <Field label="State"      value={address.state}     onChange={(v) => setAddress((a) => ({ ...a, state: v }))} />
                <Field label="Postal Code" value={address.postalCode} onChange={(v) => setAddress((a) => ({ ...a, postalCode: v }))} />
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-[#6b6b6b] uppercase tracking-wider">Country</label>
                  <select
                    value={address.country}
                    onChange={(e) => setAddress((a) => ({ ...a, country: e.target.value }))}
                    className="px-3 py-2.5 text-sm border border-[#e5e5e5] rounded-xl focus:outline-none focus:border-[#c8a951] bg-white"
                  >
                    <option value="NG">Nigeria</option>
                    <option value="GH">Ghana</option>
                    <option value="KE">Kenya</option>
                    <option value="ZA">South Africa</option>
                    <option value="US">United States</option>
                    <option value="GB">United Kingdom</option>
                  </select>
                </div>
              </div>

              <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" checked={sameAsBilling} onChange={(e) => setSame(e.target.checked)}
                  className="w-4 h-4 rounded border-[#e5e5e5] accent-[#c8a951]" />
                <span className="text-sm text-[#6b6b6b]">Billing address same as shipping</span>
              </label>

              <StepButtons onNext={goNext} nextLabel="Continue to Shipping" nextDisabled={!address.firstName || !address.line1 || !address.city} />
            </div>
          )}

          {/* SHIPPING */}
          {step === 'shipping' && (
            <div className="flex flex-col gap-6">
              <h2 className="font-serif text-2xl font-bold text-[#111111]">Shipping Method</h2>
              <div className="flex flex-col gap-3">
                {SHIPPING_OPTIONS.map((opt) => (
                  <label key={opt.id} className={[
                    'flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-all',
                    shippingOpt === opt.id
                      ? 'border-[#c8a951] bg-[#f7f1e3]'
                      : 'border-[#e5e5e5] hover:border-[#d1d5db]',
                  ].join(' ')}>
                    <input type="radio" name="shipping" value={opt.id} checked={shippingOpt === opt.id}
                      onChange={() => setShippingOpt(opt.id)} className="accent-[#c8a951]" />
                    <div className="flex-1">
                      <p className="font-medium text-sm text-[#111111]">{opt.label}</p>
                      <p className="text-xs text-[#9ca3af]">{opt.subtitle}</p>
                    </div>
                    <span className="font-semibold text-sm text-[#111111]">
                      {opt.price === 0 ? 'Free' : `₦${opt.price.toLocaleString()}`}
                    </span>
                  </label>
                ))}
              </div>
              <StepButtons onBack={goBack} onNext={goNext} nextLabel="Continue to Payment" />
            </div>
          )}

          {/* PAYMENT */}
          {step === 'payment' && (
            <div className="flex flex-col gap-6">
              <h2 className="font-serif text-2xl font-bold text-[#111111]">Payment Method</h2>
              <div className="flex flex-col gap-3">
                {PAYMENT_OPTIONS.map((opt) => (
                  <label key={opt.id} className={[
                    'flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-all',
                    paymentOpt === opt.id
                      ? 'border-[#c8a951] bg-[#f7f1e3]'
                      : 'border-[#e5e5e5] hover:border-[#d1d5db]',
                  ].join(' ')}>
                    <input type="radio" name="payment" value={opt.id} checked={paymentOpt === opt.id}
                      onChange={() => setPaymentOpt(opt.id)} className="accent-[#c8a951]" />
                    <span className="text-lg">{opt.icon}</span>
                    <span className="font-medium text-sm text-[#111111]">{opt.label}</span>
                  </label>
                ))}
              </div>

              {paymentOpt === 'card' && (
                <div className="grid sm:grid-cols-2 gap-4 p-5 rounded-2xl bg-[#fafaf9] border border-[#e5e5e5]">
                  <Field label="Cardholder Name"  value={cardName}   onChange={setCardName}   span />
                  <Field label="Card Number"       value={cardNum}    onChange={setCardNum}    span placeholder="1234 5678 9012 3456" />
                  <Field label="Expiry (MM/YY)"    value={cardExpiry} onChange={setCardExpiry} placeholder="MM/YY" />
                  <Field label="CVC"               value={cardCvc}    onChange={setCardCvc}    placeholder="123" />
                </div>
              )}

              <StepButtons onBack={goBack} onNext={goNext} nextLabel="Review Order" />
            </div>
          )}

          {/* REVIEW */}
          {step === 'review' && (
            <div className="flex flex-col gap-6">
              <h2 className="font-serif text-2xl font-bold text-[#111111]">Review Your Order</h2>

              {/* Address summary */}
              <SummaryCard label="Shipping to" onEdit={() => setStep('address')}>
                <p className="text-sm text-[#111111]">{address.firstName} {address.lastName}</p>
                <p className="text-sm text-[#6b6b6b]">{address.line1}{address.line2 ? `, ${address.line2}` : ''}</p>
                <p className="text-sm text-[#6b6b6b]">{address.city}, {address.state} {address.postalCode}</p>
              </SummaryCard>

              {/* Shipping summary */}
              <SummaryCard label="Shipping method" onEdit={() => setStep('shipping')}>
                <p className="text-sm text-[#111111]">{shipping.label}</p>
                <p className="text-sm text-[#6b6b6b]">{shipping.subtitle} · ₦{shipping.price.toLocaleString()}</p>
              </SummaryCard>

              {/* Payment summary */}
              <SummaryCard label="Payment" onEdit={() => setStep('payment')}>
                <p className="text-sm text-[#111111]">{PAYMENT_OPTIONS.find((o) => o.id === paymentOpt)?.label}</p>
              </SummaryCard>

              <button
                onClick={() => setPlaced(true)}
                className="w-full flex items-center justify-center gap-2 bg-[#c8a951] text-white text-sm font-semibold py-4 rounded-xl hover:bg-[#a8892f] transition-all active:scale-[0.98]"
              >
                Place Order · ₦{total.toLocaleString()}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </button>

              <button onClick={goBack} className="text-center text-sm text-[#9ca3af] hover:text-[#111111] transition-colors">
                ← Back to Payment
              </button>
            </div>
          )}
        </div>

        {/* ── Right: Order Summary ─────────────────────────────────────── */}
        <div className="flex flex-col gap-4 p-5 rounded-2xl bg-[#fafaf9] border border-[#e5e5e5] h-fit sticky top-[calc(32px+64px+24px)]">
          <h3 className="font-semibold text-[#111111]">Order Summary</h3>
          <div className="flex flex-col gap-3 max-h-64 overflow-y-auto pr-1">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-[#f5f5f4] shrink-0">
                  {item.product?.images[0] && (
                    <Image src={item.product.images[0].url} alt="" fill className="object-cover" sizes="48px" />
                  )}
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#111111] text-white text-[0.55rem] flex items-center justify-center font-bold">
                    {item.quantity}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-[#111111] line-clamp-1">{item.product?.name}</p>
                  {item.selectedOptions && (
                    <p className="text-[0.65rem] text-[#9ca3af]">
                      {Object.values(item.selectedOptions).join(' · ')}
                    </p>
                  )}
                </div>
                <span className="text-xs font-semibold text-[#111111] shrink-0">₦{(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-[#e5e5e5] pt-3 flex flex-col gap-2">
            <div className="flex justify-between text-sm"><span className="text-[#6b6b6b]">Subtotal</span><span>₦{subtotal.toLocaleString()}</span></div>
            <div className="flex justify-between text-sm"><span className="text-[#6b6b6b]">Shipping</span><span>₦{shipping.price.toLocaleString()}</span></div>
          </div>
          <div className="flex justify-between border-t border-[#e5e5e5] pt-3">
            <span className="font-semibold text-[#111111]">Total</span>
            <span className="font-serif text-lg font-bold text-[#111111]">₦{total.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Field({
  label, value, onChange, type = 'text', span = false, placeholder,
}: {
  label: string; value: string; onChange: (v: string) => void
  type?: string; span?: boolean; placeholder?: string
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${span ? 'sm:col-span-2' : ''}`}>
      <label className="text-xs font-semibold text-[#6b6b6b] uppercase tracking-wider">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="px-3 py-2.5 text-sm border border-[#e5e5e5] rounded-xl focus:outline-none focus:border-[#c8a951] focus:ring-2 focus:ring-[#c8a951]/10 bg-white transition"
      />
    </div>
  )
}

function StepButtons({
  onBack, onNext, nextLabel, nextDisabled = false,
}: {
  onBack?: () => void; onNext: () => void; nextLabel: string; nextDisabled?: boolean
}) {
  return (
    <div className="flex gap-3 pt-2">
      {onBack && (
        <button onClick={onBack} className="px-5 py-3 text-sm font-medium border border-[#e5e5e5] rounded-xl hover:bg-[#f5f5f4] transition-colors">
          ← Back
        </button>
      )}
      <button
        onClick={onNext}
        disabled={nextDisabled}
        className="flex-1 flex items-center justify-center gap-2 bg-[#111111] text-white text-sm font-semibold py-3 rounded-xl hover:bg-[#2a2a2a] disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
      >
        {nextLabel}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
      </button>
    </div>
  )
}

function SummaryCard({ label, onEdit, children }: { label: string; onEdit: () => void; children: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4 p-4 rounded-2xl bg-[#fafaf9] border border-[#e5e5e5]">
      <div className="flex flex-col gap-1">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#9ca3af]">{label}</p>
        {children}
      </div>
      <button onClick={onEdit} className="text-xs text-[#c8a951] font-medium hover:underline shrink-0">Edit</button>
    </div>
  )
}

function OrderPlaced() {
  const [orderNum] = useState(() => {
    const now = new Date()
    return `VND-${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}-${Math.floor(Math.random()*9000+1000)}`
  })
  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="flex flex-col items-center gap-5 text-center max-w-md mx-auto">
        <div className="w-20 h-20 rounded-full bg-[#dcfce7] flex items-center justify-center">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2"><path d="M20 6L9 17l-5-5" /></svg>
        </div>
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#111111]">Order Placed!</h1>
          <p className="text-[#6b6b6b] mt-2">Thank you for your purchase. We&apos;ll send a confirmation to your email.</p>
        </div>
        <div className="bg-[#fafaf9] border border-[#e5e5e5] rounded-2xl px-8 py-4 text-center">
          <p className="text-xs text-[#9ca3af] uppercase tracking-widest mb-1">Order Number</p>
          <p className="font-serif font-bold text-xl text-[#111111]">{orderNum}</p>
        </div>
        <div className="flex gap-3">
          <Link href="/account" className="px-5 py-2.5 text-sm font-medium border border-[#e5e5e5] rounded-xl hover:bg-[#f5f5f4] transition-colors">
            View Orders
          </Link>
          <Link href="/products" className="px-5 py-2.5 text-sm font-medium bg-[#111111] text-white rounded-xl hover:bg-[#2a2a2a] transition-colors">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}