import { useEffect, useState } from "react";
import dummyAPI from "../services/dummyApi";
import ProductCard from "../components/ProductCard";
import "./Home.css";
import { toast } from "../lib/toast.jsx";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    dummyAPI.get("/products")
      .then(res => setProducts(res.data.products))
      .catch(err => console.error(err));
  };

  const handleSearch = (e) => {
    e.preventDefault();

    if (!query.trim()) {
      fetchProducts(); // reset list
      return;
    }

    dummyAPI.get(`/products/search?q=${encodeURIComponent(query)}`)
      .then(res => setProducts(res.data.products))
      .catch(err => console.error(err));
  };

  return (
    <div className="home-container">

      {/* SEARCH BAR */}
      <form className="search-bar" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {/* PRODUCTS */}
      <div className="products-grid">
        {products.map(product => (
          <ProductCard
            key={product.id}
            product={{
              id: product.id,
              title: product.title,
              price: product.price,
              image_url: product.thumbnail,
              description: product.description,
            }}
            onAddToCart={(p) => {
              let cart = JSON.parse(localStorage.getItem("cart")) || [];
              const exists = cart.find(x => x.id === p.id);
              if (exists) {
                exists.quantity += 1;
              } else {
                cart.push({ ...p, quantity: 1 });
              }
              localStorage.setItem("cart", JSON.stringify(cart));
              toast.success(`${p.title} added to cart`);
            }}
          />
        ))}
      </div>

    </div>
  );
}
