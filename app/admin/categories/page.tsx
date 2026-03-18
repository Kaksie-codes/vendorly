// -----------------------------------------------------------------------------
// File: page.tsx
// Path: app/admin/categories/page.tsx
// -----------------------------------------------------------------------------

'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { mockCategories } from '@/lib/mock-data'
import type { Category } from '@/types'

type LocalCategory = Category & { featuredLocal: boolean }

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<LocalCategory[]>(
    mockCategories.map((c) => ({ ...c, featuredLocal: c.featured ?? false }))
  )
  const [search, setSearch]         = useState('')
  const [showModal, setShowModal]   = useState(false)
  const [editTarget, setEditTarget] = useState<LocalCategory | null>(null)
  const [form, setForm]             = useState({ name: '', slug: '', description: '', icon: '', featured: false })
  const [saving, setSaving]         = useState(false)

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.slug.toLowerCase().includes(search.toLowerCase())
  )

  const totalProducts  = categories.reduce((s, c) => s + (c.productCount ?? 0), 0)
  const featuredCount  = categories.filter((c) => c.featuredLocal).length

  const toggleFeatured = (id: string) => {
    setCategories((prev) =>
      prev.map((c) => c.id === id ? { ...c, featuredLocal: !c.featuredLocal } : c)
    )
  }

  const openAdd = () => {
    setEditTarget(null)
    setForm({ name: '', slug: '', description: '', icon: '', featured: false })
    setShowModal(true)
  }

  const openEdit = (cat: LocalCategory) => {
    setEditTarget(cat)
    setForm({
      name:        cat.name,
      slug:        cat.slug,
      description: cat.description ?? '',
      icon:        cat.icon ?? '',
      featured:    cat.featuredLocal,
    })
    setShowModal(true)
  }

  const handleSave = async () => {
    if (!form.name.trim()) return
    setSaving(true)
    await new Promise((r) => setTimeout(r, 600))
    setSaving(false)
    if (editTarget) {
      setCategories((prev) =>
        prev.map((c) =>
          c.id === editTarget.id
            ? { ...c, name: form.name, slug: form.slug, description: form.description, icon: form.icon, featuredLocal: form.featured }
            : c
        )
      )
    } else {
      const newCat: LocalCategory = {
        id:            `cat-${Date.now()}`,
        name:          form.name,
        slug:          form.slug || form.name.toLowerCase().replace(/\s+/g, '-'),
        description:   form.description,
        icon:          form.icon,
        featured:      form.featured,
        featuredLocal: form.featured,
        productCount:  0,
      }
      setCategories((prev) => [...prev, newCat])
    }
    setShowModal(false)
  }

  const handleDelete = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id))
  }

  return (
    <div className="p-6 lg:p-8 max-w-[1100px]">

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="admin-page-title">Categories</p>
          <p className="text-sm text-[#9ca3af] mt-0.5">{categories.length} categories · {totalProducts.toLocaleString()} total products</p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 bg-[#ef4444] text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-[#dc2626] transition-colors"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Category
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 mb-7">
        {[
          { label: 'Total Categories', value: String(categories.length),          color: 'text-[#111111]' },
          { label: 'Featured',         value: String(featuredCount),              color: 'text-[#c8a951]' },
          { label: 'Total Products',   value: totalProducts.toLocaleString(),     color: 'text-[#111111]' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-[#e5e5e5] px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#9ca3af]">{s.label}</p>
            <p className={`font-heading text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-5 max-w-sm">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search categories…"
          className="w-full pl-9 pr-4 py-2 text-sm border border-[#e5e5e5] rounded-xl focus:outline-none focus:border-[#ef4444] bg-white"
        />
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-[#e5e5e5] overflow-hidden">
        <div className="grid bg-[#fafaf9] border-b border-[#e5e5e5] px-5 py-3"
          style={{ gridTemplateColumns: '2fr 1fr 80px 90px 110px' }}>
          {['Category', 'Slug', 'Products', 'Featured', 'Actions'].map((h) => (
            <span key={h} className="text-[0.65rem] font-semibold uppercase tracking-wider text-[#9ca3af]">{h}</span>
          ))}
        </div>

        <div className="divide-y divide-[#f5f5f4] bg-white">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
              <span className="text-3xl">🗂️</span>
              <p className="font-semibold text-[#111111]">No categories found</p>
              <button onClick={() => setSearch('')} className="text-sm text-[#ef4444] underline">Clear search</button>
            </div>
          ) : (
            filtered.map((cat) => (
              <div key={cat.id} className="grid items-center px-5 py-4 hover:bg-[#fafaf9] transition-colors"
                style={{ gridTemplateColumns: '2fr 1fr 80px 90px 110px' }}>

                {/* Name + image */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-[#f5f5f4] shrink-0 border border-[#e5e5e5]">
                    {cat.image
                      ? <Image src={cat.image} alt={cat.name} fill className="object-cover" sizes="40px" />
                      : <span className="absolute inset-0 flex items-center justify-center text-lg">{cat.icon ?? '📦'}</span>
                    }
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#111111] truncate">
                      {cat.icon && <span className="mr-1">{cat.icon}</span>}{cat.name}
                    </p>
                    {cat.description && (
                      <p className="text-xs text-[#9ca3af] truncate">{cat.description}</p>
                    )}
                    {cat.children && cat.children.length > 0 && (
                      <p className="text-xs text-[#c8a951]">{cat.children.length} subcategories</p>
                    )}
                  </div>
                </div>

                {/* Slug */}
                <p className="text-xs font-mono text-[#6b6b6b] truncate">{cat.slug}</p>

                {/* Product count */}
                <p className="text-sm font-semibold text-[#111111]">{(cat.productCount ?? 0).toLocaleString()}</p>

                {/* Featured toggle */}
                <button
                  onClick={() => toggleFeatured(cat.id)}
                  className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors w-fit ${
                    cat.featuredLocal
                      ? 'bg-[#fef9ec] text-[#c8a951] border border-[#c8a951]/30'
                      : 'bg-[#f5f5f4] text-[#9ca3af] border border-[#e5e5e5]'
                  }`}
                >
                  <span>{cat.featuredLocal ? '★' : '☆'}</span>
                  {cat.featuredLocal ? 'Featured' : 'Hidden'}
                </button>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEdit(cat)}
                    className="p-2 rounded-lg text-[#9ca3af] hover:text-[#111111] hover:bg-[#f5f5f4] transition-colors"
                    title="Edit"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="p-2 rounded-lg text-[#9ca3af] hover:text-[#ef4444] hover:bg-[#fee2e2] transition-colors"
                    title="Delete"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <p className="text-sm text-[#9ca3af] mt-4">Showing {filtered.length} of {categories.length} categories</p>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-serif text-lg font-bold text-[#111111]">
                {editTarget ? 'Edit Category' : 'Add Category'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-[#9ca3af] hover:text-[#111111] p-1">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[#6b6b6b] block mb-1.5">Name *</label>
                <input
                  value={form.name}
                  onChange={(e) => {
                    const name = e.target.value
                    setForm((f) => ({ ...f, name, slug: name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') }))
                  }}
                  placeholder="e.g. Electronics"
                  className="w-full px-4 py-2.5 text-sm border border-[#e5e5e5] rounded-xl focus:outline-none focus:border-[#ef4444] focus:ring-2 focus:ring-[#ef4444]/10"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[#6b6b6b] block mb-1.5">Slug</label>
                <input
                  value={form.slug}
                  onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                  placeholder="e.g. electronics"
                  className="w-full px-4 py-2.5 text-sm border border-[#e5e5e5] rounded-xl focus:outline-none focus:border-[#ef4444] font-mono focus:ring-2 focus:ring-[#ef4444]/10"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[#6b6b6b] block mb-1.5">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Short description…"
                  rows={2}
                  className="w-full px-4 py-2.5 text-sm border border-[#e5e5e5] rounded-xl focus:outline-none focus:border-[#ef4444] resize-none focus:ring-2 focus:ring-[#ef4444]/10"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[#6b6b6b] block mb-1.5">Icon (emoji)</label>
                <input
                  value={form.icon}
                  onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))}
                  placeholder="e.g. 💻"
                  className="w-full px-4 py-2.5 text-sm border border-[#e5e5e5] rounded-xl focus:outline-none focus:border-[#ef4444] focus:ring-2 focus:ring-[#ef4444]/10"
                />
              </div>
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
                  className="w-4 h-4 accent-[#ef4444]"
                />
                <span className="text-sm text-[#6b6b6b]">Show as featured category</span>
              </label>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 text-sm font-medium border border-[#e5e5e5] rounded-xl text-[#6b6b6b] hover:bg-[#f5f5f4] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !form.name.trim()}
                className="flex-1 py-2.5 text-sm font-semibold bg-[#ef4444] text-white rounded-xl hover:bg-[#dc2626] disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
              >
                {saving && (
                  <svg className="animate-spin" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" opacity=".25"/><path d="M21 12a9 9 0 00-9-9"/>
                  </svg>
                )}
                {saving ? 'Saving…' : editTarget ? 'Save Changes' : 'Add Category'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
