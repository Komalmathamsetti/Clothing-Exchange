import axios from "axios";
const API = axios.create({
    baseURL:`${import.meta.env.VITE_API_URL}/value-caluculator`
});
API.interceptors.request.use((config)=>{
    const token = localStorage.getItem("token");
    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
export const calculateClothingValue = (data)=>{
    return API.post("/",data);
};