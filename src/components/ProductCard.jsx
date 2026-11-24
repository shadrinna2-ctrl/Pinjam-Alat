import React from 'react'
import { Boxes, ShoppingCart } from 'lucide-react'
import ProductArt from './ProductArt.jsx'
import { rupiah } from '../lib/format.js'

export default function ProductCard({ product, categoryName, available, onAdd, showAdd = true }) {
  const outOfStock = available <= 0
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl2 border border-line bg-white shadow-card transition hover:-translate-y-1 hover:shadow-soft">
      <a href={`#/alat/${product.slug}`} className="relative block overflow-hidden">
        <ProductArt
          kind={product.art}
          className="h-40 w-full object-cover transition duration-500 group-hover:scale-[1.03] sm:h-44"
        />
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : null}
        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-extrabold text-[#6554E8] shadow-sm">
          {categoryName}
        </span>
        {product.featured ? (
          <span className="absolute right-3 top-3 rounded-full bg-[linear-gradient(110deg,#7865FF,#FF6DA9)] px-2.5 py-1 text-[10px] font-extrabold text-white shadow-sm">
            Unggulan
          </span>
        ) : null}
        {product.model3d ? (
          <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-ink/80 px-2.5 py-1 text-[10px] font-bold text-white">
            <Boxes size={11} /> 3D
          </span>
        ) : null}
      </a>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-[15px] font-bold leading-snug">{product.name}</h3>
        <p className="mt-1 text-[11px] text-muted">
          {product.brand} · {product.model}
        </p>
        <div className="mt-2 flex items-center gap-1.5 text-[11px]">
          <span
            className={`h-1.5 w-1.5 rounded-full ${outOfStock ? 'bg-pink' : 'bg-emerald-500'}`}
            aria-hidden="true"
          />
          <span className={outOfStock ? 'font-semibold text-[#D34C70]' : 'text-muted'}>
            {outOfStock ? 'Stok habis' : `${available} unit tersedia`}
          </span>
        </div>

        <div className="mt-auto pt-3">
          <div className="font-display text-lg font-bold text-[#6353E8]">
            {rupiah(product.rentalPrice)}
            <span className="font-sans text-[11px] font-medium text-muted"> /{product.rentalUnit}</span>
          </div>
          <div className="mt-3 flex gap-2">
            <a href={`#/alat/${product.slug}`} className="btn btn-sm btn-outline flex-1">
              Detail
            </a>
            {showAdd ? (
              <button
                type="button"
                onClick={() => onAdd?.(product)}
                disabled={outOfStock}
                className="btn btn-sm btn-primary flex-1"
                aria-label={`Tambahkan ${product.name} ke keranjang`}
              >
                <ShoppingCart size={13} /> Tambah
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  )
}
