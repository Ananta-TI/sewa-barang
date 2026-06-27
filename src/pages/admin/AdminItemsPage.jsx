import { Eye, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import ConfirmDialog from "../../components/ConfirmDialog";
import PageHeader from "../../components/PageHeader";
import StatusBadge from "../../components/StatusBadge";
import { useDemo } from "../../contexts/DemoContext";
import { formatCurrency } from "../../utils/format";
export default function AdminItemsPage() {
  const { db, deleteItem } = useDemo();
  const [q, setQ] = useState("");
  const [target, setTarget] = useState(null);
  const items = db.items.filter((i) =>
    i.name.toLowerCase().includes(q.toLowerCase()),
  );
  return (
    <>
      <PageHeader
        eyebrow="Moderasi konten"
        title="Kelola Barang"
        description="Periksa barang yang ditawarkan dan hapus konten yang melanggar ketentuan."
        actions={
          <div className="input-with-icon admin-search">
            <Search size={17} />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Cari barang..."
            />
          </div>
        }
      />
      <div className="panel">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Barang</th>
                <th>Pemilik</th>
                <th>Harga</th>
                <th>Status</th>
                <th>Rating</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {items.map((i) => {
                const owner = db.users.find((u) => u.id === i.owner_id);
                return (
                  <tr key={i.id}>
                    <td>
                      <div className="table-item">
                        <img
                          src={i.image || "/items/default.svg"}
                          onError={(event) => {
                            event.currentTarget.src = "/items/default.svg";
                          }}
                        />
                        <span>
                          <strong>{i.name}</strong>
                          <small>{i.address}</small>
                        </span>
                      </div>
                    </td>
                    <td>{owner?.name}</td>
                    <td>{formatCurrency(i.price_per_day)}</td>
                    <td>
                      <StatusBadge status={i.status} />
                    </td>
                    <td>{i.rating}</td>
                    <td>
                      <div className="table-actions">
                        <Link to={`/barang/${i.slug}`}>
                          <Eye size={17} />
                        </Link>
                        <button onClick={() => setTarget(i)}>
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
      <ConfirmDialog
        open={!!target}
        title="Hapus barang dari platform?"
        message={`Tindakan ini menghapus “${target?.name}”.`}
        onCancel={() => setTarget(null)}
        onConfirm={() => {
          deleteItem(target.id);
          setTarget(null);
        }}
        confirmText="Hapus"
      />
    </>
  );
}
