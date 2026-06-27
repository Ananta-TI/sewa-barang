import {
  Boxes,
  CircleDollarSign,
  ClipboardList,
  ShieldAlert,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import StatusBadge from "../../components/StatusBadge";
import { useDemo } from "../../contexts/DemoContext";
import { formatCurrency, formatDate } from "../../utils/format";

export default function AdminOverviewPage() {
  const { db } = useDemo();
  const gross = db.rentals
    .filter((r) => r.payment_status === "berhasil")
    .reduce((s, r) => s + r.subtotal, 0);
  const counts = db.categories.map((c) => ({
    name: c.name,
    value: db.items.filter((i) => i.category_id === c.id).length,
  }));
  const max = Math.max(...counts.map((c) => c.value), 1);
  return (
    <>
      <PageHeader
        eyebrow="Kontrol platform"
        title="Ringkasan Administrator"
        description="Pantau pengguna, barang, transaksi, dan laporan dari satu dashboard."
      />
      <div className="metric-grid admin-metrics">
        <div className="metric-card">
          <span>
            <Users />
          </span>
          <div>
            <small>Total pengguna</small>
            <strong>{db.users.length}</strong>
          </div>
        </div>
        <div className="metric-card">
          <span>
            <Boxes />
          </span>
          <div>
            <small>Total barang</small>
            <strong>{db.items.length}</strong>
          </div>
        </div>
        <div className="metric-card">
          <span>
            <ClipboardList />
          </span>
          <div>
            <small>Total penyewaan</small>
            <strong>{db.rentals.length}</strong>
          </div>
        </div>
        <div className="metric-card">
          <span>
            <ShieldAlert />
          </span>
          <div>
            <small>Laporan aktif</small>
            <strong>
              {db.reports.filter((r) => r.status !== "selesai").length}
            </strong>
          </div>
        </div>
        <div className="metric-card">
          <span>
            <CircleDollarSign />
          </span>
          <div>
            <small>Nilai sewa berhasil</small>
            <strong>{formatCurrency(gross)}</strong>
          </div>
        </div>
      </div>
      <div className="dashboard-two-col">
        <section className="panel">
          <div className="panel-head">
            <h2>Distribusi kategori</h2>
          </div>
          <div className="bar-chart">
            {counts.map((c) => (
              <div key={c.name}>
                <label>
                  {c.name}
                  <span>{c.value}</span>
                </label>
                <div>
                  <i style={{ width: `${(c.value / max) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>
        <section className="panel">
          <div className="panel-head">
            <h2>Laporan terbaru</h2>
            <Link to="/admin/laporan">Kelola</Link>
          </div>
          <div className="compact-list">
            {db.reports.slice(0, 5).map((r) => (
              <div key={r.id}>
                <span>
                  <strong>{r.reason}</strong>
                  <small>
                    {r.target_type} #{r.target_id} • {formatDate(r.created_at)}
                  </small>
                </span>
                <StatusBadge status={r.status} />
              </div>
            ))}
          </div>
        </section>
      </div>
      <section className="panel">
        <div className="panel-head">
          <h2>Transaksi terbaru</h2>
          <Link to="/admin/penyewaan">Lihat semua</Link>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Barang</th>
                <th>Penyewa</th>
                <th>Nilai</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {db.rentals.slice(0, 6).map((r) => {
                const item = db.items.find((i) => i.id === r.item_id);
                const user = db.users.find((u) => u.id === r.renter_id);
                return (
                  <tr key={r.id}>
                    <td>SW-{r.id}</td>
                    <td>{item?.name}</td>
                    <td>{user?.name}</td>
                    <td>{formatCurrency(r.total)}</td>
                    <td>
                      <StatusBadge status={r.status} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
