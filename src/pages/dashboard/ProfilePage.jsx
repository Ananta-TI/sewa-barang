import { RotateCcw, Save, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LocationPicker from '../../components/LocationPicker'
import PageHeader from '../../components/PageHeader'
import { useDemo } from '../../contexts/DemoContext'
import { DEFAULT_LOCATION } from '../../data/locations'

export default function ProfilePage() {
  const { currentUser, updateProfile, resetDemo } = useDemo()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    ...currentUser,
    address: currentUser?.address || DEFAULT_LOCATION.address,
    latitude: currentUser?.latitude || DEFAULT_LOCATION.latitude,
    longitude: currentUser?.longitude || DEFAULT_LOCATION.longitude,
  })
  const [saved, setSaved] = useState(false)

  const submit = (event) => {
    event.preventDefault()
    updateProfile(form)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const updateLocation = (location) => {
    setForm((current) => ({
      ...current,
      address: location.address,
      latitude: location.latitude,
      longitude: location.longitude,
    }))
  }

  return (
    <>
      <PageHeader
        eyebrow="Informasi akun"
        title="Profil & Pengaturan"
        description="Lengkapi profil untuk meningkatkan kepercayaan pengguna lain."
      />

      <div className="profile-layout">
        <form className="panel form-panel" onSubmit={submit}>
          {saved && <div className="form-success">Perubahan profil berhasil disimpan.</div>}

          <div className="profile-avatar">
            <img src={form.avatar} alt="Avatar pengguna" />
            <div>
              <h2>{form.name}</h2>
              <span>Rating {form.rating || 0} • {form.status}</span>
            </div>
          </div>

          <div className="form-grid-2">
            <label>
              Nama lengkap
              <input value={form.name || ''} onChange={(event) => setForm({ ...form, name: event.target.value })} />
            </label>
            <label>
              Email
              <input type="email" value={form.email || ''} onChange={(event) => setForm({ ...form, email: event.target.value })} />
            </label>
            <label>
              Nomor telepon
              <input value={form.phone || ''} onChange={(event) => setForm({ ...form, phone: event.target.value })} />
            </label>
            <label>
              Alamat utama
              <input value={form.address || ''} onChange={(event) => setForm({ ...form, address: event.target.value })} />
            </label>
          </div>

          <LocationPicker
            value={{ address: form.address, latitude: form.latitude, longitude: form.longitude }}
            onChange={updateLocation}
          />

          <div className="form-actions">
            <button className="button button-primary">
              <Save size={18} /> Simpan perubahan
            </button>
          </div>
        </form>

        <aside>
          <section className="panel security-card">
            <ShieldCheck />
            <h3>Status keamanan</h3>
            <p>Akun demo menampilkan simulasi profil terverifikasi. Integrasi produksi dapat menambahkan verifikasi email, telepon, dan identitas.</p>
            <ul>
              <li>Email terdaftar</li>
              <li>Nomor telepon tersedia</li>
              <li>Riwayat transaksi tercatat</li>
            </ul>
          </section>

          <section className="panel danger-zone">
            <h3>Reset data demonstrasi</h3>
            <p>Mengembalikan seluruh barang, transaksi, dan pengguna ke data awal.</p>
            <button
              className="button button-danger"
              onClick={() => {
                if (confirm('Reset seluruh data demo?')) {
                  resetDemo()
                  navigate('/')
                }
              }}
            >
              <RotateCcw size={18} /> Reset demo
            </button>
          </section>
        </aside>
      </div>
    </>
  )
}
