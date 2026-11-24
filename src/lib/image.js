/** Kompres gambar unggahan admin agar tidak memenuhi kuota localStorage. */
export function fileToDataUrl(file, maxSize = 900, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Gagal membaca berkas gambar.'))
    reader.onload = () => {
      const img = new Image()
      img.onerror = () => reject(new Error('Berkas bukan gambar yang valid.'))
      img.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height))
        const canvas = document.createElement('canvas')
        canvas.width = Math.round(img.width * scale)
        canvas.height = Math.round(img.height * scale)
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/jpeg', quality))
      }
      img.src = reader.result
    }
    reader.readAsDataURL(file)
  })
}

export function downloadCsv(filename, headers, rows) {
  const escape = (value) => {
    const text = String(value ?? '')
    return /[",\n;]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
  }
  const csv = [headers.map(escape).join(';'), ...rows.map((row) => row.map(escape).join(';'))].join('\n')
  const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
