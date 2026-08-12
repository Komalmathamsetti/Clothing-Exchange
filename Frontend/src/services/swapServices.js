import axios from "axios";
const API = axios.create({
    baseURL:"http://localhost:5000/api/swaps"
});
API.interceptors.request.use((config)=>{
    const token = localStorage.getItem("token");
    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
export const createSwapRequest = (data) => {
  return API.post("/", data);
};

// Get requests sent by current user
export const getSentRequests = () => {
  return API.get("/sent");
};

// Get requests received by current user
export const getReceivedRequests = () => {
  return API.get("/received");
};

// Get single swap request
export const getSwapRequestById = (id) => {
  return API.get(`/${id}`);
};

// Accept a swap request
export const acceptSwapRequest = (id) => {
  return API.put(`/${id}/accept`);
};

// Reject a swap request
export const rejectSwapRequest = (id) => {
  return API.put(`/${id}/reject`);
};
