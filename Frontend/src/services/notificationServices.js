import axios from "axios";

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/notifications`,
});

// Attach JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Get all notifications
export const getNotifications = () =>
  API.get("/");

// Get unread notification count
export const getUnreadNotificationCount = () =>
  API.get("/unread-count");

// Mark one notification as read
export const markNotificationAsRead = (id) =>
  API.put(`/${id}/read`);

// Mark all notifications as read
export const markAllNotificationsAsRead = () =>
  API.put("/read-all");

// Delete one notification
export const deleteNotification = (id) =>
  API.delete(`/${id}`);