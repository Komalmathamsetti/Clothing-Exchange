import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/home",
});

export const getHomeStats = () =>
  API.get("/stats");