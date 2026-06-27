import { Link } from 'react-router-dom'
export default function NotFoundPage(){return <div className="not-found"><strong>404</strong><h1>Halaman tidak ditemukan</h1><p>Alamat yang Anda buka tidak tersedia atau telah dipindahkan.</p><Link className="button button-primary" to="/">Kembali ke beranda</Link></div>}
