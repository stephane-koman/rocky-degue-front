import axiosApiInstance from "../axios-instance";
import { IDefault } from "../utils/interface";

class CityService {
  add = (city: IDefault) => {
    return axiosApiInstance.post("/city/add", city);
  };
  update = (id: number, city: IDefault) => {
    return axiosApiInstance.put(`/city/update/${id}`, city);
  };

  delete = (id: number) => {
    return axiosApiInstance.delete(`/city/${id}`);
  };
  
  search = (data: any) => {
    return axiosApiInstance.get("/city/search", {
      params: {
        ...data,
        page: data?.currentPage,
      },
    });
  };

  findAll = () => {
    return axiosApiInstance.get("/city/all");
  };
}

export const cityService = new CityService();

