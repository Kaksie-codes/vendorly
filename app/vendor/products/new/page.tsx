// -----------------------------------------------------------------------------
// File: page.tsx
// Path: app/vendor/products/new/page.tsx
// -----------------------------------------------------------------------------

'use client'

import React, { useState } from 'react'
import Link                 from 'next/link'
import { useRouter }        from 'next/navigation'
import { getFeaturedCategories } from '@/lib/mock-data'
import type { ProductVariantOption } from '@/types'
import { Select } from '@/components/ui/Select'

type FormData = {
  name:             string
  slug:             string
  shortDescription: string
  description:      string
  price:            string
  compareAtPrice:   string
  sku:              string
  stock:            string
  weight:           string
  categoryId:       string
  status:           'active' | 'draft' | 'archived' | 'out_of_stock'
  condition:        'new' | 'like_new' | 'good' | 'fair'
  featured:         boolean
  isBestseller:     boolean
  isNew:            boolean
  tags:             string
  shippingInfo:     string
  returnPolicy:     string
  variantOptions:   ProductVariantOption[]
}

const EMPTY: FormData = {
  name: '', slug: '', shortDescription: '', description: '',
  price: '', compareAtPrice: '', sku: '', stock: '', weight: '',
  categoryId: '', status: 'draft', condition: 'new',
  featured: false, isBestseller: false, isNew: false,
  tags: '', shippingInfo: '', returnPolicy: '', variantOptions: [],
}

type Tab = 'basic' | 'pricing' | 'shipping' | 'variants'
const TABS: { id: Tab; label: string }[] = [
  { id: 'basic',    label: 'Basic Info' },
  { id: 'pricing',  label: 'Pricing & Stock' },
  { id: 'shipping', label: 'Shipping' },
  { id: 'variants', label: 'Variants' },
]

