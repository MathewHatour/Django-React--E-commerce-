import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { toast } from "../lib/toast.jsx";
import "./Auth.css";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("users/register/", form); // Django registration endpoint
      toast.success("Registration successful! You can login now.");
      navigate("/login"); // redirect to login page
    } catch (err) {
      const msg = err?.response?.data ? JSON.stringify(err.response.data) : "Registration failed";
      toast.error(msg);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <input name="username" placeholder="Username" onChange={handleChange} required />
          <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
          <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
          <button className="button-primary" type="submit">Register</button>
        </form>
        <p>{message}</p>
      </div>
    </div>
  );
}
