import React, { useMemo, useState } from 'react'
import {
  ArrowLeft,
  Boxes,
  CheckCircle2,
  Info,
  MessageCircle,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingCart,
  Wrench,
} from 'lucide-react'
import Model3D from '../components/Model3D.jsx'
import ProductArt from '../components/ProductArt.jsx'
import ProductCard from '../components/ProductCard.jsx'
import { useApp } from '../lib/store.jsx'
import { addDaysISO, formatDate, rentalDays, rupiah, todayISO } from '../lib/format.js'
import { whatsappLink } from '../lib/format.js'

export default function ProductDetail({ slug }) {
  const { productBySlug, categories, availableFor, dispatch, toast, settings, activeProducts, maintenance } = useApp()
  const product = productBySlug(slug)
  const [tab, setTab] = useState('3d')
  const [photo, setPhoto] = useState(null)
  const [qty, setQty] = useState(1)
  const [startDate, setStartDate] = useState(todayISO())
  const [endDate, setEndDate] = useState(addDaysISO(todayISO(), 1))

  if (!product) {
    return (
      <div className="container-page py-20 text-center">
        <h1 className="font-display text-2xl font-bold">Alat tidak ditemukan</h1>
        <p className="mt-2 text-sm text-muted">Alat yang Anda cari mungkin sudah dinonaktifkan admin.</p>
        <a href="#/katalog" className="btn-primary mt-6">Kembali ke katalog</a>
      </div>
    )
  }

  const category = categories.find((c) => c.slug === product.category)
  const days = rentalDays(startDate, endDate)
  const available = availableFor(product.id, startDate, endDate)
  const outOfStock = available <= 0
  const estimate = product.rentalPrice * qty * days
  const maintenanceRecord = maintenance.find((m) => m.productId === product.id && m.status === 'perawatan')

  const related = useMemo(
    () => activeProducts.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4),
    [activeProducts, product.category, product.id],
  )

  const add = () => {
    if (qty > available) {
      toast(`Stok tersedia hanya ${available} unit untuk tanggal tersebut.`, 'error')
      return
    }
    dispatch({
      type: 'cart/add',
      payload: { product, qty, startDate, endDate },
    })
    toast(`${product.name} (${qty} unit) ditambahkan ke keranjang.`)
  }

  return (
    <div className="container-page py-8">
      <a href="#/katalog" className="inline-flex items-center gap-1.5 text-xs font-bold text-muted hover:text-purple">
        <ArrowLeft size={14} /> Kembali ke katalog
      </a>

      <div className="mt-4 grid gap-7 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <div className="overflow-hidden rounded-xl2 border border-line bg-white p-2 shadow-card">
            {product.model3d ? (
              <>
                <div className="flex gap-1.5 px-1 pb-2">
                  <button
                    type="button"
                    onClick={() => setTab('3d')}
                    className={`rounded-lg px-3 py-2 text-[11px] font-extrabold ${
                      tab === '3d' ? 'bg-ink text-white' : 'bg-paper text-muted'
                    }`}
                  >
                    <Boxes size={12} className="mr-1 inline" /> Model 3D
                  </button>
                  <button
                    type="button"
                    onClick={() => setTab('foto')}
                    className={`rounded-lg px-3 py-2 text-[11px] font-extrabold ${
                      tab === 'foto' ? 'bg-ink text-white' : 'bg-paper text-muted'
                    }`}
                  >
                    Foto produk
                  </button>
                </div>
                {tab === '3d' ? (
                  <Model3D product={product} height={360} />
                ) : (
                  <div className="relative overflow-hidden rounded-2xl">
                    <ProductArt kind={product.art} className="h-[360px] w-full" />
                    {photo || product.image ? (
                      <img src={photo || product.image} alt={product.name} className="absolute inset-0 h-full w-full object-cover" />
                    ) : null}
                  </div>
                )}
              </>
                          ) : (
              <div className="relative overflow-hidden rounded-2xl">
                <ProductArt kind={product.art} className="h-[300px] w-full" />
                {photo || product.image ? (
                  <img src={photo || product.image} alt={product.name} className="absolute inset-0 h-full w-full object-cover" />
                ) : null}
                <div className="absolute inset-x-0 bottom-0 bg-ink/80 px-4 py-3 text-[11px] text-white/80">
                  Model 3D belum tersedia untuk alat ini. Hubungi admin bila membutuhkan visualisasi tambahan.
                </div>
              </div>
            )}
          </div>

          {[product.image, ...(product.gallery || [])].filter(Boolean).length ? (
            <div className="mt-3 grid grid-cols-4 gap-2">
              {[product.image, ...(product.gallery || [])].filter(Boolean).map((src, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => {
                    setPhoto(src)
                    setTab('foto')
                  }}
                  className="overflow-hidden rounded-lg border-2 border-transparent transition hover:border-purple"
                  aria-label={`Lihat foto ${index + 1} ${product.name}`}
                >
                  <img src={src} alt={`${product.name} ${index + 1}`} className="h-20 w-full object-cover" />
                </button>
              ))}
            </div>
          ) : null}

          <div className="mt-4 rounded-xl2 border border-line bg-white p-5">
            <h2 className="font-display text-base font-bold">Deskripsi</h2>
            <p className="mt-2 text-[13px] leading-relaxed text-muted">{product.description}</p>

            <h3 className="mt-5 font-display text-sm font-bold">Fungsi alat</h3>
            <p className="mt-1.5 text-[13px] leading-relaxed text-muted">{product.usage}</p>

            <h3 className="mt-5 font-display text-sm font-bold">Spesifikasi teknis</h3>
            <dl className="mt-2 divide-y divide-line overflow-hidden rounded-xl border border-line">
              {product.specs?.map((spec) => (
                <div key={spec.label} className="grid grid-cols-[40%_60%] gap-3 px-3.5 py-2.5 text-[12px]">
                  <dt className="text-muted">{spec.label}</dt>
                  <dd className="font-semibold">{spec.value}</dd>
                </div>
              ))}
            </dl>

            <h3 className="mt-5 font-display text-sm font-bold">Ketentuan penggunaan</h3>
            <p className="mt-1.5 text-[12px] leading-relaxed text-muted">{product.terms || settings.terms}</p>
          </div>
        </div>

        <div>
          <div className="sticky top-24 space-y-4">
            <div className="rounded-xl2 border border-line bg-white p-5 shadow-card">
              <div className="flex items-center gap-2">
                <span className="badge bg-purpleSoft text-[#6857ED]">{category?.name}</span>
                {product.featured ? (
                  <span className="badge bg-[#FFF4DC] text-[#A36C00]">Unggulan</span>
                ) : null}
              </div>
              <h1 className="mt-3 font-display text-2xl font-bold leading-tight">{product.name}</h1>
              <p className="mt-1 text-[12px] text-muted">
                {product.brand} · {product.model} · Kode {product.sku}
              </p>

              <div className="mt-4 flex flex-wrap items-baseline gap-2">
                <span className="font-display text-3xl font-bold text-[#6353E8]">{rupiah(product.rentalPrice)}</span>
                <span className="text-xs text-muted">/{product.rentalUnit}</span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 text-[11px]">
                <div className="rounded-lg bg-paper px-3 py-2">
                  <span className="block text-muted">Stok total</span>
                  <b className="text-sm">{product.stockTotal} unit</b>
                </div>
                <div className="rounded-lg bg-paper px-3 py-2">
                  <span className="block text-muted">Kondisi</span>
                  <b className="text-sm">{product.condition}</b>
                </div>
                {settings.showProcurement ? (
                  <div className="col-span-2 rounded-lg bg-paper px-3 py-2">
                    <span className="block text-muted">Harga pengadaan (referensi)</span>
                    <b className="text-sm">
                      {rupiah(product.procurementMin)} – {rupiah(product.procurementMax)}
                    </b>
                  </div>
                ) : null}
              </div>

              <div className="mt-4 rounded-lg border border-line p-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="label" htmlFor="start">Tanggal mulai</label>
                    <input
                      id="start"
                      type="date"
                      className="input"
                      value={startDate}
                      min={todayISO()}
                      onChange={(event) => {
                        setStartDate(event.target.value)
                        if (event.target.value > endDate) setEndDate(event.target.value)
                      }}
                    />
                  </div>
                  <div>
                    <label className="label" htmlFor="end">Tanggal selesai</label>
                    <input
                      id="end"
                      type="date"
                      className="input"
                      value={endDate}
                      min={startDate}
                      onChange={(event) => setEndDate(event.target.value)}
                    />
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between gap-2">
                  <div>
                    <span className="label mb-0">Jumlah unit</span>
                    <div className="mt-1 flex items-center gap-2">
                      <button type="button" onClick={() => setQty((v) => Math.max(1, v - 1))} className="grid h-8 w-8 place-items-center rounded-lg border border-line" aria-label="Kurangi">
                        <Minus size={13} />
                      </button>
                      <span className="w-8 text-center text-sm font-bold">{qty}</span>
                      <button type="button" onClick={() => setQty((v) => Math.min(Math.max(1, available), v + 1))} className="grid h-8 w-8 place-items-center rounded-lg border border-line" aria-label="Tambah">
                        <Plus size={13} />
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="block text-[10px] text-muted">{days} hari sewa</span>
                    <span className="font-display text-lg font-bold">{rupiah(estimate)}</span>
                  </div>
                </div>

                <p className={`mt-2 flex items-center gap-1.5 text-[11px] ${outOfStock ? 'text-[#D34C70]' : 'text-emerald-600'}`}>
                  {outOfStock ? <Info size={12} /> : <CheckCircle2 size={12} />}
                  {outOfStock
                    ? 'Tidak ada unit tersedia pada rentang tanggal ini.'
                    : `${available} unit tersedia untuk ${formatDate(startDate)} – ${formatDate(endDate)}.`}
                </p>
              </div>

              <button type="button" onClick={add} disabled={outOfStock} className="btn-primary mt-4 w-full">
                <ShoppingCart size={16} /> Tambah ke Keranjang
              </button>
              <a
                href={whatsappLink(
                  settings.whatsappNumber,
                  `Halo Admin ${settings.websiteName}, saya ingin bertanya tentang ${product.name} (${product.sku}).`,
                )}
                target="_blank"
                rel="noreferrer"
                className="btn-outline mt-2 w-full"
              >
                <MessageCircle size={15} /> Tanya Admin
              </a>
            </div>

            {maintenanceRecord ? (
              <div className="rounded-xl2 border border-[#FFE0E7] bg-[#FFF5F7] p-4">
                <div className="flex items-center gap-2 text-[12px] font-bold text-[#D34C70]">
                  <Wrench size={14} /> Sebagian unit sedang dalam perawatan
                </div>
                <p className="mt-1 text-[11px] leading-relaxed text-[#A5506B]">
                  {maintenanceRecord.quantity} unit dirawat sejak {formatDate(maintenanceRecord.startDate)} hingga
                  perkiraan {formatDate(maintenanceRecord.endDate)}. Stok siap pakai sudah disesuaikan.
                </p>
              </div>
            ) : null}

            <div className="flex items-start gap-2 rounded-xl border border-line bg-white p-4 text-[11px] text-muted">
              <ShieldCheck size={15} className="mt-0.5 shrink-0 text-purple" />
              <span>
                Harga pengadaan bukan tarif sewa. Tarif sewa ditetapkan admin laboratorium dan sudah termasuk
                pemeriksaan kondisi alat sebelum diserahkan.
              </span>
            </div>
          </div>
        </div>
      </div>

      {related.length ? (
        <section className="mt-12">
          <h2 className="font-display text-lg font-bold">Alat lain di kategori {category?.name}</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((item) => (
              <ProductCard
                key={item.id}
                product={item}
                categoryName={category?.name}
                available={availableFor(item.id)}
                onAdd={(p) => {
                  dispatch({ type: 'cart/add', payload: { product: p, qty: 1, startDate: todayISO(), endDate: addDaysISO(todayISO(), 1) } })
                  toast(`${p.name} ditambahkan ke keranjang.`)
                }}
              />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  )
}
