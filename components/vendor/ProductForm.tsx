// -----------------------------------------------------------------------------
// File: ProductForm.tsx
// Path: components/vendor/ProductForm.tsx
// -----------------------------------------------------------------------------

'use client'

import React, { useState } from 'react'
import { useRouter }        from 'next/navigation'
import { getFeaturedCategories } from '@/lib/mock-data'
import type { Product, ProductVariantOption } from '@/types'

type FormData = {
  name:            string
  slug:            string
  shortDescription:string
  description:     string
  price:           string
  compareAtPrice:  string
  sku:             string
  stock:           string
  weight:          string
  categoryId:      string
  status:          'active' | 'draft' | 'archived' | 'out_of_stock'
  condition:       'new' | 'like_new' | 'good' | 'fair'
  featured:        boolean
  isBestseller:    boolean
  isNew:           boolean
  tags:            string
  shippingInfo:    string
  returnPolicy:    string
  variantOptions:  ProductVariantOption[]
}

function toForm(product?: Product): FormData {
  return {
    name:             product?.name             ?? '',
    slug:             product?.slug             ?? '',
    shortDescription: product?.shortDescription ?? '',
    description:      product?.description      ?? '',
    price:            product?.price?.toString() ?? '',
    compareAtPrice:   product?.compareAtPrice?.toString() ?? '',
    sku:              product?.sku              ?? '',
    stock:            product?.stock?.toString() ?? '',
    weight:           product?.weight?.toString() ?? '',
    categoryId:       product?.categoryId       ?? '',
    status:           product?.status           ?? 'draft',
    condition:        product?.condition        ?? 'new',
    featured:         product?.featured         ?? false,
    isBestseller:     product?.isBestseller     ?? false,
    isNew:            product?.isNew            ?? false,
    tags:             product?.tags?.join(', ') ?? '',
    shippingInfo:     product?.shippingInfo     ?? '',
    returnPolicy:     product?.returnPolicy     ?? '',
    variantOptions:   product?.variantOptions   ?? [],
  }
}

