import axios from "axios";
const API = axios.create({
    baseURL:"http://localhost:5000/api/admin"
});
API.interceptors.request.use((config) => {

    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});
export const getAdminDashboard = ()=>{
    return API.get("/dashboard");
};
export const getAdminUsers = () => {
    return API.get("/users");
};
export const getAdminListings = ()=>{
    return API.get("/listings");
};
export const getAdminSwaps = ()=>{
    return API.get("/swaps");
;}