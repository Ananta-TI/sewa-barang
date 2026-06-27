import { statusLabel } from "../utils/format";
export default function StatusBadge({ status }) {
  const tone = [
    "selesai",
    "berhasil",
    "aktif",
    "tersedia",
    "diterima",
    "sudah_diambil",
    "sudah_dikembalikan",
  ].includes(status)
    ? "success"
    : ["ditolak", "gagal", "diblokir", "dibatalkan", "tidak_tersedia"].includes(
          status,
        )
      ? "danger"
      : "warning";
  return <span className={`badge badge-${tone}`}>{statusLabel(status)}</span>;
}
