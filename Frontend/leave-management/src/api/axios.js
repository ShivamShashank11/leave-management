import axios from "axios";

// Render deployed backend URL
const API_BASE =
  import.meta.env.VITE_API_BASE ||
  "https://leave-management-backend-6akz.onrender.com";

const api = axios.create({
  baseURL: `${API_BASE}/api`,
  timeout: 15000,
  withCredentials: true, // optional - अगर cookies भी भेजनी हों
});

api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem("token");
  if (token) {
    cfg.headers.Authorization = `Bearer ${token}`;
  }
  return cfg;
});

export default api;
