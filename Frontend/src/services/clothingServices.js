import axios from "axios";
const API = axios.create({
    baseURL : "http://localhost:5000/api/clothing"
});
API.interceptors.request.use((config)=>{
    const token = localStorage.getItem("token");
    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
export const createClothing = (clothingData)=>{
    return API.post("/",clothingData);
};
export const getAllClothings = ()=>{
    return API.get("/");
};
export const getCategories = ()=>{
    return API.get("/categories");
};
export const getMyListings = ()=>{
    return API.get("/my-listings");
};
export const getClothingById = (id)=>{
    return API.get(`${id}`);
};
export const updateClothing = (id,clothingData)=>{
    return API.put(`${id}`,clothingData);
};
export const deleteClothing = (id)=>{
    return API.delete(`${id}`);
};