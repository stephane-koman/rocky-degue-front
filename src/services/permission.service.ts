import axiosApiInstance from "../axios-instance";

class PermissionService {
  search = (data: any) => {
    return axiosApiInstance.get("/permission/search", {
      params: {
        page: data?.currentPage,
        size: data?.size,
      },
    });
  };

  findAll = () => {
    return axiosApiInstance.get("/permission/all");
  };
}

export const permissionService = new PermissionService();
