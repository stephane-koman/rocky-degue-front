import axiosApiInstance from "../axios-instance";

export const searchPermissions = (data: any) => {
  return axiosApiInstance.get("/permission/search", {
    params: {
      page: data?.currentPage,
      size: data?.size,
    },
  });
};

export const findAllPermissions = () => {
  return axiosApiInstance.get("/permission/all");
};
