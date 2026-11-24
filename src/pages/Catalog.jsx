import React, { useMemo, useState } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'
import ProductCard from '../components/ProductCard.jsx'
import { useApp } from '../lib/store.jsx'
import { useAddToCart } from '../lib/useAddToCart.js'

export default function Catalog({ query }) {
  const { activeProducts, categories, availableFor } = useApp()
  const addToCart = useAddToCart()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState(query.get('kategori') || 'semua')
  const [sort, setSort] = useState('relevan')

  const categoryName = (slug) => categories.find((c) => c.slug === slug)?.name || ''

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    const list = activeProducts
      .filter((p) => (category === 'semua' ? true : p.category === category))
      .filter((p) =>
        !term
          ? true
          : [p.name, p.brand, p.model, p.sku, p.description].join(' ').toLowerCase().includes(term),
      )
    if (sort === 'termurah') return [...list].sort((a, b) => a.rentalPrice - b.rentalPrice)
    if (sort === 'termahal') return [...list].sort((a, b) => b.rentalPrice - a.rentalPrice)
    if (sort === 'nama') return [...list].sort((a, b) => a.name.localeCompare(b.name))
    return list
  }, [activeProducts, category, search, sort])

  return (
    <div className="container-page py-10">
      <div className="max-w-2xl">
        <span className="eyebrow">Katalog</span>
        <h1 className="heading mt-2">Seluruh alat praktikum</h1>
        <p className="mt-2 text-sm text-muted">
          {activeProducts.length} alat dari {categories.length} kategori laboratorium. Gunakan pencarian
          atau filter kategori untuk menemukan alat yang dibutuhkan.
        </p>
      </div>

      <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Cari nama alat, merek, atau kode inventaris…"
            aria-label="Cari alat"
            className="input pl-10"
          />
        </div>
        <div className="relative">
          <SlidersHorizontal size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            aria-label="Urutkan alat"
            className="input min-w-[180px] appearance-none pl-9"
          >
            <option value="relevan">Urutkan: Relevan</option>
            <option value="termurah">Tarif terendah</option>
            <option value="termahal">Tarif tertinggi</option>
            <option value="nama">Nama A–Z</option>
          </select>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setCategory('semua')}
          className={`rounded-full border px-3.5 py-2 text-[11px] font-extrabold ${
            category === 'semua' ? 'border-ink bg-ink text-white' : 'border-line bg-white text-[#696E87]'
          }`}
        >
          Semua ({activeProducts.length})
        </button>
        {categories
          .filter((c) => c.status)
          .map((item) => {
            const count = activeProducts.filter((p) => p.category === item.slug).length
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setCategory(item.slug)}
                className={`rounded-full border px-3.5 py-2 text-[11px] font-extrabold ${
                  category === item.slug ? 'border-ink bg-ink text-white' : 'border-line bg-white text-[#696E87]'
                }`}
              >
                {item.name} ({count})
              </button>
            )
          })}
      </div>

      <div className="mt-7 flex items-center justify-between">
        <p className="text-xs text-muted">
          Menampilkan <b className="text-ink">{filtered.length}</b> alat
        </p>
      </div>

      {filtered.length ? (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              categoryName={categoryName(product.category)}
              available={availableFor(product.id)}
              onAdd={addToCart}
            />
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-xl2 border border-line bg-white p-10 text-center">
          <p className="text-sm font-bold">Alat tidak ditemukan</p>
          <p className="mt-1 text-xs text-muted">Coba kata kunci lain atau pilih kategori berbeda.</p>
          <button
            type="button"
            onClick={() => {
              setSearch('')
              setCategory('semua')
            }}
            className="btn btn-sm btn-soft mt-4"
          >
            Reset pencarian
          </button>
        </div>
      )}
    </div>
  )
}
