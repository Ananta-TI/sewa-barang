import {
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  Flag,
  Heart,
  MapPin,
  MessageCircle,
  Navigation,
  ShieldCheck,
  Star,
  UserRoundCheck,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import EmptyState from "../components/EmptyState";
import ItemCard from "../components/ItemCard";
import StatusBadge from "../components/StatusBadge";
import { useDemo } from "../contexts/DemoContext";
import { formatCurrency, formatDate } from "../utils/format";

const DEFAULT_IMAGE = "/items/default.svg";
const imageFallback = (event) => {
  event.currentTarget.src = DEFAULT_IMAGE;
};

export default function ItemDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { db, currentUser, toggleFavorite, createReport } = useDemo();
  const item = db.items.find((entry) => entry.slug === slug);
  const [activeImage, setActiveImage] = useState(0);
  const [reportOpen, setReportOpen] = useState(false);
  const [report, setReport] = useState({
    reason: "Informasi tidak sesuai",
    description: "",
  });

  if (!item)
    return (
      <div className="container section">
        <EmptyState
          title="Barang tidak ditemukan"
          description="Barang mungkin telah dihapus atau alamatnya berubah."
          action={
            <Link className="button button-primary" to="/jelajahi">
              Kembali jelajahi
            </Link>
          }
        />
      </div>
    );

  // PERBAIKAN: Ubah item.user_id menjadi item.owner_id
  const owner = db.users.find((entry) => entry.id === item.owner_id);
  const category = db.categories.find((entry) => entry.id === item.category_id);
  const reviews = db.reviews.filter((entry) => entry.item_id === item.id);
  const related = db.items
    .filter(
      (entry) => entry.category_id === item.category_id && entry.id !== item.id,
    )
    .slice(0, 3);
  const favorite = db.favorites.some(
    (entry) => entry.user_id === currentUser?.id && entry.item_id === item.id,
  );
  const mapsLink = `https://www.google.com/maps/dir/?api=1&destination=${item.latitude},${item.longitude}`;

  // PERBAIKAN: Tambahkan async/await untuk sinkronisasi ke database
  const doFavorite = async () => {
    try {
      await toggleFavorite(item.id);
    } catch {
      navigate("/login");
    }
  };

  // PERBAIKAN: Tambahkan async/await untuk sinkronisasi ke database
  const submitReport = async (event) => {
    event.preventDefault();
    try {
      await createReport({ target_type: "item", target_id: item.id, ...report });
      setReportOpen(false);
      alert("Laporan berhasil dikirim kepada administrator.");
    } catch {
      navigate("/login");
    }
  };

  return (
    <div className="container detail-page">
      <Link className="back-link" to="/jelajahi">
        <ChevronLeft size={18} /> Kembali ke pencarian
      </Link>
      <div className="detail-grid">
        <div className="gallery-panel">
          <div className="main-gallery">
            <img
              src={item.images?.[activeImage] || item.image || DEFAULT_IMAGE}
              alt={item.name}
              onError={imageFallback}
            />
            <span className="gallery-category">{category?.name}</span>
          </div>
          <div className="gallery-thumbs">
            {(item.images || [item.image || DEFAULT_IMAGE]).map(
              (image, index) => (
                <button
                  className={activeImage === index ? "active" : ""}
                  key={`${image}-${index}`}
                  onClick={() => setActiveImage(index)}
                >
                  <img
                    src={image || DEFAULT_IMAGE}
                    alt=""
                    onError={imageFallback}
                  />
                </button>
              ),
            )}
          </div>
        </div>
        <div className="detail-info">
          <div className="detail-meta">
            <StatusBadge status={item.status} />
            <span>
              <Star size={17} fill="currentColor" /> {item.rating} (
              {item.review_count} ulasan)
            </span>
          </div>
          <h1>{item.name}</h1>
          <p className="detail-location">
            <MapPin size={18} />
            {item.address}
          </p>
          <div className="detail-price">
            <strong>{formatCurrency(item.price_per_day)}</strong>
            <span>/ hari</span>
          </div>
          <div className="detail-actions">
            <Link
              className="button button-primary button-large"
              to={`/barang/${item.slug}/sewa`}
            >
              <CalendarDays size={19} /> Ajukan Penyewaan
            </Link>
            <button
              className={`button button-secondary button-icon-text ${favorite ? "active" : ""}`}
              onClick={doFavorite}
            >
              <Heart size={19} fill={favorite ? "currentColor" : "none"} />
              {favorite ? "Tersimpan" : "Simpan"}
            </button>
          </div>
          <div className="safety-note">
            <ShieldCheck size={22} />
            <div>
              <strong>Transaksi lebih aman</strong>
              <p>
                Gunakan alur pemesanan dan status transaksi di dalam platform.
                Jangan mengirim data sensitif melalui pesan publik.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="detail-content-grid">
        <section className="content-card">
          <h2>Deskripsi barang</h2>
          <p>{item.description}</p>
          <div className="spec-grid">
            <div>
              <span>Kondisi</span>
              <strong>{item.condition}</strong>
            </div>
            <div>
              <span>Uang jaminan</span>
              <strong>{formatCurrency(item.deposit)}</strong>
            </div>
            <div>
              <span>Total disewa</span>
              <strong>{item.rented_count} kali</strong>
            </div>
            <div>
              <span>Terdaftar sejak</span>
              <strong>{formatDate(item.created_at)}</strong>
            </div>
          </div>
          <h3>Ketentuan penyewaan</h3>
          <ul className="check-list">
            {item.rules?.map((rule) => (
              <li key={rule}>
                <CheckCircle2 size={18} />
                {rule}
              </li>
            ))}
          </ul>
        </section>
        <aside>
          <section className="content-card owner-card">
            <div className="owner-head">
              <img src={owner?.avatar} alt="" />
              <div>
                <small>Pemilik barang</small>
                <h3>{owner?.name}</h3>
                <span>
                  <Star size={15} fill="currentColor" /> {owner?.rating} •
                  Bergabung {formatDate(owner?.joined_at)}
                </span>
              </div>
            </div>
            <div className="owner-verification">
              <span>
                <UserRoundCheck size={18} /> Identitas terverifikasi
              </span>
              <span>
                <MessageCircle size={18} /> Respons cepat
              </span>
            </div>
            <button
              className="button button-secondary button-block"
              onClick={() =>
                alert(
                  "Fitur percakapan real-time disiapkan untuk tahap integrasi backend.",
                )
              }
            >
              Hubungi pemilik
            </button>
          </section>
          <section className="content-card">
            <h3>Lokasi pengambilan</h3>
            <div className="mini-map-card">
              <MapPin size={28} />
              <div>
                <strong>{item.address}</strong>
                <span>Alamat detail diberikan setelah pesanan disetujui.</span>
              </div>
            </div>
            <a
              className="button button-ghost button-block"
              href={mapsLink}
              target="_blank"
              rel="noreferrer"
            >
              <Navigation size={18} /> Buka petunjuk arah
            </a>
          </section>
          <button className="report-button" onClick={() => setReportOpen(true)}>
            <Flag size={17} /> Laporkan barang
          </button>
        </aside>
      </div>

      <section className="section-small">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Ulasan pengguna</span>
            <h2>Pengalaman penyewa sebelumnya</h2>
          </div>
        </div>
        {reviews.length ? (
          <div className="review-list">
            {reviews.map((review) => {
              const author = db.users.find((u) => u.id === review.author_id);
              return (
                <article key={review.id} className="review-card">
                  <img src={author?.avatar} alt="" />
                  <div>
                    <div>
                      <strong>{author?.name}</strong>
                      <span>
                        {"★".repeat(review.rating)}
                        {"☆".repeat(5 - review.rating)}
                      </span>
                    </div>
                    <p>{review.comment}</p>
                    <small>{formatDate(review.created_at)}</small>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <EmptyState
            title="Belum ada ulasan"
            description="Jadilah penyewa pertama yang memberi ulasan setelah transaksi selesai."
          />
        )}
      </section>
      {related.length > 0 && (
        <section className="section-small">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Barang serupa</span>
              <h2>Pilihan lain dalam kategori {category?.name}</h2>
            </div>
          </div>
          <div className="items-grid">
            {related.map((entry) => (
              <ItemCard key={entry.id} item={entry} />
            ))}
          </div>
        </section>
      )}

      {reportOpen && (
        <div
          className="modal-backdrop"
          onMouseDown={() => setReportOpen(false)}
        >
          <form
            className="modal-card"
            onMouseDown={(e) => e.stopPropagation()}
            onSubmit={submitReport}
          >
            <h3>Laporkan barang</h3>
            <p>
              Administrator akan memeriksa laporan dan mengambil tindakan bila
              diperlukan.
            </p>
            <label>
              Alasan
              <select
                value={report.reason}
                onChange={(e) =>
                  setReport({ ...report, reason: e.target.value })
                }
              >
                <option>Informasi tidak sesuai</option>
                <option>Barang terlarang</option>
                <option>Penipuan</option>
                <option>Lainnya</option>
              </select>
            </label>
            <label>
              Keterangan
              <textarea
                required
                value={report.description}
                onChange={(e) =>
                  setReport({ ...report, description: e.target.value })
                }
                rows="4"
              />
            </label>
            <div className="modal-actions">
              <button
                type="button"
                className="button button-ghost"
                onClick={() => setReportOpen(false)}
              >
                Batal
              </button>
              <button className="button button-danger">Kirim laporan</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}