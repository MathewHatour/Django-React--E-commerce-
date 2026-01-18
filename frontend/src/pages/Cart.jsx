// This component displays the shopping cart
import { useState, useEffect } from "react";
import API from "../services/api";
import { toast } from "../lib/toast.jsx";
import "./Cart.css";

export default function Cart() {
  // State to store cart items
  const [cart, setCart] = useState([]);

  // This runs when the component first loads
  useEffect(() => {
    // Get cart from browser's local storage
    const savedCart = localStorage.getItem("cart");
    // If cart exists, parse it from JSON string to array
    if (savedCart) {
      const cartArray = JSON.parse(savedCart);
      setCart(cartArray);
    } else {
      // If no cart exists, use empty array
      setCart([]);
    }
  }, []);

  // Remove an item from the cart
  const removeFromCart = (productId) => {
    // Filter out the item with the given ID
    const updatedCart = cart.filter(item => item.id !== productId);
    // Update the cart state
    setCart(updatedCart);
    // Save the updated cart to local storage
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // Update the quantity of an item in the cart
  const updateQuantity = (productId, changeAmount) => {
    // Create a new cart array with updated quantities
    const updatedCart = cart.map(item => {
      // If this is the item we want to update
      if (item.id === productId) {
        // Calculate new quantity (make sure it's at least 1)
        const newQuantity = Math.max(1, item.quantity + changeAmount);
        // Return the item with updated quantity
        return { ...item, quantity: newQuantity };
      }
      // Return other items unchanged
      return item;
    });
    // Update the cart state
    setCart(updatedCart);
    // Save the updated cart to local storage
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // Place an order with all items in the cart
  const placeOrder = async () => {
    // Check if user is logged in
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      toast("You must login first to place an order", { icon: "🔒" });
      return;
    }

    try {
      // Send cart items to backend to create an order
      await API.post("orders/", { items: cart });
      
      // Show success message
      toast.success("Order placed successfully!");
      
      // Clear the cart from local storage
      localStorage.removeItem("cart");
      // Clear the cart state
      setCart([]);
    } catch (error) {
      // Show error message if order fails
      toast.error("Failed to place order. Make sure you are logged in.");
    }
  };

  // Calculate the total price of all items in the cart
  const total = cart.reduce((sum, item) => {
    const itemPrice = item.price || 0;
    const itemQuantity = item.quantity || 0;
    return sum + (itemPrice * itemQuantity);
  }, 0);

  return (
    <div className="cart-container">
      <h2>Cart</h2>
      
      {cart.length === 0 ? (
        <p className="products-empty">Cart is empty</p>
      ) : (
        <>
          {cart.map((item) => (
            <div key={item.id} className="cart-item">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <img 
                  className="thumb" 
                  src={item.image_url || item.thumbnail || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=200&auto=format&fit=crop"} 
                  alt={item.title} 
                />
                <div>
                  <h4>{item.title}</h4>
                  <span>Quantity: {item.quantity}</span>
                </div>
              </div>
              <div>
                <button 
                  className="button-primary" 
                  onClick={() => updateQuantity(item.id, -1)}
                >
                  -
                </button>
                <button 
                  className="button-primary" 
                  style={{ marginLeft: 8 }} 
                  onClick={() => updateQuantity(item.id, 1)}
                >
                  +
                </button>
                <span style={{ marginLeft: 12 }}>
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
                <button 
                  className="button-primary" 
                  style={{ marginLeft: 12 }} 
                  onClick={() => removeFromCart(item.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          
          <div className="cart-total">Total: ${total.toFixed(2)}</div>
          <button className="button-primary" onClick={placeOrder}>
            Place Order
          </button>
        </>
      )}
    </div>
  );
}
