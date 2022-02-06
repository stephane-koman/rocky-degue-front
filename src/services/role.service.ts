import axiosApiInstance from "../axios-instance";
import { IRole } from "../utils/interface";

export const addRole = (role: IRole) => {
  return axiosApiInstance.post("/role/add", role);
};
export const updateRole = (id: number, role: IRole) => {
  return axiosApiInstance.put(`/role/update/${id}`, role);
};

export const searchRoles = (data: any) => {
  return axiosApiInstance.get("/role/search", {
    params: {
      page: data?.currentPage,
      size: data?.size,
    },
  });
};

export const findAllRoles = () => {
  return axiosApiInstance.get("/role/all");
};
