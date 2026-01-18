// This component displays detailed information about a single product
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";
import { toast } from "../lib/toast.jsx";
import "../styles/ProductDetails.css";

export default function ProductDetails() {
  // Get the product ID from the URL
  const { id } = useParams();
  
  // State to store the product data
  const [product, setProduct] = useState(null);
  // State to store any error message
  const [error, setError] = useState(null);

  // This runs when the component loads or when the product ID changes
  useEffect(() => {
    // Clear any previous errors
    setError(null);
    
    // Fetch the product details from the backend
    API.get(`products/${id}/`)
      .then((response) => {
        // Update the product state with the fetched data
        setProduct(response.data);
      })
      .catch((error) => {
        // Log error to console
        console.error("Error fetching product:", error);
        // Set error message
        setError("Product not found.");
      });
  }, [id]);

  // This function runs when user clicks "Add to Cart"
  const addToCart = () => {
    // Don't do anything if product data is not loaded
    if (!product) {
      return;
    }
    
    // Get the current cart from local storage
    const savedCart = localStorage.getItem("cart");
    let cart = [];
    
    if (savedCart) {
      // Parse the cart from JSON string to array
      cart = JSON.parse(savedCart);
    }
    
    // Check if this product is already in the cart
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      // If product is already in cart, increase quantity by 1
      existingItem.quantity += 1;
    } else {
      // If product is not in cart, add it with quantity 1
      cart.push({
        id: product.id,
        title: product.title,
        price: Number(product.price),
        image_url: product.image_url || product.thumbnail,
        quantity: 1,
      });
    }
    
    // Save the updated cart to local storage
    localStorage.setItem("cart", JSON.stringify(cart));
    
    // Show success message
    toast.success(`${product.title} added to cart`);
  };

  // Show error message if product not found
  if (error) {
    return <p className="details-message">{error}</p>;
  }
  
  // Show loading message while fetching product
  if (!product) {
    return <p>Loading...</p>;
  }

  // Calculate the price as a number and format it to 2 decimal places
  const productPrice = Number(product.price || 0);
  const formattedPrice = productPrice.toFixed(2);
  
  // Get the product image URL (try different possible field names)
  const productImage = product.image_url || product.thumbnail || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop";

  // Rating and reviews
  const rating = Number(product.rating ?? 0);
  const reviews = Number(product.reviews_count ?? 0);
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  return (
    <div className="details-container">
      <div className="details-card">
        <img
          className="product-image"
          src={productImage}
          alt={product.title}
        />
        <h2>{product.title}</h2>
        <div className="details-rating">
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
        <p>{product.description}</p>
        <p>Price: ${formattedPrice}</p>

        <button className="button-primary" onClick={addToCart}>
          Add to Cart
        </button>
      </div>
    </div>
  );
}
