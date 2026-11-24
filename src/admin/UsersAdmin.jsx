import React, { useState } from 'react'
import { Pencil, Plus, ShieldCheck, X } from 'lucide-react'
import { useApp } from '../lib/store.jsx'

const blank = { name: '', username: '', password: '', role: 'admin', status: true }

export default function UsersAdmin() {
  const { adminUsers, session, dispatch, toast, logAction } = useApp()
  const [form, setForm] = useState(null)

  const set = (key) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const save = (event) => {
    event.preventDefault()
    if (!form.name.trim() || !form.username.trim() || !form.password.trim()) {
      toast('Nama, username, dan password wajib diisi.', 'error')
      return
    }
    const duplicate = adminUsers.find(
      (user) => user.username.toLowerCase() === form.username.trim().toLowerCase() && user.id !== form.id,
    )
    if (duplicate) {
      toast('Username sudah dipakai akun lain.', 'error')
      return
    }
    dispatch({ type: 'admin/save', payload: form })
    logAction(form.id ? 'update' : 'create', 'user', form.id || 0, `${form.id ? 'Mengubah' : 'Membuat'} akun admin ${form.username}`)
    toast(`Akun ${form.username} disimpan.`)
    setForm(null)
  }

  const toggle = (user) => {
    if (user.username === session.username) {
      toast('Tidak dapat menonaktifkan akun yang sedang dipakai.', 'error')
      return
    }
    dispatch({ type: 'admin/toggle', payload: user.id })
    logAction('update', 'user', user.id, `${user.status ? 'Menonaktifkan' : 'Mengaktifkan'} akun ${user.username}`)
    toast(`Akun ${user.username} ${user.status ? 'dinonaktifkan' : 'diaktifkan'}.`)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl2 border border-line bg-white p-4">
        <p className="flex items-center gap-2 text-[11px] text-muted">
          <ShieldCheck size={14} className="text-purple" />
          Hanya superadmin yang dapat mengelola akun admin.
        </p>
        <button type="button" onClick={() => setForm({ ...blank })} className="btn btn-sm btn-primary">
          <Plus size={14} /> Buat akun admin
        </button>
      </div>

      <div className="rounded-xl2 border border-line bg-white p-4">
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Nama</th>
                <th>Username</th>
                <th>Role</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {adminUsers.map((user) => (
                <tr key={user.id}>
                  <td className="font-semibold">{user.name}</td>
                  <td>{user.username}</td>
                  <td>
                    <span className={`badge ${user.role === 'superadmin' ? 'bg-purpleSoft text-[#6554E8]' : 'bg-paper text-muted'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${user.status ? 'bg-[#E6F8EF] text-[#16834B]' : 'bg-[#FFF0F2] text-[#D34C70]'}`}>
                      {user.status ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-1.5">
                      <button type="button" onClick={() => setForm({ ...user })} className="rounded-lg bg-purpleSoft px-2 py-1.5 text-[10px] font-bold text-[#6554E8]">
                        <Pencil size={11} className="mr-1 inline" /> Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => toggle(user)}
                        className={`rounded-lg px-2 py-1.5 text-[10px] font-bold ${user.status ? 'bg-[#FFF0F2] text-[#D34C70]' : 'bg-[#E6F8EF] text-[#16834B]'}`}
                      >
                        {user.status ? 'Nonaktifkan' : 'Aktifkan'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-xl2 border border-line bg-white p-4 text-[11px] leading-relaxed text-muted">
        Password akun demo disimpan sebagai teks di localStorage karena ini prototipe frontend. Pada versi
        produksi gunakan hashing (bcrypt/Argon2) di backend, autentikasi sesi/token, dan pembatasan percobaan
        login pada sisi server.
      </div>

      {form ? (
        <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-ink/60 p-4">
          <form onSubmit={save} className="w-full max-w-md rounded-xl2 bg-white p-5">
            <div className="flex items-start justify-between">
              <h2 className="font-display text-lg font-bold">{form.id ? 'Edit akun admin' : 'Akun admin baru'}</h2>
              <button type="button" onClick={() => setForm(null)} className="rounded-lg bg-paper p-2 text-muted" aria-label="Tutup">
                <X size={16} />
              </button>
            </div>
            <div className="mt-4 space-y-3">
              <div>
                <label className="label" htmlFor="u-name">Nama lengkap</label>
                <input id="u-name" className="input" value={form.name} onChange={set('name')} />
              </div>
              <div>
                <label className="label" htmlFor="u-username">Username</label>
                <input id="u-username" className="input" value={form.username} onChange={set('username')} />
              </div>
              <div>
                <label className="label" htmlFor="u-password">Password</label>
                <input id="u-password" className="input" value={form.password} onChange={set('password')} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label" htmlFor="u-role">Role</label>
                  <select id="u-role" className="input" value={form.role} onChange={set('role')}>
                    <option value="admin">admin</option>
                    <option value="superadmin">superadmin</option>
                  </select>
                </div>
                <label className="flex items-end gap-2 pb-2 text-[11px] font-semibold">
                  <input type="checkbox" checked={!!form.status} onChange={set('status')} /> Aktif
                </label>
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button type="button" onClick={() => setForm(null)} className="btn btn-sm btn-outline">Batal</button>
              <button type="submit" className="btn btn-sm btn-primary">Simpan akun</button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  )
}
