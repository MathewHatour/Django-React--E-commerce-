import { useState, useEffect } from "react";
import API from "../services/api";
import { toast } from "../lib/toast.jsx";
import "./Cart.css";

export default function Cart() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem("cart")) || []);
  }, []);

  const removeFromCart = (id) => {
    const updated = cart.filter(p => p.id !== id);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const updateQuantity = (id, delta) => {
    const updated = cart.map(p => {
      if (p.id === id) {
        const qty = Math.max(1, p.quantity + delta);
        return { ...p, quantity: qty };
      }
      return p;
    });
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const placeOrder = async () => {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) { toast("You must login first to place an order", { icon: "🔒" }); return; }

    try {
      await API.post("orders/", { items: cart }); // Django orders endpoint
      toast.success("Order placed successfully!");
      localStorage.removeItem("cart");
      setCart([]);
    } catch (err) {
      toast.error("Failed to place order. Make sure you are logged in.");
    }
  };

  const total = cart.reduce((sum, p) => sum + p.price * p.quantity, 0);

  return (
    <div className="cart-container">
      <h2>Cart</h2>
      {cart.length === 0 ? (
        <p className="products-empty">Cart is empty</p>
      ) : (
        <>
          {cart.map((p) => (
            <div key={p.id} className="cart-item">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <img className="thumb" src={p.image_url || p.thumbnail || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=200&auto=format&fit=crop"} alt={p.title} />
                <div>
                  <h4>{p.title}</h4>
                  <span>Quantity: {p.quantity}</span>
                </div>
              </div>
              <div>
                <button className="button-primary" onClick={() => updateQuantity(p.id, -1)}>-</button>
                <button className="button-primary" style={{ marginLeft: 8 }} onClick={() => updateQuantity(p.id, 1)}>+</button>
                <span style={{ marginLeft: 12 }}>${p.price * p.quantity}</span>
                <button className="button-primary" style={{ marginLeft: 12 }} onClick={() => removeFromCart(p.id)}>Remove</button>
              </div>
            </div>
          ))}
          <div className="cart-total">Total: ${total}</div>
          <button className="button-primary" onClick={placeOrder}>Place Order</button>
        </>
      )}
    </div>
  );
}
