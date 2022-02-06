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