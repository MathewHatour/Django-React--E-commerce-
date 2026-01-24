// This is the main App component that sets up routing for the entire application
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import SellerDashboard from "./pages/SellerDashboard";
import { Toaster } from "./lib/toast.jsx";

export default function App() {
  return (
    // Router enables navigation between different pages
    <Router>
      {/* Toaster component displays notification messages (success, error, etc.) */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: "#121826", color: "#f9fafb", border: "1px solid #1f2937" },
          success: { iconTheme: { primary: "#16a34a", secondary: "#fff" } },
          error: { iconTheme: { primary: "#dc2626", secondary: "#fff" } },
        }}
      />
      {/* Navbar appears on all pages */}
      <Navbar />
      
      {/* Routes define which component to show for each URL path */}
      <Routes>
        {/* Home page - shown when user visits "/" */}
        <Route path="/" element={<Home />} />
        {/* Products listing page - shown when user visits "/products" */}
        <Route path="/products" element={<Products />} />
        {/* Product details page - :id is a parameter that can be any product ID */}
        <Route path="/products/:id" element={<ProductDetails />} />
        {/* User profile page */}
        <Route path="/profile" element={<Profile />} />
        {/* Login page */}
        <Route path="/login" element={<Login />} />
        {/* Registration page */}
        <Route path="/register" element={<Register />} />
        {/* Shopping cart page */}
        <Route path="/cart" element={<Cart />} />
        {/* Checkout page */}
        <Route path="/checkout" element={<Checkout />} />
        {/* Orders history page */}
        <Route path="/orders" element={<Orders />} />
        {/* Seller Dashboard page */}
        <Route path="/seller/dashboard" element={<SellerDashboard />} />
      </Routes>
    </Router>
  );
}
