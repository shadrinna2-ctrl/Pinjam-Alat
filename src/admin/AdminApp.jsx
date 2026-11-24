import React, { useState } from 'react'
import {
  Activity,
  BarChart3,
  Boxes,
  ClipboardList,
  ExternalLink,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Settings,
  ShoppingBag,
  Users,
  Wrench,
  X,
} from 'lucide-react'
import { useApp } from '../lib/store.jsx'
import AdminLogin from './AdminLogin.jsx'
import Overview from './Overview.jsx'
import ProductsAdmin from './ProductsAdmin.jsx'
import CategoriesAdmin from './CategoriesAdmin.jsx'
import OrdersAdmin from './OrdersAdmin.jsx'
import CustomersAdmin from './CustomersAdmin.jsx'
import ReportsAdmin from './ReportsAdmin.jsx'
import MaintenanceAdmin from './MaintenanceAdmin.jsx'
import SettingsAdmin from './SettingsAdmin.jsx'
import UsersAdmin from './UsersAdmin.jsx'
import LogsAdmin from './LogsAdmin.jsx'

const menu = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, subtitle: 'Ringkasan inventaris dan pesanan laboratorium' },
  { key: 'produk', label: 'Manajemen Produk', icon: Package, subtitle: 'Tambah, ubah, dan nonaktifkan alat' },
  { key: 'kategori', label: 'Kategori', icon: Boxes, subtitle: 'Kelola kategori laboratorium' },
  { key: 'pesanan', label: 'Pesanan', icon: ClipboardList, subtitle: 'Periksa dan ubah status peminjaman' },
  { key: 'pelanggan', label: 'Pelanggan', icon: Users, subtitle: 'Data peminjam dan riwayat transaksi' },
  { key: 'perawatan', label: 'Perawatan Alat', icon: Wrench, subtitle: 'Catat unit yang sedang diperbaiki' },
  { key: 'laporan', label: 'Laporan', icon: BarChart3, subtitle: 'Unduh laporan inventaris dan pendapatan' },
  { key: 'pengaturan', label: 'Pengaturan', icon: Settings, subtitle: 'Identitas website dan kontak' },
  { key: 'akun', label: 'Akun Admin', icon: Users, subtitle: 'Kelola akun admin laboratorium', superadmin: true },
  { key: 'aktivitas', label: 'Log Aktivitas', icon: Activity, subtitle: 'Riwayat aktivitas admin', superadmin: true },
]

export default function AdminApp({ route }) {
  const { session, logout, settings } = useApp()
  const [open, setOpen] = useState(false)

  if (!session) return <AdminLogin />

  const requested = route.segments[1] || 'dashboard'
  const available = menu.filter((item) => !item.superadmin || session.role === 'superadmin')
  const current = available.find((item) => item.key === requested) || available[0]

  const views = {
    dashboard: Overview,
    produk: ProductsAdmin,
    kategori: CategoriesAdmin,
    pesanan: OrdersAdmin,
    pelanggan: CustomersAdmin,
    perawatan: MaintenanceAdmin,
    laporan: ReportsAdmin,
    pengaturan: SettingsAdmin,
    akun: UsersAdmin,
    aktivitas: LogsAdmin,
  }
  const View = views[current.key]

  return (
    <div className="min-h-screen bg-[#F4F5FB]">
      <div className="mx-auto flex min-h-screen w-full max-w-[1440px]">
        <aside
          className={`fixed inset-y-0 left-0 z-40 flex w-[248px] flex-col bg-ink px-4 py-6 text-white transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
            open ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between px-2">
            <a href="#/" className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-[linear-gradient(135deg,#7865FF,#FF6DA9)] font-display text-xs font-bold">
                PA
              </span>
              <span className="font-display text-lg font-bold">{settings.websiteName}</span>
            </a>
            <button type="button" onClick={() => setOpen(false)} className="rounded-lg p-1 text-white/60 lg:hidden" aria-label="Tutup menu">
              <X size={18} />
            </button>
          </div>

          <p className="mt-6 px-2 text-[10px] font-extrabold uppercase tracking-[0.15em] text-white/35">Menu Utama</p>
          <nav className="mt-2 flex-1 space-y-1 overflow-y-auto">
            {available.map((item) => (
              <a
                key={item.key}
                href={`#/admin/${item.key}`}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[12px] font-bold transition ${
                  current.key === item.key ? 'bg-white/15 text-white' : 'text-[#C5C8DC] hover:bg-white/10 hover:text-white'
                }`}
              >
                <item.icon size={16} /> {item.label}
              </a>
            ))}
          </nav>

          <div className="mt-4 space-y-2">
            <a href="#/" className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-[11px] font-bold text-white/85 hover:bg-white/10">
              <ExternalLink size={14} /> Lihat website
            </a>
            <button
              type="button"
              onClick={logout}
              className="flex w-full items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-[11px] font-bold text-white/85 hover:bg-white/10"
            >
              <LogOut size={14} /> Keluar
            </button>
            <div className="rounded-xl bg-white/5 px-3 py-2.5 text-[10px] leading-relaxed text-white/45">
              Masuk sebagai <b className="text-white/80">{session.name}</b> ({session.role})
            </div>
          </div>
        </aside>

        {open ? <div className="fixed inset-0 z-30 bg-ink/50 lg:hidden" onClick={() => setOpen(false)} /> : null}

        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <header className="mb-6 flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <button type="button" onClick={() => setOpen(true)} className="rounded-xl border border-line bg-white p-2.5 lg:hidden" aria-label="Buka menu">
                <Menu size={18} />
              </button>
              <div>
                <h1 className="font-display text-2xl font-bold">{current.label}</h1>
                <p className="mt-0.5 text-[12px] text-muted">{current.subtitle}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <a href="#/" className="btn btn-sm btn-outline hidden sm:inline-flex">
                <ShoppingBag size={13} /> Situs customer
              </a>
              <span className="rounded-xl border border-line bg-white px-3 py-2 text-[11px] font-bold">
                {session.name}
              </span>
            </div>
          </header>

          <View />
        </main>
      </div>
    </div>
  )
}
