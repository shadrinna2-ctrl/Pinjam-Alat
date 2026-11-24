import React, { useMemo, useState } from 'react'
import { Eye, MessageCircle, Search, X } from 'lucide-react'
import { useApp, STATUS_META } from '../lib/store.jsx'
import { formatDate, rupiah, whatsappLink } from '../lib/format.js'

export default function OrdersAdmin() {
  const { orders, dispatch, toast, logAction, availableFor, products } = useApp()
  const [statusFilter, setStatusFilter] = useState('semua')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)
  const [draftStatus, setDraftStatus] = useState('')
  const [note, setNote] = useState('')

  const filtered = useMemo(
    () =>
      orders
        .filter((order) => (statusFilter === 'semua' ? true : order.status === statusFilter))
        .filter((order) =>
          `${order.code} ${order.customer.name} ${order.customer.phone}`
            .toLowerCase()
            .includes(search.toLowerCase()),
        ),
    [orders, statusFilter, search],
  )

  const open = (order) => {
    setSelected(order)
    setDraftStatus(order.status)
    setNote(order.adminNote || '')
  }

  const save = () => {
    if (!selected) return

    if (draftStatus === 'dikonfirmasi' && selected.status !== 'dikonfirmasi') {
      for (const item of selected.items) {
        const available = availableFor(item.productId, selected.startDate, selected.endDate)
        if (item.qty > available) {
          const product = products.find((p) => p.id === item.productId)
          toast(
            `Tidak dapat dikonfirmasi: stok ${product?.name || item.name} tersedia ${available} unit pada periode tersebut.`,
            'error',
          )
          return
        }
      }
    }

    dispatch({
      type: 'order/status',
      payload: { id: selected.id, status: draftStatus, adminNote: note.trim() },
    })
    logAction(
      'update',
      'rental',
      selected.id,
      `Mengubah status pesanan ${selected.code} menjadi ${STATUS_META[draftStatus].label}`,
    )
    toast(`Status pesanan ${selected.code} diperbarui.`)
    setSelected(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-xl2 border border-line bg-white p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            className="input pl-9"
            placeholder="Cari kode pesanan, nama, atau WhatsApp…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Cari pesanan"
          />
        </div>
        <select className="input sm:w-56" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} aria-label="Filter status">
          <option value="semua">Semua status</option>
          {Object.entries(STATUS_META).map(([key, meta]) => (
            <option key={key} value={key}>{meta.label}</option>
          ))}
        </select>
      </div>

      <div className="rounded-xl2 border border-line bg-white p-4">
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Kode pesanan</th>
                <th>Peminjam</th>
                <th>Alat</th>
                <th>Periode</th>
                <th>Total</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => (
                <tr key={order.id}>
                  <td className="font-bold">{order.code}</td>
                  <td>
                    <p className="font-semibold">{order.customer.name}</p>
                    <p className="text-[10px] text-muted">{order.customer.phone}</p>
                  </td>
                  <td className="max-w-[200px]">
                    <p className="truncate text-[11px]">{order.items.map((item) => `${item.name} ×${item.qty}`).join(', ')}</p>
                  </td>
                  <td className="whitespace-nowrap text-[11px]">
                    {formatDate(order.startDate)} – {formatDate(order.endDate)}
                    <span className="block text-[10px] text-muted">{order.days} hari</span>
                  </td>
                  <td className="whitespace-nowrap font-semibold">{rupiah(order.total)}</td>
                  <td>
                    <span className={`badge ${STATUS_META[order.status].className}`}>{STATUS_META[order.status].label}</span>
                  </td>
                  <td>
                    <button type="button" onClick={() => open(order)} className="rounded-lg bg-purpleSoft px-2 py-1.5 text-[10px] font-bold text-[#6554E8]">
                      <Eye size={12} className="mr-1 inline" /> Detail
                    </button>
                  </td>
                </tr>
              ))}
              {!filtered.length ? (
                <tr><td colSpan={7} className="py-8 text-center text-muted">Tidak ada pesanan pada filter ini.</td></tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      {selected ? (
        <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-ink/60 p-4">
          <div className="my-6 w-full max-w-2xl rounded-xl2 bg-white p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-display text-lg font-bold">Pesanan {selected.code}</h2>
                <p className="text-[11px] text-muted">
                  Dibuat {new Date(selected.createdAt).toLocaleString('id-ID')}
                </p>
              </div>
              <button type="button" onClick={() => setSelected(null)} className="rounded-lg bg-paper p-2 text-muted" aria-label="Tutup">
                <X size={16} />
              </button>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-paper p-3">
                <span className="text-[10px] font-bold uppercase tracking-wide text-muted">Peminjam</span>
                <p className="mt-1 text-[12px] font-bold">{selected.customer.name}</p>
                <p className="text-[11px] text-muted">{selected.customer.phone}</p>
                <p className="text-[11px] text-muted">{selected.customer.email || 'Email tidak diisi'}</p>
                <p className="mt-1 text-[11px] text-muted">{selected.customer.address}</p>
              </div>
              <div className="rounded-xl bg-paper p-3">
                <span className="text-[10px] font-bold uppercase tracking-wide text-muted">Periode & tujuan</span>
                <p className="mt-1 text-[12px] font-bold">
                  {formatDate(selected.startDate)} – {formatDate(selected.endDate)} ({selected.days} hari)
                </p>
                <p className="text-[11px] text-muted">{selected.purpose || 'Tujuan tidak dicatat'}</p>
                <p className="mt-1 text-[11px] text-muted">Catatan: {selected.notes || '-'}</p>
              </div>
            </div>

            <div className="mt-3 overflow-hidden rounded-xl border border-line">
              <table className="data-table min-w-full">
                <thead>
                  <tr>
                    <th>Alat</th>
                    <th>Jumlah</th>
                    <th>Tarif/hari</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {selected.items.map((item) => (
                    <tr key={item.productId}>
                      <td className="font-semibold">{item.name}<span className="block text-[10px] font-normal text-muted">{item.sku}</span></td>
                      <td>{item.qty} × {item.days} hari</td>
                      <td>{rupiah(item.price)}</td>
                      <td className="font-semibold">{rupiah(item.subtotal)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-3 flex items-center justify-between rounded-xl bg-purpleSoft px-4 py-3">
              <span className="text-[11px] font-bold text-[#5B49E0]">Total pesanan</span>
              <span className="font-display text-lg font-bold text-[#5B49E0]">{rupiah(selected.total)}</span>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div>
                <label className="label" htmlFor="o-status">Ubah status</label>
                <select id="o-status" className="input" value={draftStatus} onChange={(event) => setDraftStatus(event.target.value)}>
                  {Object.entries(STATUS_META).map(([key, meta]) => (
                    <option key={key} value={key}>{meta.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label" htmlFor="o-note">Catatan admin</label>
                <input id="o-note" className="input" value={note} onChange={(event) => setNote(event.target.value)} placeholder="Contoh: siap diambil besok pagi" />
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
              <a
                href={whatsappLink(
                  selected.customer.phone,
                  `Halo ${selected.customer.name}, pesanan ${selected.code} di PinjamAlat. `,
                )}
                target="_blank"
                rel="noreferrer"
                className="btn btn-sm btn-outline"
              >
                <MessageCircle size={13} /> Hubungi peminjam
              </a>
              <div className="flex gap-2">
                <button type="button" onClick={() => setSelected(null)} className="btn btn-sm btn-outline">Batal</button>
                <button type="button" onClick={save} className="btn btn-sm btn-primary">Simpan perubahan</button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
