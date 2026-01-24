import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { toast } from "../lib/toast.jsx";
import "../styles/SalesTracker.css";

export default function SalesTracker() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    fetchSalesData();
  }, []);

  const fetchSalesData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch both summary and orders in parallel
      const [summaryResponse, ordersResponse] = await Promise.all([
        API.get("/products/seller/sales-summary/"),
        API.get("/products/seller/sales-orders/")
      ]);

      setSummary(summaryResponse.data);
      setOrders(ordersResponse.data);
    } catch (err) {
      console.error("Error fetching sales data:", err);
      const errorMsg = err.response?.data?.detail || "Failed to load sales data";
      
      // Handle authentication errors
      if (err.response?.status === 401) {
        toast.error("Session expired. Please login again");
        localStorage.clear();
        navigate("/login");
        return;
      }
      
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const toggleOrderExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  if (loading) {
    return (
      <div className="sales-tracker">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading sales data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="sales-tracker">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="sales-tracker">
      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card">
          <div className="card-icon products-icon">📦</div>
          <div className="card-content">
            <h3>Total Products</h3>
            <p className="card-value">{summary?.total_products || 0}</p>
          </div>
        </div>

        <div className="summary-card">
          <div className="card-icon orders-icon">🛒</div>
          <div className="card-content">
            <h3>Total Orders</h3>
            <p className="card-value">{summary?.total_orders || 0}</p>
          </div>
        </div>

        <div className="summary-card">
          <div className="card-icon items-icon">📊</div>
          <div className="card-content">
            <h3>Items Sold</h3>
            <p className="card-value">{summary?.total_items_sold || 0}</p>
          </div>
        </div>

        <div className="summary-card highlight">
          <div className="card-icon revenue-icon">💰</div>
          <div className="card-content">
            <h3>Total Revenue</h3>
            <p className="card-value">${(summary?.total_revenue || 0).toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Orders Section */}
      <div className="orders-section">
        <h2>Order History</h2>

        {orders.length === 0 ? (
          <div className="empty-state">
            <h3>No sales yet</h3>
            <p>Your orders will appear here once customers purchase your products.</p>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order.order_id} className="order-card">
                <div
                  className="order-header"
                  onClick={() => toggleOrderExpand(order.order_id)}
                >
                  <div className="order-info">
                    <h3>Order #{order.order_id}</h3>
                    <p className="order-meta">
                      <span className="customer-name">👤 {order.customer}</span>
                      <span className="order-date">
                        📅 {new Date(order.created_at).toLocaleDateString()}
                      </span>
                    </p>
                  </div>
                  <div className="order-summary">
                    <p className="order-total">${order.total.toFixed(2)}</p>
                    <span className="expand-icon">
                      {expandedOrder === order.order_id ? "▲" : "▼"}
                    </span>
                  </div>
                </div>

                {/* Expanded Order Items */}
                {expandedOrder === order.order_id && (
                  <div className="order-items">
                    <table className="items-table">
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>Price</th>
                          <th>Quantity</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.items.map((item) => (
                          <tr key={item.product_id}>
                            <td className="product-name">{item.product_title}</td>
                            <td>${item.price.toFixed(2)}</td>
                            <td>×{item.quantity}</td>
                            <td className="item-total">${item.total.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
