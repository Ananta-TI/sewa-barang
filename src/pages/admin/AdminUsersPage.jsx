import { Ban, CheckCircle2, Search } from "lucide-react";
import { useState } from "react";
import PageHeader from "../../components/PageHeader";
import StatusBadge from "../../components/StatusBadge";
import { useDemo } from "../../contexts/DemoContext";
import { formatDate } from "../../utils/format";
export default function AdminUsersPage() {
  const { db, currentUser, setUserStatus } = useDemo();
  const [q, setQ] = useState("");
  const users = db.users.filter(
    (u) =>
      u.id !== currentUser.id &&
      `${u.name} ${u.email}`.toLowerCase().includes(q.toLowerCase()),
  );
  return (
    <>
      <PageHeader
        eyebrow="Manajemen akun"
        title="Kelola Pengguna"
        description="Tinjau profil, status, dan aktivitas akun pada platform."
        actions={
          <div className="input-with-icon admin-search">
            <Search size={17} />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Cari pengguna..."
            />
          </div>
        }
      />
      <div className="panel">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Pengguna</th>
                <th>Kontak</th>
                <th>Peran</th>
                <th>Bergabung</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>
                    <div className="table-item">
                      <img src={u.avatar} />
                      <span>
                        <strong>{u.name}</strong>
                        <small>Rating {u.rating || 0}</small>
                      </span>
                    </div>
                  </td>
                  <td>
                    {u.email}
                    <br />
                    <small>{u.phone}</small>
                  </td>
                  <td>{u.role}</td>
                  <td>{formatDate(u.joined_at)}</td>
                  <td>
                    <StatusBadge status={u.status} />
                  </td>
                  <td>
                    {u.status === "aktif" ? (
                      <button
                        className="table-action-text danger"
                        onClick={() => setUserStatus(u.id, "diblokir")}
                      >
                        <Ban size={16} />
                        Blokir
                      </button>
                    ) : (
                      <button
                        className="table-action-text"
                        onClick={() => setUserStatus(u.id, "aktif")}
                      >
                        <CheckCircle2 size={16} />
                        Aktifkan
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
