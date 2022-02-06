import { JWT_TOKEN } from "./constantHelpers";

export const getIsLoggedIn = (): boolean => {
    return localStorage.getItem(JWT_TOKEN) ? true : false;
}