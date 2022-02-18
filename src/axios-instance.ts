import axios, { AxiosResponse } from "axios";
import { JWT_TOKEN } from "./utils/helpers/constantHelpers";

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
        //"Content-Type": "application/x-www-form-urlencoded",
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
    if (error?.response?.status === 403) {
      localStorage.clear();
      window.location.replace("/login?session=expired");
    }

    if (
      error?.response?.status === 401 &&
      error?.response?.data?.code === "TOKEN_EXPIRED"
    ) {
      return changeTokenInLocalStorage(error, true);
    }

    if (
      error?.response?.status === 400 &&
      error?.response?.data?.code === "TOKEN_BLACKLISTED"
    ) {
      return changeTokenInLocalStorage(error);
    }

    return Promise.reject(error);
  }
);

const changeTokenInLocalStorage = (
  error: any,
  isTokenExpired?: boolean
): Promise<AxiosResponse<any, any>> => {
  const value = localStorage.getItem(JWT_TOKEN);
  const keys = JSON.parse(value);
  if (isTokenExpired) {
    keys.access_token = error?.response?.data?.token;
    localStorage.setItem(JWT_TOKEN, JSON.stringify(keys));
  }
  error.config.headers["Authorization"] = "Bearer " + keys.access_token;
  return axiosApiInstance.request(error.config);
};

export default axiosApiInstance;
