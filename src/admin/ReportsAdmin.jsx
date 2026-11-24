import React, { useMemo, useState } from 'react'
import { Download } from 'lucide-react'
import { useApp, STATUS_META } from '../lib/store.jsx'
import { downloadCsv } from '../lib/image.js'
import { formatDate, rentalDays, rupiah } from '../lib/format.js'

const types = [
  { key: 'inventaris', label: 'Seluruh inventaris' },
  { key: 'stok', label: 'Laporan stok alat' },
  { key: 'pesanan', label: 'Laporan pesanan' },
  { key: 'terlaris', label: 'Alat paling sering dipinjam' },
  { key: 'pendapatan', label: 'Pendapatan tercatat' },
  { key: 'pembatalan', label: 'Laporan pembatalan' },
  { key: 'perawatan', label: 'Alat dalam perawatan' },
]

export default function ReportsAdmin() {
  const { products, orders, maintenance, categories, availableFor, toast } = useApp()
  const [type, setType] = useState('inventaris')

  const categoryName = (slug) => categories.find((c) => c.slug === slug)?.name || '-'

  const report = useMemo(() => {
    if (type === 'inventaris') {
      return {
        headers: ['Kode', 'Nama alat', 'Kategori', 'Merek', 'Kondisi', 'Stok', 'Tarif sewa', 'Status'],
        rows: products.map((p) => [
          p.sku, p.name, categoryName(p.category), p.brand, p.condition, p.stockTotal,
          p.rentalPrice, p.status,
        ]),
      }
    }
    if (type === 'stok') {
      return {
        headers: ['Kode', 'Nama alat', 'Stok total', 'Siap dipinjam', 'Tarif sewa'],
        rows: products.map((p) => [p.sku, p.name, p.stockTotal, availableFor(p.id), p.rentalPrice]),
      }
    }
    if (type === 'pesanan') {
      return {
        headers: ['Kode', 'Tanggal pesan', 'Peminjam', 'WhatsApp', 'Alat', 'Periode', 'Hari', 'Total', 'Status'],
        rows: orders.map((o) => [
          o.code,
          new Date(o.createdAt).toLocaleDateString('id-ID'),
          o.customer.name,
          o.customer.phone,
          o.items.map((item) => `${item.name} x${item.qty}`).join(' | '),
          `${o.startDate} s/d ${o.endDate}`,
          o.days,
          o.total,
          STATUS_META[o.status].label,
        ]),
      }
    }
    if (type === 'terlaris') {
      const map = {}
      orders
        .filter((o) => o.status !== 'dibatalkan')
        .forEach((o) =>
          o.items.forEach((item) => {
            map[item.productId] = map[item.productId] || { name: item.name, qty: 0, orders: 0, revenue: 0 }
            map[item.productId].qty += item.qty
            map[item.productId].orders += 1
            map[item.productId].revenue += item.subtotal
          }),
        )
      const rows = Object.values(map).sort((a, b) => b.qty - a.qty)
      return {
        headers: ['Nama alat', 'Total unit dipinjam', 'Jumlah pesanan', 'Pendapatan'],
        rows: rows.map((r) => [r.name, r.qty, r.orders, r.revenue]),
      }
    }
    if (type === 'pendapatan') {
      const map = {}
      orders
        .filter((o) => o.status !== 'dibatalkan')
        .forEach((o) => {
          const date = new Date(o.createdAt)
          const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
          map[key] = map[key] || { count: 0, total: 0 }
          map[key].count += 1
          map[key].total += o.total
        })
      return {
        headers: ['Bulan', 'Jumlah pesanan', 'Pendapatan tercatat'],
        rows: Object.entries(map)
          .sort((a, b) => b[0].localeCompare(a[0]))
          .map(([month, value]) => [month, value.count, value.total]),
      }
    }
    if (type === 'pembatalan') {
      return {
        headers: ['Kode', 'Peminjam', 'Tanggal pesan', 'Periode', 'Total', 'Catatan admin'],
        rows: orders
          .filter((o) => o.status === 'dibatalkan')
          .map((o) => [o.code, o.customer.name, new Date(o.createdAt).toLocaleDateString('id-ID'), `${o.startDate} s/d ${o.endDate}`, o.total, o.adminNote || '-']),
      }
    }
    return {
      headers: ['Alat', 'Jumlah unit', 'Mulai', 'Perkiraan selesai', 'Status', 'Catatan'],
      rows: maintenance.map((m) => [
        products.find((p) => p.id === m.productId)?.name || 'Alat dihapus',
        m.quantity, m.startDate, m.endDate, m.status, m.description,
      ]),
    }
  }, [type, products, orders, maintenance, categories, availableFor])

  const summary = useMemo(() => {
    if (type === 'pendapatan') {
      const total = report.rows.reduce((sum, row) => sum + Number(row[2]), 0)
      return [
        { label: 'Total pendapatan', value: rupiah(total) },
        { label: 'Bulan tercatat', value: report.rows.length },
      ]
    }
    if (type === 'pesanan') {
      return [
        { label: 'Total pesanan', value: orders.length },
        { label: 'Nilai transaksi', value: rupiah(orders.reduce((sum, o) => sum + o.total, 0)) },
      ]
    }
    if (type === 'stok') {
      return [
        { label: 'Unit siap dipinjam', value: products.reduce((sum, p) => sum + availableFor(p.id), 0) },
        { label: 'Total unit inventaris', value: products.reduce((sum, p) => sum + Number(p.stockTotal), 0) },
      ]
    }
    return [{ label: 'Baris data', value: report.rows.length }]
  }, [type, report, orders, products, availableFor])

  const exportCsv = () => {
    downloadCsv(`pinjamalat-${type}-${new Date().toISOString().slice(0, 10)}.csv`, report.headers, report.rows)
    toast('Laporan CSV berhasil diunduh.')
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-xl2 border border-line bg-white p-4 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label className="label" htmlFor="report-type">Jenis laporan</label>
          <select id="report-type" className="input" value={type} onChange={(event) => setType(event.target.value)}>
            {types.map((item) => (
              <option key={item.key} value={item.key}>{item.label}</option>
            ))}
          </select>
        </div>
        <button type="button" onClick={exportCsv} className="btn-primary btn-sm sm:w-auto">
          <Download size={14} /> Ekspor CSV
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {summary.map((item) => (
          <div key={item.label} className="rounded-xl2 border border-line bg-white p-4">
            <span className="text-[11px] font-bold text-muted">{item.label}</span>
            <b className="mt-1 block font-display text-xl font-bold">{item.value}</b>
          </div>
        ))}
      </div>

      <div className="rounded-xl2 border border-line bg-white p-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-base font-bold">{types.find((t) => t.key === type).label}</h2>
          <span className="text-[10px] text-muted">Pemisah kolom CSV: titik koma (;)</span>
        </div>
        <div className="table-wrap mt-3 max-h-[520px] overflow-y-auto scrollbar-thin">
          <table className="data-table">
            <thead className="sticky top-0">
              <tr>
                {report.headers.map((header) => (
                  <th key={header}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {report.rows.map((row, index) => (
                <tr key={index}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className={cellIndex === 0 ? 'font-semibold' : ''}>
                      {typeof cell === 'number' && cell >= 10000 ? rupiah(cell) : String(cell)}
                    </td>
                  ))}
                </tr>
              ))}
              {!report.rows.length ? (
                <tr><td colSpan={report.headers.length} className="py-8 text-center text-muted">Tidak ada data untuk laporan ini.</td></tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
