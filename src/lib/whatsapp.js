import { formatDate, rupiah, whatsappLink } from './format.js'

export function buildOrderMessage(order, settings) {
  const lines = [
    `Halo Admin ${settings.websiteName}, saya ingin mengajukan peminjaman alat.`,
    '',
    `Kode pesanan: ${order.code}`,
    `Nama peminjam: ${order.customer.name}`,
    `Nomor WhatsApp: ${order.customer.phone}`,
    `Email: ${order.customer.email || '-'}`,
    `Lokasi/alamat: ${order.customer.address || '-'}`,
    '',
    'Daftar alat:',
    ...order.items.map(
      (item, index) =>
        `${index + 1}. ${item.name} (${item.sku}) — ${item.qty} unit × ${item.days} hari = ${rupiah(item.subtotal)}`,
    ),
    '',
    `Tanggal peminjaman: ${formatDate(order.startDate)} s/d ${formatDate(order.endDate)} (${order.days} hari)`,
    `Estimasi biaya: ${rupiah(order.total)}`,
    `Tujuan peminjaman: ${order.purpose || '-'}`,
    `Catatan: ${order.notes || '-'}`,
    '',
    'Mohon konfirmasi ketersediaan alat. Terima kasih.',
  ]
  return lines.join('\n')
}

export function orderWhatsappLink(order, settings) {
  return whatsappLink(settings.whatsappNumber, buildOrderMessage(order, settings))
}
