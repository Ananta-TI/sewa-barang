import { Eye, EyeOff, LockKeyhole, Mail, ShieldCheck, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useDemo } from "../contexts/DemoContext";

// Konfigurasi animasi Framer Motion
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

export default function LoginPage() {
  const [form, setForm] = useState({
    email: "ridwan@demo.id",
    password: "password123",
  });
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { login } = useDemo();
  const navigate = useNavigate();
  const location = useLocation();

  // Tangkap jejak lokasi sebelum dilempar ke login
  const from = location.state?.from || "/dashboard";

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      // Tunggu proses login Supabase selesai
      const user = await login(form.email, form.password);
      
      // Jika berhasil, navigate dengan replace
      navigate(
        user.role === "admin" ? "/admin" : from,
        { replace: true }
      );
    } catch (err) {
      setError(err.message || "Terjadi kesalahan saat login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* BAGIAN VISUAL / INFO */}
      <motion.div 
        className="auth-visual"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div>
          <span className="eyebrow inverse">
            <ShieldCheck size={17} /> Marketplace penyewaan lokal
          </span>
          <h1>Sewa barang lebih mudah dan terstruktur.</h1>
          <p>
            Masuk untuk mengelola barang, memantau transaksi, menyimpan favorit,
            dan menerima notifikasi.
          </p>
          <div className="demo-credentials">
            <strong>Akun demo pengguna</strong>
            <code>ridwan@demo.id</code>
            <code>password123</code>
            <strong>Akun administrator</strong>
            <code>admin@sewabarang.id</code>
            <code>admin123</code>
          </div>
        </div>
      </motion.div>

      {/* BAGIAN FORM LOGIN */}
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
            <h2>Selamat datang kembali</h2>
            <p>Masukkan email dan password untuk melanjutkan.</p>
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
            Password
            <div className={`input-with-icon ${loading ? 'opacity-70' : ''}`}>
              <LockKeyhole size={18} />
              <input
                type={show ? "text" : "password"}
                required
                disabled={loading}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
              />
              <button 
                type="button" 
                onClick={() => setShow(!show)}
                disabled={loading}
                className="hover:text-gray-700 transition-colors"
                title={show ? "Sembunyikan password" : "Tampilkan password"}
              >
                {show ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </motion.label>

          <motion.div className="form-row-between" variants={fadeUp}>
            <label className="checkbox-line cursor-pointer">
              <input type="checkbox" defaultChecked disabled={loading} /> 
              <span>Ingat saya</span>
            </label>
            <button
              type="button"
              className="text-button"
              disabled={loading}
              onClick={() =>
                alert("Fitur reset password tersedia setelah backend email diaktifkan.")
              }
            >
              Lupa password?
            </button>
          </motion.div>

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
              "Masuk"
            )}
          </motion.button>

          <motion.p className="auth-switch" variants={fadeUp}>
            Belum memiliki akun? <Link to="/register" className="font-semibold text-primary">Daftar sekarang</Link>
          </motion.p>
        </motion.form>
      </div>
    </div>
  );
}