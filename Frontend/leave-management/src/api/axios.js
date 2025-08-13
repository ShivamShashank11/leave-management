// src/api/axios.js (ya jaha baseURL define hai)
import axios from "axios";

const api = axios.create({
  baseURL: "https://leave-management-backend-6akz.onrender.com/api", // LIVE backend
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
