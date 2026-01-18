// This component displays a single product card
import { Link } from "react-router-dom";
import "./ProductCard.css";

// Fallback image in case the product has no image
const fallbackImg = "https://via.placeholder.com/180x140?text=No+Image";

export default function ProductCard({ product, onAddToCart }) {
  // Get the product image URL (try different possible field names)
  const imageUrl = product.image_url || product.thumbnail || product.images?.[0] || fallbackImg;
  
  // Get the product price and convert it to a number
  const productPrice = Number(product.price ?? 0);
  // Format the price to 2 decimal places
  const formattedPrice = productPrice.toFixed(2);

  // Rating and reviews
  const rating = Number(product.rating ?? 0);
  const reviews = Number(product.reviews_count ?? 0);
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  return (
    <div className="product-card">
      {/* Top-right add-to-cart icon button */}
      <button
        className="card-cart-btn"
        aria-label="Add to cart"
        onClick={() => onAddToCart?.(product)}
        title="Add to cart"
      >
        <i className="fa-solid fa-cart-plus"></i>
      </button>

      <img className="product-image" src={imageUrl} alt={product.title} />
      <h3 className="product-title">{product.title}</h3>

      {/* Rating stars + reviews count */}
      <div className="product-rating">
        {Array.from({ length: fullStars }).map((_, i) => (
          <i key={`full-${i}`} className="fa-solid fa-star"></i>
        ))}
        {hasHalf && <i className="fa-solid fa-star-half-stroke"></i>}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <i key={`empty-${i}`} className="fa-regular fa-star"></i>
        ))}
        <span className="rating-number">{rating.toFixed(1)}</span>
        <span className="reviews-count">({reviews})</span>
      </div>

      <div className="product-meta">
        <span className="product-price">${formattedPrice}</span>
        <Link to={`/products/${product.id}`} className="view-btn">
          View
        </Link>
      </div>
    </div>
  );
}
