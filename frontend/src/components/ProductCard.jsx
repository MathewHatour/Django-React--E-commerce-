import { Link } from "react-router-dom";
// Styles now handled at the page/component level; no central styles import

const PLACEHOLDER_IMG =
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop";

export default function ProductCard({ product, onAddToCart }) {
  const img = product.image_url || product.thumbnail || PLACEHOLDER_IMG;
  return (
    <div className="product-card">
      <Link to={`/products/${product.id}`} className="product-image-link">
        <img className="product-image" src={img} alt={product.title} />
      </Link>
      <h3>{product.title}</h3>
      <p>${product.price}</p>
      <div className="product-actions">
        <Link to={`/products/${product.id}`}>
          <button className="button-primary">View Details</button>
        </Link>
        <button className="button-primary" onClick={() => onAddToCart?.(product)}>Add to Cart</button>
      </div>
    </div>
  );
}
