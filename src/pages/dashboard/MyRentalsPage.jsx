import { CheckCircle2, CreditCard, RotateCcw, Star } from "lucide-react";
import { useState } from "react";
import EmptyState from "../../components/EmptyState";
import PageHeader from "../../components/PageHeader";
import StatusBadge from "../../components/StatusBadge";
import { useDemo } from "../../contexts/DemoContext";
import { formatCurrency, formatDate } from "../../utils/format";

export default function MyRentalsPage() {
  const { db, currentUser, updateRental, addReview } = useDemo();
  const rentals = db.rentals.filter((r) => r.renter_id === currentUser.id);
  const [review, setReview] = useState(null);
  const [form, setForm] = useState({ rating: 5, comment: "" });
  const submit = (e) => {
    e.preventDefault();
    const item = db.items.find((i) => i.id === review.item_id);
    addReview({
      rental_id: review.id,
      targetuser_id: item.ownerId,
      item_id: item.id,
      ...form,
    });
    setReview(null);
    alert("Ulasan berhasil disimpan.");
  };
  return (
    <>
      <PageHeader
        eyebrow="Sebagai penyewa"
        title="Penyewaan Saya"
        description="Pantau status persetujuan, pembayaran, pengambilan, dan pengembalian barang."
      />
      {rentals.length ? (
        <div className="rental-list">
          {rentals.map((r) => {
            const item = db.items.find((i) => i.id === r.item_id);
            const owner = db.users.find((u) => u.id === item?.owner_id);
            const reviewed = db.reviews.some(
              (v) => v.rental_id === r.id && v.author_id === currentUser.id,
            );
            return (
              <article className="rental-card" key={r.id}>
                <div className="rental-main">
                  <img src={item?.image} />
                  <div>
                    <small>SW-{r.id}</small>
                    <h3>{item?.name}</h3>
                    <span>Pemilik: {owner?.name}</span>
                    <p>
                      {formatDate(r.start_date)} – {formatDate(r.end_date)} •{" "}
                      {r.days} hari
                    </p>
                  </div>
                  <div className="rental-value">
                    <StatusBadge status={r.status} />
                    <strong>{formatCurrency(r.total)}</strong>
                  </div>
                </div>
                <div className="status-timeline">
                  <div className="done">
                    <span>1</span>
                    <small>Permintaan</small>
                  </div>
                  <div
                    className={
                      ["diterima", "selesai"].includes(r.status) ? "done" : ""
                    }
                  >
                    <span>2</span>
                    <small>Disetujui</small>
                  </div>
                  <div
                    className={r.payment_status === "berhasil" ? "done" : ""}
                  >
                    <span>3</span>
                    <small>Pembayaran</small>
                  </div>
                  <div
                    className={
                      r.pickup_status === "sudah_diambil" ? "done" : ""
                    }
                  >
                    <span>4</span>
                    <small>Pengambilan</small>
                  </div>
                  <div
                    className={
                      r.return_status === "sudah_dikembalikan" ? "done" : ""
                    }
                  >
                    <span>5</span>
                    <small>Pengembalian</small>
                  </div>
                </div>
                <div className="rental-actions">
                  {r.status === "diterima" &&
                    r.payment_status === "belum_dibayar" && (
                      <button
                        className="button button-primary"
                        onClick={() =>
                          updateRental(r.id, { payment_status: "berhasil" })
                        }
                      >
                        <CreditCard size={17} />
                        Simulasikan pembayaran
                      </button>
                    )}
                  {r.payment_status === "berhasil" &&
                    r.pickup_status === "belum_diambil" && (
                      <button
                        className="button button-secondary"
                        onClick={() =>
                          updateRental(r.id, { pickup_status: "sudah_diambil" })
                        }
                      >
                        <CheckCircle2 size={17} />
                        Konfirmasi diambil
                      </button>
                    )}
                  {r.pickup_status === "sudah_diambil" &&
                    r.return_status === "belum_dikembalikan" && (
                      <button
                        className="button button-secondary"
                        onClick={() =>
                          updateRental(r.id, {
                            return_status: "sudah_dikembalikan",
                            status: "selesai",
                          })
                        }
                      >
                        <RotateCcw size={17} />
                        Konfirmasi dikembalikan
                      </button>
                    )}
                  {r.status === "selesai" && !reviewed && (
                    <button
                      className="button button-secondary"
                      onClick={() => setReview(r)}
                    >
                      <Star size={17} />
                      Beri ulasan
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="Belum ada penyewaan"
          description="Barang yang kamu sewa akan tampil di halaman ini."
        />
      )}
      {review && (
        <div className="modal-backdrop" onMouseDown={() => setReview(null)}>
          <form
            className="modal-card"
            onMouseDown={(e) => e.stopPropagation()}
            onSubmit={submit}
          >
            <h3>Beri ulasan</h3>
            <label>
              Rating
              <select
                value={form.rating}
                onChange={(e) => setForm({ ...form, rating: e.target.value })}
              >
                <option value="5">5 - Sangat baik</option>
                <option value="4">4 - Baik</option>
                <option value="3">3 - Cukup</option>
                <option value="2">2 - Kurang</option>
                <option value="1">1 - Buruk</option>
              </select>
            </label>
            <label>
              Komentar
              <textarea
                rows="4"
                required
                value={form.comment}
                onChange={(e) => setForm({ ...form, comment: e.target.value })}
              />
            </label>
            <div className="modal-actions">
              <button
                type="button"
                className="button button-ghost"
                onClick={() => setReview(null)}
              >
                Batal
              </button>
              <button className="button button-primary">Simpan ulasan</button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
