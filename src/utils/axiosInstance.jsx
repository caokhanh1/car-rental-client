import axios from "axios";

const baseURL = import.meta.env.VITE_APP_API_URL;

let currentUser = localStorage.getItem("currentUser")
  ? JSON.parse(localStorage.getItem("currentUser"))
  : null;

const axiosInstance = axios.create({
  baseURL,
  headers: {
    Authorization: `Bearer ${currentUser?.token}`,
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
