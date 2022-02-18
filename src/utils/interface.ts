import React from "react";
import { EActionType, ETableActionType } from "./enum";

export interface IDefault {
  id: number;
  name: string;
}
export interface IUser extends IDefault {
  email: string;
  role: IRole;
  permissions: IPermission[];
};

export interface IRole extends IDefault {
  description: string;
  permissions: IPermission[];
}

export interface IPermission extends IDefault {
  description: string;
}

export interface ICity extends IDefault {
  code: string;
  country: IDefault;
}

export interface ICountry extends IDefault {
  code: string;
}

export interface IPaymentType extends ICountry  {}

export interface ICustomer extends IDefault {
  email: string;
  phone: string;
  address: string;
  description?: string;
  country: ICountry;
};

export interface IPagination {
  currentPage: number;
  size: number;
  total: number;
}

export interface IDeleteModal {
  id: any;
  info: any;
  onConfirm: (data?: any) => void;
  onCancel: (data?: any) => void;
}

export interface ITableActions {
  type?: ETableActionType;
  data: any;
  children?: React.ReactNode;
  permissions?: {
    show?: string;
    edit?: string;
    delete?: string;
  };
  deleteInfo?: any;
  handleAction?: (data: any, type: EActionType) => void;
  handleOtherAction?: (data: any, type?: string) => void;
  onCancelDelete?: (data?: any) => void;
  onConfirmDelete?: (id?: any) => void;
}

export interface ITableHeaderActions {
  search?: boolean;
  refresh?: boolean;
  searchInputRef?: any;
  children?: React.ReactNode;
  onSearch?: (value: string) => void;
  onRefresh?: () => void;
}