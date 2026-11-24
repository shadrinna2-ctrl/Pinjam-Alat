export const rupiah = (value) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(Number(value) || 0)

export const rupiahShort = (value) => {
  const n = Number(value) || 0
  if (n >= 1_000_000_000) return `Rp${(n / 1_000_000_000).toFixed(1)} M`
  if (n >= 1_000_000) return `Rp${Math.round(n / 1_000_000)} jt`
  if (n >= 1_000) return `Rp${Math.round(n / 1_000)} rb`
  return `Rp${n}`
}

export const todayISO = () => new Date().toISOString().slice(0, 10)

export const addDaysISO = (iso, days) => {
  const d = new Date(`${iso}T00:00:00`)
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

/** Lama sewa inklusif: tanggal mulai dan selesai sama-sama dihitung. */
export const rentalDays = (start, end) => {
  if (!start || !end) return 0
  const a = new Date(`${start}T00:00:00`)
  const b = new Date(`${end}T00:00:00`)
  const diff = Math.round((b - a) / 86_400_000)
  return diff < 0 ? 0 : diff + 1
}

export const formatDate = (iso, opts = {}) => {
  if (!iso) return '-'
  const d = new Date(`${iso}T00:00:00`)
  if (Number.isNaN(d.getTime())) return '-'
  return d.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    ...opts,
  })
}

export const rangesOverlap = (aStart, aEnd, bStart, bEnd) =>
  aStart <= bEnd && bStart <= aEnd

export const slugify = (text) =>
  String(text)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')

export const initials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('')

export const orderCode = (date = new Date()) => {
  const stamp = date.toISOString().slice(2, 10).replace(/-/g, '')
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `PA-${stamp}-${rand}`
}

export const whatsappLink = (number, message) =>
  `https://wa.me/${String(number).replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
