// src/api/axios.js
import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://plunder-backend.onrender.com/api';

const api = axios.create({
  baseURL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
}, (error) => Promise.reject(error));

export default api;
