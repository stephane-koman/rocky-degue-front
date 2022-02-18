import axiosApiInstance from "../axios-instance";
import { IDefault } from "../utils/interface";

class PaymentTypeService {
  add = (paymentType: IDefault) => {
    return axiosApiInstance.post("/payment-type/add", paymentType);
  };
  update = (id: number, paymentType: IDefault) => {
    return axiosApiInstance.put(`/payment-type/update/${id}`, paymentType);
  };

  delete = (id: number) => {
    return axiosApiInstance.delete(`/payment-type/${id}`);
  };
  
  search = (data: any) => {
    return axiosApiInstance.get("/payment-type/search", {
      params: {
        ...data,
        page: data?.currentPage,
      },
    });
  };

  findAll = () => {
    return axiosApiInstance.get("/paymentType/all");
  };
}

export const paymentTypeService = new PaymentTypeService();

