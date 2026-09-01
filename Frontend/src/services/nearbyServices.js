import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/nearby",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const getNearbyListings = (
  city,
  state,
  latitude = null,
  longitude = null
) => {
  const params = {};

  // GPS search
  if (
    latitude !== null &&
    longitude !== null
  ) {
    params.latitude = latitude;
    params.longitude = longitude;
  }

  // Manual city/state search
  else {
    params.city = city;

    if (state) {
      params.state = state;
    }
  }

  return API.get("/", {
    params,
  });
};