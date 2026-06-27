import { LocateFixed, MapPin } from "lucide-react";
import {
  coordsToPercent,
  DEFAULT_LOCATION,
  LOCATION_PRESETS,
  percentToCoords,
} from "../data/locations";

export default function LocationPicker({ value, onChange }) {
  const location = {
    address: value?.address || DEFAULT_LOCATION.address,
    latitude: Number(value?.latitude || DEFAULT_LOCATION.latitude),
    longitude: Number(value?.longitude || DEFAULT_LOCATION.longitude),
  };

  const setLocation = (next) => onChange?.({ ...location, ...next });

  const pickFromMap = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const leftPercent = ((event.clientX - rect.left) / rect.width) * 100;
    const topPercent = ((event.clientY - rect.top) / rect.height) * 100;
    const coords = percentToCoords(leftPercent, topPercent);
    setLocation({
      ...coords,
      address: location.address || "Titik pilihan di Pekanbaru",
    });
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert(
        "Browser belum mendukung pembacaan lokasi. Silakan pilih titik pada map.",
      );
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) =>
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          address: location.address || "Lokasi saya",
        }),
      () => alert("Lokasi tidak dapat dibaca. Silakan pilih titik pada map."),
    );
  };

  return (
    <div className="location-picker">
      <div className="location-picker-head">
        <div>
          <strong>Tandai lokasi pengambilan</strong>
          <p>
            Klik area map untuk memindahkan pin seperti memilih titik jemput.
          </p>
        </div>
        <button
          type="button"
          className="button button-secondary"
          onClick={useCurrentLocation}
        >
          <LocateFixed size={18} /> Pakai lokasi saya
        </button>
      </div>

      <div
        className="location-map"
        onClick={pickFromMap}
        role="button"
        tabIndex="0"
        aria-label="Pilih titik lokasi pada map"
      >
        <div className="map-road road-a" />
        <div className="map-road road-b" />
        <div className="map-road road-c" />
        <span className="map-label label-a">Pekanbaru</span>
        <span className="map-label label-b">Marpoyan</span>
        <span className="map-label label-c">Rumbai</span>
        <div
          className="location-pin"
          style={coordsToPercent(location.latitude, location.longitude)}
        >
          <MapPin size={34} />
          <span>Lokasi barang</span>
        </div>
      </div>

      <div className="location-preset-list">
        {LOCATION_PRESETS.map((entry) => (
          <button
            type="button"
            key={entry.id}
            onClick={() => setLocation(entry)}
            className={location.address === entry.address ? "active" : ""}
          >
            {entry.name}
          </button>
        ))}
      </div>

      <small className="field-help">
        Titik map akan disimpan otomatis untuk fitur jarak terdekat dan petunjuk
        arah saat aplikasi di-hosting.
      </small>
    </div>
  );
}
