import { MapPin, PackageCheck } from "lucide-react";
import { Link } from "react-router-dom";

export default function Logo({ compact = false }) {
  return (
    <Link to="/" className="logo" aria-label="SewaBarangSekitar">
      <span className="logo-mark">
        <PackageCheck size={22} />
        <MapPin size={12} />
      </span>
      {!compact && (
        <span>
          SewaBarang<span>Sekitar</span>
        </span>
      )}
    </Link>
  );
}
