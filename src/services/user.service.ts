import axiosApiInstance from "../axios-instance";
import { JWT_TOKEN } from "../utils/constantHelpers";

export const login = (data: any) => {
    return axiosApiInstance.post("/auth/login", data);
};

export const refreshAccessToken = async () => {
    const value = localStorage.getItem(JWT_TOKEN);
    const data = JSON.parse(value);

    return axiosApiInstance.post("/auth/refresh", data).then((response: any) => {
        return response?.data?.access_token;
    });
};