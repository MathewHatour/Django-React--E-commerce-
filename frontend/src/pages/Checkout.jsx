import { Link } from "react-router-dom";
import "./Checkout.css";

export default function Checkout() {
  return (
    <div className="checkout-container">
      <div className="checkout-box">
        <h2>Checkout</h2>
        <p>Add your cart items and place an order from the Cart page.</p>
        <Link to="/cart" className="button-primary" style={{ display: "inline-block", textAlign: "center" }}>
          Go to Cart
        </Link>
      </div>
    </div>
  );
}
