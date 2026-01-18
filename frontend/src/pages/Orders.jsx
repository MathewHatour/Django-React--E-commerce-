// This component displays user's order history
import { useEffect, useState } from "react";
import API from "../services/api";
import { toast } from "../lib/toast.jsx";
import "./Orders.css";

export default function Orders() {
  // State to store the list of orders
  const [orders, setOrders] = useState([]);

  // This function fetches orders from the backend
  const fetchOrders = async () => {
    try {
      // Get orders from the backend
      const response = await API.get("orders/");
      // Update the orders state
      setOrders(response.data);
    } catch (error) {
      // Log error to console
      console.error("Error fetching orders:", error);
      // Show error message to user
      toast.error("Failed to fetch orders. Make sure you are logged in.");
    }
  };

  // This function removes an order
  const removeOrder = async (orderId) => {
    // Ask user to confirm before deleting
    const userConfirmed = confirm("Remove this order? This cannot be undone.");
    if (!userConfirmed) {
      return;
    }
    
    try {
      // Delete the order from the backend
      await API.delete(`orders/${orderId}/`);
      // Remove the order from the local state
      setOrders((previousOrders) => {
        return previousOrders.filter(order => order.id !== orderId);
      });
      // Show success message
      toast.success("Order removed");
    } catch (error) {
      // Log error to console
      console.error("Error removing order:", error);
      // Show error message to user
      toast.error("Failed to remove order");
    }
  };

  // State to store cart items (for placing new orders)
  const [cart, setCartState] = useState([]);
  
  // This runs when the component first loads
  useEffect(() => {
    // Get cart from browser's local storage
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      // Parse cart from JSON string to array
      const cartArray = JSON.parse(savedCart);
      setCartState(cartArray);
    } else {
      // If no cart exists, use empty array
      setCartState([]);
    }
  }, []);

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
    setCartState(updatedCart);
    // Save the updated cart to local storage
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // Place an order with all items in the cart
  const placeOrder = async () => {
    // Get cart from local storage
    const savedCart = localStorage.getItem("cart");
    let cartItems = [];
    
    if (savedCart) {
      cartItems = JSON.parse(savedCart);
    }
    
    // Check if cart is empty
    if (cartItems.length === 0) {
      toast("Cart is empty", { icon: "🛒" });
      return;
    }
    
    try {
      // Send cart items to backend to create an order
      await API.post("orders/", { items: cartItems });
      // Show success message
      toast.success("Order placed!");
      // Clear the cart from local storage
      localStorage.removeItem("cart");
      // Refresh the order list
      fetchOrders();
    } catch (error) {
      // Log error to console
      console.error("Error placing order:", error);
      // Show error message to user
      toast.error("Failed to place order. Make sure you are logged in.");
    }
  };

  // Fetch orders when component first loads
  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="orders-container">
      <h2>My Orders</h2>
      
      <div style={{ margin: "12px 0" }}>
        <h3>Your Cart</h3>
        {cart.length === 0 ? (
          <p>No items in cart.</p>
        ) : (
          <ul>
            {cart.map((item) => (
              <li key={item.id}>
                {item.title} — ${item.price} x {item.quantity}
                <button 
                  className="button-primary" 
                  style={{ marginLeft: 8 }} 
                  onClick={() => updateQuantity(item.id, -1)}
                >
                  -
                </button>
                <button 
                  className="button-primary" 
                  style={{ marginLeft: 6 }} 
                  onClick={() => updateQuantity(item.id, 1)}
                >
                  +
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      

      
      {orders.map((order, idx) => (
        <div key={order.id} className="order-card">
          <div className="order-header">
            <h3>Order #{idx + 1}</h3>
            <button 
              className="button-danger" 
              onClick={() => removeOrder(order.id)}
            >
              Remove Order
            </button>
          </div>
          <div className="order-meta">
            <p>Total items: {order.total_items}</p>
            <p>Total price: ${order.total_price}</p>
          </div>
          <ul className="order-items">
            {order.items.map((item, index) => (
              <li key={index} className="order-item-row">
                <img
                  className="thumb"
                  src={item.product.image_url || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=200&auto=format&fit=crop"}
                  alt={item.product.title}
                />
                <span>
                  {item.product.title} — ${item.product.price} × {item.quantity}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