export function ProductForm({ product }: { product?: Product }) {
  const router     = useRouter()
  const categories = getFeaturedCategories()
  const isEdit     = !!product

  const [form,    setForm]    = useState<FormData>(toForm(product))
  const [saving,  setSaving]  = useState(false)
  const [saved,   setSaved]   = useState(false)
  const [tab,     setTab]     = useState<'basic' | 'pricing' | 'shipping' | 'variants'>('basic')

  const set = (k: keyof FormData, v: unknown) => {
    setForm((f) => ({ ...f, [k]: v }))
    if (k === 'name' && !isEdit) {
      setForm((f) => ({ ...f, slug: (v as string).toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') }))
    }
  }

  const handleSave = async (status?: 'active' | 'draft') => {
    if (status) set('status', status)
    setSaving(true)
    await new Promise((r) => setTimeout(r, 800))
    setSaving(false)
    setSaved(true)
    setTimeout(() => {
      setSaved(false)
      router.push('/vendor/products')
    }, 1200)
  }

  const addVariantOption = () => {
    set('variantOptions', [...form.variantOptions, { name: '', values: [] }])
  }

  const removeVariantOption = (i: number) => {
    set('variantOptions', form.variantOptions.filter((_, idx) => idx !== i))
  }

  const updateVariantOption = (i: number, key: 'name' | 'values', value: string) => {
    const next = [...form.variantOptions]
    if (key === 'values') {
      next[i] = { ...next[i], values: value.split(',').map((s) => s.trim()).filter(Boolean) }
    } else {
      next[i] = { ...next[i], name: value }
    }
    set('variantOptions', next)
  }

  const TABS = [
    { id: 'basic',    label: 'Basic Info' },
    { id: 'pricing',  label: 'Pricing & Stock' },
    { id: 'shipping', label: 'Shipping' },
    { id: 'variants', label: 'Variants' },
  ] as const

  return (
    <div className="max-w-[900px]">

      {/* Tab nav */}
      <div className="flex gap-1 border-b border-[#e5e5e5] mb-7">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={[
              'px-4 py-2.5 text-sm font-medium relative transition-all',
              tab === t.id
                ? 'text-[#111111] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#c8a951]'
                : 'text-[#9ca3af] hover:text-[#6b6b6b]',
            ].join(' ')}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Basic Info ──────────────────────────────────────────────── */}
      {tab === 'basic' && (
        <div className="flex flex-col gap-5">
          <FormSection title="Product Details">
            <Field label="Product Name" value={form.name} onChange={(v) => set('name', v)} required />
            <Field label="URL Slug" value={form.slug} onChange={(v) => set('slug', v)} helper="vendorly.com/products/{slug}" />
            <Field label="Short Description" value={form.shortDescription} onChange={(v) => set('shortDescription', v)} placeholder="One-line summary shown on cards" />
            <TextAreaField label="Full Description" value={form.description} onChange={(v) => set('description', v)} rows={6} required />

            <div className="grid sm:grid-cols-2 gap-4">
              <SelectField label="Category" value={form.categoryId} onChange={(v) => set('categoryId', v)} options={categories.map((c) => ({ value: c.id, label: `${c.icon ?? ''} ${c.name}` }))} />
              <SelectField label="Condition" value={form.condition} onChange={(v) => set('condition', v as FormData['condition'])} options={[
                { value: 'new',      label: 'New' },
                { value: 'like_new', label: 'Like New' },
                { value: 'good',     label: 'Good' },
                { value: 'fair',     label: 'Fair' },
              ]} />
            </div>

            <Field label="Tags" value={form.tags} onChange={(v) => set('tags', v)} placeholder="handmade, leather, gift — comma separated" helper="Helps customers find your product in search" />
          </FormSection>

          {/* Status & flags */}
          <FormSection title="Visibility & Flags">
            <SelectField label="Status" value={form.status} onChange={(v) => set('status', v as FormData['status'])} options={[
              { value: 'active',       label: 'Active — visible to customers' },
              { value: 'draft',        label: 'Draft — hidden from store' },
              { value: 'archived',     label: 'Archived' },
              { value: 'out_of_stock', label: 'Out of Stock' },
            ]} />
            <div className="flex flex-wrap gap-5 pt-1">
              {([
                { key: 'featured',     label: '⭐ Featured product' },
                { key: 'isBestseller', label: '🔥 Mark as Bestseller' },
                { key: 'isNew',        label: '✨ Show "New" badge' },
              ] as const).map(({ key, label }) => (
                <label key={key} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form[key] as boolean} onChange={(e) => set(key, e.target.checked)} className="accent-[#c8a951]" />
                  <span className="text-sm text-[#6b6b6b]">{label}</span>
                </label>
              ))}
            </div>
          </FormSection>

          {/* Images */}
          <FormSection title="Images">
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
              {(product?.images ?? []).map((img, i) => (
                <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-[#e5e5e5] bg-[#f5f5f4] group">
                  <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
                  <button className="absolute top-1 right-1 w-5 h-5 bg-black/60 rounded-full text-white text-[10px] hidden group-hover:flex items-center justify-center">✕</button>
                </div>
              ))}
              <label className="aspect-square rounded-xl border-2 border-dashed border-[#e5e5e5] flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-[#c8a951] hover:bg-[#fafaf9] transition-all">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                <span className="text-[0.6rem] text-[#9ca3af]">Add</span>
                <input type="file" accept="image/*" multiple className="hidden" />
              </label>
            </div>
            <p className="text-xs text-[#9ca3af]">First image is the main product photo. Recommend 800×800px or larger.</p>
          </FormSection>
        </div>
      )}

      {/* ── Pricing & Stock ──────────────────────────────────────────── */}
      {tab === 'pricing' && (
        <div className="flex flex-col gap-5">
          <FormSection title="Pricing">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Price (₦)" value={form.price} onChange={(v) => set('price', v)} type="number" required placeholder="0.00" />
              <Field label="Compare-at Price (₦)" value={form.compareAtPrice} onChange={(v) => set('compareAtPrice', v)} type="number" placeholder="Original / strike-through price" />
            </div>
            {form.compareAtPrice && Number(form.compareAtPrice) > Number(form.price) && (
              <p className="text-xs text-[#16a34a] font-medium">
                💰 Sale: {Math.round((1 - Number(form.price) / Number(form.compareAtPrice)) * 100)}% off
              </p>
            )}
          </FormSection>

          <FormSection title="Inventory">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="SKU" value={form.sku} onChange={(v) => set('sku', v)} placeholder="e.g. CC-LJ-001" />
              <Field label="Stock Quantity" value={form.stock} onChange={(v) => set('stock', v)} type="number" placeholder="0" />
            </div>
            {form.stock && Number(form.stock) <= 5 && Number(form.stock) > 0 && (
              <p className="text-xs text-[#d97706] font-medium">⚠️ Low stock warning will show on product page</p>
            )}
            {form.stock === '0' && (
              <p className="text-xs text-[#dc2626] font-medium">Product will show as out of stock</p>
            )}
          </FormSection>
        </div>
      )}

      {/* ── Shipping ─────────────────────────────────────────────────── */}
      {tab === 'shipping' && (
        <div className="flex flex-col gap-5">
          <FormSection title="Physical Details">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Weight (grams)" value={form.weight} onChange={(v) => set('weight', v)} type="number" placeholder="e.g. 500" />
            </div>
          </FormSection>
          <FormSection title="Policies">
            <TextAreaField label="Shipping Info" value={form.shippingInfo} onChange={(v) => set('shippingInfo', v)} rows={3} placeholder="e.g. Ships within 3–5 business days…" />
            <TextAreaField label="Return Policy" value={form.returnPolicy} onChange={(v) => set('returnPolicy', v)} rows={3} placeholder="Leave blank to use your store default policy" />
          </FormSection>
        </div>
      )}

      {/* ── Variants ─────────────────────────────────────────────────── */}
      {tab === 'variants' && (
        <div className="flex flex-col gap-5">
          <FormSection title="Variant Options">
            <p className="text-sm text-[#9ca3af]">Add options like Size or Color. Each combination becomes a variant with its own price and stock.</p>
            <div className="flex flex-col gap-3">
              {form.variantOptions.map((opt, i) => (
                <div key={i} className="flex gap-3 items-start p-4 bg-[#fafaf9] rounded-xl border border-[#e5e5e5]">
                  <div className="flex-1 grid sm:grid-cols-2 gap-3">
                    <Field label="Option Name" value={opt.name} onChange={(v) => updateVariantOption(i, 'name', v)} placeholder="e.g. Size" />
                    <Field label="Values (comma-separated)" value={opt.values.join(', ')} onChange={(v) => updateVariantOption(i, 'values', v)} placeholder="S, M, L, XL" />
                  </div>
                  <button onClick={() => removeVariantOption(i)} className="mt-6 w-8 h-8 flex items-center justify-center text-[#9ca3af] hover:text-[#dc2626] rounded-lg hover:bg-[#fee2e2] transition-colors shrink-0">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
                  </button>
                </div>
              ))}
            </div>
            <button onClick={addVariantOption} className="flex items-center gap-2 px-4 py-2.5 border border-dashed border-[#e5e5e5] rounded-xl text-sm text-[#6b6b6b] hover:border-[#c8a951] hover:text-[#c8a951] transition-colors">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Add Option
            </button>
          </FormSection>
        </div>
      )}

      {/* Action bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 mt-8 pt-6 border-t border-[#e5e5e5]">
        <button
          onClick={() => handleSave('active')}
          disabled={saving || !form.name || !form.price}
          className={[
            'flex-1 sm:flex-none px-8 py-3 font-semibold text-sm rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2',
            saved ? 'bg-[#16a34a] text-white' : 'bg-[#111111] text-white hover:bg-[#2a2a2a] disabled:opacity-50',
          ].join(' ')}
        >
          {saving && <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 00-9-9" strokeLinecap="round"/></svg>}
          {saved ? '✓ Saved!' : saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Publish Product'}
        </button>
        {!isEdit && (
          <button onClick={() => handleSave('draft')} disabled={saving} className="px-6 py-3 border border-[#e5e5e5] text-[#6b6b6b] text-sm font-medium rounded-xl hover:bg-[#fafaf9] transition-colors disabled:opacity-50">
            Save as Draft
          </button>
        )}
        <button onClick={() => router.push('/vendor/products')} className="text-sm text-[#9ca3af] hover:text-[#6b6b6b] transition-colors">
          Cancel
        </button>
      </div>
    </div>
  )
}

// ─── Field helpers ────────────────────────────────────────────────────────────

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-[#e5e5e5] p-5 sm:p-6 flex flex-col gap-4">
      <h3 className="font-semibold text-[#111111] border-b border-[#f5f5f4] pb-3">{title}</h3>
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

function TextAreaField({ label, value, onChange, rows = 4, required, placeholder }: {
  label: string; value: string; onChange: (v: string) => void
  rows?: number; required?: boolean; placeholder?: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold uppercase tracking-wider text-[#6b6b6b]">
        {label}{required && <span className="text-[#dc2626] ml-0.5">*</span>}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="px-3 py-2.5 text-sm border border-[#e5e5e5] rounded-xl resize-none focus:outline-none focus:border-[#c8a951] transition bg-white"
      />
    </div>
  )
}

function SelectField({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold uppercase tracking-wider text-[#6b6b6b]">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="px-3 py-2.5 text-sm border border-[#e5e5e5] rounded-xl bg-white focus:outline-none focus:border-[#c8a951] transition">
        <option value="">Select…</option>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  )
}