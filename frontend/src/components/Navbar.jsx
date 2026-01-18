import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");
  const username = localStorage.getItem("username");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleProfileClick = () => {
    if (!token) {
      navigate("/login");
    } else {
      navigate("/profile");
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="logo">MyShop</Link>
      </div>

      <div className="navbar-right">
        {/* Cart icon (always visible) */}
        <Link to="/cart" className="icon-btn">
          <i className="fa-solid fa-cart-shopping"></i>
        </Link>

        {!token ? (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link">Register</Link>
          </>
        ) : (
          <>
            <button onClick={handleProfileClick} className="nav-link">
              {username ? `Hi, ${username}` : "Profile"}
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
