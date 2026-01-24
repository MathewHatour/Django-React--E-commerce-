// This component handles user registration
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { toast } from "../lib/toast.jsx";
import "./Auth.css";

export default function Register() {
  // Hook to navigate to different pages
  const navigate = useNavigate();
  
  // State to store form data (username, email, password, user_type)
  const [form, setForm] = useState({ 
    username: "", 
    email: "", 
    password: "",
    user_type: "" // Will be 'customer' or 'seller'
  });

  // This function runs when user types in any input field
  const handleChange = (event) => {
    // Get the name of the input field (username, email, or password)
    const fieldName = event.target.name;
    // Get the value the user typed
    const fieldValue = event.target.value;
    // Update the form state with the new value
    setForm({ 
      ...form, 
      [fieldName]: fieldValue 
    });
  };

  // This function runs when user selects their account type
  const handleUserTypeSelect = (type) => {
    setForm({
      ...form,
      user_type: type
    });
  };

  // This function runs when user submits the registration form
  const handleSubmit = async (event) => {
    // Prevent the page from refreshing
    event.preventDefault();
    
    // Check if user selected account type
    if (!form.user_type) {
      toast.error("Please select if you are a Customer or Seller");
      return;
    }
    
    try {
      // Send registration data to the backend
      await API.post("users/register/", form);
      
      // Show success message
      toast.success("Registration successful! You can login now.");
      
      // Redirect user to login page
      navigate("/login");
    } catch (error) {
      // If registration fails, show error message
      let errorMessage = "Registration failed";
      
      // Try to get a more specific error message from the server
      if (error.response && error.response.data) {
        errorMessage = JSON.stringify(error.response.data);
      }
      
      toast.error(errorMessage);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Register</h2>
        
        <form onSubmit={handleSubmit}>
          <input
            name="username"
            value={form.username}
            placeholder="Username"
            onChange={handleChange}
            required
          />
          
          <input
            name="email"
            type="email"
            value={form.email}
            placeholder="Email"
            onChange={handleChange}
            required
          />
          
          <input
            name="password"
            type="password"
            value={form.password}
            placeholder="Password"
            onChange={handleChange}
            required
          />

          <div className="user-type-selection">
            <label>I am a:</label>
            <div className="user-type-buttons">
              <button
                type="button"
                className={`user-type-btn ${form.user_type === 'customer' ? 'active' : ''}`}
                onClick={() => handleUserTypeSelect('customer')}
              >
                🛒 Customer
              </button>
              <button
                type="button"
                className={`user-type-btn ${form.user_type === 'seller' ? 'active' : ''}`}
                onClick={() => handleUserTypeSelect('seller')}
              >
                🏪 Seller
              </button>
            </div>
          </div>
          
          <button className="button-primary" type="submit">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
