// This component handles user registration
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { toast } from "../lib/toast.jsx";
import "./Auth.css";

export default function Register() {
  // Hook to navigate to different pages
  const navigate = useNavigate();
  
  // State to store form data (username, email, password)
  const [form, setForm] = useState({ 
    username: "", 
    email: "", 
    password: "" 
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

  // This function runs when user submits the registration form
  const handleSubmit = async (event) => {
    // Prevent the page from refreshing
    event.preventDefault();
    
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
          
          <button className="button-primary" type="submit">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
