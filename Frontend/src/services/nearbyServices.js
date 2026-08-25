import axios from "axios";
const API = axios.create({
    baseURL:"http://localhost:5000/api/nearby",
});
API.interceptors.request.use((config)=>{
    const token = localStorage.getItem("token");
    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
export const getNearbyListings = (city,state)=>{
    return API.get("/",{
        params:{
            city,state
        },
    });
};