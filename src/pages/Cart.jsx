import React from 'react'
import { AlertTriangle, ArrowRight, CalendarDays, Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react'
import { useApp } from '../lib/store.jsx'
import { addDaysISO, formatDate, rentalDays, rupiah, todayISO } from '../lib/format.js'

export default function Cart() {
  const { cart, dispatch, availableFor, settings } = useApp()

  const startDate = cart[0]?.startDate || todayISO()
  const endDate = cart[0]?.endDate || addDaysISO(todayISO(), 1)
  const days = rentalDays(startDate, endDate)

  const lines = cart.map((line) => {
    const available = availableFor(line.productId, startDate, endDate)
    return {
      ...line,
      available,
      over: line.qty > available,
      subtotal: line.price * line.qty * days,
    }
  })
  const subtotal = lines.reduce((sum, line) => sum + line.subtotal, 0)
  const hasIssue = lines.some((line) => line.over) || days === 0

  const updateRange = (key, value) => {
    const nextStart = key === 'start' ? value : startDate
    let nextEnd = key === 'end' ? value : endDate
    if (nextEnd < nextStart) nextEnd = nextStart
    dispatch({ type: 'cart/dates', payload: { startDate: nextStart, endDate: nextEnd } })
  }

  if (!cart.length) {
    return (
      <div className="container-page py-16">
        <div className="mx-auto max-w-lg rounded-xl2 border border-line bg-white p-10 text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-purpleSoft text-[#6554E8]">
            <ShoppingCart size={24} />
          </span>
          <h1 className="mt-4 font-display text-xl font-bold">Keranjang masih kosong</h1>
          <p className="mt-2 text-sm text-muted">
            Tambahkan alat praktikum dari katalog untuk mulai mengajukan peminjaman.
          </p>
          <a href="#/katalog" className="btn-primary mt-5">
            Jelajahi katalog <ArrowRight size={15} />
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="container-page py-10">
      <span className="eyebrow">Keranjang</span>
      <h1 className="heading mt-2">Rencana peminjaman</h1>

      <div className="mt-7 grid items-start gap-5 lg:grid-cols-[1.4fr_0.6fr]">
        <div className="space-y-3">
          <div className="rounded-xl2 border border-line bg-white p-4">
            <div className="flex items-center gap-2 text-[12px] font-bold">
              <CalendarDays size={15} className="text-purple" /> Periode penyewaan
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div>
                <label className="label" htmlFor="cart-start">Tanggal mulai</label>
                <input id="cart-start" type="date" className="input" value={startDate} min={todayISO()} onChange={(event) => updateRange('start', event.target.value)} />
              </div>
              <div>
                <label className="label" htmlFor="cart-end">Tanggal selesai</label>
                <input id="cart-end" type="date" className="input" value={endDate} min={startDate} onChange={(event) => updateRange('end', event.target.value)} />
              </div>
            </div>
            <p className="mt-2 text-[11px] text-muted">
              {days > 0 ? `${days} hari sewa (tanggal mulai & selesai dihitung).` : 'Tanggal selesai harus setelah tanggal mulai.'}
            </p>
          </div>

          <div className="rounded-xl2 border border-line bg-white p-4">
            <ul className="divide-y divide-line">
              {lines.map((line) => (
                <li key={line.productId} className="grid gap-3 py-4 sm:grid-cols-[1fr_auto_auto] sm:items-center">
                  <div>
                    <a href={`#/alat/${line.slug}`} className="text-sm font-bold hover:text-purple">{line.name}</a>
                    <div className="mt-0.5 text-[11px] text-muted">
                      {line.sku} · {rupiah(line.price)}/{settings.rentalUnitLabel || 'hari'} · stok siap {line.available}
                    </div>
                    {line.over ? (
                      <p className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-[#D34C70]">
                        <AlertTriangle size={11} /> Jumlah melebihi stok tersedia untuk tanggal ini.
                      </p>
                    ) : null}
                  </div>

                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => dispatch({ type: 'cart/qty', payload: { productId: line.productId, qty: line.qty - 1 } })} className="grid h-8 w-8 place-items-center rounded-lg border border-line" aria-label="Kurangi jumlah">
                      <Minus size={13} />
                    </button>
                    <span className="w-7 text-center text-sm font-bold">{line.qty}</span>
                    <button type="button" onClick={() => dispatch({ type: 'cart/qty', payload: { productId: line.productId, qty: line.qty + 1 } })} className="grid h-8 w-8 place-items-center rounded-lg border border-line" aria-label="Tambah jumlah">
                      <Plus size={13} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-4 sm:justify-end">
                    <span className="text-sm font-bold">{rupiah(line.subtotal)}</span>
                    <button
                      type="button"
                      onClick={() => dispatch({ type: 'cart/remove', payload: { productId: line.productId } })}
                      className="rounded-lg bg-[#FFF0F3] p-2 text-[#DF4E7E]"
                      aria-label={`Hapus ${line.name}`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <aside className="rounded-xl2 border border-line bg-white p-5 shadow-card">
          <h2 className="font-display text-lg font-bold">Ringkasan</h2>
          <div className="mt-4 space-y-2.5 text-[12px] text-muted">
            <div className="flex justify-between">
              <span>Jumlah item</span>
              <b className="text-ink">{lines.reduce((sum, line) => sum + line.qty, 0)} unit</b>
            </div>
            <div className="flex justify-between">
              <span>Lama sewa</span>
              <b className="text-ink">{days} hari</b>
            </div>
            <div className="flex justify-between">
              <span>Periode</span>
              <b className="text-right text-ink">{formatDate(startDate)} – {formatDate(endDate)}</b>
            </div>
            <div className="flex justify-between border-t border-line pt-3">
              <span>Subtotal</span>
              <b className="text-ink">{rupiah(subtotal)}</b>
            </div>
          </div>

          <div className="mt-4 flex items-baseline justify-between border-t border-line pt-3">
            <span className="text-sm font-bold">Estimasi total</span>
            <span className="font-display text-xl font-bold text-[#6353E8]">{rupiah(subtotal)}</span>
          </div>

          <a
            href={hasIssue ? undefined : '#/checkout'}
            aria-disabled={hasIssue}
            className={`mt-4 w-full ${hasIssue ? 'btn pointer-events-none bg-line text-muted' : 'btn-primary'}`}
          >
            Lanjut ke checkout <ArrowRight size={15} />
          </a>
          {hasIssue ? (
            <p className="mt-2 text-[11px] text-[#D34C70]">
              Perbaiki jumlah atau tanggal sewa sebelum melanjutkan.
            </p>
          ) : (
            <p className="mt-2 text-[11px] text-muted">
              Biaya akhir dikonfirmasi admin. Belum ada pembayaran online pada versi ini.
            </p>
          )}
          <a href="#/katalog" className="btn-ghost mt-2 w-full text-[11px]">Tambah alat lain</a>
        </aside>
      </div>
    </div>
  )
}
