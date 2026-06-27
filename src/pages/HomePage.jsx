import {
  ArrowRight,
  BadgeCheck,
  CalendarCheck,
  Camera,
  Drill,
  Dumbbell,
  Gamepad2,
  Laptop,
  MapPin,
  PartyPopper,
  Search,
  ShieldCheck,
  Shirt,
  Star,
  TentTree,
  WalletCards,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import ItemCard from "../components/ItemCard";
import { useDemo } from "../contexts/DemoContext";
import { formatCurrency } from "../utils/format";

const iconMap = {
  Camera,
  Laptop,
  TentTree,
  Gamepad2,
  Drill,
  PartyPopper,
  Shirt,
  Dumbbell,
};

// Bungkus Link React Router dengan motion agar bisa dianimasikan
const MotionLink = motion(Link);

// Konfigurasi animasi default agar kode lebih rapi
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

export default function HomePage() {
  const { db } = useDemo();
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const featured = db.items.filter((item) => item.featured).slice(0, 6);

  const submit = (event) => {
    event.preventDefault();
    navigate(`/jelajahi?q=${encodeURIComponent(query)}`);
  };

  return (
    <>
      <section className="hero-section">
        <div className="container hero-grid">
          <motion.div 
            className="hero-copy"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.span className="eyebrow" variants={fadeInUp}>
              <MapPin size={16} /> Marketplace lokal berbasis lokasi
            </motion.span>
            <motion.h1 variants={fadeInUp}>
              Butuh barang sebentar? <span>Sewa yang dekat saja.</span>
            </motion.h1>
            <motion.p variants={fadeInUp}>
              Temukan kamera, proyektor, alat camping, perlengkapan acara, dan
              barang lainnya dari pemilik tepercaya di sekitarmu.
            </motion.p>
            <motion.form className="hero-search" onSubmit={submit} variants={fadeInUp}>
              <Search size={21} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari kamera, proyektor, tenda..."
              />
              <button className="button button-primary">Cari Barang</button>
            </motion.form>
            <motion.div className="hero-trust" variants={fadeInUp}>
              <span><BadgeCheck size={18} /> Pengguna terverifikasi</span>
              <span><ShieldCheck size={18} /> Transaksi tercatat</span>
              <span><Star size={18} /> Ulasan dua arah</span>
            </motion.div>
          </motion.div>

          <motion.div 
            className="hero-visual"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="hero-card hero-card-main">
              <img src="/items/kamera-sony-a6400-kit-lens.jpg" alt="Kamera sewaan" />
              <div>
                <small>Terdekat 2,8 km</small>
                <strong>Sony A6400</strong>
                <span>{formatCurrency(180000)}/hari</span>
              </div>
            </div>
            <div className="hero-floating hero-floating-a">
              <MapPin size={19} />
              <div>
                <strong>Lokasi sekitar</strong>
                <small>Radius dapat diatur</small>
              </div>
            </div>
            <div className="hero-floating hero-floating-b">
              <ShieldCheck size={19} />
              <div>
                <strong>Aman & tercatat</strong>
                <small>Riwayat lengkap</small>
              </div>
            </div>
            <div className="hero-orbit orbit-a" />
            <div className="hero-orbit orbit-b" />
          </motion.div>
        </div>
      </section>

      <motion.section 
        className="stats-strip"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        variants={staggerContainer}
      >
        <div className="container stats-grid">
          <motion.div variants={fadeInUp}>
            <strong>{db.items.length}+</strong>
            <span>Barang aktif</span>
          </motion.div>
          <motion.div variants={fadeInUp}>
            <strong>{db.users.filter((u) => u.role === "user").length}+</strong>
            <span>Pengguna demo</span>
          </motion.div>
          <motion.div variants={fadeInUp}>
            <strong>{db.rentals.length}+</strong>
            <span>Transaksi tercatat</span>
          </motion.div>
          <motion.div variants={fadeInUp}>
            <strong>8</strong>
            <span>Kategori utama</span>
          </motion.div>
        </div>
      </motion.section>

      <section className="section container">
        <motion.div 
          className="section-heading"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
        >
          <div>
            <span className="eyebrow">Kategori populer</span>
            <h2>Cari sesuai kebutuhanmu</h2>
          </div>
          <Link to="/jelajahi" className="text-link">
            Lihat semua <ArrowRight size={17} />
          </Link>
        </motion.div>
        
        <motion.div 
          className="category-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
        >
          {db.categories.map((category) => {
            const Icon = iconMap[category.icon] || Camera;
            return (
              <MotionLink
                key={category.id}
                to={`/jelajahi?kategori=${category.id}`}
                className="category-card"
                variants={fadeInUp}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <span>
                  <Icon />
                </span>
                <h3>{category.name}</h3>
                <p>{category.description}</p>
                <small>
                  {db.items.filter((i) => i.category_id === category.id).length}{" "}
                  barang
                </small>
              </MotionLink>
            );
          })}
        </motion.div>
      </section>

      <section className="section section-soft">
        <div className="container">
          <motion.div 
            className="section-heading"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <div>
              <span className="eyebrow">Pilihan terbaik</span>
              <h2>Barang unggulan di sekitarmu</h2>
            </div>
            <Link to="/jelajahi" className="button button-secondary">
              Jelajahi semua
            </Link>
          </motion.div>
          
          <motion.div 
            className="items-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
          >
            {featured.map((item) => (
              <motion.div key={item.id} variants={fadeInUp}>
                <ItemCard item={item} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="section container">
        <motion.div 
          className="section-heading centered"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
        >
          <span className="eyebrow">Mudah digunakan</span>
          <h2>Tiga langkah untuk mulai menyewa</h2>
          <p>Seluruh proses tersimpan dalam satu platform, dari pencarian sampai pengembalian.</p>
        </motion.div>
        
        <motion.div 
          className="steps-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
        >
          <motion.div className="step-card" variants={fadeInUp}>
            <span>01</span>
            <Search />
            <h3>Cari barang</h3>
            <p>Gunakan kata kunci, kategori, harga, dan radius lokasi untuk menemukan pilihan yang sesuai.</p>
          </motion.div>
          <motion.div className="step-card" variants={fadeInUp}>
            <span>02</span>
            <CalendarCheck />
            <h3>Ajukan jadwal</h3>
            <p>Pilih tanggal mulai dan selesai, lalu kirim permintaan kepada pemilik barang.</p>
          </motion.div>
          <motion.div className="step-card" variants={fadeInUp}>
            <span>03</span>
            <WalletCards />
            <h3>Bayar dan ambil</h3>
            <p>Setelah disetujui, selesaikan pembayaran dan lakukan serah terima sesuai kesepakatan.</p>
          </motion.div>
        </motion.div>
      </section>

      <section className="section container">
        <motion.div 
          className="owner-cta"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
        >
          <div>
            <span className="eyebrow inverse">
              Punya barang yang jarang dipakai?
            </span>
            <h2>Ubah barang menganggur menjadi penghasilan tambahan.</h2>
            <p>
              Unggah barangmu, tentukan harga dan jadwal ketersediaan, lalu
              terima permintaan sewa dari orang di sekitar.
            </p>
            <Link to="/dashboard/tambah-barang" className="button button-light">
              Mulai sewakan barang <ArrowRight size={17} />
            </Link>
          </div>
          <img src="/items/proyektor-epson-4000-lumens.jpg" alt="Barang yang disewakan" />
        </motion.div>
      </section>
    </>
  );
}