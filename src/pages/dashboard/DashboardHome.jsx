import {
  ArrowUpRight,
  Boxes,
  CircleDollarSign,
  ClipboardList,
  Heart,
  Plus,
  Star,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import StatusBadge from "../../components/StatusBadge";
import { useDemo } from "../../contexts/DemoContext";
import { formatCurrency, formatDate } from "../../utils/format";

export default function DashboardHome() {
  const { db, currentUser } = useDemo();

  // Memastikan semua relasi menggunakan snake_case bawaan Supabase
  const myItems = db.items.filter((i) => i.owner_id === currentUser?.id);
  const myRentals = db.rentals.filter((r) => r.renter_id === currentUser?.id);
  const incoming = db.rentals.filter((r) =>
    myItems.some((i) => i.id === r.item_id)
  );
  const favorites = db.favorites.filter((f) => f.user_id === currentUser?.id);

  // Kalkulasi total pendapatan dari transaksi yang sudah selesai
  const income = incoming
    .filter((r) => r.status === "selesai")
    .reduce((s, r) => s + (r.subtotal || 0), 0);

  // Menggabungkan dan mengurutkan aktivitas terbaru (maksimal 5)
  const recent = [...myRentals, ...incoming]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at) || b.id - a.id)
    .slice(0, 5);

  // Kalkulasi data mockup dinamis untuk progress bar reputasi
  const responseRate = currentUser?.rating >= 4.5 ? 98 : 85;
  const accuracyRate = incoming.length > 0 ? 95 : 100;
  const profileCompletion = currentUser?.avatar && currentUser?.address ? 100 : 70;

  return (
    <div className="dashboard-container">
      <PageHeader
        eyebrow="Ringkasan akun"
        title={`Halo, ${currentUser?.name?.split(" ")[0] || "Guest"}! 👋`}
        description="Pantau aktivitas sewa dan manajemen barangmu dari satu tempat."
        actions={
          <Link to="/dashboard/tambah-barang" className="button button-primary shadow-sm">
            <Plus size={18} />
            Tambah barang
          </Link>
        }
      />

      {/* METRIC CARDS - Layout Responsif Grid */}
      <div className="metric-grid">
        <div className="metric-card hover-lift">
          <div className="metric-icon bg-blue-light">
            <Boxes className="text-blue" />
          </div>
          <div className="metric-info">
            <small>Barang Aktif</small>
            <strong>{myItems.length}</strong>
          </div>
        </div>

        <div className="metric-card hover-lift">
          <div className="metric-icon bg-orange-light">
            <ClipboardList className="text-orange" />
          </div>
          <div className="metric-info">
            <small>Permintaan Masuk</small>
            <strong>
              {incoming.filter((r) => r.status === "menunggu").length}
            </strong>
          </div>
        </div>

        <div className="metric-card hover-lift">
          <div className="metric-icon bg-pink-light">
            <Heart className="text-pink" />
          </div>
          <div className="metric-info">
            <small>Barang Favorit</small>
            <strong>{favorites.length}</strong>
          </div>
        </div>

        <div className="metric-card hover-lift">
          <div className="metric-icon bg-green-light">
            <CircleDollarSign className="text-green" />
          </div>
          <div className="metric-info">
            <small>Pendapatan Selesai</small>
            <strong>{formatCurrency(income)}</strong>
          </div>
        </div>
      </div>

      <div className="dashboard-two-col mt-6">
        {/* TABEL AKTIVITAS TERBARU */}
        <section className="panel flex-1">
          <div className="panel-head flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp size={20} className="text-gray-500" />
              <h2>Aktivitas Terbaru</h2>
            </div>
            <Link to="/dashboard/penyewaan" className="text-link flex items-center gap-1 text-sm">
              Lihat semua <ArrowUpRight size={16}/>
            </Link>
          </div>

          <div className="table-responsive">
            {recent.length > 0 ? (
              <table className="w-full">
                <thead>
                  <tr>
                    <th>Barang</th>
                    <th>Peran</th>
                    <th>Tanggal</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((r) => {
                    const item = db.items.find((i) => i.id === r.item_id);
                    const isRenter = r.renter_id === currentUser?.id;
                    return (
                      <tr key={`${r.id}-${isRenter ? 'renter' : 'owner'}`} className="hover-bg-gray">
                        <td>
                          <div className="table-item flex items-center gap-3">
                            <img 
                              src={item?.image || '/items/default.svg'} 
                              alt={item?.name} 
                              className="w-10 h-10 rounded-md object-cover" 
                            />
                            <div className="flex flex-col">
                              <strong className="text-sm font-semibold">{item?.name || 'Barang Dihapus'}</strong>
                              <small className="text-xs text-gray-500">SW-{r.id}</small>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className={`role-badge px-2 py-1 rounded text-xs font-medium ${isRenter ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                            {isRenter ? "Penyewa" : "Pemilik"}
                          </span>
                        </td>
                        <td className="text-sm">{formatDate(r.start_date)}</td>
                        <td>
                          <StatusBadge status={r.status} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="empty-table-state p-8 text-center text-gray-500 border border-dashed rounded-lg">
                <ClipboardList size={32} className="mx-auto mb-3 text-gray-400" />
                <p>Belum ada aktivitas transaksi sewa menyewa.</p>
              </div>
            )}
          </div>
        </section>

        {/* PANEL REPUTASI */}
        <section className="panel reputation-panel">
          <div className="panel-head mb-4">
            <h2>Reputasi Akun</h2>
          </div>
          
          <div className="rating-big flex flex-col items-center justify-center p-5 bg-gray-50 rounded-lg mb-6 border border-gray-100">
            <div className="flex items-center gap-2 text-yellow-500 mb-1">
              <Star fill="currentColor" size={28} />
              <strong className="text-4xl text-gray-900 font-bold">{currentUser?.rating || 0}</strong>
            </div>
            <span className="text-sm text-gray-500">Rating rata-rata pengguna</span>
          </div>

          <div className="reputation-bars space-y-5">
            <div className="progress-group">
              <div className="flex justify-between text-sm mb-2">
                <label className="font-medium text-gray-700">Respons pemilik</label>
                <span className="text-gray-500 font-semibold">{responseRate}%</span>
              </div>
              <progress value={responseRate} max="100" className="w-full h-2 rounded-full overflow-hidden bg-gray-200 text-blue-500" />
            </div>
            
            <div className="progress-group">
              <div className="flex justify-between text-sm mb-2">
                <label className="font-medium text-gray-700">Ketepatan transaksi</label>
                <span className="text-gray-500 font-semibold">{accuracyRate}%</span>
              </div>
              <progress value={accuracyRate} max="100" className="w-full h-2 rounded-full overflow-hidden bg-gray-200 text-green-500" />
            </div>
            
            <div className="progress-group">
              <div className="flex justify-between text-sm mb-2">
                <label className="font-medium text-gray-700">Kelengkapan profil</label>
                <span className="text-gray-500 font-semibold">{profileCompletion}%</span>
              </div>
              <progress value={profileCompletion} max="100" className="w-full h-2 rounded-full overflow-hidden bg-gray-200 text-purple-500" />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}