import { TFunction } from "i18next";
import React from "react";
import { CITY_PERMISSIONS, COUNTRY_PERMISSIONS, PERMISSION_PERMISSIONS, ROLE_PERMISSIONS, USER_PERMISSIONS } from "./utils/helpers/permissionHelpers";

const Dashboard = React.lazy(() => import('./pages/dashborad/Dashboard'));
//const NotFound = React.lazy(() => import("./pages/not-found/NotFound"));
const User = React.lazy(() => import("./pages/user/User"));
const Role = React.lazy(() => import("./pages/role/Role"));
const Permission = React.lazy(() => import("./pages/permission/Permission"));
const Country = React.lazy(() => import("./pages/country/Country"));
const City = React.lazy(() => import("./pages/city/City"));

const routes = (t: TFunction) => [
  {
    path: "/",
    exact: true,
    name: t("common.home"),
    breadcrumbName: t("common.home"),
  },
  {
    path: "/dashboard",
    name: t("menu.dashboard"),
    breadcrumbName: t("menu.dashboard"),
    component: Dashboard,
  },
  {
    path: "/settings",
    exact: true,
    name: t("menu.settings"),
    breadcrumbName: t("menu.settings"),
    component: User,
    permissions: USER_PERMISSIONS,
  },
  {
    path: "/settings/users",
    name: t("menu.users"),
    breadcrumbName: t("menu.users"),
    component: User,
    permissions: USER_PERMISSIONS,
  },
  {
    path: "/settings/roles",
    name: t("menu.roles"),
    breadcrumbName: t("menu.roles"),
    component: Role,
    permissions: ROLE_PERMISSIONS,
  },
  {
    path: "/settings/permissions",
    name: t("menu.permissions"),
    breadcrumbName: t("menu.permissions"),
    component: Permission,
    permissions: PERMISSION_PERMISSIONS,
  },
  {
    path: "/settings/countries",
    name: t("menu.countries"),
    breadcrumbName: t("menu.countries"),
    component: Country,
    permissions: COUNTRY_PERMISSIONS,
  },
  {
    path: "/settings/cities",
    name: t("menu.cities"),
    breadcrumbName: t("menu.cities"),
    component: City,
    permissions: CITY_PERMISSIONS,
  },
];

export default routes;