import React, { useState } from 'react'
import { ArrowLeft, Eye, EyeOff, Lock, ShieldCheck, User } from 'lucide-react'
import { useApp } from '../lib/store.jsx'

export default function AdminLogin() {
  const { login, settings } = useApp()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const submit = (event) => {
    event.preventDefault()
    const result = login(username, password)
    if (!result.ok) setError(result.error)
  }

  return (
    <div className="grid min-h-screen bg-[radial-gradient(circle_at_20%_20%,rgba(120,101,255,0.35),transparent_35%),#10132B] lg:grid-cols-[1.1fr_0.9fr]">
      <div className="hidden flex-col justify-between p-10 text-white lg:flex">
        <a href="#/" className="inline-flex items-center gap-2 text-xs font-bold text-white/70 hover:text-white">
          <ArrowLeft size={14} /> Kembali ke website
        </a>
        <div>
          <span className="grid h-12 w-12 place-items-center rounded-xl bg-[linear-gradient(135deg,#7865FF,#FF6DA9)] font-display text-sm font-bold">
            PA
          </span>
          <h1 className="mt-5 max-w-md font-display text-4xl font-bold leading-tight">
            Dashboard {settings.websiteName}
          </h1>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-[#B9BDD4]">
            Kelola inventaris, tarif sewa, stok, pesanan, pelanggan, perawatan alat, dan laporan laboratorium
            dari satu tempat.
          </p>
          <div className="mt-8 space-y-2.5 text-[12px] text-[#C6C8DC]">
            {[
              'Manajemen produk, kategori, dan media 3D',
              'Pemeriksaan stok otomatis pada setiap pesanan',
              'Laporan pesanan dan pendapatan dengan ekspor CSV',
            ].map((item) => (
              <p key={item} className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-purple" /> {item}
              </p>
            ))}
          </div>
        </div>
        <p className="text-[11px] text-white/35">
          © {new Date().getFullYear()} {settings.websiteName} · Prototipe demo
        </p>
      </div>

      <div className="flex items-center justify-center p-5">
        <div className="w-full max-w-md rounded-[26px] bg-white p-7 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
          <div className="flex items-center gap-2.5 lg:hidden">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[linear-gradient(135deg,#7865FF,#FF6DA9)] font-display text-xs font-bold text-white">
              PA
            </span>
            <span className="font-display text-lg font-bold">{settings.websiteName}</span>
          </div>

          <div className="mt-6 lg:mt-0">
            <span className="eyebrow">Login Admin</span>
            <h2 className="mt-2 font-display text-2xl font-bold">Masuk ke dashboard</h2>
            <p className="mt-1.5 text-[12px] text-muted">
              Gunakan akun admin laboratorium yang diberikan superadmin.
            </p>
          </div>

          <form onSubmit={submit} className="mt-5 space-y-3">
            <div>
              <label className="label" htmlFor="username">Username atau email</label>
              <div className="relative">
                <User size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  id="username"
                  className="input pl-9"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  autoComplete="username"
                  placeholder="admin"
                />
              </div>
            </div>
            <div>
              <label className="label" htmlFor="password">Password</label>
              <div className="relative">
                <Lock size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className="input px-9"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted hover:text-ink"
                  aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error ? (
              <p className="rounded-lg bg-[#FFF0F2] px-3 py-2 text-[11px] font-semibold text-[#D34C70]">{error}</p>
            ) : null}

            <button type="submit" className="btn-primary w-full">Masuk</button>
          </form>

          <div className="mt-5 rounded-xl bg-paper p-3 text-[11px] leading-relaxed text-muted">
            <b className="text-ink">Akun demo:</b> admin / PinjamAlat2026! · superadmin / SuperAdmin2026!
            <br />
            Pada versi produksi, akun disimpan di backend dengan password ter-hash dan sesi aman.
          </div>

          <a href="#/" className="btn-ghost mt-3 w-full text-[11px]">
            <ArrowLeft size={13} /> Kembali ke website customer
          </a>
        </div>
      </div>
    </div>
  )
}
