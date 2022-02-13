import axiosApiInstance from "../axios-instance";
import { JWT_TOKEN } from "../utils/helpers/constantHelpers";
import { IUser } from "../utils/interface";

class UserService {
  login = (data: any) => {
    return axiosApiInstance.post("/auth/login", data);
  };

  logout = () => {
    const value = localStorage.getItem(JWT_TOKEN);
    const data = JSON.parse(value);

    return axiosApiInstance.post("/auth/logout", data);
  };

  add = (user: IUser) => {
    return axiosApiInstance.post("/user/add", user);
  };

  update = (id: number, user: IUser) => {
    return axiosApiInstance.put(`/user/update/${id}`, user);
  };

  delete = (id: number) => {
    return axiosApiInstance.delete(`/user/${id}`);
  };

  resetPassword = (id: number, data: any) => {
    return axiosApiInstance.put(`/user/reset_password/${id}`, data);
  };

  search = (data: any) => {
    return axiosApiInstance.get("/user/search", {
      params: {
        ...data,
        page: data?.currentPage,
      },
    });
  };

  getUserInfos = () => {
    return axiosApiInstance.get("/user/me");
  };

  refreshAccessToken = async () => {
    const value = localStorage.getItem(JWT_TOKEN);
    const data = JSON.parse(value);

    return axiosApiInstance
      .post("/auth/refresh", data)
      .then((response: any) => {
        return response?.data?.access_token;
      });
  };
}
export const userService = new UserService();
