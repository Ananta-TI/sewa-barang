import { Check, X } from "lucide-react";
import EmptyState from "../../components/EmptyState";
import PageHeader from "../../components/PageHeader";
import StatusBadge from "../../components/StatusBadge";
import { useDemo } from "../../contexts/DemoContext";
import { formatCurrency, formatDate } from "../../utils/format";

export default function RequestsPage() {
  const { db, currentUser, updateRental } = useDemo();

  // Menggunakan owner_id (snake_case sesuai database Supabase)
  const myIds = db.items
    .filter((i) => i.owner_id === currentUser?.id)
    .map((i) => i.id);
  
  // Menggunakan item_id
  const rentals = db.rentals.filter((r) => myIds.includes(r.item_id));
  
  return (
    <>
      <PageHeader
        eyebrow="Sebagai pemilik"
        title="Permintaan Masuk"
        description="Tinjau profil penyewa, jadwal, dan nilai transaksi sebelum memberikan keputusan."
      />
      {rentals.length ? (
        <div className="request-list">
          {rentals.map((r) => {
            // Menggunakan item_id dan renter_id
            const item = db.items.find((i) => i.id === r.item_id);
            const renter = db.users.find((u) => u.id === r.renter_id);
            
            return (
              <article className="request-card" key={r.id}>
                <img className="request-image" src={item?.image} />
                <div className="request-body">
                  <div className="request-head">
                    <div>
                      <small>SW-{r.id}</small>
                      <h3>{item?.name}</h3>
                    </div>
                    <StatusBadge status={r.status} />
                  </div>
                  <div className="request-user">
                    <img src={renter?.avatar} />
                    <div>
                      <strong>{renter?.name}</strong>
                      <span>
                        Rating {renter?.rating} • {renter?.address}
                      </span>
                    </div>
                  </div>
                  <div className="request-details">
                    <span>
                      <small>Periode</small>
                      <strong>
                        {/* Menggunakan start_date dan end_date */}
                        {formatDate(r.start_date)} – {formatDate(r.end_date)}
                      </strong>
                    </span>
                    <span>
                      <small>Durasi</small>
                      <strong>{r.days} hari</strong>
                    </span>
                    <span>
                      <small>Nilai sewa</small>
                      <strong>{formatCurrency(r.subtotal)}</strong>
                    </span>
                  </div>
                  {r.note && <p className="request-note">“{r.note}”</p>}
                  {r.status === "menunggu" && (
                    <div className="request-actions">
                      <button
                        className="button button-danger"
                        onClick={() => updateRental(r.id, { status: "ditolak" })}
                      >
                        <X size={17} />
                        Tolak
                      </button>
                      <button
                        className="button button-primary"
                        onClick={() => updateRental(r.id, { status: "diterima" })}
                      >
                        <Check size={17} />
                        Terima
                      </button>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="Belum ada permintaan"
          description="Permintaan penyewaan untuk barangmu akan tampil di halaman ini."
        />
      )}
    </>
  );
}