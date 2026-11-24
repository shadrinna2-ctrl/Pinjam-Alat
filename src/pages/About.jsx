import React from 'react'
import { Boxes, CheckCircle2, Instagram, MessageCircle, ShieldCheck } from 'lucide-react'
import ProductArt from '../components/ProductArt.jsx'
import { useApp } from '../lib/store.jsx'
import { whatsappLink } from '../lib/format.js'

export default function About() {
  const { settings, activeProducts, categories } = useApp()

  return (
    <div className="container-page py-10">
      <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <span className="eyebrow">Tentang Kami</span>
          <h1 className="heading mt-2">Satu pintu untuk alat praktikum laboratorium</h1>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            {settings.websiteName} adalah platform penyewaan dan peminjaman alat praktikum yang dikelola
            laboratorium terpadu. Sebelumnya, pencarian alat dilakukan secara manual dengan bertanya kepada
            pengelola untuk mengetahui jenis, fungsi, stok, kondisi, dan tarif sewa.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Sekarang seluruh inventaris dapat ditelusuri melalui satu website. Setiap alat dilengkapi foto,
            deskripsi, spesifikasi teknis, ketersediaan stok, tarif sewa, dan visualisasi 3D yang dapat diputar
            dari berbagai sisi sebelum diajukan peminjamannya.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              { value: activeProducts.length, label: 'Alat terdaftar' },
              { value: categories.length, label: 'Kategori laboratorium' },
              { value: '3D', label: 'Visualisasi interaktif' },
            ].map((item) => (
              <div key={item.label} className="rounded-xl2 border border-line bg-white px-4 py-3">
                <b className="font-display text-xl font-bold">{item.value}</b>
                <span className="mt-0.5 block text-[11px] text-muted">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
        <ProductArt kind="machine" className="h-72 w-full rounded-xl2" />
      </div>

      <section className="mt-12 grid gap-4 md:grid-cols-3">
        {[
          { icon: Boxes, title: 'Inventaris terpusat', text: 'Admin mengelola alat, kategori, stok, kondisi, media, dan tarif sewa melalui dashboard.' },
          { icon: ShieldCheck, title: 'Stok diperiksa sistem', text: 'Jumlah pesanan dikurangi stok yang sedang dipinjam dan unit yang sedang diperbaiki.' },
          { icon: CheckCircle2, title: 'Konfirmasi manusiawi', text: 'Setiap pesanan tetap diperiksa admin laboratorium sebelum alat diserahkan.' },
        ].map((item) => (
          <div key={item.title} className="rounded-xl2 border border-line bg-white p-5">
            <item.icon size={18} className="text-purple" />
            <h2 className="mt-3 text-sm font-extrabold">{item.title}</h2>
            <p className="mt-1.5 text-[12px] leading-relaxed text-muted">{item.text}</p>
          </div>
        ))}
      </section>

      <section className="mt-10 rounded-[26px] bg-ink p-7 text-white md:p-9">
        <div className="flex flex-wrap items-center justify-between gap-5">
          <div>
            <h2 className="font-display text-xl font-bold">Butuh informasi lebih lanjut?</h2>
            <p className="mt-2 max-w-xl text-sm text-[#B9BDD4]">
              Hubungi pengelola laboratorium pada {settings.openingHours} atau kunjungi kami di{' '}
              {settings.businessAddress}.
            </p>
          </div>
          <div className="flex gap-2">
            <a
              href={whatsappLink(settings.whatsappNumber, `Halo ${settings.websiteName}, saya ingin bertanya tentang layanan peminjaman alat.`)}
              target="_blank"
              rel="noreferrer"
              className="btn bg-white text-ink"
            >
              <MessageCircle size={15} /> WhatsApp
            </a>
            <a href={settings.instagramUrl} target="_blank" rel="noreferrer" className="btn border border-white/30 text-white">
              <Instagram size={15} /> Instagram
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
