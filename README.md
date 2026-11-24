# PinjamAlat

Platform penyewaan dan peminjaman alat praktikum laboratorium berbasis website dengan visualisasi 3D.
Dibangun dengan React + Vite + Tailwind CSS dan Three.js.

## Menjalankan aplikasi

```bash
npm install
npm run dev
```

Vite menampilkan alamat lokal (umumnya http://localhost:5173). Build produksi:

```bash
npm run build
npm run preview
```

## Akun demo admin

| Peran | Username | Password |
| --- | --- | --- |
| Admin | `admin` | `PinjamAlat2026!` |
| Superadmin | `superadmin` | `SuperAdmin2026!` |

Dashboard admin dibuka melalui tautan **Login Admin** di bagian atas website atau alamat `#/admin`.
Login dibatasi 5 percobaan per menit (lockout 60 detik).

## Fitur

**Customer**
- Beranda dengan hero, kategori, alat unggulan, cara peminjaman, dan informasi layanan.
- Katalog 28 alat dari 4 kategori laboratorium: pencarian, filter kategori, dan pengurutan.
- Halaman detail: foto/ilustrasi, deskripsi, fungsi, spesifikasi teknis, kondisi, stok,
  harga pengadaan (dapat disembunyikan admin), tarif sewa, dan ketentuan penggunaan.
- Viewer 3D interaktif (Three.js + OrbitControls): drag/geser untuk memutar, scroll/pinch untuk zoom,
  tombol reset, pause, zoom in/out. Bila model tidak tersedia, sistem menampilkan ilustrasi produk.
- Keranjang: ubah jumlah, hapus item, atur tanggal sewa, estimasi biaya, dan pemeriksaan stok per tanggal.
- Checkout: data peminjam, periode, tujuan, catatan, persetujuan ketentuan, pembuatan kode pesanan,
  serta tautan WhatsApp berisi ringkasan pesanan (pesan tetap dikirim manual dari aplikasi WhatsApp).
- Status pesanan: cek dengan kode pesanan + nomor WhatsApp, lengkap dengan linimasa status.

**Admin**
- Login/logout, dashboard statistik (alat, stok, pesanan per status, pendapatan, grafik 6 bulan,
  alat terlaris, stok kritis, aktivitas terbaru).
- CRUD produk (termasuk unggah gambar, unggah model GLB/GLTF, harga pengadaan terpisah dari tarif sewa,
  stok, kondisi, status publikasi, unggulan, ilustrasi, jenis model 3D).
- Manajemen kategori, pesanan (ubah status + catatan, validasi stok saat konfirmasi), pelanggan,
  perawatan alat, laporan dengan ekspor CSV, dan pengaturan website (identitas, WhatsApp, Instagram,
  alamat, jam operasional, ketentuan, tampil/tidaknya harga pengadaan).
- Superadmin: kelola akun admin dan melihat log aktivitas.

## Aturan bisnis

- `Subtotal = tarif harian × jumlah × hari`.
- `Hari sewa = (tanggal selesai − tanggal mulai) + 1` (kedua tanggal dihitung).
- Stok tersedia = stok total − unit pada pesanan **dikonfirmasi/dipinjam** yang tanggalnya beririsan
  − unit yang sedang **dirawat**. Pesanan tidak dapat dikonfirmasi bila stok tidak mencukupi.
- Harga pengadaan hanya referensi inventaris dan tidak pernah dipakai sebagai tarif sewa.
- Snapshot nama, harga, dan lama sewa disimpan pada item pesanan agar perubahan produk tidak
  mengubah transaksi lama.

## Struktur proyek

```
src/
  data/catalog.js        # 4 kategori + 28 alat + pengaturan & akun demo
  lib/store.jsx          # state (localStorage), harga, ketersediaan stok, pesanan, auth admin
  lib/models3d.js        # model 3D prosedural per jenis alat (Three.js)
  lib/format.js          # Rupiah, tanggal, lama sewa, kode pesanan
  lib/whatsapp.js        # penyusunan pesan ringkasan pesanan
  components/            # header, footer, kartu produk, viewer 3D, ilustrasi SVG
  pages/                 # beranda, katalog, kategori, detail, keranjang, checkout, status, tentang, kontak
  admin/                 # login, layout, dashboard, produk, kategori, pesanan, pelanggan,
                         # perawatan, laporan, pengaturan, akun admin, log aktivitas
```

## Catatan status implementasi

Ini adalah prototipe frontend interaktif: seluruh data (produk, pesanan, pengaturan, akun demo)
disimpan di `localStorage` peramban sehingga reset saat penyimpanan dibersihkan atau dibuka di perangkat
lain. Untuk produksi, pindahkan data dan autentikasi ke backend (Laravel + MySQL sesuai PRD), hash password
di server, lindungi endpoint admin dengan role-based authorization, simpan media di storage server, dan
gunakan HTTPS. Pembayaran online, invoice PDF, dan notifikasi WhatsApp otomatis belum termasuk versi ini.

## Asumsi data

- 20 alat baru mengikuti daftar PRD; 8 alat katalog awal (laptop, proyektor, kamera DSLR, tripod,
  mikrofon, ring light, speaker, webcam) dipertahankan dan ditempatkan pada kategori Laboratorium Komputer
  sebagai perlengkapan multimedia pendukung praktikum, sehingga total 28 alat.
- Tarif sewa, merek/model, spesifikasi, dan stok merupakan data contoh yang dapat diubah admin.
  Harga pengadaan memakai kisaran pada PRD.
