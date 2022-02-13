import axiosApiInstance from "../axios-instance";
import { IRole } from "../utils/interface";

class RoleService {
  add = (role: IRole) => {
    return axiosApiInstance.post("/role/add", role);
  };
  update = (id: number, role: IRole) => {
    return axiosApiInstance.put(`/role/update/${id}`, role);
  };

  delete = (id: number) => {
    return axiosApiInstance.delete(`/role/${id}`);
  };
  search = (data: any) => {
    return axiosApiInstance.get("/role/search", {
      params: {
        ...data,
        page: data?.currentPage,
      },
    });
  };

  findAll = () => {
    return axiosApiInstance.get("/role/all");
  };
}

export const roleService = new RoleService();

