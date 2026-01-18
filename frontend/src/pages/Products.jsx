// This component displays all products with search functionality
import { useEffect, useState } from "react";
import API from "../services/api";
import ProductCard from "../components/ProductCard";
import { toast } from "../lib/toast.jsx";
import "./Products.css";

export default function Products() {
  // State to store the list of products
  const [products, setProducts] = useState([]);
  // State to store the search term
  const [search, setSearch] = useState("");

  // This runs when the component first loads
  useEffect(() => {
    // Fetch all products from the backend
    API.get("products/")
      .then((response) => {
        // Try different ways the data might be structured
        let productList = [];
        
        if (response.data && response.data.results) {
          // If data is paginated, get results array
          productList = response.data.results;
        } else if (response.data && response.data.products) {
          // If data has a products property
          productList = response.data.products;
        } else if (Array.isArray(response.data)) {
          // If data is directly an array
          productList = response.data;
        }
        
        // Update the products state
        setProducts(productList);
      })
      .catch((error) => {
        // Log error to console if fetch fails
        console.error("Error fetching products:", error);
      });
  }, []);
  const addToCart = (product) => {
    try {
      const raw = localStorage.getItem("cart");
      const cart = raw ? JSON.parse(raw) : [];
      const existing = cart.find((item) => item.id === product.id);
      if (existing) {
        existing.quantity = (existing.quantity || 1) + 1;
      } else {
        cart.push({
          id: product.id,
          title: product.title,
          price: Number(product.price || 0),
          quantity: 1,
          image_url: product.image_url || product.thumbnail || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=300&auto=format&fit=crop",
        });
      }
      localStorage.setItem("cart", JSON.stringify(cart));
      toast.success("Added to cart");
    } catch (e) {
      console.error("Failed to add to cart", e);
      toast.error("Could not add to cart");
    }
  };

  // This function runs when user submits the search form
  const handleSearch = (event) => {
    // Prevent the page from refreshing
    event.preventDefault();
    
    // Don't search if search term is empty
    if (!search.trim()) {
      return;
    }
    
    // Search for products using the search term
    API.get(`products/?search=${encodeURIComponent(search)}`)
      .then((response) => {
        // Try different ways the data might be structured
        let productList = [];
        
        if (response.data && response.data.results) {
          productList = response.data.results;
        } else if (response.data && response.data.products) {
          productList = response.data.products;
        } else if (Array.isArray(response.data)) {
          productList = response.data;
        }
        
        // Update the products state with search results
        setProducts(productList);
      })
      .catch((error) => {
        // Log error to console if search fails
        console.error("Error searching products:", error);
      });
  };

  return (
    <div className="products-container">
      <form className="search-form" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="search-input"
        />
        <button className="search-btn" type="submit">
          Search
        </button>
      </form>

      <div className="products-grid">
        {products.length === 0 ? (
          <p className="products-empty">No products found.</p>
        ) : (
          products.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
          ))
        )}
      </div>
    </div>
  );
}
