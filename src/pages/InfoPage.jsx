import {
  BadgeCheck,
  CalendarCheck,
  CheckCircle2,
  FileCheck2,
  LockKeyhole,
  PackageCheck,
  Search,
  ShieldCheck,
  Star,
  UserRoundCheck,
} from 'lucide-react'

const content = {
  cara: {
    eyebrow: 'Panduan platform',
    title: 'Cara kerja SewaBarangSekitar',
    description: 'Alur sederhana untuk penyewa dan pemilik barang.',
    sections: [
      ['Untuk penyewa', [
        ['Cari barang', Search, 'Gunakan pencarian, kategori, harga, dan radius lokasi.'],
        ['Kirim permintaan', CalendarCheck, 'Pilih tanggal sewa dan tunggu persetujuan pemilik.'],
        ['Ambil dan gunakan', PackageCheck, 'Lakukan pembayaran serta serah terima sesuai kesepakatan.'],
        ['Kembalikan dan ulas', Star, 'Konfirmasi pengembalian lalu berikan penilaian.'],
      ]],
      ['Untuk pemilik', [
        ['Tambahkan barang', PackageCheck, 'Unggah foto, kondisi, harga, deposit, lokasi, dan peraturan.'],
        ['Tinjau permintaan', FileCheck2, 'Terima atau tolak berdasarkan jadwal dan profil penyewa.'],
        ['Serah terima', CalendarCheck, 'Dokumentasikan kondisi barang sebelum digunakan.'],
        ['Terima ulasan', BadgeCheck, 'Bangun reputasi melalui pelayanan dan kondisi barang.'],
      ]],
    ],
  },
  keamanan: {
    eyebrow: 'Keamanan platform',
    title: 'Kepercayaan dibangun dari proses yang jelas',
    description: 'Fitur keamanan dirancang untuk mengurangi risiko dalam transaksi peer-to-peer.',
    sections: [
      ['Perlindungan pengguna', [
        ['Verifikasi akun', UserRoundCheck, 'Identitas, email, dan nomor telepon dapat diverifikasi.'],
        ['Hak akses', LockKeyhole, 'Pengguna hanya dapat mengubah data dan transaksi miliknya sendiri.'],
        ['Status tercatat', FileCheck2, 'Perubahan transaksi disimpan mulai dari permintaan hingga selesai.'],
        ['Pelaporan', ShieldCheck, 'Barang, pengguna, atau transaksi bermasalah dapat dilaporkan.'],
      ]],
      ['Praktik aman', [
        ['Gunakan platform', CheckCircle2, 'Hindari kesepakatan yang menghilangkan bukti transaksi.'],
        ['Periksa barang', PackageCheck, 'Foto kondisi barang sebelum dan sesudah penyewaan.'],
        ['Jaga privasi', LockKeyhole, 'Alamat detail tidak perlu ditampilkan sebelum pesanan disetujui.'],
        ['Baca ulasan', Star, 'Periksa rating dan riwayat sebelum menyetujui transaksi.'],
      ]],
    ],
  },
  syarat: {
    eyebrow: 'Ketentuan layanan',
    title: 'Syarat penggunaan ringkas',
    description: 'Ketentuan dasar untuk menjaga platform tetap aman dan bermanfaat.',
    sections: [
      ['Ketentuan utama', [
        ['Barang legal', CheckCircle2, 'Dilarang menawarkan barang ilegal, berbahaya, atau melanggar hak pihak lain.'],
        ['Informasi jujur', FileCheck2, 'Foto, kondisi, harga, dan lokasi harus sesuai keadaan sebenarnya.'],
        ['Tanggung jawab', ShieldCheck, 'Pemilik dan penyewa bertanggung jawab atas kesepakatan serta kondisi barang.'],
        ['Moderasi', BadgeCheck, 'Administrator dapat menonaktifkan konten dan akun yang melanggar aturan.'],
      ]],
    ],
  },
}

export default function InfoPage({ type }) {
  const data = content[type] || content.cara
  return (
    <div className="info-page">
      <section className="info-hero">
        <div className="container">
          <span className="eyebrow inverse">{data.eyebrow}</span>
          <h1>{data.title}</h1>
          <p>{data.description}</p>
        </div>
      </section>
      <div className="container section">
        {data.sections.map(([title, items]) => (
          <section key={title} className="info-section">
            <h2>{title}</h2>
            <div className="info-grid">
              {items.map(([name, Icon, description]) => (
                <article key={name}>
                  <span><Icon /></span>
                  <h3>{name}</h3>
                  <p>{description}</p>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
