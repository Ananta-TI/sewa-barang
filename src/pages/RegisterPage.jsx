import { LockKeyhole, Mail, Phone, UserRound, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useDemo } from "../contexts/DemoContext";

// Konfigurasi animasi Framer Motion (sama dengan halaman Login)
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { register } = useDemo();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (form.password.length < 8)
      return setError("Password minimal 8 karakter.");
    if (form.password !== form.confirm)
      return setError("Konfirmasi password tidak sama.");
      
    setLoading(true);
    
    try {
      // Tunggu proses register Supabase selesai
      await register(form);
      
      // Redirect ke dashboard dan hapus history halaman register
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Terjadi kesalahan saat mendaftar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* BAGIAN VISUAL / INFO */}
      <motion.div 
        className="auth-visual register-visual"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div>
          <span className="eyebrow inverse">Mulai dari sekitar</span>
          <h1>Satu akun untuk menyewa dan menyewakan.</h1>
          <p>
            Bangun reputasi melalui transaksi yang tercatat, rating dua arah,
            dan profil yang lengkap.
          </p>
          <ul className="check-list inverse-list">
            <li>Kelola barang dan jadwal</li>
            <li>Temukan barang berdasarkan lokasi</li>
            <li>Pantau seluruh riwayat transaksi</li>
          </ul>
        </div>
      </motion.div>

      {/* BAGIAN FORM REGISTER */}
      <div className="auth-form-wrap">
        <motion.form 
          className="auth-card" 
          onSubmit={submit}
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div variants={fadeUp}>
            <Link to="/" className="auth-back flex items-center gap-2">
              <ArrowLeft size={16} /> Kembali ke beranda
            </Link>
          </motion.div>

          <motion.div variants={fadeUp}>
            <h2>Buat akun baru</h2>
            <p>Isi data dasar berikut untuk bergabung.</p>
          </motion.div>
          
          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              className="form-error"
            >
              {error}
            </motion.div>
          )}
          
          <motion.label variants={fadeUp}>
            Nama lengkap
            <div className={`input-with-icon ${loading ? 'opacity-70' : ''}`}>
              <UserRound size={18} />
              <input
                required
                disabled={loading}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Ridwan Abrilla"
              />
            </div>
          </motion.label>

          <motion.label variants={fadeUp}>
            Email
            <div className={`input-with-icon ${loading ? 'opacity-70' : ''}`}>
              <Mail size={18} />
              <input
                type="email"
                required
                disabled={loading}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="nama@email.com"
              />
            </div>
          </motion.label>

          <motion.label variants={fadeUp}>
            Nomor telepon
            <div className={`input-with-icon ${loading ? 'opacity-70' : ''}`}>
              <Phone size={18} />
              <input
                required
                disabled={loading}
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="081234567890"
              />
            </div>
          </motion.label>

          <div className="form-grid-2">
            <motion.label variants={fadeUp}>
              Password
              <div className={`input-with-icon ${loading ? 'opacity-70' : ''}`}>
                <LockKeyhole size={18} />
                <input
                  type="password"
                  required
                  disabled={loading}
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  placeholder="Minimal 8 karakter"
                />
              </div>
            </motion.label>
            
            <motion.label variants={fadeUp}>
              Konfirmasi
              <div className={`input-with-icon ${loading ? 'opacity-70' : ''}`}>
                <LockKeyhole size={18} />
                <input
                  type="password"
                  required
                  disabled={loading}
                  value={form.confirm}
                  onChange={(e) =>
                    setForm({ ...form, confirm: e.target.value })
                  }
                  placeholder="Ulangi password"
                />
              </div>
            </motion.label>
          </div>

          <motion.label className="checkbox-line cursor-pointer" variants={fadeUp}>
            <input type="checkbox" required disabled={loading} /> 
            <span>Saya menyetujui syarat penggunaan dan kebijakan platform.</span>
          </motion.label>

          <motion.button 
            variants={fadeUp}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            className="button button-primary button-block button-large"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="spinner-border"></span> Memproses...
              </span>
            ) : (
              "Daftar"
            )}
          </motion.button>

          <motion.p className="auth-switch" variants={fadeUp}>
            Sudah memiliki akun? <Link to="/login" className="font-semibold text-primary">Masuk</Link>
          </motion.p>
        </motion.form>
      </div>
    </div>
  );
}