export default function NewProductPage() {
  const router     = useRouter()
  const categories = getFeaturedCategories()

  const [form,   setForm]   = useState<FormData>(EMPTY)
  const [tab,    setTab]    = useState<Tab>('basic')
  const [saving, setSaving] = useState(false)
  const [saved,  setSaved]  = useState(false)

  const set = (k: keyof FormData, v: unknown) => {
    setForm((f) => {
      const next = { ...f, [k]: v }
      if (k === 'name') {
        next.slug = (v as string).toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      }
      return next
    })
  }

  const handleSave = async (status: 'active' | 'draft') => {
    set('status', status)
    setSaving(true)
    await new Promise((r) => setTimeout(r, 800))
    setSaving(false)
    setSaved(true)
    setTimeout(() => router.push('/vendor/products'), 1100)
  }

  const tabIdx    = TABS.findIndex((t) => t.id === tab)
  const canPublish = form.name.trim() && form.price && form.sku

  const addVariantOption = () =>
    set('variantOptions', [...form.variantOptions, { name: '', values: [] }])

  const removeVariantOption = (i: number) =>
    set('variantOptions', form.variantOptions.filter((_, idx) => idx !== i))

  const updateVariantOption = (i: number, key: 'name' | 'values', value: string) => {
    const next = [...form.variantOptions]
    next[i] = key === 'values'
      ? { ...next[i], values: value.split(',').map((s) => s.trim()).filter(Boolean) }
      : { ...next[i], name: value }
    set('variantOptions', next)
  }

  return (
    <div className="p-6 lg:p-8 max-w-[900px]">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-[#9ca3af] mb-5">
        <Link href="/vendor/products" className="hover:text-[#c8a951] transition-colors">Products</Link>
        <span>/</span>
        <span className="text-[#111111] font-medium">Add New Product</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#111111]">Add New Product</h1>
          <p className="text-sm text-[#9ca3af] mt-0.5">Fill in the details to list a product in your store.</p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => handleSave('draft')}
            disabled={saving || !form.name}
            className="px-4 py-2.5 text-sm font-medium border border-[#e5e5e5] rounded-xl text-[#6b6b6b] hover:bg-[#f5f5f4] disabled:opacity-40 transition-colors"
          >
            Save Draft
          </button>
          <button
            onClick={() => handleSave('active')}
            disabled={saving || !canPublish}
            className={[
              'px-5 py-2.5 text-sm font-semibold rounded-xl transition-all active:scale-[0.98] flex items-center gap-2 disabled:opacity-40',
              saved ? 'bg-[#16a34a] text-white' : 'bg-[#111111] text-white hover:bg-[#2a2a2a]',
            ].join(' ')}
          >
            {saving && <svg className="animate-spin" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 00-9-9" strokeLinecap="round"/></svg>}
            {saved ? '✓ Published!' : saving ? 'Saving…' : 'Publish Product'}
          </button>
        </div>
      </div>

      {/* Tab nav */}
      <div className="flex gap-1 border-b border-[#e5e5e5] mb-7 overflow-x-auto">
        {TABS.map((t, i) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={[
              'flex items-center gap-2 px-5 py-2.5 text-sm font-medium relative whitespace-nowrap transition-all',
              tab === t.id
                ? 'text-[#111111] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#c8a951]'
                : 'text-[#9ca3af] hover:text-[#6b6b6b]',
            ].join(' ')}
          >
            <span className={`w-5 h-5 rounded-full text-[0.6rem] font-bold flex items-center justify-center shrink-0 ${tab === t.id ? 'bg-[#111111] text-white' : 'bg-[#f5f5f4] text-[#9ca3af]'}`}>
              {i + 1}
            </span>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Basic Info ────────────────────────────────────────────────────── */}
      {tab === 'basic' && (
        <div className="flex flex-col gap-5">
          <Section title="Product Details">
            <Field label="Product Name" value={form.name} onChange={(v) => set('name', v)} required placeholder="e.g. Handwoven Leather Journal" />

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#6b6b6b]">URL Slug</label>
              <div className="flex items-center border border-[#e5e5e5] rounded-xl overflow-hidden focus-within:border-[#c8a951] bg-white">
                <span className="px-3 py-2.5 text-xs text-[#9ca3af] bg-[#f5f5f4] border-r border-[#e5e5e5] whitespace-nowrap select-none">/products/</span>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => set('slug', e.target.value)}
                  className="flex-1 px-3 py-2.5 text-sm focus:outline-none bg-white"
                />
              </div>
            </div>

            <Field
              label="Short Description"
              value={form.shortDescription}
              onChange={(v) => set('shortDescription', v)}
              placeholder="One-line summary shown on product cards"
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#6b6b6b]">
                Full Description <span className="text-[#dc2626]">*</span>
              </label>
              <textarea
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
                rows={6}
                placeholder="Describe your product — materials, dimensions, care instructions, what makes it special…"
                className="px-3 py-2.5 text-sm border border-[#e5e5e5] rounded-xl resize-none focus:outline-none focus:border-[#c8a951] focus:ring-2 focus:ring-[#c8a951]/10 transition bg-white"
              />
              <p className="text-xs text-[#9ca3af] text-right">{form.description.length} characters</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#6b6b6b]">Category</label>
                <Select
                  options={categories.map((c) => ({ value: c.id, label: `${c.icon} ${c.name}` }))}
                  value={form.categoryId}
                  onChange={(v) => set('categoryId', v)}
                  placeholder="Select category…"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#6b6b6b]">Condition</label>
                <Select
                  options={[
                    { value: 'new',      label: 'New' },
                    { value: 'like_new', label: 'Like New' },
                    { value: 'good',     label: 'Good' },
                    { value: 'fair',     label: 'Fair' },
                  ]}
                  value={form.condition}
                  onChange={(v) => set('condition', v as FormData['condition'])}
                />
              </div>
            </div>

            <Field
              label="Tags"
              value={form.tags}
              onChange={(v) => set('tags', v)}
              placeholder="handmade, leather, gift — comma separated"
              helper="Helps customers discover your product via search"
            />
          </Section>

          {/* Images */}
          <Section title="Product Images">
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
              {[
                { label: 'Main photo', primary: true },
                { label: 'Add photo', primary: false },
                { label: 'Add photo', primary: false },
                { label: 'Add photo', primary: false },
              ].map((slot, i) => (
                <label key={i} className={[
                  'aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1 cursor-pointer transition-all',
                  slot.primary
                    ? 'border-[#c8a951] bg-[#f7f1e3] hover:bg-[#f0e8d0] col-span-2 row-span-2'
                    : 'border-[#e5e5e5] bg-[#fafaf9] hover:border-[#c8a951] hover:bg-[#f7f1e3]',
                ].join(' ')}>
                  <svg width={slot.primary ? 24 : 18} height={slot.primary ? 24 : 18} viewBox="0 0 24 24" fill="none" stroke={slot.primary ? '#c8a951' : '#9ca3af'} strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>
                  </svg>
                  <span className={`font-medium ${slot.primary ? 'text-xs text-[#c8a951]' : 'text-[0.6rem] text-[#9ca3af]'}`}>{slot.label}</span>
                  <input type="file" accept="image/*" className="hidden" />
                </label>
              ))}
            </div>
            <p className="text-xs text-[#9ca3af]">First image is your main product photo. Recommended: 800×800px minimum, square crop, white or neutral background.</p>
          </Section>

          {/* Visibility */}
          <Section title="Visibility & Badges">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#6b6b6b]">Status</label>
              <Select
                options={[
                  { value: 'draft',        label: 'Draft — hidden from store' },
                  { value: 'active',       label: 'Active — visible to customers' },
                  { value: 'out_of_stock', label: 'Out of Stock' },
                  { value: 'archived',     label: 'Archived' },
                ]}
                value={form.status}
                onChange={(v) => set('status', v as FormData['status'])}
                className="max-w-xs"
              />
            </div>
            <div className="flex flex-wrap gap-6 pt-1">
              {([
                { key: 'featured',     label: '⭐ Featured',   sub: 'Show on homepage hero' },
                { key: 'isBestseller', label: '🔥 Bestseller', sub: 'Show bestseller badge' },
                { key: 'isNew',        label: '✨ New',         sub: 'Show "New" badge on card' },
              ] as const).map(({ key, label, sub }) => (
                <label key={key} className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form[key] as boolean}
                    onChange={(e) => set(key, e.target.checked)}
                    className="mt-0.5 accent-[#c8a951]"
                  />
                  <div>
                    <p className="text-sm font-medium text-[#111111]">{label}</p>
                    <p className="text-xs text-[#9ca3af]">{sub}</p>
                  </div>
                </label>
              ))}
            </div>
          </Section>
        </div>
      )}

      {/* ── Pricing & Stock ───────────────────────────────────────────────── */}
      {tab === 'pricing' && (
        <div className="flex flex-col gap-5">
          <Section title="Pricing">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#6b6b6b]">
                  Price (₦) <span className="text-[#dc2626]">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#9ca3af] font-medium pointer-events-none">₦</span>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => set('price', e.target.value)}
                    placeholder="0.00"
                    min="0"
                    className="w-full pl-7 pr-3 py-2.5 text-sm border border-[#e5e5e5] rounded-xl focus:outline-none focus:border-[#c8a951] bg-white transition"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#6b6b6b]">Compare-at Price (₦)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#9ca3af] font-medium pointer-events-none">₦</span>
                  <input
                    type="number"
                    value={form.compareAtPrice}
                    onChange={(e) => set('compareAtPrice', e.target.value)}
                    placeholder="Original / strike-through price"
                    min="0"
                    className="w-full pl-7 pr-3 py-2.5 text-sm border border-[#e5e5e5] rounded-xl focus:outline-none focus:border-[#c8a951] bg-white transition"
                  />
                </div>
                <p className="text-xs text-[#9ca3af]">Shows as crossed-out price — signals a sale</p>
              </div>
            </div>

            {form.compareAtPrice && form.price && Number(form.compareAtPrice) > Number(form.price) && (
              <div className="flex items-center gap-2.5 p-3 bg-[#dcfce7] border border-[#bbf7d0] rounded-xl text-sm text-[#16a34a] font-medium">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
                {Math.round((1 - Number(form.price) / Number(form.compareAtPrice)) * 100)}% sale badge will show on product card and page
              </div>
            )}
          </Section>

          <Section title="Inventory">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#6b6b6b]">
                  SKU <span className="text-[#dc2626]">*</span>
                </label>
                <input
                  type="text"
                  value={form.sku}
                  onChange={(e) => set('sku', e.target.value)}
                  placeholder="e.g. CC-LJ-001"
                  className="px-3 py-2.5 text-sm border border-[#e5e5e5] rounded-xl focus:outline-none focus:border-[#c8a951] bg-white transition font-mono"
                />
                <p className="text-xs text-[#9ca3af]">Unique identifier for this product</p>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#6b6b6b]">Stock Quantity</label>
                <input
                  type="number"
                  value={form.stock}
                  onChange={(e) => set('stock', e.target.value)}
                  placeholder="0"
                  min="0"
                  className="px-3 py-2.5 text-sm border border-[#e5e5e5] rounded-xl focus:outline-none focus:border-[#c8a951] bg-white transition"
                />
              </div>
            </div>

            {form.stock && Number(form.stock) <= 5 && Number(form.stock) > 0 && (
              <div className="flex items-center gap-2 p-3 bg-[#fef3c7] border border-[#fde68a] rounded-xl text-sm text-[#d97706] font-medium">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                Low stock warning will appear on the product page
              </div>
            )}
            {form.stock === '0' && (
              <div className="flex items-center gap-2 p-3 bg-[#fee2e2] border border-[#fecaca] rounded-xl text-sm text-[#dc2626] font-medium">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                Product will show as out of stock and cannot be purchased
              </div>
            )}
          </Section>
        </div>
      )}

      {/* ── Shipping ──────────────────────────────────────────────────────── */}
      {tab === 'shipping' && (
        <div className="flex flex-col gap-5">
          <Section title="Physical Details">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#6b6b6b]">Weight (grams)</label>
                <input
                  type="number"
                  value={form.weight}
                  onChange={(e) => set('weight', e.target.value)}
                  placeholder="e.g. 500"
                  className="px-3 py-2.5 text-sm border border-[#e5e5e5] rounded-xl focus:outline-none focus:border-[#c8a951] bg-white transition"
                />
                <p className="text-xs text-[#9ca3af]">Used to calculate accurate shipping costs</p>
              </div>
            </div>
          </Section>

          <Section title="Shipping & Return Policies">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#6b6b6b]">Shipping Info</label>
              <textarea
                value={form.shippingInfo}
                onChange={(e) => set('shippingInfo', e.target.value)}
                rows={3}
                placeholder="e.g. Ships within 3–5 business days from Lagos. Carefully wrapped in tissue paper and a kraft box."
                className="px-3 py-2.5 text-sm border border-[#e5e5e5] rounded-xl resize-none focus:outline-none focus:border-[#c8a951] transition bg-white"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#6b6b6b]">Return Policy</label>
              <textarea
                value={form.returnPolicy}
                onChange={(e) => set('returnPolicy', e.target.value)}
                rows={3}
                placeholder="Leave blank to use your store default return policy"
                className="px-3 py-2.5 text-sm border border-[#e5e5e5] rounded-xl resize-none focus:outline-none focus:border-[#c8a951] transition bg-white"
              />
              <p className="text-xs text-[#9ca3af]">A product-specific policy overrides your store default</p>
            </div>
          </Section>
        </div>
      )}

      {/* ── Variants ──────────────────────────────────────────────────────── */}
      {tab === 'variants' && (
        <div className="flex flex-col gap-5">
          <Section title="Variant Options">
            <p className="text-sm text-[#6b6b6b]">
              Add options like <strong>Size</strong> or <strong>Color</strong>. Each combination of values becomes a purchasable variant with its own price and stock level.
            </p>

            {form.variantOptions.length === 0 && (
              <div className="flex flex-col items-center gap-2 py-10 border border-dashed border-[#e5e5e5] rounded-xl">
                <span className="text-3xl">🎨</span>
                <p className="text-sm font-medium text-[#111111]">No variants yet</p>
                <p className="text-xs text-[#9ca3af]">Click below to add an option like Size or Color</p>
              </div>
            )}

            <div className="flex flex-col gap-3">
              {form.variantOptions.map((opt, i) => (
                <div key={i} className="flex gap-3 items-start p-4 bg-[#fafaf9] rounded-xl border border-[#e5e5e5]">
                  <div className="flex-1 grid sm:grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-[#6b6b6b]">Option Name</label>
                      <input
                        type="text"
                        value={opt.name}
                        onChange={(e) => updateVariantOption(i, 'name', e.target.value)}
                        placeholder="e.g. Size, Color, Material"
                        className="px-3 py-2.5 text-sm border border-[#e5e5e5] rounded-xl focus:outline-none focus:border-[#c8a951] bg-white transition"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-[#6b6b6b]">Values</label>
                      <input
                        type="text"
                        value={opt.values.join(', ')}
                        onChange={(e) => updateVariantOption(i, 'values', e.target.value)}
                        placeholder="S, M, L, XL"
                        className="px-3 py-2.5 text-sm border border-[#e5e5e5] rounded-xl focus:outline-none focus:border-[#c8a951] bg-white transition"
                      />
                      <p className="text-xs text-[#9ca3af]">Comma-separated</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeVariantOption(i)}
                    className="mt-6 w-8 h-8 flex items-center justify-center text-[#9ca3af] hover:text-[#dc2626] rounded-lg hover:bg-[#fee2e2] transition-colors shrink-0"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={addVariantOption}
              className="flex items-center gap-2 px-4 py-2.5 border border-dashed border-[#e5e5e5] rounded-xl text-sm font-medium text-[#6b6b6b] hover:border-[#c8a951] hover:text-[#c8a951] hover:bg-[#f7f1e3] transition-all"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Add Option
            </button>

            {/* Live variant preview */}
            {form.variantOptions.length > 0 && form.variantOptions.every((o) => o.name && o.values.length > 0) && (
              <div className="p-4 bg-[#f7f1e3] border border-[#e8d5a3] rounded-xl">
                <p className="text-xs font-semibold text-[#a8892f] uppercase tracking-wider mb-3">Variant Preview</p>
                <div className="flex flex-wrap gap-2">
                  {form.variantOptions[0].values.flatMap((v1) =>
                    form.variantOptions.length > 1
                      ? form.variantOptions[1].values.map((v2) => `${v1} / ${v2}`)
                      : [v1]
                  ).slice(0, 20).map((combo) => (
                    <span key={combo} className="px-2.5 py-1 bg-white border border-[#e8d5a3] rounded-lg text-xs text-[#6b6b6b] font-medium">
                      {combo}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-[#a8892f] mt-2">Configure individual variant pricing and stock after publishing.</p>
              </div>
            )}
          </Section>
        </div>
      )}

      {/* Bottom action bar */}
      <div className="flex items-center justify-between gap-4 mt-8 pt-6 border-t border-[#e5e5e5]">
        <div className="flex gap-2">
          {tabIdx > 0 && (
            <button
              onClick={() => setTab(TABS[tabIdx - 1].id)}
              className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border border-[#e5e5e5] rounded-xl text-[#6b6b6b] hover:bg-[#f5f5f4] transition-colors"
            >
              ← Back
            </button>
          )}
          {tabIdx < TABS.length - 1 && (
            <button
              onClick={() => setTab(TABS[tabIdx + 1].id)}
              className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium bg-[#f5f5f4] rounded-xl text-[#6b6b6b] hover:bg-[#e5e5e5] transition-colors"
            >
              Next →
            </button>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => handleSave('draft')}
            disabled={saving || !form.name}
            className="px-4 py-2.5 text-sm font-medium border border-[#e5e5e5] rounded-xl text-[#6b6b6b] hover:bg-[#f5f5f4] disabled:opacity-40 transition-colors"
          >
            Save Draft
          </button>
          <button
            onClick={() => handleSave('active')}
            disabled={saving || !canPublish}
            className={[
              'px-6 py-2.5 text-sm font-semibold rounded-xl transition-all active:scale-[0.98] flex items-center gap-2 disabled:opacity-40',
              saved ? 'bg-[#16a34a] text-white' : 'bg-[#111111] text-white hover:bg-[#2a2a2a]',
            ].join(' ')}
          >
            {saving && <svg className="animate-spin" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 00-9-9" strokeLinecap="round"/></svg>}
            {saved ? '✓ Published!' : saving ? 'Saving…' : 'Publish Product'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Reusable field ───────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-[#e5e5e5] p-5 sm:p-6 flex flex-col gap-4">
      <h3 className="font-semibold text-[#111111] pb-3 border-b border-[#f5f5f4]">{title}</h3>
      {children}
    </div>
  )
}

function Field({ label, value, onChange, type = 'text', required, placeholder, helper }: {
  label: string; value: string; onChange: (v: string) => void
  type?: string; required?: boolean; placeholder?: string; helper?: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold uppercase tracking-wider text-[#6b6b6b]">
        {label}{required && <span className="text-[#dc2626] ml-0.5">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="px-3 py-2.5 text-sm border border-[#e5e5e5] rounded-xl focus:outline-none focus:border-[#c8a951] focus:ring-2 focus:ring-[#c8a951]/10 transition bg-white"
      />
      {helper && <p className="text-xs text-[#9ca3af]">{helper}</p>}
    </div>
  )
}