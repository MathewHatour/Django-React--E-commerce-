import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import dummyAPI from "../services/dummyApi";
import { toast } from "../lib/toast.jsx";
import "./ProductDetails.css";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    dummyAPI.get(`/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(err => console.error(err));
  }, [id]);

  const addToCart = () => {
    if (!product) return;
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const exists = cart.find(p => p.id === product.id);
    if (exists) {
      exists.quantity += 1;
    } else {
      cart.push({ id: product.id, title: product.title, price: product.price, image_url: product.thumbnail, quantity: 1 });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    toast.success(`${product.title} added to cart`);
  };

  if (!product) return <p>Loading...</p>;

  return (
    <div className="details-container">
      <div className="details-card">
        <img
          className="product-image"
          src={product.thumbnail || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop"}
          alt={product.title}
        />
        <h2>{product.title}</h2>
        <p>{product.description}</p>
        <p>Price: ${product.price}</p>

        <button className="button-primary" onClick={addToCart}>Add to Cart</button>
      </div>
    </div>
  );
}
