import axios from "axios";

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/home`,
});

export const getHomeStats = () =>
  API.get("/stats");