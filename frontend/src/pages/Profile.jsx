import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";
import "./Profile.css";

export default function Profile() {
  const [orders, setOrders] = useState([]);
  const accessToken = localStorage.getItem("access_token");

  useEffect(() => {
    if (!accessToken) return;
    API.get("orders/")
      .then((res) => setOrders(res.data))
      .catch(() => {});
  }, [accessToken]);

  if (!accessToken) {
    return (
      <div className="profile-container">
        <div className="profile-card">
          <h2>Welcome</h2>
          <p>Please login to view your profile and orders.</p>
          <div className="profile-actions">
            <Link className="button-primary" to="/login">Login</Link>
            <Link className="button-primary" to="/register">Register</Link>
          </div>
        </div>
      </div>
    );
  }

  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>Your Profile</h2>
        <p>You are logged in.</p>
        <div className="profile-actions">
          <Link className="button-primary" to="/cart">Go to Cart ({cart.length})</Link>
          <Link className="button-primary" to="/orders">View Orders</Link>
        </div>
      </div>

      <div className="profile-card">
        <h2>Recent Orders</h2>
        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="order-card">
              <h3>Order #{order.id}</h3>
              <p>Total items: {order.total_items}</p>
              <p>Total price: ${order.total_price}</p>
              <ul>
                {order.items.map((item, idx) => (
                  <li key={idx}>{item.product.title} x {item.quantity}</li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
