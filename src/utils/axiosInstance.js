import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8090",
});

// 🔐 Request Interceptor (Token auto attach)
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🔥 Response Interceptor (Token expire handle)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {

    if (
      error.response?.status === 401 ||
      error.response?.data?.message === "Token expired"
    ) {
      alert("Token expired, please login again");

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      window.location.href = "/login";   
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
