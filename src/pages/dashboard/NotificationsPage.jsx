import { BellRing, CheckCheck } from "lucide-react";
import EmptyState from "../../components/EmptyState";
import PageHeader from "../../components/PageHeader";
import { useDemo } from "../../contexts/DemoContext";
import { formatDateTime } from "../../utils/format";
export default function NotificationsPage() {
  const { db, currentUser, markNotificationRead, markAllRead } = useDemo();
  const notes = db.notifications
    .filter((n) => n.user_id === currentUser.id)
    .sort((a, b) => b.id - a.id);
  return (
    <>
      <PageHeader
        eyebrow="Pembaruan akun"
        title="Notifikasi"
        description="Perubahan status transaksi dan aktivitas penting akan muncul di sini."
        actions={
          <button className="button button-secondary" onClick={markAllRead}>
            <CheckCheck size={18} />
            Tandai semua dibaca
          </button>
        }
      />
      {notes.length ? (
        <div className="notification-list">
          {notes.map((n) => (
            <button
              key={n.id}
              className={`notification-card ${n.read ? "" : "unread"}`}
              onClick={() => markNotificationRead(n.id)}
            >
              <span>
                <BellRing size={20} />
              </span>
              <div>
                <strong>{n.title}</strong>
                <p>{n.message}</p>
                <small>{formatDateTime(n.created_at)}</small>
              </div>
              {!n.read && <i />}
            </button>
          ))}
        </div>
      ) : (
        <EmptyState title="Belum ada notifikasi" />
      )}
    </>
  );
}
