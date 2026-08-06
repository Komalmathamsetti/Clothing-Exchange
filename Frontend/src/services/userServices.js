import axios from "axios";
const API = axios.create({
    baseURL: "http://localhost:5000/api/users"
});
API.interceptors.request.use((config)=>{
    const token = localStorage.getItem("token");
    if(token){
        config.headers.Authorization = `Bearer ${token}`
    }
    return config;
});
export const getProfile = ()=>{
    return API.get("/profile");
};
export const updateProfile = (userData)=>{
    return API.put("/update-profile",userData);
};
export const changePassword = (passwordData)=>{
    return API.put("/change-password",passwordData);
};
export const deleteAccount = ()=>{
    return API.delete("/delete-account");
};
