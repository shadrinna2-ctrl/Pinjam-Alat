import React from 'react'
import { useApp } from '../lib/store.jsx'

export default function LogsAdmin() {
  const { logs } = useApp()

  return (
    <div className="rounded-xl2 border border-line bg-white p-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-base font-bold">Log aktivitas admin</h2>
        <span className="text-[10px] text-muted">{logs.length} catatan terakhir</span>
      </div>
      <div className="table-wrap mt-3">
        <table className="data-table">
          <thead>
            <tr>
              <th>Waktu</th>
              <th>Admin</th>
              <th>Aksi</th>
              <th>Entitas</th>
              <th>Keterangan</th>
              <th>IP</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id}>
                <td className="whitespace-nowrap text-[11px]">{new Date(log.createdAt).toLocaleString('id-ID')}</td>
                <td className="font-semibold">{log.userId}</td>
                <td>
                  <span className="badge bg-purpleSoft text-[#6554E8]">{log.action}</span>
                </td>
                <td className="text-[11px] text-muted">
                  {log.entityType}#{log.entityId}
                </td>
                <td className="max-w-[320px] text-[11px]">{log.description}</td>
                <td className="text-[11px] text-muted">{log.ip}</td>
              </tr>
            ))}
            {!logs.length ? (
              <tr><td colSpan={6} className="py-8 text-center text-muted">Belum ada aktivitas tercatat.</td></tr>
            ) : null}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-[10px] leading-relaxed text-muted">
        Pada versi produksi, log aktivitas disimpan di tabel <code>activity_logs</code> pada database server
        sehingga tidak dapat diubah dari peramban.
      </p>
    </div>
  )
}
