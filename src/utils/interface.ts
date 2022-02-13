import React from "react";
import { EActionType, ETableActionType } from "./enum";

export interface IUser {
  id: number;
  name: string;
  email: string;
  role: IRole;
  permissions: IPermission[];
}

export interface IRole {
  id: number;
  name: string;
  description: string;
  permissions: IPermission[];
}

export interface IPermission {
  id: number;
  name: string;
  description: string;
}

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