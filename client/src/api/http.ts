import axios from "axios";

// Get token from local storage
const getToken = () => localStorage.getItem("token");

const api = axios.create({
//   baseURL: "https://api.example.com", // Update with your actual API URL
  baseURL: "http://localhost:3000/api", // Update with your actual API URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include JWT token automatically
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
