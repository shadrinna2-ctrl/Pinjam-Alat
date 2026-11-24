import React, { useState } from 'react'
import { Menu, ShoppingCart, X } from 'lucide-react'
import { useApp } from '../lib/store.jsx'

const links = [
  { href: '#/', label: 'Beranda', match: '/' },
  { href: '#/katalog', label: 'Katalog', match: '/katalog' },
  { href: '#/kategori', label: 'Kategori', match: '/kategori' },
  { href: '#/tentang', label: 'Tentang Kami', match: '/tentang' },
  { href: '#/kontak', label: 'Kontak', match: '/kontak' },
]

export default function SiteHeader({ path, cartCount }) {
  const { settings } = useApp()
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className="bg-ink text-[11px] text-[#C8CBE0]">
        <div className="container-page flex items-center justify-between gap-3 py-2">
          <span className="truncate">
            {settings.openingHours} · {settings.businessAddress}
          </span>
          <a href="#/admin" className="shrink-0 font-semibold text-white/70 hover:text-white">
            Login Admin
          </a>
        </div>
      </div>

      <header className="sticky top-0 z-30 border-b border-line bg-white/90 backdrop-blur-md">
        <div className="container-page flex h-[70px] items-center justify-between gap-5">
          <a href="#/" className="flex items-center gap-2.5">
            {settings.websiteLogo ? (
              <img src={settings.websiteLogo} alt={settings.websiteName} className="h-10 w-10 rounded-xl object-cover" />
            ) : (
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-[linear-gradient(135deg,#7865FF,#FF6DA9)] font-display text-sm font-bold text-white shadow-[0_8px_20px_rgba(120,101,255,0.3)]">
                PA
              </span>
            )}
            <span className="font-display text-xl font-bold tracking-tight">{settings.websiteName}</span>
          </a>

          <nav className="hidden items-center gap-7 text-[13px] font-bold text-[#555A75] lg:flex">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={path === link.match ? 'text-purple' : 'hover:text-purple'}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a href="#/keranjang" className="relative rounded-xl border border-line bg-white p-2.5" aria-label="Buka keranjang">
              <ShoppingCart size={18} />
              {cartCount > 0 ? (
                <span className="absolute -right-1.5 -top-1.5 grid h-5 min-w-[20px] place-items-center rounded-full bg-pink px-1 text-[10px] font-extrabold text-white">
                  {cartCount}
                </span>
              ) : null}
            </a>
            <a href="#/status" className="btn btn-sm btn-dark hidden sm:inline-flex">
              Cek Status
            </a>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="rounded-xl border border-line bg-white p-2.5 lg:hidden"
              aria-label="Menu"
              aria-expanded={open}
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {open ? (
          <div className="border-t border-line bg-white lg:hidden">
            <nav className="container-page flex flex-col py-3">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-lg px-2 py-3 text-sm font-bold ${
                    path === link.match ? 'text-purple' : 'text-[#555A75]'
                  }`}
                >
                  {link.label}
                </a>
              ))}
              <a href="#/status" onClick={() => setOpen(false)} className="rounded-lg px-2 py-3 text-sm font-bold text-[#555A75]">
                Cek Status Pesanan
              </a>
            </nav>
          </div>
        ) : null}
      </header>
    </>
  )
}
