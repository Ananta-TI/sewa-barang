import { MapPin } from "lucide-react";
import { coordsToPercent } from "../data/locations";

export default function MapPreview({ items = [], userLocation, onSelect }) {
  return (
    <div className="fake-map" aria-label="Peta lokasi barang">
      <div className="map-road road-a" />
      <div className="map-road road-b" />
      <div className="map-road road-c" />
      <span className="map-label label-a">Pekanbaru</span>
      <span className="map-label label-b">Marpoyan</span>
      <span className="map-label label-c">Rumbai</span>
      {userLocation && (
        <div
          className="map-user-marker"
          style={coordsToPercent(userLocation.lat, userLocation.lon)}
          title="Lokasi Anda"
        >
          <span />
        </div>
      )}
      {items.map((item) => (
        <button
          type="button"
          key={item.id}
          className="map-item-marker"
          style={coordsToPercent(item.latitude, item.longitude)}
          onClick={() => onSelect?.(item)}
          title={item.name}
        >
          <MapPin size={18} />
          <span>{item.name}</span>
        </button>
      ))}
    </div>
  );
}
