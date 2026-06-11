import axios from "axios";

// URL base para nuestro backend de Flask
const API_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para inyectar automáticamente el token JWT en las cabeceras
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("travel_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
