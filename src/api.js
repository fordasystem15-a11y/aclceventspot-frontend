import axios from "axios";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API,
  withCredentials: true,
});

console.log("API Base URL:", process.env.REACT_APP_API_URL);
alert("API Base URL: " + process.env.REACT_APP_API_URL);


export default api;
