// This file sets up the API client for making requests to the backend
import axios from "axios";

// Create an axios instance with the base URL of the backend API
const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
});

// This interceptor runs before every API request
// It automatically adds the authentication token if the user is logged in
API.interceptors.request.use((request) => {
  // Get the access token from local storage
  const accessToken = localStorage.getItem("access_token");
  
  // If user has a token, add it to the request headers
  if (accessToken) {
    // Add Authorization header with Bearer token
    request.headers.Authorization = `Bearer ${accessToken}`;
  }
  
  // Return the request (with or without token)
  return request;
});

// Export the API client so other components can use it
export default API;
