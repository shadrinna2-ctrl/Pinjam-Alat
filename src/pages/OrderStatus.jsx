import React, { useState } from 'react'
import { ClipboardCheck, MessageCircle, Search } from 'lucide-react'
import { useApp, STATUS_META } from '../lib/store.jsx'
import { formatDate, rupiah } from '../lib/format.js'
import { orderWhatsappLink } from '../lib/whatsapp.js'

const timeline = ['menunggu', 'dikonfirmasi', 'dipinjam', 'selesai']

export default function OrderStatus() {
  const { findOrder, settings } = useApp()
  const [code, setCode] = useState('')
  const [phone, setPhone] = useState('')
  const [order, setOrder] = useState(null)
  const [error, setError] = useState('')

  const submit = (event) => {
    event.preventDefault()
    const found = findOrder(code, phone)
    if (!found) {
      setOrder(null)
      setError('Pesanan tidak ditemukan. Periksa kembali kode pesanan dan nomor WhatsApp.')
      return
    }
    setError('')
    setOrder(found)
  }

  const activeIndex = order ? timeline.indexOf(order.status) : -1

  return (
    <div className="container-page py-10">
      <div className="max-w-2xl">
        <span className="eyebrow">Status Pesanan</span>
        <h1 className="heading mt-2">Pantau peminjaman Anda</h1>
        <p className="mt-2 text-sm text-muted">
          Masukkan kode pesanan dan nomor WhatsApp yang dipakai saat checkout.
        </p>
      </div>

      <form onSubmit={submit} className="mt-6 grid gap-3 rounded-xl2 border border-line bg-white p-5 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
        <div>
          <label className="label" htmlFor="code">Kode pesanan</label>
          <input id="code" className="input" value={code} onChange={(event) => setCode(event.target.value)} placeholder="PA-XXXXXX-XXXX" />
        </div>
        <div>
          <label className="label" htmlFor="phone">Nomor WhatsApp</label>
          <input id="phone" className="input" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="08xxxxxxxxxx" inputMode="tel" />
        </div>
        <button type="submit" className="btn-primary">
          <Search size={15} /> Cek Status
        </button>
      </form>

      {error ? (
        <p className="mt-3 rounded-xl bg-[#FFF0F2] px-4 py-3 text-xs font-semibold text-[#D34C70]">{error}</p>
      ) : null}

      {order ? (
        <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-xl2 border border-line bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wide text-muted">Kode pesanan</span>
                <h2 className="font-display text-lg font-bold">{order.code}</h2>
              </div>
              <span className={`badge ${STATUS_META[order.status].className}`}>
                {STATUS_META[order.status].label}
              </span>
            </div>

            <ol className="mt-6 space-y-4">
              {timeline.map((step, index) => {
                const done = activeIndex >= index && order.status !== 'dibatalkan'
                return (
                  <li key={step} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <span
                        className={`grid h-7 w-7 place-items-center rounded-full text-[11px] font-bold ${
                          done ? 'bg-purple text-white' : 'bg-paper text-muted'
                        }`}
                      >
                        {index + 1}
                      </span>
                      {index < timeline.length - 1 ? (
                        <span className={`mt-1 h-7 w-0.5 ${done ? 'bg-purple/40' : 'bg-line'}`} />
                      ) : null}
                    </div>
                    <div>
                      <p className={`text-[13px] font-bold ${done ? 'text-ink' : 'text-muted'}`}>
                        {STATUS_META[step].label}
                      </p>
                      <p className="text-[11px] text-muted">
                        {step === 'menunggu' && 'Pesanan diterima sistem dan menunggu pemeriksaan admin.'}
                        {step === 'dikonfirmasi' && 'Admin mengonfirmasi ketersediaan alat dan jadwal pengambilan.'}
                        {step === 'dipinjam' && 'Alat sudah diserahkan kepada peminjam.'}
                        {step === 'selesai' && 'Alat telah dikembalikan dan diperiksa laboran.'}
                      </p>
                    </div>
                  </li>
                )
              })}
            </ol>

            {order.status === 'dibatalkan' ? (
              <p className="mt-3 rounded-xl bg-[#FFF0F2] px-3 py-2.5 text-[11px] font-semibold text-[#D34C70]">
                Pesanan ini dibatalkan. Hubungi admin bila membutuhkan penjelasan lebih lanjut.
              </p>
            ) : null}

            {order.adminNote ? (
              <div className="mt-4 rounded-xl bg-paper px-3 py-2.5 text-[11px] text-muted">
                <b className="text-ink">Catatan admin: </b>
                {order.adminNote}
              </div>
            ) : null}

            <dl className="mt-5 divide-y divide-line border-t border-line text-[12px]">
              <div className="grid grid-cols-[38%_62%] gap-2 py-2">
                <dt className="text-muted">Peminjam</dt>
                <dd className="font-semibold">{order.customer.name}</dd>
              </div>
              <div className="grid grid-cols-[38%_62%] gap-2 py-2">
                <dt className="text-muted">Periode</dt>
                <dd className="font-semibold">{formatDate(order.startDate)} – {formatDate(order.endDate)} ({order.days} hari)</dd>
              </div>
              <div className="grid grid-cols-[38%_62%] gap-2 py-2">
                <dt className="text-muted">Tujuan</dt>
                <dd className="font-semibold">{order.purpose || '-'}</dd>
              </div>
              <div className="grid grid-cols-[38%_62%] gap-2 py-2">
                <dt className="text-muted">Total</dt>
                <dd className="font-display text-base font-bold text-[#6353E8]">{rupiah(order.total)}</dd>
              </div>
            </dl>
          </div>

          <div className="space-y-4">
            <div className="rounded-xl2 border border-line bg-white p-5">
              <h3 className="font-display text-sm font-bold">Daftar alat</h3>
              <ul className="mt-3 space-y-2.5">
                {order.items.map((item) => (
                  <li key={item.productId} className="flex justify-between gap-3 text-[11px]">
                    <span className="text-muted">
                      {item.name} <b className="text-ink">×{item.qty}</b> · {item.days} hari
                    </span>
                    <span className="shrink-0 font-bold">{rupiah(item.subtotal)}</span>
                  </li>
                ))}
              </ul>
            </div>

            {['menunggu', 'dikonfirmasi'].includes(order.status) ? (
              <a href={orderWhatsappLink(order, settings)} target="_blank" rel="noreferrer" className="btn-primary w-full">
                <MessageCircle size={16} /> Hubungi Admin via WhatsApp
              </a>
            ) : (
              <a href={settings.instagramUrl} target="_blank" rel="noreferrer" className="btn-outline w-full">
                <ClipboardCheck size={15} /> Lihat informasi terbaru
              </a>
            )}

            <div className="rounded-xl2 border border-line bg-white p-4 text-[11px] leading-relaxed text-muted">
              Pengambilan alat dilakukan di {settings.businessAddress} pada {settings.openingHours}. Bawa kartu
              identitas mahasiswa saat mengambil alat.
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
