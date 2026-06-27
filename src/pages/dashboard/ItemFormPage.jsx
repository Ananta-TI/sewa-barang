import { Image as ImageIcon, Link2, Save, UploadCloud } from 'lucide-react'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import LocationPicker from '../../components/LocationPicker'
import PageHeader from '../../components/PageHeader'
import { useDemo } from '../../contexts/DemoContext'
import { DEFAULT_LOCATION } from '../../data/locations'

const DEFAULT_IMAGE = '/items/default.svg'
const LOCAL_IMAGE_OPTIONS = [
  { label: 'Kamera Sony A6400 + Kit Lens', value: '/items/kamera-sony-a6400-kit-lens.jpg' },
  { label: 'Proyektor Epson 4000 Lumens', value: '/items/proyektor-epson-4000-lumens.jpg' },
  { label: 'Paket Camping 4 Orang Lengkap', value: '/items/paket-camping-4-orang-lengkap.jpg' },
  { label: 'PlayStation 5 + 2 Controller', value: '/items/playstation-5-2-controller.jpg' },
  { label: 'Mesin Bor Bosch 13 mm', value: '/items/mesin-bor-bosch-13-mm.jpg' },
  { label: 'Sound System 1000 Watt', value: '/items/sound-system-1000-watt.jpg' },
  { label: 'Jas Pria Formal Hitam', value: '/items/jas-pria-formal-hitam.jpg' },
  { label: 'Sepeda Gunung Polygon', value: '/items/sepeda-gunung-polygon.jpg' },
  { label: 'Laptop ASUS VivoBook i5', value: '/items/laptop-asus-vivobook-i5.jpg' },
  { label: 'Tripod Video Profesional', value: '/items/tripod-video-profesional.jpg' },
  { label: 'Lensa Sigma 30mm', value: '/items/lensa-sigma-30mm.jpg' },
  { label: 'Paket Dekorasi Ulang Tahun Anak', value: '/items/paket-dekorasi-ulang-tahun-anak.jpg' },
  { label: 'Printer Canon Ink Tank Warna', value: '/items/printer-canon-ink-tank-warna.jpg' },
  { label: 'Carrier Eiger 60L + Rain Cover', value: '/items/carrier-eiger-60l-rain-cover.jpg' },
  { label: 'Meja Lipat Event 120 cm', value: '/items/meja-lipat-event-120-cm.jpg' },
  { label: 'Kebaya Modern Wisuda Cream', value: '/items/kebaya-modern-wisuda-cream.jpg' },
  { label: 'Matras Yoga Premium 8 mm', value: '/items/matras-yoga-premium-8-mm.jpg' },
  { label: 'Gerinda Makita 4 Inch', value: '/items/gerinda-makita-4-inch.jpg' },
  { label: 'Ikon Kamera', value: '/items/camera.svg' },
  { label: 'Ikon Proyektor', value: '/items/projector.svg' },
  { label: 'Ikon Camping', value: '/items/camping.svg' },
  { label: 'Ikon Gaming', value: '/items/gaming.svg' },
  { label: 'Ikon Perkakas', value: '/items/tools.svg' },
  { label: 'Ikon Sound System', value: '/items/sound.svg' },
  { label: 'Ikon Fashion', value: '/items/suit.svg' },
  { label: 'Ikon Sepeda', value: '/items/bike.svg' },
  { label: 'Ikon Laptop', value: '/items/laptop.svg' },
  { label: 'Ikon Tripod', value: '/items/tripod.svg' },
]

function normalizeImageAddress(value) {
  const imageUrl = String(value || '').trim()
  if (!imageUrl) return ''

  try {
    const parsed = new URL(imageUrl)

    // Link share Google Drive bukan file gambar langsung. Ubah dulu ke format preview publik.
    if (parsed.hostname.includes('drive.google.com')) {
      const fileMatch = parsed.pathname.match(/\/file\/d\/([^/]+)/)
      const id = fileMatch?.[1] || parsed.searchParams.get('id')
      if (id) return `https://drive.google.com/uc?export=view&id=${id}`
    }

    return imageUrl
  } catch {
    return imageUrl
  }
}

