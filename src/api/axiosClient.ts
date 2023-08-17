import axios from "axios";
import store from "../store";

const axiosClient = axios.create({
    baseURL: `${import.meta.env.VITE_URL_API}/`,
    headers: {
        "content-type": "application/json",
    },
});

axiosClient.interceptors.request.use((config) => {
    const token = store?.getState()?.auth?.token;
    config.headers.Authorization = `Bearer ${token}`;
    return config;
});

axiosClient.interceptors.response.use(
    (response) => {
        if (response && response.data) {
            return response.data;
        }
        return response;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosClient;
