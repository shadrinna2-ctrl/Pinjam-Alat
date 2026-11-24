import React from 'react'
import { Instagram, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import { useApp } from '../lib/store.jsx'
import { whatsappLink } from '../lib/format.js'

export default function SiteFooter() {
  const { settings } = useApp()
  return (
    <footer className="bg-ink pb-7 pt-12 text-white">
      <div className="container-page flex flex-wrap justify-between gap-8">
        <div className="max-w-sm">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[linear-gradient(135deg,#7865FF,#FF6DA9)] font-display text-xs font-bold">
              PA
            </span>
            <span className="font-display text-lg font-bold">{settings.websiteName}</span>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-[#9DA2BD]">
            {settings.tagline}. Katalog alat praktikum, visualisasi 3D, dan pengajuan peminjaman
            dalam satu tempat.
          </p>
          <div className="mt-4 flex gap-2">
            <a
              href={whatsappLink(settings.whatsappNumber, `Halo ${settings.websiteName}, saya ingin bertanya tentang peminjaman alat.`)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-[11px] font-bold hover:bg-white/10"
            >
              <MessageCircle size={13} /> WhatsApp
            </a>
            <a
              href={settings.instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-[11px] font-bold hover:bg-white/10"
            >
              <Instagram size={13} /> Instagram
            </a>
          </div>
        </div>

        <div className="text-xs text-[#C6C8DC]">
          <h3 className="mb-3 font-display text-sm font-bold text-white">Navigasi</h3>
          <ul className="space-y-2">
            <li><a href="#/" className="hover:text-white">Beranda</a></li>
            <li><a href="#/katalog" className="hover:text-white">Katalog Alat</a></li>
            <li><a href="#/kategori" className="hover:text-white">Kategori Laboratorium</a></li>
            <li><a href="#/status" className="hover:text-white">Status Pesanan</a></li>
            <li><a href="#/tentang" className="hover:text-white">Tentang Kami</a></li>
          </ul>
        </div>

        <div className="max-w-xs text-xs text-[#C6C8DC]">
          <h3 className="mb-3 font-display text-sm font-bold text-white">Kontak Pengelola</h3>
          <ul className="space-y-2.5">
            <li className="flex gap-2">
              <MapPin size={14} className="mt-0.5 shrink-0 text-purple" />
              <span>{settings.businessAddress}</span>
            </li>
            <li className="flex gap-2">
              <Phone size={14} className="mt-0.5 shrink-0 text-purple" />
              <span>+{settings.whatsappNumber.replace(/^0/, '')}</span>
            </li>
            <li className="flex gap-2">
              <Mail size={14} className="mt-0.5 shrink-0 text-purple" />
              <span>{settings.contactEmail}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="container-page mt-9 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5 text-[11px] text-[#858BA9]">
        <span>© {new Date().getFullYear()} {settings.websiteName}. Seluruh hak cipta dilindungi.</span>
        <span>Prototipe demo · data tersimpan di peramban (localStorage)</span>
      </div>
    </footer>
  )
}
