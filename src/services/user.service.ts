import axiosApiInstance from "../axios-instance";
import { JWT_TOKEN } from "../utils/helpers/constantHelpers";
import { IUser } from "../utils/interface";

export const login = (data: any) => {
  return axiosApiInstance.post("/auth/login", data);
};

export const logout = () => {
  const value = localStorage.getItem(JWT_TOKEN);
  const data = JSON.parse(value);

  return axiosApiInstance.post("/auth/logout", data);
};

export const addUser = (user: IUser) => {
  return axiosApiInstance.post("/user/add", user);
};

export const getUserInfos = () => {
  return axiosApiInstance.get("/user/me");
};

export const updateUser = (id: number, user: IUser) => {
  return axiosApiInstance.put(`/user/update/${id}`, user);
};

export const searchUsers = (data: any) => {
  return axiosApiInstance.get("/user/search", {
    params: {
      ...data,
      page: data?.currentPage,
      size: data?.size,
      sort: data?.sort,
    },
  });
};

export const refreshAccessToken = async () => {
  const value = localStorage.getItem(JWT_TOKEN);
  const data = JSON.parse(value);

  return axiosApiInstance.post("/auth/refresh", data).then((response: any) => {
    return response?.data?.access_token;
  });
};
