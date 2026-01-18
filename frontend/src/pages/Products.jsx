import { Link, useNavigate } from "react-router-dom";
import "./Products.css";

export default function Profile() {
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");
  const username = localStorage.getItem("username");

  if (!token) {
    navigate("/login");
    return null;
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>Welcome, {username}</h2>
        <p>Manage your account and view your activity.</p>

        <div className="profile-actions">
          <Link to="/cart" className="profile-btn">
            <i className="fa-solid fa-cart-shopping"></i> View Cart
          </Link>

          <Link to="/orders" className="profile-btn">
            View Orders
          </Link>
        </div>
      </div>
    </div>
  );
}
