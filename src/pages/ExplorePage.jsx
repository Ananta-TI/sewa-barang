import {
  Grid2X2,
  ListFilter,
  LocateFixed,
  Map,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import ItemCard from "../components/ItemCard";
import MapPreview from "../components/MapPreview";
import EmptyState from "../components/EmptyState";
import { useDemo } from "../contexts/DemoContext";
import { haversineKm } from "../utils/format";

export default function ExplorePage() {
  const { db, currentUser } = useDemo();
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState(params.get("q") || "");
  const [category, setCategory] = useState(params.get("kategori") || "");
  const [maxPrice, setMaxPrice] = useState(500000);
  const [radius, setRadius] = useState(20);
  const [sort, setSort] = useState("terdekat");
  const [view, setView] = useState("grid");
  const [userLocation, setUserLocation] = useState(
    currentUser?.latitude
      ? { lat: currentUser.latitude, lon: currentUser.longitude }
      : { lat: 0.5071, lon: 101.4478 },
  );
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    setParams(
      (prev) => {
        if (query) prev.set("q", query);
        else prev.delete("q");
        if (category) prev.set("kategori", category);
        else prev.delete("kategori");
        return prev;
      },
      { replace: true },
    );
  }, [query, category]);
  const locate = () =>
    navigator.geolocation?.getCurrentPosition(
      (pos) =>
        setUserLocation({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        }),
      () =>
        alert(
          "Lokasi tidak dapat dibaca. Lokasi demo Pekanbaru tetap digunakan.",
        ),
    );

  const results = useMemo(
    () =>
      db.items
        .map((item) => ({
          ...item,
          distance: haversineKm(
            userLocation.lat,
            userLocation.lon,
            item.latitude,
            item.longitude,
          ),
        }))
        .filter((item) => item.status === "tersedia")
        .filter(
          (item) =>
            !query ||
            `${item.name} ${item.description} ${item.address}`
              .toLowerCase()
              .includes(query.toLowerCase()),
        )
        .filter((item) => !category || item.category_id === Number(category))
        .filter((item) => item.price_per_day <= maxPrice)
        .filter((item) => item.distance == null || item.distance <= radius)
        .sort((a, b) =>
          sort === "harga_asc"
            ? a.price_per_day - b.price_per_day
            : sort === "harga_desc"
              ? b.price_per_day - a.price_per_day
              : sort === "rating"
                ? b.rating - a.rating
                : a.distance - b.distance,
        ),
    [db.items, query, category, maxPrice, radius, sort, userLocation],
  );

  return (
    <div className="container explore-page">
      <div className="explore-title">
        <div>
          <span className="eyebrow">Marketplace lokal</span>
          <h1>Jelajahi barang di sekitar</h1>
          <p>{results.length} barang ditemukan berdasarkan filter saat ini.</p>
        </div>
        <div className="view-switch">
          <button
            className={view === "grid" ? "active" : ""}
            onClick={() => setView("grid")}
          >
            <Grid2X2 size={18} /> Grid
          </button>
          <button
            className={view === "map" ? "active" : ""}
            onClick={() => setView("map")}
          >
            <Map size={18} /> Peta
          </button>
        </div>
      </div>
      <div className="explore-layout">
        <aside className="filter-panel">
          <div className="filter-title">
            <SlidersHorizontal size={19} />
            <strong>Filter pencarian</strong>
          </div>
          <label>
            Pencarian
            <div className="input-with-icon">
              <Search size={17} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Nama barang..."
              />
            </div>
          </label>
          <label>
            Kategori
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Semua kategori</option>
              {db.categories.map((entry) => (
                <option key={entry.id} value={entry.id}>
                  {entry.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Harga maksimum{" "}
            <strong>{new Intl.NumberFormat("id-ID").format(maxPrice)}</strong>
            <input
              type="range"
              min="50000"
              max="500000"
              step="25000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
            />
          </label>
          <label>
            Radius lokasi <strong>{radius} km</strong>
            <input
              type="range"
              min="1"
              max="50"
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
            />
          </label>
          <button
            className="button button-secondary button-block"
            onClick={locate}
          >
            <LocateFixed size={18} /> Gunakan lokasi saya
          </button>
          <button
            className="button button-ghost button-block"
            onClick={() => {
              setQuery("");
              setCategory("");
              setMaxPrice(500000);
              setRadius(50);
            }}
          >
            Reset filter
          </button>
        </aside>
        <div className="explore-results">
          <div className="result-toolbar">
            <span>
              <ListFilter size={18} />
              {results.length} hasil
            </span>
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="terdekat">Jarak terdekat</option>
              <option value="harga_asc">Harga termurah</option>
              <option value="harga_desc">Harga tertinggi</option>
              <option value="rating">Rating tertinggi</option>
            </select>
          </div>
          {view === "grid" ? (
            results.length ? (
              <div className="items-grid explore-grid">
                {results.map((item) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    distance={item.distance}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                title="Barang tidak ditemukan"
                description="Coba perluas radius atau ubah filter pencarian."
              />
            )
          ) : (
            <div className="map-view-wrap">
              <MapPreview
                items={results}
                userLocation={userLocation}
                onSelect={setSelected}
              />
              {selected && (
                <div className="map-selection">
                  <img src={selected.image} alt="" />
                  <div>
                    <strong>{selected.name}</strong>
                    <span>
                      {selected.distance?.toFixed(1)} km • {selected.address}
                    </span>
                  </div>
                  <Link
                    to={`/barang/${selected.slug}`}
                    className="button button-primary"
                  >
                    Lihat
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
