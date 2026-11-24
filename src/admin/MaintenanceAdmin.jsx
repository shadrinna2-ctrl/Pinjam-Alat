import React, { useState } from 'react'
import { CheckCircle2, Wrench } from 'lucide-react'
import { useApp } from '../lib/store.jsx'
import { addDaysISO, formatDate, todayISO } from '../lib/format.js'

export default function MaintenanceAdmin() {
  const { products, maintenance, dispatch, toast, logAction } = useApp()
  const [form, setForm] = useState({
    productId: products[0]?.id || '',
    quantity: 1,
    startDate: todayISO(),
    endDate: addDaysISO(todayISO(), 3),
    description: '',
  })

  const set = (key) => (event) => setForm((prev) => ({ ...prev, [key]: event.target.value }))

  const submit = (event) => {
    event.preventDefault()
    const product = products.find((p) => p.id === Number(form.productId))
    if (!product) {
      toast('Pilih alat yang akan dirawat.', 'error')
      return
    }
    if (!form.description.trim()) {
      toast('Catatan kerusakan atau perawatan wajib diisi.', 'error')
      return
    }
    const qty = Math.max(1, Number(form.quantity) || 1)
    if (qty > product.stockTotal) {
      toast('Jumlah unit perawatan melebihi stok total alat.', 'error')
      return
    }
    dispatch({
      type: 'maintenance/add',
      payload: {
        productId: product.id,
        quantity: qty,
        startDate: form.startDate,
        endDate: form.endDate,
        description: form.description.trim(),
        status: 'perawatan',
        createdBy: 'admin',
        createdAt: new Date().toISOString(),
      },
    })
    logAction('maintenance', 'product', product.id, `Mencatat perawatan ${product.name} (${qty} unit)`)
    toast(`Perawatan ${product.name} dicatat. Stok siap pakai berkurang ${qty} unit.`)
    setForm((prev) => ({ ...prev, description: '', quantity: 1 }))
  }

  const active = maintenance.filter((item) => item.status === 'perawatan')
  const history = maintenance.filter((item) => item.status === 'selesai')
  const productName = (id) => products.find((p) => p.id === id)?.name || 'Alat dihapus'

  return (
    <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
      <form onSubmit={submit} className="rounded-xl2 border border-line bg-white p-4">
        <h2 className="flex items-center gap-2 font-display text-base font-bold">
          <Wrench size={16} className="text-purple" /> Catat perawatan
        </h2>
        <div className="mt-4 space-y-3">
          <div>
            <label className="label" htmlFor="m-product">Alat</label>
            <select id="m-product" className="input" value={form.productId} onChange={set('productId')}>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} ({product.sku})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="m-qty">Jumlah unit dirawat</label>
            <input id="m-qty" type="number" min="1" className="input" value={form.quantity} onChange={set('quantity')} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label" htmlFor="m-start">Mulai perawatan</label>
              <input id="m-start" type="date" className="input" value={form.startDate} onChange={set('startDate')} />
            </div>
            <div>
              <label className="label" htmlFor="m-end">Perkiraan selesai</label>
              <input id="m-end" type="date" className="input" value={form.endDate} min={form.startDate} onChange={set('endDate')} />
            </div>
          </div>
          <div>
            <label className="label" htmlFor="m-desc">Catatan kerusakan / perawatan</label>
            <textarea id="m-desc" className="input min-h-[80px]" value={form.description} onChange={set('description')} placeholder="Contoh: kalibrasi probe, penggantian kabel kanal 2" />
          </div>
          <button type="submit" className="btn-primary w-full">Simpan catatan perawatan</button>
          <p className="text-[10px] leading-relaxed text-muted">
            Unit yang sedang dirawat tidak dihitung sebagai stok siap dipinjam dan tidak dapat dikonfirmasi
            dalam pesanan baru.
          </p>
        </div>
      </form>

      <div className="space-y-4">
        <div className="rounded-xl2 border border-line bg-white p-4">
          <h2 className="font-display text-base font-bold">Sedang dirawat ({active.length})</h2>
          <div className="mt-3 space-y-2">
            {active.length ? (
              active.map((item) => (
                <div key={item.id} className="rounded-lg border border-line p-3">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="text-[12px] font-bold">{productName(item.productId)}</p>
                      <p className="text-[10px] text-muted">
                        {item.quantity} unit · {formatDate(item.startDate)} – {formatDate(item.endDate)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        dispatch({ type: 'maintenance/finish', payload: item.id })
                        logAction('maintenance', 'product', item.productId, `Menyelesaikan perawatan ${productName(item.productId)}`)
                        toast('Perawatan ditandai selesai. Stok kembali tersedia.')
                      }}
                      className="btn btn-sm btn-soft"
                    >
                      <CheckCircle2 size={13} /> Tandai selesai
                    </button>
                  </div>
                  <p className="mt-2 text-[11px] text-muted">{item.description}</p>
                </div>
              ))
            ) : (
              <p className="rounded-lg bg-paper px-3 py-3 text-[11px] text-muted">Tidak ada alat dalam perawatan.</p>
            )}
          </div>
        </div>

        <div className="rounded-xl2 border border-line bg-white p-4">
          <h2 className="font-display text-base font-bold">Riwayat perawatan</h2>
          <div className="table-wrap mt-3">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Alat</th>
                  <th>Unit</th>
                  <th>Periode</th>
                  <th>Catatan</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item) => (
                  <tr key={item.id}>
                    <td className="font-semibold">{productName(item.productId)}</td>
                    <td>{item.quantity}</td>
                    <td>{formatDate(item.startDate)} – {formatDate(item.endDate)}</td>
                    <td className="max-w-[240px] truncate text-muted">{item.description}</td>
                  </tr>
                ))}
                {!history.length ? (
                  <tr><td colSpan={4} className="py-6 text-center text-muted">Belum ada riwayat perawatan.</td></tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
