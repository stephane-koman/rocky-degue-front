import axios from "axios";
import { refreshAccessToken } from "./services/user.service";
import { JWT_TOKEN } from "./utils/constantHelpers";

const axiosApiInstance = axios.create({
  baseURL:
    process.env.REACT_APP_API_URL || "https://degue-app-back.herokuapp.com/api",
});

// Request interceptor for API calls
axiosApiInstance.interceptors.request.use(
  async (config) => {
    if (!config?.url?.includes("/auth/login")) {
      const value = localStorage.getItem(JWT_TOKEN);
      const keys = JSON.parse(value);
      config.headers = {
        Authorization: `Bearer ${keys?.access_token}`,
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      };
    } else {
      config.headers = {
        Accept: "application/json",
      };
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

// Response interceptor for API calls
axiosApiInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async function (error) {
    const originalRequest = error?.config;

    if (
      (error?.response?.status === 400 &&
        error?.response?.data?.code === "TOKEN_BLACKLISTED") ||
      (error?.response?.status === 403 &&
        error?.response?.data?.code === "TOKEN_INVALID")
    ) {
      localStorage.clear();
      window.location.replace("/login?session=expired");
    }

    if (
      error?.response?.status === 401 &&
      error?.response?.data?.code === "TOKEN_EXPIRED" &&
      !originalRequest?._retry
    ) {
      originalRequest._retry = true;
      const access_token = refreshAccessToken();
      axios.defaults.headers.common["Authorization"] = "Bearer " + access_token;
      return axiosApiInstance(originalRequest);
    }
    return Promise.reject(error);
  }
);

export default axiosApiInstance;
