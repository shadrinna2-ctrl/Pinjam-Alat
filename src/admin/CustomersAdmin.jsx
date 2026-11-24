import React, { useState } from 'react'
import { ChevronDown, MessageCircle, Search } from 'lucide-react'
import { useApp, STATUS_META } from '../lib/store.jsx'
import { formatDate, rupiah, whatsappLink } from '../lib/format.js'

export default function CustomersAdmin() {
  const { customers } = useApp()
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState(null)

  const filtered = customers.filter((customer) =>
    `${customer.name} ${customer.phone} ${customer.email}`.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-xl2 border border-line bg-white p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            className="input pl-9"
            placeholder="Cari nama, WhatsApp, atau email pelanggan…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Cari pelanggan"
          />
        </div>
        <span className="text-[11px] text-muted">{filtered.length} pelanggan</span>
      </div>

      <div className="rounded-xl2 border border-line bg-white p-4">
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Pelanggan</th>
                <th>Kontak</th>
                <th>Jumlah pesanan</th>
                <th>Total transaksi</th>
                <th>Status terakhir</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((customer) => (
                <React.Fragment key={customer.phone}>
                  <tr>
                    <td>
                      <p className="font-bold">{customer.name}</p>
                      <p className="text-[10px] text-muted">{customer.address || '-'}</p>
                    </td>
                    <td>
                      <p className="text-[11px] font-semibold">{customer.phone}</p>
                      <p className="text-[10px] text-muted">{customer.email || '-'}</p>
                    </td>
                    <td className="font-semibold">{customer.orderCount}</td>
                    <td className="font-semibold">{rupiah(customer.totalSpent)}</td>
                    <td>
                      <span className={`badge ${STATUS_META[customer.lastStatus].className}`}>
                        {STATUS_META[customer.lastStatus].label}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-1.5">
                        <button
                          type="button"
                          onClick={() => setExpanded(expanded === customer.phone ? null : customer.phone)}
                          className="rounded-lg bg-purpleSoft px-2 py-1.5 text-[10px] font-bold text-[#6554E8]"
                        >
                          Riwayat <ChevronDown size={11} className="ml-0.5 inline" />
                        </button>
                        <a
                          href={whatsappLink(customer.phone, `Halo ${customer.name}, dari PinjamAlat.`)}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-lg border border-line px-2 py-1.5 text-[10px] font-bold text-muted"
                        >
                          <MessageCircle size={11} className="mr-0.5 inline" /> Chat
                        </a>
                      </div>
                    </td>
                  </tr>
                  {expanded === customer.phone ? (
                    <tr>
                      <td colSpan={6} className="bg-paper">
                        <div className="space-y-2 py-1">
                          {customer.orders.map((order) => (
                            <div key={order.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-white px-3 py-2 text-[11px]">
                              <div>
                                <b>{order.code}</b>
                                <span className="text-muted"> · {order.items.map((item) => `${item.name} ×${item.qty}`).join(', ')}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-muted">{formatDate(order.startDate)}</span>
                                <span className="font-semibold">{rupiah(order.total)}</span>
                                <span className={`badge ${STATUS_META[order.status].className}`}>{STATUS_META[order.status].label}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ) : null}
                </React.Fragment>
              ))}
              {!filtered.length ? (
                <tr><td colSpan={6} className="py-8 text-center text-muted">Belum ada data pelanggan.</td></tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
