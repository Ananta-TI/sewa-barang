import {
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  CreditCard,
  ShieldCheck,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import EmptyState from "../components/EmptyState";
import { useDemo } from "../contexts/DemoContext";
import { daysBetween, formatCurrency } from "../utils/format";

export default function BookingPage() {
  const { slug } = useParams();
  const { db, currentUser, createRental } = useDemo();
  const item = db.items.find((i) => i.slug === slug);
  const today = new Date().toISOString().slice(0, 10);
  
  const [form, setForm] = useState({
    start_date: today,
    end_date: today,
    note: "",
    agree: false,
  });
  
  const [done, setDone] = useState(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // Tambahan state loading
  
  const days = useMemo(
    () => daysBetween(form.start_date, form.end_date),
    [form.start_date, form.end_date],
  );

  if (!item)
    return (
      <div className="container section">
        <EmptyState title="Barang tidak ditemukan" />
      </div>
    );

  const subtotal = days * item.price_per_day,
    total = subtotal + item.deposit;

  // Ubah menjadi async/await karena createRental sekarang memanggil Supabase
  const submit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (form.end_date < form.start_date)
      return setError("Tanggal selesai tidak boleh sebelum tanggal mulai.");
    if (!form.agree)
      return setError("Anda harus menyetujui ketentuan penyewaan.");
      
    try {
      setIsSubmitting(true);
      // Tunggu hingga proses insert ke Supabase selesai
      const rental = await createRental({ item_id: item.id, ...form });
      setDone(rental);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (done)
    return (
      <div className="container booking-success">
        <CheckCircle2 size={64} />
        <h1>Permintaan sewa berhasil dikirim</h1>
        <p>
          Pemilik akan menerima notifikasi dan dapat menyetujui atau menolak
          permintaan Anda.
        </p>
        <div className="success-summary">
          <span>Nomor transaksi</span>
          <strong>SW-{done.id}</strong>
          <span>Total estimasi</span>
          <strong>{formatCurrency(done.total)}</strong>
        </div>
        <div>
          <Link className="button button-primary" to="/dashboard/penyewaan">
            Lihat penyewaan saya
          </Link>
          <Link className="button button-ghost" to="/jelajahi">
            Cari barang lain
          </Link>
        </div>
      </div>
    );

  return (
    <div className="container booking-page">
      <Link className="back-link" to={`/barang/${item.slug}`}>
        <ChevronLeft size={18} /> Kembali ke detail barang
      </Link>
      <div className="booking-grid">
        <form className="content-card booking-form" onSubmit={submit}>
          <span className="eyebrow">Pengajuan penyewaan</span>
          <h1>Atur jadwal sewa</h1>
          <p>
            Permintaan baru akan berstatus menunggu sampai disetujui pemilik.
          </p>
          {error && <div className="form-error">{error}</div>}
          <div className="selected-item">
            <img src={item.image} alt="" />
            <div>
              <strong>{item.name}</strong>
              <span>{item.address}</span>
              <small>{formatCurrency(item.price_per_day)}/hari</small>
            </div>
          </div>
          <div className="form-grid-2">
            <label>
              Tanggal mulai
              <input
                type="date"
                min={today}
                required
                value={form.start_date}
                onChange={(e) =>
                  setForm({
                    ...form,
                    start_date: e.target.value,
                    end_date:
                      e.target.value > form.end_date
                        ? e.target.value
                        : form.end_date,
                  })
                }
              />
            </label>
            <label>
              Tanggal selesai
              <input
                type="date"
                min={form.start_date}
                required
                value={form.end_date}
                onChange={(e) => setForm({ ...form, end_date: e.target.value })}
              />
            </label>
          </div>
          <label>
            Keperluan atau catatan
            <textarea
              rows="4"
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              placeholder="Contoh: digunakan untuk dokumentasi acara kampus."
            />
          </label>
          <label className="checkbox-line">
            <input
              type="checkbox"
              checked={form.agree}
              onChange={(e) => setForm({ ...form, agree: e.target.checked })}
            />{" "}
            Saya memahami ketentuan penggunaan, biaya, dan kewajiban menjaga
            barang.
          </label>
          <button 
            className="button button-primary button-block button-large"
            disabled={isSubmitting}
          >
            <CalendarDays size={19} /> 
            {isSubmitting ? "Mengirim..." : "Kirim permintaan"}
          </button>
        </form>
        <aside className="content-card price-summary">
          <h2>Ringkasan biaya</h2>
          <div>
            <span>Harga sewa × {days} hari</span>
            <strong>{formatCurrency(subtotal)}</strong>
          </div>
          <div>
            <span>Uang jaminan</span>
            <strong>{formatCurrency(item.deposit)}</strong>
          </div>
          <div className="summary-total">
            <span>Total dibayar</span>
            <strong>{formatCurrency(total)}</strong>
          </div>
          <p>
            Uang jaminan dapat dikembalikan setelah barang diterima pemilik
            dalam kondisi sesuai.
          </p>
          <div className="summary-assurance">
            <ShieldCheck />
            <span>
              <strong>Alur transaksi tercatat</strong>
              <small>
                Status pemesanan, pembayaran, pengambilan, dan pengembalian
                tersimpan pada akun.
              </small>
            </span>
          </div>
          <div className="summary-assurance">
            <CreditCard />
            <span>
              <strong>Pembayaran tahap berikutnya</strong>
              <small>
                Pembayaran dilakukan setelah permintaan disetujui pemilik.
              </small>
            </span>
          </div>
        </aside>
      </div>
    </div>
  );
}