import axiosApiInstance from "../axios-instance";
import { IDefault } from "../utils/interface";

class CustomerService {
  add = (customer: IDefault) => {
    return axiosApiInstance.post("/customer/add", customer);
  };
  update = (id: number, customer: IDefault) => {
    return axiosApiInstance.put(`/customer/update/${id}`, customer);
  };

  delete = (id: number) => {
    return axiosApiInstance.delete(`/customer/${id}`);
  };

  search = (data: any) => {
    return axiosApiInstance.get("/customer/search", {
      params: {
        ...data,
        page: data?.currentPage,
      },
    });
  };

  findById = (id: any) => {
    return axiosApiInstance.get(`/customer/${id}`);
  };

  findAll = () => {
    return axiosApiInstance.get("/customer/all");
  };
}

export const customerService = new CustomerService();

