import React from 'react'
import { Clock3, Instagram, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import { useApp } from '../lib/store.jsx'
import { whatsappLink } from '../lib/format.js'

export default function Contact() {
  const { settings } = useApp()

  return (
    <div className="container-page py-10">
      <div className="max-w-2xl">
        <span className="eyebrow">Kontak</span>
        <h1 className="heading mt-2">Hubungi pengelola laboratorium</h1>
        <p className="mt-2 text-sm text-muted">
          Pemesanan dan pertanyaan ditangani langsung oleh admin melalui WhatsApp pada jam operasional.
        </p>
      </div>

      <div className="mt-7 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl2 border border-line bg-white p-6">
          <MessageCircle size={20} className="text-purple" />
          <h2 className="mt-3 font-display text-base font-bold">WhatsApp Admin</h2>
          <p className="mt-1.5 text-[12px] leading-relaxed text-muted">
            Konfirmasi ketersediaan alat, jadwal pengambilan, dan perubahan pesanan.
          </p>
          <a
            href={whatsappLink(settings.whatsappNumber, `Halo Admin ${settings.websiteName}, saya ingin bertanya tentang peminjaman alat praktikum.`)}
            target="_blank"
            rel="noreferrer"
            className="btn-primary mt-4 w-full"
          >
            Chat via WhatsApp
          </a>
          <p className="mt-2 text-center text-[11px] text-muted">+{settings.whatsappNumber.replace(/^0/, '')}</p>
        </div>

        <div className="rounded-xl2 border border-line bg-white p-6">
          <Instagram size={20} className="text-purple" />
          <h2 className="mt-3 font-display text-base font-bold">Instagram</h2>
          <p className="mt-1.5 text-[12px] leading-relaxed text-muted">
            Informasi kegiatan laboratorium, alat terbaru, dan jadwal praktikum.
          </p>
          <a href={settings.instagramUrl} target="_blank" rel="noreferrer" className="btn-outline mt-4 w-full">
            Kunjungi Instagram
          </a>
          <p className="mt-2 truncate text-center text-[11px] text-muted">
            {settings.instagramUrl.replace(/^https?:\/\/(www\.)?instagram\.com\/?/, '@').replace(/\/$/, '') || '@pinjamalat'}
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-4 rounded-xl2 border border-line bg-white p-6 sm:grid-cols-2">
        <div className="flex gap-3">
          <MapPin size={18} className="mt-0.5 shrink-0 text-purple" />
          <div>
            <h3 className="text-sm font-extrabold">Alamat pengelola</h3>
            <p className="mt-1 text-[12px] leading-relaxed text-muted">{settings.businessAddress}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Clock3 size={18} className="mt-0.5 shrink-0 text-purple" />
          <div>
            <h3 className="text-sm font-extrabold">Jam operasional</h3>
            <p className="mt-1 text-[12px] leading-relaxed text-muted">{settings.openingHours}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Phone size={18} className="mt-0.5 shrink-0 text-purple" />
          <div>
            <h3 className="text-sm font-extrabold">Telepon / WhatsApp</h3>
            <p className="mt-1 text-[12px] leading-relaxed text-muted">+{settings.whatsappNumber.replace(/^0/, '')}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Mail size={18} className="mt-0.5 shrink-0 text-purple" />
          <div>
            <h3 className="text-sm font-extrabold">Email</h3>
            <p className="mt-1 text-[12px] leading-relaxed text-muted">{settings.contactEmail}</p>
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-xl2 border border-line bg-[#FFF9EE] p-5 text-[12px] leading-relaxed text-[#8A6116]">
        <b>Catatan:</b> pembukaan WhatsApp tidak sama dengan pengiriman pesan otomatis. Setelah menekan tombol,
        Anda tetap perlu menekan tombol kirim di aplikasi WhatsApp.
      </div>
    </div>
  )
}
