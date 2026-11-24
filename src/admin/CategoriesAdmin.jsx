import React, { useState } from 'react'
import { Pencil, Plus, X } from 'lucide-react'
import ProductArt, { artKinds } from '../components/ProductArt.jsx'
import { useApp } from '../lib/store.jsx'

const blank = { name: '', slug: '', description: '', art: 'instrument', order: 1, status: true }

export default function CategoriesAdmin() {
  const { categories, products, dispatch, toast, logAction } = useApp()
  const [form, setForm] = useState(null)

  const openNew = () => setForm({ ...blank, order: categories.length + 1 })
  const openEdit = (category) => setForm({ ...category })

  const set = (key) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const save = (event) => {
    event.preventDefault()
    if (!form.name.trim()) {
      toast('Nama kategori wajib diisi.', 'error')
      return
    }
    dispatch({ type: 'category/save', payload: { ...form, order: Number(form.order) || 1 } })
    logAction(form.id ? 'update' : 'create', 'category', form.id || 0, `${form.id ? 'Mengubah' : 'Menambah'} kategori ${form.name}`)
    toast(`Kategori ${form.name} disimpan.`)
    setForm(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-xl2 border border-line bg-white p-4">
        <p className="text-[12px] text-muted">
          Kategori dipakai untuk pengelompokan katalog dan filter customer.
        </p>
        <button type="button" onClick={openNew} className="btn btn-sm btn-primary">
          <Plus size={14} /> Tambah Kategori
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {categories.map((category) => (
          <div key={category.id} className="overflow-hidden rounded-xl2 border border-line bg-white">
            <div className="flex gap-3 p-4">
              <div className="h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-ink">
                <ProductArt kind={category.art} className="h-full w-full" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-extrabold">{category.name}</h3>
                  <button type="button" onClick={() => openEdit(category)} className="rounded-lg bg-purpleSoft p-1.5 text-[#6554E8]" aria-label={`Edit ${category.name}`}>
                    <Pencil size={12} />
                  </button>
                </div>
                <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-muted">{category.description}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-[10px]">
                  <span className={`badge ${category.status ? 'bg-[#E6F8EF] text-[#16834B]' : 'bg-[#FFF0F2] text-[#D34C70]'}`}>
                    {category.status ? 'Aktif' : 'Nonaktif'}
                  </span>
                  <span className="text-muted">{products.filter((p) => p.category === category.slug).length} alat</span>
                  <span className="text-muted">Urutan {category.order}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-line px-4 py-2">
              <span className="text-[10px] text-muted">/{category.slug}</span>
              <button
                type="button"
                onClick={() => {
                  dispatch({ type: 'category/toggle', payload: category.id })
                  logAction('update', 'category', category.id, `${category.status ? 'Menonaktifkan' : 'Mengaktifkan'} kategori ${category.name}`)
                  toast(`Kategori ${category.name} ${category.status ? 'dinonaktifkan' : 'diaktifkan'}.`)
                }}
                className={`text-[10px] font-bold ${category.status ? 'text-[#D34C70]' : 'text-[#16834B]'}`}
              >
                {category.status ? 'Nonaktifkan' : 'Aktifkan'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {form ? (
        <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-ink/60 p-4">
          <form onSubmit={save} className="w-full max-w-lg rounded-xl2 bg-white p-5">
            <div className="flex items-start justify-between">
              <h2 className="font-display text-lg font-bold">{form.id ? 'Edit kategori' : 'Tambah kategori'}</h2>
              <button type="button" onClick={() => setForm(null)} className="rounded-lg bg-paper p-2 text-muted" aria-label="Tutup">
                <X size={16} />
              </button>
            </div>
            <div className="mt-4 space-y-3">
              <div>
                <label className="label" htmlFor="c-name">Nama kategori *</label>
                <input id="c-name" className="input" value={form.name} onChange={set('name')} required />
              </div>
              <div>
                <label className="label" htmlFor="c-desc">Deskripsi</label>
                <textarea id="c-desc" className="input min-h-[70px]" value={form.description} onChange={set('description')} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label" htmlFor="c-art">Ilustrasi</label>
                  <select id="c-art" className="input" value={form.art} onChange={set('art')}>
                    {artKinds.map((kind) => (
                      <option key={kind} value={kind}>{kind}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label" htmlFor="c-order">Urutan</label>
                  <input id="c-order" type="number" min="1" className="input" value={form.order} onChange={set('order')} />
                </div>
              </div>
              <label className="flex items-center gap-2 rounded-lg bg-paper px-3 py-2 text-[11px] font-semibold">
                <input type="checkbox" checked={!!form.status} onChange={set('status')} /> Kategori aktif ditampilkan
              </label>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button type="button" onClick={() => setForm(null)} className="btn btn-sm btn-outline">Batal</button>
              <button type="submit" className="btn btn-sm btn-primary">Simpan</button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  )
}
