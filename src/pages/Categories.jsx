import React from 'react'
import { ArrowRight } from 'lucide-react'
import ProductArt from '../components/ProductArt.jsx'
import { useApp } from '../lib/store.jsx'
import { rupiah } from '../lib/format.js'

export default function Categories() {
  const { categories, activeProducts, availableFor } = useApp()

  return (
    <div className="container-page py-10">
      <div className="max-w-2xl">
        <span className="eyebrow">Kategori</span>
        <h1 className="heading mt-2">Empat kategori laboratorium</h1>
        <p className="mt-2 text-sm text-muted">
          Setiap kategori dikelola admin laboratorium dan dapat diperbarui melalui dashboard.
        </p>
      </div>

      <div className="mt-8 space-y-5">
        {categories.map((category) => {
          const items = activeProducts.filter((p) => p.category === category.slug)
          const cheapest = items.length ? Math.min(...items.map((p) => p.rentalPrice)) : 0
          return (
            <section key={category.id} className="overflow-hidden rounded-xl2 border border-line bg-white shadow-card">
              <div className="grid md:grid-cols-[280px_1fr]">
                <div className="relative">
                  <ProductArt kind={category.art} className="h-40 w-full md:h-full" />
                  <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-extrabold text-[#6554E8]">
                    {category.status ? 'Aktif' : 'Nonaktif'}
                  </span>
                </div>
                <div className="p-5 md:p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="font-display text-xl font-bold">{category.name}</h2>
                      <p className="mt-1.5 max-w-2xl text-[12px] leading-relaxed text-muted">{category.description}</p>
                    </div>
                    <a href={`#/katalog?kategori=${category.slug}`} className="btn btn-sm btn-soft shrink-0">
                      Buka kategori <ArrowRight size={13} />
                    </a>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {items.slice(0, 6).map((product) => (
                      <a
                        key={product.id}
                        href={`#/alat/${product.slug}`}
                        className="rounded-lg border border-line px-2.5 py-1.5 text-[11px] font-semibold text-[#555A75] hover:border-purple hover:text-purple"
                      >
                        {product.name}
                      </a>
                    ))}
                    {items.length > 6 ? (
                      <span className="rounded-lg bg-paper px-2.5 py-1.5 text-[11px] font-semibold text-muted">
                        +{items.length - 6} lainnya
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 border-t border-line pt-4 text-[11px] text-muted">
                    <span><b className="text-ink">{items.length}</b> alat</span>
                    <span>Mulai <b className="text-ink">{rupiah(cheapest)}</b>/hari</span>
                    <span>
                      <b className="text-ink">{items.reduce((sum, p) => sum + availableFor(p.id), 0)}</b> unit siap dipinjam
                    </span>
                  </div>
                </div>
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
