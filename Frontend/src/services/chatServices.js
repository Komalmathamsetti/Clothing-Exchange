import axios from "axios";
const API = axios.create({
    baseURL:"http://localhost:5000/api/chats"
});
API.interceptors.request.use((config)=>{
    const token = localStorage.getItem("token");
    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
export const getMyChats = async()=>{
    return API.get("/");
};
export const getChatMessages = (chatId)=>{
    return API.get(`/${chatId}/messages`);
};
export const sendMessage = (chatId,message)=>{
    return API.post(`/${chatId}/messages`,{
        message,
    });
};
export const createChat = (swap_request_id)=>{
    return API.post("/",{
        swap_request_id,
    });
};