import React, { useRef, useState } from 'react'
import { ImagePlus, RotateCcw, Save } from 'lucide-react'
import { useApp } from '../lib/store.jsx'
import { fileToDataUrl } from '../lib/image.js'

export default function SettingsAdmin() {
  const { settings, dispatch, toast, logAction, resetDemo } = useApp()
  const [form, setForm] = useState({ ...settings })
  const logoInput = useRef(null)

  const set = (key) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const uploadLogo = async (file) => {
    if (!file) return
    try {
      const dataUrl = await fileToDataUrl(file, 240, 0.9)
      setForm((prev) => ({ ...prev, websiteLogo: dataUrl }))
      toast('Logo dimuat. Simpan pengaturan untuk menerapkan.')
    } catch (error) {
      toast(error.message, 'error')
    }
  }

  const save = (event) => {
    event.preventDefault()
    if (!form.websiteName.trim()) {
      toast('Nama aplikasi wajib diisi.', 'error')
      return
    }
    dispatch({ type: 'settings/save', payload: form })
    logAction('update', 'settings', 0, 'Mengubah pengaturan website')
    toast('Pengaturan website disimpan.')
  }

  return (
    <form onSubmit={save} className="grid gap-4 lg:grid-cols-[1.4fr_0.6fr]">
      <div className="space-y-4">
        <section className="rounded-xl2 border border-line bg-white p-4">
          <h2 className="font-display text-base font-bold">Identitas website</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="s-name">Nama aplikasi</label>
              <input id="s-name" className="input" value={form.websiteName} onChange={set('websiteName')} />
            </div>
            <div>
              <label className="label" htmlFor="s-tagline">Tagline</label>
              <input id="s-tagline" className="input" value={form.tagline} onChange={set('tagline')} />
            </div>
            <div className="sm:col-span-2">
              <label className="label" htmlFor="s-hero">Judul banner beranda</label>
              <input id="s-hero" className="input" value={form.heroTitle} onChange={set('heroTitle')} />
            </div>
            <div className="sm:col-span-2">
              <label className="label" htmlFor="s-herosub">Deskripsi banner beranda</label>
              <textarea id="s-herosub" className="input min-h-[64px]" value={form.heroSubtitle} onChange={set('heroSubtitle')} />
            </div>
            <div className="sm:col-span-2 flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center overflow-hidden rounded-xl bg-ink">
                {form.websiteLogo ? (
                  <img src={form.websiteLogo} alt="Logo" className="h-full w-full object-cover" />
                ) : (
                  <span className="font-display text-xs font-bold text-white">PA</span>
                )}
              </div>
              <div>
                <input ref={logoInput} type="file" accept="image/*" className="hidden" onChange={(event) => uploadLogo(event.target.files?.[0])} />
                <button type="button" onClick={() => logoInput.current?.click()} className="btn btn-sm btn-soft">
                  <ImagePlus size={13} /> Unggah logo
                </button>
                {form.websiteLogo ? (
                  <button type="button" onClick={() => setForm((prev) => ({ ...prev, websiteLogo: '' }))} className="ml-2 text-[10px] font-bold text-[#D34C70]">
                    Hapus logo
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-xl2 border border-line bg-white p-4">
          <h2 className="font-display text-base font-bold">Kontak & lokasi</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="s-wa">Nomor WhatsApp admin</label>
              <input id="s-wa" className="input" value={form.whatsappNumber} onChange={set('whatsappNumber')} placeholder="6281234567890" />
              <p className="mt-1 text-[10px] text-muted">Format internasional tanpa tanda +, contoh 62812xxxxxxx.</p>
            </div>
            <div>
              <label className="label" htmlFor="s-ig">Link Instagram</label>
              <input id="s-ig" className="input" value={form.instagramUrl} onChange={set('instagramUrl')} placeholder="https://instagram.com/akun" />
            </div>
            <div>
              <label className="label" htmlFor="s-email">Email kontak</label>
              <input id="s-email" className="input" value={form.contactEmail} onChange={set('contactEmail')} />
            </div>
            <div>
              <label className="label" htmlFor="s-hours">Jam operasional</label>
              <input id="s-hours" className="input" value={form.openingHours} onChange={set('openingHours')} />
            </div>
            <div className="sm:col-span-2">
              <label className="label" htmlFor="s-address">Alamat pengelola</label>
              <textarea id="s-address" className="input min-h-[56px]" value={form.businessAddress} onChange={set('businessAddress')} />
            </div>
          </div>
        </section>

        <section className="rounded-xl2 border border-line bg-white p-4">
          <h2 className="font-display text-base font-bold">Ketentuan & tampilan</h2>
          <div className="mt-3">
            <label className="label" htmlFor="s-terms">Ketentuan peminjaman</label>
            <textarea id="s-terms" className="input min-h-[90px]" value={form.terms} onChange={set('terms')} />
          </div>
          <label className="mt-3 flex items-center gap-2 rounded-xl bg-paper px-3 py-2.5 text-[11px] font-semibold">
            <input type="checkbox" checked={!!form.showProcurement} onChange={set('showProcurement')} />
            Tampilkan kisaran harga pengadaan pada halaman detail alat
          </label>
        </section>

        <div className="flex justify-end">
          <button type="submit" className="btn-primary btn-sm">
            <Save size={14} /> Simpan pengaturan
          </button>
        </div>
      </div>

      <aside className="space-y-4">
        <div className="rounded-xl2 border border-line bg-white p-4">
          <h2 className="font-display text-base font-bold">Pratinjau hero</h2>
          <div className="mt-3 rounded-xl bg-[radial-gradient(circle_at_70%_20%,rgba(183,170,255,0.55),transparent_45%),#F4F2FF] p-4">
            <span className="text-[9px] font-extrabold uppercase tracking-widest text-purple">Laboratorium Terpadu</span>
            <p className="mt-1.5 font-display text-sm font-bold leading-snug">{form.heroTitle}</p>
            <p className="mt-1 line-clamp-3 text-[10px] leading-relaxed text-muted">{form.heroSubtitle}</p>
          </div>
        </div>

        <div className="rounded-xl2 border border-line bg-white p-4">
          <h2 className="font-display text-base font-bold">Data demo</h2>
          <p className="mt-1.5 text-[11px] leading-relaxed text-muted">
            Versi ini menyimpan data di localStorage peramban. Mengembalikan data demo akan menghapus seluruh
            perubahan produk, pesanan, dan pengaturan yang dibuat.
          </p>
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Kembalikan seluruh data ke kondisi demo awal?')) resetDemo()
            }}
            className="btn btn-sm btn-outline mt-3 w-full"
          >
            <RotateCcw size={13} /> Kembalikan data demo
          </button>
        </div>

        <div className="rounded-xl2 border border-[#E4E1FF] bg-purpleSoft p-4 text-[11px] leading-relaxed text-[#5B49E0]">
          <b>Catatan produksi:</b> untuk versi daring, pindahkan pengaturan, produk, dan pesanan ke database
          server (MySQL/Laravel) agar dapat diakses admin dari perangkat berbeda, serta hash password dan gunakan
          HTTPS.
        </div>
      </aside>
    </form>
  )
}