function isValidImageAddress(value) {
  const imageUrl = String(value || '').trim()
  if (!imageUrl) return true
  if (imageUrl.startsWith('/') || imageUrl.startsWith('data:image/')) return true

  try {
    const parsed = new URL(imageUrl)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

function fileToOptimizedDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Gambar tidak dapat dibaca.'))
    reader.onload = () => {
      const img = new Image()
      img.onerror = () => resolve(reader.result)
      img.onload = () => {
        const maxSize = 900
        const ratio = Math.min(1, maxSize / img.width, maxSize / img.height)
        const canvas = document.createElement('canvas')
        canvas.width = Math.max(1, Math.round(img.width * ratio))
        canvas.height = Math.max(1, Math.round(img.height * ratio))
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/jpeg', 0.82))
      }
      img.src = reader.result
    }
    reader.readAsDataURL(file)
  })
}

export default function ItemFormPage() {
  const { id } = useParams()
  const { db, currentUser, saveItem } = useDemo()
  const navigate = useNavigate()
  const existing = id ? db.items.find((item) => item.id === Number(id)) : null

  const [error, setError] = useState('')
  const [imageError, setImageError] = useState(false)
  const [form, setForm] = useState(
    existing
      ? { ...existing, rules: (existing.rules || []).join('\n') }
      : {
          name: '',
          category_id: '',
          description: '',
          condition: 'Baik',
          price_per_day: '',
          deposit: '',
          address: currentUser.address || DEFAULT_LOCATION.address,
          latitude: currentUser.latitude || DEFAULT_LOCATION.latitude,
          longitude: currentUser.longitude || DEFAULT_LOCATION.longitude,
          image: '',
          status: 'tersedia',
          rules: '',
        },
  )

  const update = (key, value) => {
    const nextValue = key === 'image' ? normalizeImageAddress(value) : value
    setForm((current) => ({ ...current, [key]: nextValue }))
    if (key === 'image') setImageError(false)
  }

  const chooseLocalImage = (value) => {
    if (!value) return
    update('image', value)
  }

  const uploadLocalImage = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('File yang dipilih harus berupa gambar.')
      return
    }

    try {
      setError('')
      const dataUrl = await fileToOptimizedDataUrl(file)
      update('image', dataUrl)
    } catch (err) {
      setError(err.message || 'Gambar tidak dapat diproses.')
    }
  }

  const updateLocation = (location) => {
    setForm((current) => ({
      ...current,
      address: location.address,
      latitude: location.latitude,
      longitude: location.longitude,
    }))
  }

  const submit = (event) => {
    event.preventDefault()
    setError('')

    const imageUrl = normalizeImageAddress(form.image) || DEFAULT_IMAGE
    if (!isValidImageAddress(imageUrl)) {
      setError('Masukkan link gambar yang valid, pilih gambar bawaan, atau unggah file gambar dari laptop.')
      return
    }

    if (imageError && !imageUrl.startsWith('/')) {
      setError('Link gambar tidak dapat dimuat. Pakai upload gambar lokal atau pilih gambar bawaan agar aman saat demo/hosting.')
      return
    }

    try {
      saveItem({ ...form, image: imageUrl }, id)
      navigate('/dashboard/barang')
    } catch (err) {
      setError(err.message)
    }
  }

  const previewSource = form.image && !imageError ? form.image : DEFAULT_IMAGE

  return (
    <>
      <PageHeader
        eyebrow="Pengelolaan barang"
        title={existing ? 'Edit Barang' : 'Tambah Barang Baru'}
        description="Isi informasi selengkap mungkin agar penyewa dapat mengambil keputusan dengan percaya diri."
      />

      <form className="panel form-panel" onSubmit={submit}>
        {error && <div className="form-error">{error}</div>}

        <div className="form-section">
          <h2>Informasi utama</h2>
          <div className="form-grid-2">
            <label>
              Nama barang
              <input
                required
                value={form.name}
                onChange={(event) => update('name', event.target.value)}
                placeholder="Contoh: Kamera Sony A6400"
              />
            </label>

            <label>
              Kategori
              <select
                required
                value={form.category_id}
                onChange={(event) => update('category_id', event.target.value)}
              >
                <option value="">Pilih kategori</option>
                {db.categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label>
            Deskripsi
            <textarea
              rows="5"
              required
              value={form.description}
              onChange={(event) => update('description', event.target.value)}
              placeholder="Jelaskan kelengkapan, kegunaan, dan kondisi barang."
            />
          </label>

          <div className="form-grid-3">
            <label>
              Kondisi
              <select value={form.condition} onChange={(event) => update('condition', event.target.value)}>
                <option>Sangat Baik</option>
                <option>Baik</option>
                <option>Cukup Baik</option>
              </select>
            </label>

            <label>
              Harga per hari
              <input
                type="number"
                min="0"
                required
                value={form.price_per_day}
                onChange={(event) => update('price_per_day', event.target.value)}
              />
            </label>

            <label>
              Uang jaminan
              <input
                type="number"
                min="0"
                value={form.deposit}
                onChange={(event) => update('deposit', event.target.value)}
              />
            </label>
          </div>
        </div>

        <div className="form-section">
          <h2>Lokasi dan gambar</h2>

          <label>
            Alamat pengambilan
            <input
              required
              value={form.address}
              onChange={(event) => update('address', event.target.value)}
              placeholder="Contoh: Marpoyan Damai, Pekanbaru"
            />
          </label>

          <LocationPicker
            value={{ address: form.address, latitude: form.latitude, longitude: form.longitude }}
            onChange={updateLocation}
          />

          <label>
            Gambar barang
            <div className="image-choice-grid">
              <div className="image-url-input">
                <Link2 size={18} />
                <input
                  value={form.image?.startsWith('data:image/') ? 'Gambar lokal sudah dipilih' : form.image}
                  onChange={(event) => update('image', event.target.value)}
                  placeholder="Tempel direct link gambar, atau upload/pilih gambar bawaan"
                />
              </div>

              <select className="image-local-select" defaultValue="" onChange={(event) => chooseLocalImage(event.target.value)}>
                <option value="">Pilih gambar bawaan</option>
                {LOCAL_IMAGE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>

              <label className="image-upload-button">
                <UploadCloud size={18} />
                Upload dari laptop
                <input type="file" accept="image/*" onChange={uploadLocalImage} />
              </label>
            </div>
            <small className="field-help">
              Link Google biasa sering gagal tampil karena bukan alamat gambar langsung. Untuk demo dan hosting static,
              paling aman gunakan upload gambar lokal atau pilih gambar bawaan.
            </small>
          </label>

          <div className={`image-url-preview ${imageError ? 'has-error' : ''}`}>
            <img
              src={previewSource}
              alt="Pratinjau barang"
              onLoad={() => { if (previewSource === form.image) setImageError(false) }}
              onError={() => { if (previewSource !== DEFAULT_IMAGE) setImageError(true) }}
            />
            <div>
              <span className="image-preview-icon">
                <ImageIcon size={21} />
              </span>
              <strong>Pratinjau gambar</strong>
              {form.image ? (
                imageError ? (
                  <p className="image-preview-error">
                    Gambar tidak berhasil dimuat. Gunakan upload dari laptop, pilih gambar bawaan, atau pakai link
                    gambar langsung yang dapat diakses publik.
                  </p>
                ) : (
                  <p>Gambar berhasil dimuat dan akan digunakan pada kartu, detail barang, serta halaman transaksi.</p>
                )
              ) : (
                <p>Tempelkan link gambar untuk melihat pratinjau sebelum disimpan.</p>
              )}
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Ketentuan dan status</h2>
          <label>
            Ketentuan penyewaan
            <textarea
              rows="5"
              value={form.rules}
              onChange={(event) => update('rules', event.target.value)}
              placeholder={'Satu ketentuan per baris\nContoh: Wajib menunjukkan identitas'}
            />
          </label>

          <label>
            Status
            <select value={form.status} onChange={(event) => update('status', event.target.value)}>
              <option value="tersedia">Tersedia</option>
              <option value="tidak_tersedia">Tidak tersedia</option>
            </select>
          </label>
        </div>

        <div className="form-actions">
          <button type="button" className="button button-ghost" onClick={() => navigate(-1)}>
            Batal
          </button>
          <button className="button button-primary">
            <Save size={18} />
            Simpan barang
          </button>
        </div>
      </form>
    </>
  )
}
