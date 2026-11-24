import React, { useMemo, useRef, useState } from 'react'
import { Boxes, ImagePlus, Pencil, Plus, Search, Trash2, X } from 'lucide-react'
import ProductArt, { artKinds } from '../components/ProductArt.jsx'
import { modelKinds } from '../lib/models3d.js'
import { useApp } from '../lib/store.jsx'
import { fileToDataUrl } from '../lib/image.js'
import { rupiah } from '../lib/format.js'

const blank = {
  name: '',
  slug: '',
  sku: '',
  category: 'laboratorium-komputer',
  brand: '',
  model: '',
  description: '',
  usage: '',
  specsText: '',
  procurementMin: '',
  procurementMax: '',
  rentalPrice: '',
  rentalUnit: 'hari',
  stockTotal: 1,
  condition: 'Baik',
  status: 'aktif',
  featured: false,
  art: 'instrument',
  model3d: 'instrument',
  terms: '',
  image: '',
}

const specsToText = (specs = []) => specs.map((spec) => `${spec.label}: ${spec.value}`).join('\n')
const textToSpecs = (text) =>
  text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label, ...rest] = line.split(':')
      return { label: label.trim(), value: rest.join(':').trim() }
    })
    .filter((spec) => spec.label && spec.value)

export default function ProductsAdmin() {
  const { products, categories, dispatch, toast, logAction, availableFor } = useApp()
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('semua')
  const [form, setForm] = useState(null)
  const [saving, setSaving] = useState(false)
  const imageInput = useRef(null)

  const filtered = useMemo(
    () =>
      products
        .filter((p) => (categoryFilter === 'semua' ? true : p.category === categoryFilter))
        .filter((p) => `${p.name} ${p.sku} ${p.brand}`.toLowerCase().includes(search.toLowerCase())),
    [products, categoryFilter, search],
  )

  const openNew = () => setForm({ ...blank })
  const openEdit = (product) =>
    setForm({
      ...product,
      specsText: specsToText(product.specs),
      procurementMin: product.procurementMin ?? '',
      procurementMax: product.procurementMax ?? '',
      terms: product.terms || '',
      image: product.image || '',
    })

  const set = (key) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const uploadImage = async (file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      toast('Berkas harus berupa gambar (JPG/PNG/WebP).', 'error')
      return
    }
    try {
      const dataUrl = await fileToDataUrl(file)
      setForm((prev) => ({ ...prev, image: dataUrl }))
      toast('Gambar produk berhasil dimuat.')
    } catch (error) {
      toast(error.message, 'error')
    }
  }

  const uploadGallery = async (files) => {
    const list = Array.from(files || []).slice(0, 3)
    if (!list.length) return
    try {
      const images = await Promise.all(
        list.map((file) => (file.type.startsWith('image/') ? fileToDataUrl(file, 600, 0.8) : Promise.reject(new Error('Berkas galeri harus berupa gambar.')))),
      )
      setForm((prev) => ({ ...prev, gallery: images }))
      toast(`${images.length} foto galeri dimuat.`)
    } catch (error) {
      toast(error.message, 'error')
    }
  }

  const uploadModel = (file) => {
    if (!file) return
    const valid = /\.(glb|gltf)$/i.test(file.name)
    if (!valid) {
      toast('Model 3D harus berformat GLB atau GLTF.', 'error')
      return
    }
    if (file.size > 15 * 1024 * 1024) {
      toast('Ukuran model maksimal 15 MB.', 'error')
      return
    }
    const url = URL.createObjectURL(file)
    setForm((prev) => ({ ...prev, customModelUrl: url, modelFileName: file.name, model3d: prev.model3d || 'instrument' }))
    toast(`Model ${file.name} dimuat. Pratinjau 3D memakai berkas ini pada sesi ini.`)
  }

  const save = (event) => {
    event.preventDefault()
    if (!form.name.trim() || !form.sku.trim()) {
      toast('Nama alat dan kode inventaris wajib diisi.', 'error')
      return
    }
    if (Number(form.rentalPrice) <= 0) {
      toast('Tarif sewa harus lebih besar dari nol.', 'error')
      return
    }
    setSaving(true)
    const payload = {
      ...form,
      specs: textToSpecs(form.specsText || ''),
      gallery: Array.isArray(form.gallery) ? form.gallery : [],
      procurementMin: Number(form.procurementMin) || 0,
      procurementMax: Number(form.procurementMax) || 0,
      rentalPrice: Number(form.rentalPrice) || 0,
      stockTotal: Math.max(0, Number(form.stockTotal) || 0),
      image: form.image || '',
    }
    delete payload.specsText
    dispatch({ type: 'product/save', payload })
    logAction(form.id ? 'update' : 'create', 'product', form.id || 0, `${form.id ? 'Mengubah' : 'Menambah'} alat ${form.name}`)
    toast(`Alat ${form.name} berhasil disimpan.`)
    setSaving(false)
    setForm(null)
  }

  const toggleStatus = (product) => {
    dispatch({ type: product.status === 'aktif' ? 'product/delete' : 'product/restore', payload: product.id })
    logAction(
      product.status === 'aktif' ? 'deactivate' : 'activate',
      'product',
      product.id,
      `${product.status === 'aktif' ? 'Menonaktifkan' : 'Mengaktifkan'} alat ${product.name}`,
    )
    toast(`Alat ${product.name} ${product.status === 'aktif' ? 'dinonaktifkan' : 'diaktifkan kembali'}.`)
  }

  const categoryName = (slug) => categories.find((c) => c.slug === slug)?.name || '-'

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-xl2 border border-line bg-white p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            className="input pl-9"
            placeholder="Cari nama alat, kode, atau merek…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Cari produk"
          />
        </div>
        <select className="input sm:w-56" value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} aria-label="Filter kategori">
          <option value="semua">Semua kategori</option>
          {categories.map((category) => (
            <option key={category.id} value={category.slug}>{category.name}</option>
          ))}
        </select>
        <button type="button" onClick={openNew} className="btn-primary btn-sm sm:w-auto">
          <Plus size={15} /> Tambah Produk
        </button>
      </div>

      <div className="rounded-xl2 border border-line bg-white p-4">
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Produk</th>
                <th>Kategori</th>
                <th>Tarif sewa</th>
                <th>Stok</th>
                <th>Kondisi</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => (
                <tr key={product.id}>
                  <td>
                    <div className="flex items-center gap-2.5">
                      <div className="h-10 w-12 shrink-0 overflow-hidden rounded-lg bg-ink">
                        {product.image ? (
                          <img src={product.image} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <ProductArt kind={product.art} className="h-full w-full" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-bold">{product.name}</p>
                        <p className="text-[10px] text-muted">{product.sku} · {product.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td>{categoryName(product.category)}</td>
                  <td className="font-semibold">{rupiah(product.rentalPrice)}<span className="text-muted">/{product.rentalUnit}</span></td>
                  <td>
                    <span className="font-semibold">{product.stockTotal}</span>
                    <span className="text-muted"> · siap {availableFor(product.id)}</span>
                  </td>
                  <td>{product.condition}</td>
                  <td>
                    <span className={`badge ${product.status === 'aktif' ? 'bg-[#E6F8EF] text-[#16834B]' : 'bg-[#FFF0F2] text-[#D34C70]'}`}>
                      {product.status}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-1.5">
                      <button type="button" onClick={() => openEdit(product)} className="rounded-lg bg-purpleSoft px-2 py-1.5 text-[10px] font-bold text-[#6554E8]">
                        <Pencil size={12} className="mr-1 inline" /> Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleStatus(product)}
                        className={`rounded-lg px-2 py-1.5 text-[10px] font-bold ${
                          product.status === 'aktif' ? 'bg-[#FFF0F2] text-[#D34C70]' : 'bg-[#E6F8EF] text-[#16834B]'
                        }`}
                      >
                        <Trash2 size={12} className="mr-1 inline" />
                        {product.status === 'aktif' ? 'Nonaktifkan' : 'Aktifkan'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!filtered.length ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-muted">Tidak ada produk yang cocok dengan pencarian.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      {form ? (
        <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-ink/60 p-4">
          <form onSubmit={save} className="my-6 w-full max-w-3xl rounded-xl2 bg-white p-5 shadow-soft">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-display text-lg font-bold">{form.id ? 'Edit produk' : 'Tambah produk baru'}</h2>
                <p className="text-[11px] text-muted">Lengkapi data alat, tarif sewa, stok, dan media.</p>
              </div>
              <button type="button" onClick={() => setForm(null)} className="rounded-lg bg-paper p-2 text-muted" aria-label="Tutup">
                <X size={16} />
              </button>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div>
                <label className="label" htmlFor="p-name">Nama alat *</label>
                <input id="p-name" className="input" value={form.name} onChange={set('name')} required />
              </div>
              <div>
                <label className="label" htmlFor="p-sku">Kode inventaris *</label>
                <input id="p-sku" className="input" value={form.sku} onChange={set('sku')} placeholder="OSC-DIG-017" required />
              </div>
              <div>
                <label className="label" htmlFor="p-category">Kategori</label>
                <select id="p-category" className="input" value={form.category} onChange={set('category')}>
                  {categories.map((category) => (
                    <option key={category.id} value={category.slug}>{category.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label" htmlFor="p-brand">Merek</label>
                <input id="p-brand" className="input" value={form.brand} onChange={set('brand')} />
              </div>
              <div>
                <label className="label" htmlFor="p-model">Model</label>
                <input id="p-model" className="input" value={form.model} onChange={set('model')} />
              </div>
              <div>
                <label className="label" htmlFor="p-condition">Kondisi</label>
                <select id="p-condition" className="input" value={form.condition} onChange={set('condition')}>
                  <option>Baik</option>
                  <option>Sangat baik</option>
                  <option>Perlu perawatan</option>
                  <option>Rusak ringan</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="label" htmlFor="p-description">Deskripsi</label>
                <textarea id="p-description" className="input min-h-[64px]" value={form.description} onChange={set('description')} />
              </div>
              <div className="sm:col-span-2">
                <label className="label" htmlFor="p-usage">Fungsi alat</label>
                <textarea id="p-usage" className="input min-h-[56px]" value={form.usage} onChange={set('usage')} />
              </div>
              <div className="sm:col-span-2">
                <label className="label" htmlFor="p-specs">Spesifikasi teknis (satu per baris, format Label: Nilai)</label>
                <textarea
                  id="p-specs"
                  className="input min-h-[90px] font-mono text-[11px]"
                  value={form.specsText}
                  onChange={set('specsText')}
                  placeholder={'Bandwidth: 200 MHz\nKanal: 4 kanal analog'}
                />
              </div>

              <div>
                <label className="label" htmlFor="p-price">Tarif sewa (Rp) *</label>
                <input id="p-price" type="number" min="0" step="1000" className="input" value={form.rentalPrice} onChange={set('rentalPrice')} required />
              </div>
              <div>
                <label className="label" htmlFor="p-unit">Satuan sewa</label>
                <select id="p-unit" className="input" value={form.rentalUnit} onChange={set('rentalUnit')}>
                  <option value="hari">per hari</option>
                  <option value="sesi">per sesi</option>
                  <option value="minggu">per minggu</option>
                </select>
              </div>
              <div>
                <label className="label" htmlFor="p-stock">Stok total</label>
                <input id="p-stock" type="number" min="0" className="input" value={form.stockTotal} onChange={set('stockTotal')} />
              </div>
              <div>
                <label className="label" htmlFor="p-status">Status publikasi</label>
                <select id="p-status" className="input" value={form.status} onChange={set('status')}>
                  <option value="aktif">Aktif</option>
                  <option value="nonaktif">Nonaktif</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
              <div>
                <label className="label" htmlFor="p-procmin">Harga pengadaan minimum (Rp)</label>
                <input id="p-procmin" type="number" min="0" className="input" value={form.procurementMin} onChange={set('procurementMin')} />
              </div>
              <div>
                <label className="label" htmlFor="p-procmax">Harga pengadaan maksimum (Rp)</label>
                <input id="p-procmax" type="number" min="0" className="input" value={form.procurementMax} onChange={set('procurementMax')} />
              </div>

              <div>
                <label className="label" htmlFor="p-art">Ilustrasi produk</label>
                <select id="p-art" className="input" value={form.art} onChange={(event) => setForm((prev) => ({ ...prev, art: event.target.value }))}>
                  {artKinds.map((kind) => (
                    <option key={kind} value={kind}>{kind}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label" htmlFor="p-model3d">Jenis model 3D</label>
                <select id="p-model3d" className="input" value={form.model3d || ''} onChange={(event) => setForm((prev) => ({ ...prev, model3d: event.target.value }))}>
                  <option value="">Tanpa model 3D</option>
                  {modelKinds.map((kind) => (
                    <option key={kind} value={kind}>{kind}</option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="label" htmlFor="p-terms">Ketentuan penggunaan</label>
                <textarea id="p-terms" className="input min-h-[56px]" value={form.terms} onChange={set('terms')} />
              </div>

              <div className="sm:col-span-2 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-line p-3">
                  <span className="label">Foto produk</span>
                  <div className="flex items-center gap-3">
                    <div className="h-16 w-24 overflow-hidden rounded-lg bg-ink">
                      {form.image ? (
                        <img src={form.image} alt="Pratinjau" className="h-full w-full object-cover" />
                      ) : (
                        <ProductArt kind={form.art} className="h-full w-full" />
                      )}
                    </div>
                    <div>
                      <input ref={imageInput} type="file" accept="image/*" className="hidden" onChange={(event) => uploadImage(event.target.files?.[0])} />
                      <button type="button" onClick={() => imageInput.current?.click()} className="btn btn-sm btn-soft">
                        <ImagePlus size={13} /> Unggah gambar
                      </button>
                      {form.image ? (
                        <button type="button" onClick={() => setForm((prev) => ({ ...prev, image: '' }))} className="mt-1 block text-[10px] font-bold text-[#D34C70]">
                          Hapus gambar
                        </button>
                      ) : null}
                    </div>
                  </div>
                  <div className="mt-3 border-t border-line pt-3">
                    <span className="label">Galeri foto (maks. 3)</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="w-full text-[11px]"
                      onChange={(event) => uploadGallery(event.target.files)}
                    />
                    {Array.isArray(form.gallery) && form.gallery.length ? (
                      <div className="mt-2 flex items-center gap-2">
                        {form.gallery.map((src, index) => (
                          <div key={index} className="relative h-12 w-16 overflow-hidden rounded-md">
                            <img src={src} alt={`Galeri ${index + 1}`} className="h-full w-full object-cover" />
                          </div>
                        ))}
                        <button type="button" onClick={() => setForm((prev) => ({ ...prev, gallery: [] }))} className="text-[10px] font-bold text-[#D34C70]">
                          Hapus galeri
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="rounded-xl border border-line p-3">
                  <span className="label">Model 3D (GLB / GLTF)</span>
                  <input
                    type="file"
                    accept=".glb,.gltf,model/gltf-binary,model/gltf+json"
                    className="w-full text-[11px]"
                    onChange={(event) => uploadModel(event.target.files?.[0])}
                  />
                  <p className="mt-1 text-[10px] leading-relaxed text-muted">
                    {form.modelFileName
                      ? `Berkas aktif: ${form.modelFileName}`
                      : 'Tanpa berkas, viewer memakai model prosedural bawaan.'}
                  </p>
                </div>
              </div>

              <label className="sm:col-span-2 flex items-center gap-2 rounded-xl bg-paper px-3 py-2.5 text-[11px] font-semibold">
                <input type="checkbox" checked={!!form.featured} onChange={set('featured')} />
                Tampilkan sebagai produk unggulan di beranda
              </label>
            </div>

            <div className="mt-4 flex flex-wrap justify-end gap-2">
              <button type="button" onClick={() => setForm(null)} className="btn btn-sm btn-outline">Batal</button>
              <button type="submit" className="btn btn-sm btn-primary" disabled={saving}>
                <Boxes size={13} /> Simpan produk
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  )
}
