import { PackageOpen } from "lucide-react";
export default function EmptyState({
  title = "Belum ada data",
  description = "Data akan muncul di sini.",
  action,
}) {
  return (
    <div className="empty-state">
      <PackageOpen size={42} />
      <h3>{title}</h3>
      <p>{description}</p>
      {action}
    </div>
  );
}
