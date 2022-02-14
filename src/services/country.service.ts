import axiosApiInstance from "../axios-instance";
import { IDefault } from "../utils/interface";

class CountryService {
  add = (country: IDefault) => {
    return axiosApiInstance.post("/country/add", country);
  };
  update = (id: number, country: IDefault) => {
    return axiosApiInstance.put(`/country/update/${id}`, country);
  };

  delete = (id: number) => {
    return axiosApiInstance.delete(`/country/${id}`);
  };
  
  search = (data: any) => {
    return axiosApiInstance.get("/country/search", {
      params: {
        ...data,
        page: data?.currentPage,
      },
    });
  };

  findAll = () => {
    return axiosApiInstance.get("/country/all");
  };
}

export const countryService = new CountryService();

