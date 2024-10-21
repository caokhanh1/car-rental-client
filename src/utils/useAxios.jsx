import axios from "axios";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const baseURL = import.meta.env.VITE_APP_API_URL;

const useAxios = () => {
  const { authTokens, setUser, setAuthTokens } = useContext(AuthContext);
  const navigate = useNavigate();

  const axiosInstance = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authTokens.token}`,
    },
  });

  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("authTokens");
        setAuthTokens(null);
        setUser(null);
        navigate("/sign-in");
      }
      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

export default useAxios;
