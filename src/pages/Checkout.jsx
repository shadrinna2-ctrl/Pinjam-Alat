import React, { useState } from 'react'
import { ArrowLeft, CheckCircle2, ClipboardCheck, Copy, MessageCircle } from 'lucide-react'
import { useApp } from '../lib/store.jsx'
import { formatDate, rentalDays, rupiah } from '../lib/format.js'
import { buildOrderMessage, orderWhatsappLink } from '../lib/whatsapp.js'

const emptyForm = {
  name: '',
  phone: '',
  email: '',
  address: '',
  purpose: '',
  notes: '',
  agree: false,
}

export default function Checkout() {
  const { cart, createOrder, settings, toast } = useApp()
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [order, setOrder] = useState(null)

  const startDate = cart[0]?.startDate
  const endDate = cart[0]?.endDate
  const days = rentalDays(startDate, endDate)
  const subtotal = cart.reduce((sum, line) => sum + line.price * line.qty * days, 0)

  const set = (key) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const submit = (event) => {
    event.preventDefault()
    const nextErrors = {}
    if (form.name.trim().length < 3) nextErrors.name = 'Nama lengkap minimal 3 karakter.'
    if (form.phone.replace(/\D/g, '').length < 9) nextErrors.phone = 'Nomor WhatsApp tidak valid.'
    if (!form.address.trim()) nextErrors.address = 'Alamat atau lokasi peminjaman wajib diisi.'
    if (!form.purpose.trim()) nextErrors.purpose = 'Tujuan peminjaman wajib diisi.'
    if (!form.agree) nextErrors.agree = 'Centang persetujuan ketentuan peminjaman.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) {
      toast('Lengkapi data peminjaman terlebih dahulu.', 'error')
      return
    }

    const result = createOrder({ ...form, startDate, endDate })
    if (!result.ok) {
      toast(result.error, 'error')
      return
    }
    setOrder(result.order)
    window.scrollTo({ top: 0 })
  }

  if (order) {
    return (
      <div className="container-page py-10">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-xl2 border border-line bg-white p-6 text-center shadow-card">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#E6F8EF] text-[#16834B]">
              <CheckCircle2 size={26} />
            </span>
            <h1 className="mt-4 font-display text-2xl font-bold">Pesanan berhasil dibuat</h1>
            <p className="mt-2 text-sm text-muted">
              Simpan kode pesanan berikut untuk memeriksa status peminjaman.
            </p>
            <div className="mx-auto mt-4 inline-flex items-center gap-2 rounded-xl border border-dashed border-purple bg-purpleSoft px-5 py-3">
              <span className="font-display text-xl font-bold tracking-wide text-[#5B49E0]">{order.code}</span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(order.code)
                  toast('Kode pesanan disalin.')
                }}
                className="rounded-lg bg-white p-1.5 text-[#5B49E0]"
                aria-label="Salin kode pesanan"
              >
                <Copy size={13} />
              </button>
            </div>
          </div>

          <div className="mt-4 rounded-xl2 border border-line bg-white p-5">
            <h2 className="font-display text-base font-bold">Ringkasan pemesanan</h2>
            <dl className="mt-3 divide-y divide-line text-[12px]">
              <div className="grid grid-cols-[38%_62%] gap-2 py-2">
                <dt className="text-muted">Nama peminjam</dt>
                <dd className="font-semibold">{order.customer.name}</dd>
              </div>
              <div className="grid grid-cols-[38%_62%] gap-2 py-2">
                <dt className="text-muted">WhatsApp</dt>
                <dd className="font-semibold">{order.customer.phone}</dd>
              </div>
              <div className="grid grid-cols-[38%_62%] gap-2 py-2">
                <dt className="text-muted">Periode</dt>
                <dd className="font-semibold">
                  {formatDate(order.startDate)} – {formatDate(order.endDate)} ({order.days} hari)
                </dd>
              </div>
              <div className="grid grid-cols-[38%_62%] gap-2 py-2">
                <dt className="text-muted">Alat</dt>
                <dd className="font-semibold">
                  {order.items.map((item) => `${item.name} (${item.qty}×)`).join(', ')}
                </dd>
              </div>
              <div className="grid grid-cols-[38%_62%] gap-2 py-2">
                <dt className="text-muted">Estimasi biaya</dt>
                <dd className="font-display text-base font-bold text-[#6353E8]">{rupiah(order.total)}</dd>
              </div>
              <div className="grid grid-cols-[38%_62%] gap-2 py-2">
                <dt className="text-muted">Status</dt>
                <dd className="font-semibold">Menunggu konfirmasi admin</dd>
              </div>
            </dl>

            <div className="mt-4 rounded-xl bg-paper p-3">
              <p className="text-[11px] leading-relaxed text-muted">
                Pesanan <b>belum otomatis terkirim ke WhatsApp</b>. Tekan tombol di bawah untuk membuka WhatsApp
                dengan ringkasan pesanan yang sudah disiapkan, lalu tekan kirim di aplikasi WhatsApp.
              </p>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <a href={orderWhatsappLink(order, settings)} target="_blank" rel="noreferrer" className="btn-primary flex-1">
                <MessageCircle size={16} /> Kirim ke WhatsApp Admin
              </a>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(buildOrderMessage(order, settings))
                  toast('Ringkasan pesanan disalin.')
                }}
                className="btn-outline"
              >
                <Copy size={15} /> Salin ringkasan
              </button>
            </div>
            <a href="#/status" className="btn-ghost mt-2 w-full text-[11px]">
              <ClipboardCheck size={14} /> Cek status pesanan nanti
            </a>
          </div>
        </div>
      </div>
    )
  }

  if (!cart.length) {
    return (
      <div className="container-page py-16 text-center">
        <h1 className="font-display text-xl font-bold">Belum ada alat untuk di-checkout</h1>
        <p className="mt-2 text-sm text-muted">Tambahkan alat ke keranjang terlebih dahulu.</p>
        <a href="#/katalog" className="btn-primary mt-5">Buka katalog</a>
      </div>
    )
  }

  return (
    <div className="container-page py-10">
      <a href="#/keranjang" className="inline-flex items-center gap-1.5 text-xs font-bold text-muted hover:text-purple">
        <ArrowLeft size={14} /> Kembali ke keranjang
      </a>
      <span className="eyebrow mt-4 block">Checkout</span>
      <h1 className="heading mt-2">Data peminjaman</h1>

      <form onSubmit={submit} className="mt-7 grid items-start gap-5 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-xl2 border border-line bg-white p-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="label" htmlFor="name">Nama lengkap *</label>
              <input id="name" className="input" value={form.name} onChange={set('name')} placeholder="Nama sesuai kartu identitas" />
              {errors.name ? <p className="mt-1 text-[11px] text-[#D34C70]">{errors.name}</p> : null}
            </div>
            <div>
              <label className="label" htmlFor="phone">Nomor WhatsApp *</label>
              <input id="phone" className="input" value={form.phone} onChange={set('phone')} placeholder="08xxxxxxxxxx" inputMode="tel" />
              {errors.phone ? <p className="mt-1 text-[11px] text-[#D34C70]">{errors.phone}</p> : null}
            </div>
            <div>
              <label className="label" htmlFor="email">Email (opsional)</label>
              <input id="email" type="email" className="input" value={form.email} onChange={set('email')} placeholder="nama@kampus.ac.id" />
            </div>
            <div className="sm:col-span-2">
              <label className="label" htmlFor="address">Alamat atau lokasi peminjaman *</label>
              <textarea id="address" className="input min-h-[70px]" value={form.address} onChange={set('address')} placeholder="Contoh: Lab Elektronika Gedung B, Kampus Utama" />
              {errors.address ? <p className="mt-1 text-[11px] text-[#D34C70]">{errors.address}</p> : null}
            </div>
            <div>
              <label className="label" htmlFor="start-date">Tanggal mulai</label>
              <input id="start-date" className="input bg-paper" value={formatDate(startDate)} readOnly />
            </div>
            <div>
              <label className="label" htmlFor="end-date">Tanggal selesai</label>
              <input id="end-date" className="input bg-paper" value={formatDate(endDate)} readOnly />
            </div>
            <div className="sm:col-span-2">
              <label className="label" htmlFor="purpose">Tujuan peminjaman *</label>
              <input id="purpose" className="input" value={form.purpose} onChange={set('purpose')} placeholder="Contoh: Praktikum Sistem Digital modul 3" />
              {errors.purpose ? <p className="mt-1 text-[11px] text-[#D34C70]">{errors.purpose}</p> : null}
            </div>
            <div className="sm:col-span-2">
              <label className="label" htmlFor="notes">Catatan tambahan</label>
              <textarea id="notes" className="input min-h-[60px]" value={form.notes} onChange={set('notes')} placeholder="Kebutuhan khusus, waktu pengambilan, dsb." />
            </div>
          </div>

          <label className="mt-4 flex items-start gap-2 rounded-xl bg-paper p-3 text-[11px] leading-relaxed text-muted">
            <input type="checkbox" checked={form.agree} onChange={set('agree')} className="mt-0.5" />
            <span>
              Saya menyetujui ketentuan peminjaman laboratorium: {settings.terms}
            </span>
          </label>
          {errors.agree ? <p className="mt-1 text-[11px] text-[#D34C70]">{errors.agree}</p> : null}
        </div>

        <aside className="rounded-xl2 border border-line bg-white p-5 shadow-card">
          <h2 className="font-display text-base font-bold">Ringkasan pesanan</h2>
          <ul className="mt-3 space-y-2.5">
            {cart.map((line) => (
              <li key={line.productId} className="flex justify-between gap-3 text-[11px]">
                <span className="text-muted">
                  {line.name} <b className="text-ink">×{line.qty}</b>
                </span>
                <span className="shrink-0 font-bold">{rupiah(line.price * line.qty * days)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 space-y-2 border-t border-line pt-3 text-[12px] text-muted">
            <div className="flex justify-between">
              <span>Lama sewa</span>
              <b className="text-ink">{days} hari</b>
            </div>
            <div className="flex justify-between">
              <span>Estimasi total</span>
              <b className="font-display text-base text-[#6353E8]">{rupiah(subtotal)}</b>
            </div>
          </div>
          <button type="submit" className="btn-primary mt-4 w-full">
            Buat Pesanan
          </button>
          <p className="mt-2 text-[10px] leading-relaxed text-muted">
            Setelah pesanan dibuat, Anda akan menerima kode pesanan dan tautan WhatsApp berisi ringkasan untuk
            dikirim ke admin.
          </p>
        </aside>
      </form>
    </div>
  )
}
