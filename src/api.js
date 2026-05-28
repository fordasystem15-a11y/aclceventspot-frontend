import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  (window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://aclceventspot-backend.onrender.com");

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

console.log("API Base URL:", API_BASE_URL);

export default api;
