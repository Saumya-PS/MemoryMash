import axios from "axios";

// Shared axios instance, token attached on every request.

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1"
});






api.interceptors.request.use((config) => {

    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;

});




export default api;
