import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import ProductForm from "../components/ProductForm";
import SalesTracker from "../components/SalesTracker";
import "../styles/SellerDashboard.css";
import { toast } from "../lib/toast.jsx";

export default function SellerDashboard() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [activeTab, setActiveTab] = useState("products"); // 'products' or 'sales'

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const userType = localStorage.getItem("user_type");
    
    if (!token) {
      toast.error("Please login to access the seller dashboard");
      navigate("/login");
      return;
    }
    
    if (userType !== 'seller') {
      toast.error("Access denied. Seller account required.");
      navigate("/");
      return;
    }
    
    fetchProducts();
  }, [navigate]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await API.get("/products/seller/");
      setProducts(response.data);
    } catch (err) {
      console.error("Error fetching products:", err);
      const errorMsg = err.response?.data?.detail || "Failed to load products";
      
      // Handle authentication errors
      if (err.response?.status === 401) {
        toast.error("Session expired. Please login again");
        localStorage.clear();
        navigate("/login");
        return;
      }
      
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (productId, productData) => {
    try {
      const response = await API.post("/products/seller/", productData);
      setProducts([response.data, ...products]);
      setShowAddForm(false);
      toast.success("Product added successfully!");
      return true;
    } catch (err) {
      console.error("Error adding product:", err);
      console.error("Error response:", err.response?.data);
      
      // Better error handling
      let errorMsg = "Failed to add product";
      if (err.response?.data) {
        // Handle validation errors
        if (typeof err.response.data === 'object') {
          const errors = Object.entries(err.response.data).map(([key, value]) => {
            if (Array.isArray(value)) {
              return `${key}: ${value.join(', ')}`;
            }
            return `${key}: ${value}`;
          }).join('; ');
          errorMsg = errors;
        } else {
          errorMsg = err.response.data.detail || err.response.data;
        }
      }
      
      toast.error(errorMsg);
      return false;
    }
  };

  const handleUpdateProduct = async (productId, productData) => {
    try {
      const response = await API.put(`/products/seller/${productId}/`, productData);
      setProducts(products.map(p => p.id === productId ? response.data : p));
      setEditingProduct(null);
      toast.success("Product updated successfully!");
      return true;
    } catch (err) {
      console.error("Error updating product:", err);
      console.error("Error response:", err.response?.data);
      
      // Better error handling
      let errorMsg = "Failed to update product";
      if (err.response?.data) {
        if (typeof err.response.data === 'object') {
          const errors = Object.entries(err.response.data).map(([key, value]) => {
            if (Array.isArray(value)) {
              return `${key}: ${value.join(', ')}`;
            }
            return `${key}: ${value}`;
          }).join('; ');
          errorMsg = errors;
        } else {
          errorMsg = err.response.data.detail || err.response.data;
        }
      }
      
      toast.error(errorMsg);
      return false;
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      await API.delete(`/products/seller/${productId}/`);
      setProducts(products.filter(p => p.id !== productId));
      toast.success("Product deleted successfully!");
    } catch (err) {
      console.error("Error deleting product:", err);
      toast.error(err.response?.data?.detail || "Failed to delete product");
    }
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setShowAddForm(false);
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
  };

  const handleAddNewClick = () => {
    setShowAddForm(true);
    setEditingProduct(null);
  };

  if (loading) {
    return (
      <div className="seller-dashboard">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="seller-dashboard">
      <div className="dashboard-header">
        <h1>Seller Dashboard</h1>
        <p>Manage your products and track sales</p>
      </div>

      {/* Tab Navigation */}
      <div className="dashboard-tabs">
        <button
          className={`tab-button ${activeTab === "products" ? "active" : ""}`}
          onClick={() => setActiveTab("products")}
        >
          Products ({products.length})
        </button>
        <button
          className={`tab-button ${activeTab === "sales" ? "active" : ""}`}
          onClick={() => setActiveTab("sales")}
        >
          Sales & Orders
        </button>
      </div>

      {/* Products Tab */}
      {activeTab === "products" && (
        <div className="products-section">
          {/* Add/Edit Product Form */}
          {(showAddForm || editingProduct) && (
            <div className="form-container">
              <div className="form-header">
                <h2>{editingProduct ? "Edit Product" : "Add New Product"}</h2>
                <button
                  className="close-button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingProduct(null);
                  }}
                >
                  ×
                </button>
              </div>
              <ProductForm
                product={editingProduct}
                onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}
                onCancel={() => {
                  setShowAddForm(false);
                  setEditingProduct(null);
                }}
              />
            </div>
          )}

          {/* Add New Product Button */}
          {!showAddForm && !editingProduct && (
            <div className="action-bar">
              <button className="btn-primary" onClick={handleAddNewClick}>
                + Add New Product
              </button>
            </div>
          )}

          {/* Products Table */}
          {error && <div className="error-message">{error}</div>}

          {products.length === 0 ? (
            <div className="empty-state">
              <h3>No products yet</h3>
              <p>Start by adding your first product!</p>
            </div>
          ) : (
            <div className="products-table-container">
              <table className="products-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Discount</th>
                    <th>Stock</th>
                    <th>Rating</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td>
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.title}
                            className="product-thumbnail"
                          />
                        ) : (
                          <div className="no-image">No Image</div>
                        )}
                      </td>
                      <td className="product-title">{product.title}</td>
                      <td>{product.category || "N/A"}</td>
                      <td>${parseFloat(product.price).toFixed(2)}</td>
                      <td>
                        {product.discount > 0 ? (
                          <span className="discount-badge">{product.discount}% OFF</span>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td>
                        <span className={`stock-badge ${product.stock === 0 ? "out-of-stock" : ""}`}>
                          {product.stock}
                        </span>
                      </td>
                      <td>
                        ⭐ {parseFloat(product.rating).toFixed(1)} ({product.reviews_count})
                      </td>
                      <td>{new Date(product.created_at).toLocaleDateString()}</td>
                      <td className="actions-cell">
                        <button
                          className="btn-edit"
                          onClick={() => handleEditClick(product)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Sales Tab */}
      {activeTab === "sales" && <SalesTracker />}
    </div>
  );
}
