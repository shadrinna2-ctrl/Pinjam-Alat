import React from 'react'
import { AlertTriangle, ArrowUpRight, Boxes, CircleDollarSign, ClipboardList, Package, Wrench } from 'lucide-react'
import { useApp, STATUS_META } from '../lib/store.jsx'
import { formatDate, rupiah } from '../lib/format.js'

const card = 'rounded-xl2 border border-line bg-white p-4'

export default function Overview() {
  const { products, orders, availableFor, maintenance, logs, activeProducts } = useApp()

  const countByStatus = (status) => orders.filter((order) => order.status === status).length
  const revenue = orders
    .filter((order) => order.status !== 'dibatalkan')
    .reduce((sum, order) => sum + order.total, 0)

  const stats = [
    { label: 'Total alat', value: products.length, icon: Package },
    { label: 'Total stok inventaris', value: products.reduce((sum, p) => sum + Number(p.stockTotal), 0), icon: Boxes },
    { label: 'Jumlah pesanan', value: orders.length, icon: ClipboardList },
    { label: 'Pendapatan tercatat', value: rupiah(revenue), icon: CircleDollarSign },
  ]

  const statusStats = [
    { status: 'menunggu', count: countByStatus('menunggu') },
    { status: 'dikonfirmasi', count: countByStatus('dikonfirmasi') },
    { status: 'dipinjam', count: countByStatus('dipinjam') },
    { status: 'selesai', count: countByStatus('selesai') },
  ]

  const months = Array.from({ length: 6 }).map((_, index) => {
    const date = new Date()
    date.setDate(1)
    date.setMonth(date.getMonth() - (5 - index))
    return {
      key: `${date.getFullYear()}-${date.getMonth()}`,
      label: date.toLocaleDateString('id-ID', { month: 'short' }),
      count: 0,
    }
  })
  orders.forEach((order) => {
    const date = new Date(order.createdAt)
    const bucket = months.find((m) => m.key === `${date.getFullYear()}-${date.getMonth()}`)
    if (bucket) bucket.count += 1
  })
  const maxCount = Math.max(1, ...months.map((m) => m.count))

  const topProducts = Object.values(
    orders
      .filter((order) => order.status !== 'dibatalkan')
      .flatMap((order) => order.items)
      .reduce((acc, item) => {
        acc[item.productId] = acc[item.productId] || { name: item.name, qty: 0 }
        acc[item.productId].qty += item.qty
        return acc
      }, {}),
  )
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5)

  const lowStock = activeProducts
    .map((product) => ({ product, available: availableFor(product.id) }))
    .filter((item) => item.available <= 2)
    .sort((a, b) => a.available - b.available)
    .slice(0, 5)

  const activeMaintenance = maintenance.filter((m) => m.status === 'perawatan')

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className={card}>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-muted">{stat.label}</span>
              <stat.icon size={16} className="text-purple" />
            </div>
            <b className="mt-2 block font-display text-2xl font-bold">{stat.value}</b>
          </div>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {statusStats.map((item) => (
          <div key={item.status} className={card}>
            <div className="flex items-center justify-between gap-2">
              <span className={`badge ${STATUS_META[item.status].className}`}>{STATUS_META[item.status].label}</span>
              <b className="font-display text-xl font-bold">{item.count}</b>
            </div>
            <a href="#/admin/pesanan" className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-purple">
              Lihat pesanan <ArrowUpRight size={11} />
            </a>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
        <div className={card}>
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base font-bold">Grafik penyewaan</h2>
            <span className="text-[10px] text-muted">6 bulan terakhir</span>
          </div>
          <div className="mt-5 flex h-44 items-end gap-3">
            {months.map((month) => (
              <div key={month.key} className="flex flex-1 flex-col items-center gap-2">
                <span className="text-[10px] font-bold text-muted">{month.count}</span>
                <div className="flex w-full flex-1 items-end">
                  <div
                    className="w-full rounded-t-lg bg-[linear-gradient(180deg,#7865FF,#A46BFF)]"
                    style={{ height: `${Math.max(6, (month.count / maxCount) * 100)}%` }}
                    title={`${month.count} pesanan`}
                  />
                </div>
                <span className="text-[10px] font-semibold capitalize text-muted">{month.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={card}>
          <h2 className="font-display text-base font-bold">Alat paling sering dipinjam</h2>
          <ul className="mt-4 space-y-3">
            {topProducts.length ? (
              topProducts.map((item, index) => (
                <li key={item.name}>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold">
                      {index + 1}. {item.name}
                    </span>
                    <b>{item.qty} unit</b>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-paper">
                    <div
                      className="h-full rounded-full bg-purple"
                      style={{ width: `${(item.qty / topProducts[0].qty) * 100}%` }}
                    />
                  </div>
                </li>
              ))
            ) : (
              <li className="text-[11px] text-muted">Belum ada data peminjaman.</li>
            )}
          </ul>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <div className={card}>
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base font-bold">Stok yang perlu diperiksa</h2>
            <a href="#/admin/perawatan" className="text-[10px] font-bold text-purple">Kelola perawatan</a>
          </div>
          <ul className="mt-3 space-y-2">
            {lowStock.length ? (
              lowStock.map((item) => (
                <li key={item.product.id} className="flex items-center justify-between gap-2 rounded-lg bg-paper px-3 py-2">
                  <span className="text-[11px] font-semibold">{item.product.name}</span>
                  <span className={`badge ${item.available === 0 ? 'bg-[#FFF0F2] text-[#D34C70]' : 'bg-[#FFF4DC] text-[#A36C00]'}`}>
                    {item.available === 0 ? 'Habis' : `${item.available} unit`}
                  </span>
                </li>
              ))
            ) : (
              <li className="text-[11px] text-muted">Semua stok dalam kondisi aman.</li>
            )}
          </ul>
        </div>

        <div className={card}>
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base font-bold">Aktivitas terbaru</h2>
            <span className="inline-flex items-center gap-1 text-[10px] text-muted">
              <Wrench size={11} /> {activeMaintenance.length} unit dirawat
            </span>
          </div>
          <ul className="mt-3 space-y-2">
            {logs.slice(0, 5).map((log) => (
              <li key={log.id} className="rounded-lg bg-paper px-3 py-2">
                <p className="text-[11px] font-semibold">{log.description}</p>
                <p className="text-[10px] text-muted">
                  {log.userId} · {new Date(log.createdAt).toLocaleString('id-ID')}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className={card}>
        <div className="flex items-center justify-between">
          <h2 className="font-display text-base font-bold">Pesanan terbaru</h2>
          <a href="#/admin/pesanan" className="text-[10px] font-bold text-purple">Semua pesanan</a>
        </div>
        <div className="table-wrap mt-3">
          <table className="data-table">
            <thead>
              <tr>
                <th>Kode</th>
                <th>Peminjam</th>
                <th>Tanggal</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map((order) => (
                <tr key={order.id}>
                  <td className="font-semibold">{order.code}</td>
                  <td>{order.customer.name}</td>
                  <td>{formatDate(order.startDate)}</td>
                  <td className="font-semibold">{rupiah(order.total)}</td>
                  <td>
                    <span className={`badge ${STATUS_META[order.status].className}`}>
                      {STATUS_META[order.status].label}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {activeMaintenance.length ? (
        <div className="flex items-start gap-2 rounded-xl2 border border-[#FFE3C2] bg-[#FFF9EE] p-4 text-[11px] text-[#8A6116]">
          <AlertTriangle size={15} className="mt-0.5 shrink-0" />
          <span>
            {activeMaintenance.length} catatan perawatan aktif. Unit yang dirawat tidak dihitung sebagai stok siap
            dipinjam pada katalog customer.
          </span>
        </div>
      ) : null}
    </div>
  )
}
