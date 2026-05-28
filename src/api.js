import axios from "axios";

// ✅ Automatically use Render backend in production
const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://aclceventspot-backend.onrender.com"
    : "http://localhost:5000";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

console.log("API Base URL:", API_BASE_URL);

export default api;
