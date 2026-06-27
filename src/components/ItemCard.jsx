import { Heart, MapPin, Star } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDemo } from "../contexts/DemoContext";
import { formatCurrency } from "../utils/format";

export default function ItemCard({ item, distance }) {
  const { db, currentUser, toggleFavorite } = useDemo();
  const navigate = useNavigate();
  const category = db.categories.find((entry) => entry.id === item.category_id);
  const isFavorite = db.favorites.some(
    (entry) => entry.user_id === currentUser?.id && entry.item_id === item.id,
  );
  const owner = db.users.find((entry) => entry.id === item.owner_id);

  const onFavorite = (event) => {
    event.preventDefault();
    try {
      toggleFavorite(item.id);
    } catch {
      navigate("/login");
    }
  };

  return (
    <Link to={`/barang/${item.slug}`} className="item-card">
      <div className="item-card-image-wrap">
        <img
          src={item.image || "/items/default.svg"}
          alt={item.name}
          className="item-card-image"
          onError={(event) => {
            event.currentTarget.src = "/items/default.svg";
          }}
        />
        <button
          type="button"
          className={`favorite-button ${isFavorite ? "active" : ""}`}
          onClick={onFavorite}
          aria-label="Simpan barang"
        >
          <Heart size={19} fill={isFavorite ? "currentColor" : "none"} />
        </button>
        <span className="category-pill">{category?.name}</span>
      </div>
      <div className="item-card-body">
        <div className="item-card-rating">
          <Star size={15} fill="currentColor" />
          <strong>{item.rating || "Baru"}</strong>
          <span>({item.review_count})</span>
        </div>
        <h3>{item.name}</h3>
        <p className="location-line">
          <MapPin size={15} />
          {distance != null ? `${distance.toFixed(1)} km` : item.address}
        </p>
        <div className="owner-mini">
          <img src={owner?.avatar} alt="" />
          <span>{owner?.name}</span>
        </div>
        <div className="item-card-footer">
          <div>
            <strong>{formatCurrency(item.price_per_day)}</strong>
            <span>/hari</span>
          </div>
          <span className="condition">{item.condition}</span>
        </div>
      </div>
    </Link>
  );
}
