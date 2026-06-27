import { Link, Outlet } from 'react-router-dom'
import Logo from '../components/Logo'
import Navbar from '../components/Navbar'

export default function PublicLayout() {
  return (
    <div className="app-shell">
      <Navbar />
      
      <main>
        <Outlet />
      </main>
      
      <footer className="site-footer">
        <div className="container footer-grid">
          <div>
            <Logo />
            <p>Temukan dan sewakan barang di sekitar dengan lebih mudah, aman, dan terstruktur.</p>
          </div>
          <div>
            <h4>Platform</h4>
            <Link to="/jelajahi">Jelajahi barang</Link>
            <Link to="/cara-kerja">Cara kerja</Link>
            <Link to="/keamanan">Keamanan</Link>
          </div>
          <div>
            <h4>Dukungan</h4>
            <a href="mailto:dukungan@sewabarang.id">Pusat bantuan</a>
            <a href="mailto:dukungan@sewabarang.id">Hubungi kami</a>
            <Link to="/syarat">Syarat penggunaan</Link>
          </div>
          <div>
            <h4>Lokasi utama</h4>
            <p>Pekanbaru, Riau</p>
            <p>Senin–Jumat, 08.00–17.00 WIB</p>
          </div>
        </div>
        <div className="container footer-bottom">
          <span>© 2026 SewaBarangSekitar</span>
          <span>Proyek akademik Ridwan Abrilla ganteng sekali mantap</span>
        </div>
      </footer>
    </div>
  )
}