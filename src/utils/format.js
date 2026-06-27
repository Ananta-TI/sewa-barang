export const formatCurrency = (value = 0) => new Intl.NumberFormat('id-ID', {
  style: 'currency', currency: 'IDR', maximumFractionDigits: 0,
}).format(Number(value) || 0)

export const formatDate = (value) => value ? new Intl.DateTimeFormat('id-ID', {
  day: '2-digit', month: 'long', year: 'numeric',
}).format(new Date(value)) : '-'

export const formatDateTime = (value) => value ? new Intl.DateTimeFormat('id-ID', {
  day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
}).format(new Date(value)) : '-'

export const slugify = (text = '') => text.toLowerCase().trim()
  .replace(/[^a-z0-9\s-]/g, '')
  .replace(/\s+/g, '-')
  .replace(/-+/g, '-')

export const daysBetween = (start, end) => {
  if (!start || !end) return 1
  const a = new Date(`${start}T00:00:00`)
  const b = new Date(`${end}T00:00:00`)
  return Math.max(1, Math.round((b - a) / 86400000) + 1)
}

export const haversineKm = (lat1, lon1, lat2, lon2) => {
  if ([lat1, lon1, lat2, lon2].some((v) => typeof v !== 'number')) return null
  const toRad = (deg) => deg * Math.PI / 180
  const r = 6371
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2
  return r * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export const statusLabel = (status = '') => ({
  menunggu: 'Menunggu', diterima: 'Diterima', ditolak: 'Ditolak', selesai: 'Selesai', dibatalkan: 'Dibatalkan',
  aktif: 'Aktif', diblokir: 'Diblokir', tersedia: 'Tersedia', disewa: 'Disewa', tidak_tersedia: 'Tidak tersedia',
  belum_dibayar: 'Belum dibayar', berhasil: 'Berhasil', gagal: 'Gagal', diproses: 'Diproses',
  belum_diambil: 'Belum diambil', sudah_diambil: 'Sudah diambil', belum_dikembalikan: 'Belum dikembalikan', sudah_dikembalikan: 'Sudah dikembalikan',
}[status] || status.replaceAll('_', ' '))
