import { EActionType } from "../enum";

export const USER_PERMISSIONS = ["show_user", "add_user", "edit_user", "delete_user"];
export const ROLE_PERMISSIONS = ["show_role", "add_role", "edit_role", "delete_role"];
export const PERMISSION_PERMISSIONS = ["show_permission"];
export const COUNTRY_PERMISSIONS = ["show_country", "add_country", "edit_country", "delete_country"];
export const CITY_PERMISSIONS = ["show_city", "add_city", "edit_city", "delete_city"];
export const CUSTOMER_PERMISSIONS = ["show_customer", "add_customer", "edit_customer", "delete_customer"];
export const PAYMENT_TYPE_PERMISSIONS =  ["show_payment_type", "add_payment_type", "edit_payment_type", "delete_payment_type"];

export const getPermission = (permissions: string[], type: EActionType) => {
    return permissions.find((p: string) => p.includes(type))
};

export const getPermissions = (permissions: string[], type: string) => {
  return permissions.filter((p: string) => p.includes(type));
};