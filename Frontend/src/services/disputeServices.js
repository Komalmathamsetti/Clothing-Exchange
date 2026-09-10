import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000/api/disputes"
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});


// Create a new dispute
export const createDispute = (data) => {
    return API.post("/", data);
};


// Get disputes involving the logged-in user
export const getMyDisputes = () => {
    return API.get("/my");
};


// Get one dispute with all messages
export const getDisputeById = (id) => {
    return API.get(`/${id}`);
};


// Add a reply to a dispute
export const addDisputeMessage = (id, message) => {
    return API.post(`/${id}/messages`, {
        message
    });
};


// Admin: get all disputes
export const getAdminDisputes = () => {
    return API.get("/admin/all");
};


// Admin: update dispute status
export const updateDisputeStatus = (id, status) => {
    return API.patch(`/admin/${id}/status`, {
        status
    });
};