import axios from "axios";

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/reviews`,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const createReview = (reviewData) =>
  API.post("/", reviewData);

export const getUserReviews = (userId) =>
  API.get(`/user/${userId}`);

export const checkReview = (swapId) =>
  API.get(`/check/${swapId}`);

export const getSwapReviews = (swapId) =>
  API.get(`/swap/${swapId}`);
export const getMyReviews = () => API.get("/my");
export const getLatestReviews = () => API.get("/latest");