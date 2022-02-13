import { EActionType } from "../enum";

export const USER_PERMISSIONS = ["show_user", "add_user", "edit_user", "delete_user"];
export const ROLE_PERMISSIONS = ["show_role", "add_role", "edit_role", "delete_role"];
export const PERMISSION_PERMISSIONS = ["show_permission"];

export const getPermission = (permissions: string[], type: EActionType) => {
    return permissions.find((p: string) => p.includes(type))
};

export const getPermissions = (permissions: string[], type: string) => {
  return permissions.filter((p: string) => p.includes(type));
};