import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/admin",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const getAdminDashboard = () => API.get("/dashboard");

export const getAdminUsers = () => API.get("/users");

export const getAdminUserById = (id) => API.get(`/users/${id}`);

export const updateAdminUserStatus = (id, isActive) =>
  API.patch(`/users/${id}/status`, {
    is_active: isActive,
  });

export const getAdminListings = () => API.get("/listings");
export const removeAdminListings = (id) => API.patch(`/listings/${id}/remove`);
export const getAdminSwaps = () => API.get("/swaps");
export const getAnalytics = (days = 30)=>API.get(`/analytics?days=${days}`);