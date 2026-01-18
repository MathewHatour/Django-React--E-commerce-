import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";
import { toast } from "../lib/toast.jsx";
import "./Profile.css";

export default function Profile() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const accessToken = localStorage.getItem("access_token");
  const username = localStorage.getItem("username");

  useEffect(() => {
    if (!accessToken) {
      setLoading(false);
      return;
    }
    API.get("orders/")
      .then((res) => {
        setOrders(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [accessToken]);

  if (!accessToken) {
    return (
      <div className="profile-container">
        <div className="profile-welcome-card">
          <div className="profile-icon">
            <i className="fa-solid fa-user"></i>
          </div>
          <h2>Welcome to MyShop</h2>
          <p>Please log in to view your profile, manage orders, and track your purchases.</p>
          <div className="profile-actions">
            <Link to="/login" className="button-primary">
              <i className="fa-solid fa-right-to-bracket"></i> Login
            </Link>
            <Link to="/register" className="button-secondary">
              <i className="fa-solid fa-user-plus"></i> Register
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartTotal = cart.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
  const totalOrders = orders.length;
  const totalSpent = orders.reduce((sum, order) => sum + parseFloat(order.total_price || 0), 0);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", { 
        year: "numeric", 
        month: "short", 
        day: "numeric" 
      });
    } catch {
      return "N/A";
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          <i className="fa-solid fa-user"></i>
        </div>
        <div className="profile-info">
          <h1>{username || "User"}</h1>
          <p className="profile-email">Member since {new Date().getFullYear()}</p>
        </div>
      </div>

      <div className="profile-stats">
        <div className="stat-card">
          <div className="stat-icon cart-icon">
            <i className="fa-solid fa-cart-shopping"></i>
          </div>
          <div className="stat-content">
            <h3>{cart.length}</h3>
            <p>Items in Cart</p>
          </div>
          <Link to="/cart" className="stat-link">
            View Cart <i className="fa-solid fa-arrow-right"></i>
          </Link>
        </div>

        <div className="stat-card">
          <div className="stat-icon orders-icon">
            <i className="fa-solid fa-box"></i>
          </div>
          <div className="stat-content">
            <h3>{totalOrders}</h3>
            <p>Total Orders</p>
          </div>
          <Link to="/orders" className="stat-link">
            View Orders <i className="fa-solid fa-arrow-right"></i>
          </Link>
        </div>

        <div className="stat-card">
          <div className="stat-icon total-icon">
            <i className="fa-solid fa-dollar-sign"></i>
          </div>
          <div className="stat-content">
            <h3>${totalSpent.toFixed(2)}</h3>
            <p>Total Spent</p>
          </div>
        </div>
      </div>

      {cart.length > 0 && (
        <div className="profile-section">
          <div className="section-header">
            <h2>
              <i className="fa-solid fa-shopping-cart"></i> Current Cart
            </h2>
            <Link to="/cart" className="view-all-link">
              View Full Cart <i className="fa-solid fa-arrow-right"></i>
            </Link>
          </div>
          <div className="cart-preview">
            <div className="cart-summary">
              <p>
                <strong>{cart.length}</strong> {cart.length === 1 ? "item" : "items"} • 
                <strong> ${cartTotal.toFixed(2)}</strong>
              </p>
            </div>
            <Link to="/cart" className="button-primary">
              <i className="fa-solid fa-shopping-bag"></i> Checkout
            </Link>
          </div>
        </div>
      )}

      <div className="profile-section">
        <div className="section-header">
          <h2>
            <i className="fa-solid fa-clock-rotate-left"></i> Recent Orders
          </h2>
          {orders.length > 0 && (
            <Link to="/orders" className="view-all-link">
              View All <i className="fa-solid fa-arrow-right"></i>
            </Link>
          )}
        </div>

        {loading ? (
          <div className="loading-state">
            <i className="fa-solid fa-spinner fa-spin"></i>
            <p>Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="empty-state">
            <i className="fa-solid fa-box-open"></i>
            <h3>No orders yet</h3>
            <p>Start shopping to see your orders here!</p>
            <Link to="/products" className="button-primary">
              <i className="fa-solid fa-store"></i> Browse Products
            </Link>
          </div>
        ) : (
          <div className="orders-grid">
            {orders.slice(0, 6).map((order, idx) => (
              <div key={order.id} className="order-card">
                <div className="order-card-header">
                  <div>
                    <h3>Order #{idx + 1}</h3>
                    <p className="order-date">{formatDate(order.created_at)}</p>
                  </div>
                  <div className="order-status">
                    <span className="status-badge">Completed</span>
                  </div>
                </div>

                <div className="order-items-preview">
                  {order.items.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="order-item-mini">
                      <img
                        src={item.product?.image_url || item.product?.thumbnail || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=200&auto=format&fit=crop"}
                        alt={item.product?.title || "Product"}
                        className="order-item-thumb"
                      />
                      <div className="order-item-info">
                        <p className="order-item-title">{item.product?.title || "Product"}</p>
                        <p className="order-item-qty">Qty: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <p className="order-more-items">+{order.items.length - 3} more items</p>
                  )}
                </div>

                <div className="order-card-footer">
                  <div className="order-totals">
                    <span>{order.total_items} {order.total_items === 1 ? "item" : "items"}</span>
                    <span className="order-total-price">${parseFloat(order.total_price || 0).toFixed(2)}</span>
                  </div>
                  <Link to="/orders" className="order-view-btn">
                    View Details <i className="fa-solid fa-arrow-right"></i>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
