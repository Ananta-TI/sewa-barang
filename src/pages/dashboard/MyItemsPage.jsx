import { Edit3, Eye, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import ConfirmDialog from "../../components/ConfirmDialog";
import EmptyState from "../../components/EmptyState";
import PageHeader from "../../components/PageHeader";
import StatusBadge from "../../components/StatusBadge";
import { useDemo } from "../../contexts/DemoContext";
import { formatCurrency } from "../../utils/format";

export default function MyItemsPage() {
  const { db, currentUser, deleteItem } = useDemo();
  const [target, setTarget] = useState(null);
  const items = db.items.filter((i) => i.owner_id === currentUser.id);
  return (
    <>
      <PageHeader
        eyebrow="Inventaris pribadi"
        title="Barang Saya"
        description="Kelola informasi, harga, lokasi, dan ketersediaan barang."
        actions={
          <Link className="button button-primary" to="/dashboard/tambah-barang">
            <Plus size={18} />
            Tambah barang
          </Link>
        }
      />
      {items.length ? (
        <div className="panel">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Barang</th>
                  <th>Kategori</th>
                  <th>Harga</th>
                  <th>Status</th>
                  <th>Disewa</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => {
                  const category = db.categories.find(
                    (c) => c.id === item.category_id,
                  );
                  return (
                    <tr key={item.id}>
                      <td>
                        <div className="table-item">
                          <img src={item.image} />
                          <span>
                            <strong>{item.name}</strong>
                            <small>{item.address}</small>
                          </span>
                        </div>
                      </td>
                      <td>{category?.name}</td>
                      <td>{formatCurrency(item.price_per_day)}/hari</td>
                      <td>
                        <StatusBadge status={item.status} />
                      </td>
                      <td>{item.rented_count} kali</td>
                      <td>
                        <div className="table-actions">
                          <Link to={`/barang/${item.slug}`} title="Lihat">
                            <Eye size={17} />
                          </Link>
                          <Link
                            to={`/dashboard/barang/${item.id}/edit`}
                            title="Edit"
                          >
                            <Edit3 size={17} />
                          </Link>
                          <button onClick={() => setTarget(item)} title="Hapus">
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState
          title="Belum ada barang"
          description="Tambahkan barang yang jarang digunakan untuk mulai memperoleh penghasilan."
          action={
            <Link
              className="button button-primary"
              to="/dashboard/tambah-barang"
            >
              Tambah barang pertama
            </Link>
          }
        />
      )}
      <ConfirmDialog
        open={!!target}
        title="Hapus barang?"
        message={`Barang “${target?.name}” akan dihapus dari daftar.`}
        onCancel={() => setTarget(null)}
        onConfirm={() => {
          deleteItem(target.id);
          setTarget(null);
        }}
        confirmText="Hapus barang"
      />
    </>
  );
}
