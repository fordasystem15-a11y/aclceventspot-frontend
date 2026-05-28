import axios from "axios";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API,
  withCredentials: true,
});

export default api;
