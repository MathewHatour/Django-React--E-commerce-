// This component handles user login
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { toast } from "../lib/toast.jsx";
import "./Auth.css";

export default function Login() {
  // Hook to navigate to different pages
  const navigate = useNavigate();
  
  // State to store login form data (username and password)
  const [form, setForm] = useState({ 
    username: "", 
    password: "" 
  });

  // This function runs when user types in any input field
  const handleChange = (event) => {
    // Get the name of the input field (username or password)
    const fieldName = event.target.name;
    // Get the value the user typed
    const fieldValue = event.target.value;
    // Update the form state with the new value
    setForm({ 
      ...form, 
      [fieldName]: fieldValue 
    });
  };

  // This function runs when user submits the login form
  const handleSubmit = async (event) => {
    // Prevent the page from refreshing
    event.preventDefault();
    
    try {
      // Send login credentials to the backend (using custom login endpoint)
      const response = await API.post("users/login/", form);

      // Save the access token (used for authenticated requests)
      localStorage.setItem("access_token", response.data.access);
      // Save the refresh token (used to get a new access token)
      localStorage.setItem("refresh_token", response.data.refresh);
      // Save the username (to display in navbar)
      localStorage.setItem("username", response.data.username);
      // Save the user type (customer or seller)
      localStorage.setItem("user_type", response.data.user_type);

      // Notify other components that user logged in
      window.dispatchEvent(new CustomEvent("auth-change"));
      
      // Show success message with user type
      const userTypeLabel = response.data.user_type === 'seller' ? 'Seller' : 'Customer';
      toast.success(`Login successful! Welcome ${userTypeLabel}.`);
      
      // Redirect seller to dashboard, customer to home
      if (response.data.user_type === 'seller') {
        navigate("/seller/dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      // Handle different types of errors
      if (!error.response) {
        // No response means server is not reachable
        toast.error("Cannot reach server. Is the backend running at http://127.0.0.1:8000?");
      } else if (error.response.status === 401 || error.response.status === 400) {
        // 401 or 400 means wrong username/password
        let errorMessage = "Invalid username or password.";
        
        // Try to get a more specific error message
        if (error.response.data && error.response.data.error) {
          errorMessage = error.response.data.error;
        }
        
        toast.error(errorMessage);
      } else {
        // Other errors
        let errorMessage = "Login failed. Try again.";
        if (error.response.data && error.response.data.error) {
          errorMessage = error.response.data.error;
        }
        toast.error(errorMessage);
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Login</h2>

        <form onSubmit={handleSubmit}>
          <input
            name="username"
            value={form.username}
            placeholder="Username"
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

          <button className="button-primary" type="submit">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
