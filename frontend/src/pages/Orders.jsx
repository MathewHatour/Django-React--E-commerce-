import { useEffect, useState } from "react";
import API from "../services/api";
import { toast } from "../lib/toast.jsx";
import "./Orders.css";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const res = await API.get("orders/");
      setOrders(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch orders. Make sure you are logged in.");
    }
  };

  const removeOrder = async (orderId) => {
    if (!confirm("Remove this order? This cannot be undone.")) return;
    try {
      await API.delete(`orders/${orderId}/`);
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
      toast.success("Order removed");
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove order");
    }
  };

  // Embedded cart editor (adjust quantities before placing order)
  const [cart, setCartState] = useState([]);
  useEffect(() => {
    setCartState(JSON.parse(localStorage.getItem("cart")) || []);
  }, []);

  const updateQuantity = (id, delta) => {
    const updated = cart.map(p => {
      if (p.id === id) {
        const qty = Math.max(1, p.quantity + delta);
        return { ...p, quantity: qty };
      }
      return p;
    });
    setCartState(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const placeOrder = async () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.length === 0) {
      toast("Cart is empty", { icon: "🛒" });
      return;
    }
    try {
      await API.post("orders/", { items: cart });
      toast.success("Order placed!");
      localStorage.removeItem("cart");
      fetchOrders(); // Refresh order list
    } catch (err) {
      console.error(err);
      toast.error("Failed to place order. Make sure you are logged in.");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="orders-container">
      <h2>My Orders</h2>
      <div style={{ margin: "12px 0" }}>
        <h3>Your Cart</h3>
        {cart.length === 0 ? (
          <p>No items in cart.</p>
        ) : (
          <ul>
            {cart.map((p) => (
              <li key={p.id}>
                {p.title} — ${p.price} x {p.quantity}
                <button className="button-primary" style={{ marginLeft: 8 }} onClick={() => updateQuantity(p.id, -1)}>-</button>
                <button className="button-primary" style={{ marginLeft: 6 }} onClick={() => updateQuantity(p.id, 1)}>+</button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <button className="button-primary" onClick={placeOrder}>Place Order</button>
      {orders.map((order) => (
        <div key={order.id} className="order-card">
          <div className="order-header">
            <h3>Order #{order.id}</h3>
            <button className="button-danger" onClick={() => removeOrder(order.id)}>Remove Order</button>
          </div>
          <div className="order-meta">
            <p>Total items: {order.total_items}</p>
            <p>Total price: ${order.total_price}</p>
          </div>
          <ul className="order-items">
            {order.items.map((item, idx) => (
              <li key={idx} className="order-item-row">
                <img
                  className="thumb"
                  src={item.product.image_url || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=200&auto=format&fit=crop"}
                  alt={item.product.title}
                />
                <span>{item.product.title} — ${item.product.price} × {item.quantity}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
