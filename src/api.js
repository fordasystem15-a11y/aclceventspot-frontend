import axios from "axios";

const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://aclceventspot-backend.onrender.com"
    : "http://localhost:5000";

console.log("🔎 Environment:", process.env.NODE_ENV);
console.log("🌐 API Base URL:", API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export default api;
