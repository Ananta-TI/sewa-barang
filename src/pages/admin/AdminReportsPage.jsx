import { CheckCircle2, Clock3 } from "lucide-react";
import PageHeader from "../../components/PageHeader";
import StatusBadge from "../../components/StatusBadge";
import { useDemo } from "../../contexts/DemoContext";
import { formatDate } from "../../utils/format";
export default function AdminReportsPage() {
  const { db, resolveReport } = useDemo();
  return (
    <>
      <PageHeader
        eyebrow="Keamanan platform"
        title="Laporan & Sengketa"
        description="Tinjau laporan pengguna dan catat penyelesaiannya."
      />
      <div className="report-admin-grid">
        {db.reports.map((r) => {
          const reporter = db.users.find((u) => u.id === r.reporter_id);
          return (
            <article className="panel report-admin-card" key={r.id}>
              <div className="report-admin-head">
                <span>
                  <small>Laporan #{r.id}</small>
                  <h3>{r.reason}</h3>
                </span>
                <StatusBadge status={r.status} />
              </div>
              <p>{r.description}</p>
              <dl>
                <div>
                  <dt>Pelapor</dt>
                  <dd>{reporter?.name}</dd>
                </div>
                <div>
                  <dt>Target</dt>
                  <dd>
                    {r.target_type} #{r.target_id}
                  </dd>
                </div>
                <div>
                  <dt>Tanggal</dt>
                  <dd>{formatDate(r.created_at)}</dd>
                </div>
              </dl>
              <div className="report-admin-actions">
                {r.status === "menunggu" && (
                  <button
                    className="button button-secondary"
                    onClick={() => resolveReport(r.id, "diproses")}
                  >
                    <Clock3 size={17} />
                    Proses
                  </button>
                )}
                {r.status !== "selesai" && (
                  <button
                    className="button button-primary"
                    onClick={() => resolveReport(r.id, "selesai")}
                  >
                    <CheckCircle2 size={17} />
                    Selesaikan
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}
