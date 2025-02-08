import axios from "axios";

const getToken = () => localStorage.getItem("token");

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Update with your actual API URL
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
