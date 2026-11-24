import React from 'react'
import {
  ArrowRight,
  Boxes,
  CalendarCheck,
  ClipboardList,
  Clock3,
  Instagram,
  MessageCircle,
  ScanEye,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import ProductArt from '../components/ProductArt.jsx'
import ProductCard from '../components/ProductCard.jsx'
import { useApp } from '../lib/store.jsx'
import { useAddToCart } from '../lib/useAddToCart.js'
import { whatsappLink } from '../lib/format.js'

const steps = [
  { icon: ScanEye, title: 'Telusuri & periksa 3D', text: 'Cari alat per kategori, baca spesifikasi, lalu putar model 3D untuk melihat bentuk alat dari berbagai sisi.' },
  { icon: CalendarCheck, title: 'Atur jumlah & tanggal', text: 'Tentukan jumlah unit serta tanggal mulai dan selesai. Sistem menghitung estimasi biaya dan memeriksa stok.' },
  { icon: ClipboardList, title: 'Isi data peminjaman', text: 'Lengkapi formulir checkout. Sistem membuat kode pesanan dan ringkasan pemesanan otomatis.' },
  { icon: MessageCircle, title: 'Konfirmasi ke admin', text: 'Kirim ringkasan ke WhatsApp admin. Admin memeriksa stok, mengonfirmasi, lalu alat siap diambil.' },
]

export default function Home() {
  const { activeProducts, categories, availableFor, settings } = useApp()
  const addToCart = useAddToCart()
  const featured = activeProducts.filter((p) => p.featured).slice(0, 4)
  const categoryName = (slug) => categories.find((c) => c.slug === slug)?.name || ''

  return (
    <>
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_78%_12%,rgba(183,170,255,0.45),transparent_30%),radial-gradient(circle_at_5%_88%,rgba(255,185,212,0.4),transparent_28%),#F4F2FF]">
        <div className="container-page grid items-center gap-10 py-14 lg:grid-cols-2 lg:py-20">
          <div>
            <span className="eyebrow">
              <Sparkles size={13} /> Laboratorium Terpadu
            </span>
            <h1 className="mt-4 font-display text-4xl font-bold leading-[1.05] tracking-tight md:text-[54px]">
              {settings.heroTitle}
            </h1>
            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-[#686D88]">{settings.heroSubtitle}</p>

            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#/katalog" className="btn-primary">
                Lihat Semua Alat <ArrowRight size={16} />
              </a>
              <a href="#cara-pinjam" className="btn btn-outline">
                Cara Peminjaman
              </a>
            </div>

            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-xs font-semibold text-[#696E87]">
              <span className="inline-flex items-center gap-1.5">
                <Boxes size={14} className="text-purple" /> Visualisasi 3D interaktif
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-purple" /> Stok diperiksa sistem
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock3 size={14} className="text-purple" /> Konfirmasi cepat via WhatsApp
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-x-8 top-6 h-72 rounded-full bg-[linear-gradient(135deg,#D8D1FF,#FFD6E8)] blur-2xl" />
            <div className="relative overflow-hidden rounded-[28px] border border-white/70 shadow-[0_28px_70px_rgba(40,32,74,0.18)]">
              <ProductArt kind="instrument" className="h-[300px] w-full sm:h-[360px]" />
              <div className="absolute bottom-4 left-4 rounded-xl bg-white/95 px-3.5 py-2.5 shadow-soft">
                <div className="text-[10px] font-bold uppercase tracking-wide text-muted">Alat unggulan</div>
                <div className="text-sm font-extrabold">Digital Oscilloscope</div>
                <div className="text-[11px] text-[#6353E8]">Model 3D siap diputar</div>
              </div>
              <div className="absolute right-4 top-4 rounded-xl bg-ink/85 px-3 py-2 text-[11px] font-bold text-white">
                360° viewer
              </div>
            </div>
          </div>
        </div>

        <div className="container-page relative -mb-8 grid gap-3 pb-8 sm:grid-cols-3">
          {[
            { value: activeProducts.length, label: 'Alat dalam katalog' },
            { value: categories.length, label: 'Kategori laboratorium' },
            { value: `${activeProducts.filter((p) => p.model3d).length}`, label: 'Alat dengan model 3D' },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl2 border border-line bg-white px-5 py-4 shadow-soft">
              <b className="font-display text-2xl font-bold">{stat.value}</b>
              <span className="mt-1 block text-[11px] text-muted">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="eyebrow">Kategori Laboratorium</span>
              <h2 className="heading mt-2">Pilih laboratoriummu</h2>
            </div>
            <a href="#/katalog" className="text-xs font-bold text-purple hover:underline">
              Lihat seluruh katalog →
            </a>
          </div>

          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.filter((c) => c.status).map((category) => {
              const count = activeProducts.filter((p) => p.category === category.slug).length
              return (
                <a
                  key={category.id}
                  href={`#/katalog?kategori=${category.slug}`}
                  className="group overflow-hidden rounded-xl2 border border-line bg-white shadow-card transition hover:-translate-y-1 hover:shadow-soft"
                >
                  <ProductArt kind={category.art} className="h-32 w-full" />
                  <div className="p-4">
                    <h3 className="text-sm font-extrabold leading-snug">{category.name}</h3>
                    <p className="mt-1.5 line-clamp-2 text-[11px] leading-relaxed text-muted">{category.description}</p>
                    <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold text-purple">
                      {count} alat <ArrowRight size={12} className="transition group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </a>
              )
            })}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 md:py-20">
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="eyebrow">Rekomendasi</span>
              <h2 className="heading mt-2">Alat unggulan</h2>
              <p className="mt-2 max-w-xl text-sm text-muted">
                Paling sering dipakai untuk praktikum dan penelitian tingkat lanjut.
              </p>
            </div>
            <a href="#/katalog" className="btn btn-sm btn-soft">Semua alat</a>
          </div>

          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                categoryName={categoryName(product.category)}
                available={availableFor(product.id)}
                onAdd={addToCart}
              />
            ))}
          </div>
        </div>
      </section>

      <section id="cara-pinjam" className="section bg-[#F0F1FA]">
        <div className="container-page">
          <span className="eyebrow">Cara Peminjaman</span>
          <h2 className="heading mt-2">Empat langkah, alat siap dipakai</h2>
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <div key={step.title} className="rounded-xl2 border border-line bg-white p-5">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-purpleSoft text-[#6857ED]">
                    <step.icon size={18} />
                  </span>
                  <span className="font-display text-xs font-bold text-muted">0{index + 1}</span>
                </div>
                <h3 className="mt-4 text-sm font-extrabold">{step.title}</h3>
                <p className="mt-1.5 text-[12px] leading-relaxed text-muted">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-page grid gap-4 md:grid-cols-3">
          {[
            { title: 'Jam operasional', body: settings.openingHours, icon: Clock3 },
            { title: 'Lokasi pengambilan', body: settings.businessAddress, icon: ClipboardList },
            { title: 'Ketentuan peminjaman', body: 'Alat dikembalikan lengkap dan tepat waktu. Denda keterlambatan mengikuti kebijakan laboratorium.', icon: ShieldCheck },
          ].map((item) => (
            <div key={item.title} className="rounded-xl2 border border-line bg-white p-5">
              <item.icon size={18} className="text-purple" />
              <h3 className="mt-3 text-sm font-extrabold">{item.title}</h3>
              <p className="mt-1.5 text-[12px] leading-relaxed text-muted">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page pb-16">
        <div className="flex flex-wrap items-center justify-between gap-6 rounded-[26px] bg-[linear-gradient(120deg,#7865FF,#9B69EF_48%,#FF77AA)] p-8 text-white">
          <div>
            <h2 className="font-display text-2xl font-bold">Butuh alat untuk praktikum minggu ini?</h2>
            <p className="mt-2 max-w-xl text-sm text-[#F0EAFF]">
              Cek ketersediaan lalu hubungi admin melalui WhatsApp. Kami bantu siapkan alat dan jadwal pengambilan.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a
              href={whatsappLink(settings.whatsappNumber, `Halo ${settings.websiteName}, saya ingin bertanya tentang peminjaman alat praktikum.`)}
              target="_blank"
              rel="noreferrer"
              className="btn bg-white text-ink hover:-translate-y-0.5"
            >
              <MessageCircle size={16} /> WhatsApp Admin
            </a>
            <a
              href={settings.instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="btn border border-white/40 text-white hover:bg-white/10"
            >
              <Instagram size={16} /> Instagram
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
