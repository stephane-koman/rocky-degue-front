import { unionArrays } from "./arrayHelpers";
import { JWT_TOKEN, USER_INFOS } from "./constantHelpers";

export const getIsLoggedIn = (): boolean => {
    return localStorage.getItem(JWT_TOKEN) ? true : false;
}

export const getUserPermissions = () => {
    const userInfos: any = JSON.parse(localStorage.getItem(USER_INFOS));
    const permissions: any[] = userInfos?.permissions;
    const rolePermissions: any[] = userInfos?.role?.permissions || [];
    return userInfos && unionArrays(permissions, rolePermissions);
}