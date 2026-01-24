// This component displays the navigation bar at the top of every page
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Navbar.css";

export default function Navbar() {
  // Hook to navigate to different pages programmatically
  const navigate = useNavigate();

  // State to store the authentication token (null if user is not logged in)
  const [token, setToken] = useState(localStorage.getItem("access_token"));
  // State to store the username (null if user is not logged in)
  const [username, setUsername] = useState(localStorage.getItem("username"));
  // State to store the user type (customer or seller)
  const [userType, setUserType] = useState(localStorage.getItem("user_type"));

  // This function runs when user clicks the logout button
  const handleLogout = () => {
    // Clear all data from local storage
    localStorage.clear();
    // Clear the token state
    setToken(null);
    // Clear the username state
    setUsername(null);
    // Redirect user to login page
    navigate("/login");
  };

  // This function runs when user clicks on their profile/username
  const handleProfileClick = () => {
    // If user is not logged in, redirect to login page
    if (!token) {
      navigate("/login");
    } else {
      // If user is logged in, go to profile page
      navigate("/profile");
    }
  };

  // This runs when the component loads and sets up event listeners
  useEffect(() => {
    // This function updates the auth state from local storage
    const refreshAuth = () => {
      // Get the latest token and username from local storage
      setToken(localStorage.getItem("access_token"));
      setUsername(localStorage.getItem("username"));
      setUserType(localStorage.getItem("user_type"));
    };

    // Listen for storage changes (when user logs in/out in another tab)
    window.addEventListener("storage", refreshAuth);
    // Listen for custom auth-change event (when user logs in/out in same tab)
    window.addEventListener("auth-change", refreshAuth);

    // Cleanup: remove event listeners when component is removed
    return () => {
      window.removeEventListener("storage", refreshAuth);
      window.removeEventListener("auth-change", refreshAuth);
    };
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        {/* Link to home page */}
        <Link to="/" className="logo">MyShop</Link>
        {/* Link to products page */}
        <Link to="/products" className="nav-link">Products</Link>
        {/* Link to seller dashboard - only show if logged in AND is a seller */}
        {token && userType === 'seller' && (
          <Link to="/seller/dashboard" className="nav-link">Seller Dashboard</Link>
        )}
      </div>

      <div className="navbar-right">
        {/* Cart icon - link to cart page */}
        <Link to="/cart" className="icon-btn">
          <i className="fa-solid fa-cart-shopping"></i>
        </Link>

        {/* Show different buttons based on whether user is logged in */}
        {!token ? (
          // If user is NOT logged in, show Login and Register links
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link">Register</Link>
          </>
        ) : (
          // If user IS logged in, show username and Logout button
          <>
            <button onClick={handleProfileClick} className="nav-link">
              Hi, {username}
            </button>
            <button onClick={handleLogout} className="nav-link logout">
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
