import { TFunction } from "i18next";
import React from "react";

const Dashboard = React.lazy(() => import('./pages/dashborad/Dashboard'));
//const NotFound = React.lazy(() => import("./pages/not-found/NotFound"));
const User = React.lazy(() => import("./pages/user/User"));
const Role = React.lazy(() => import("./pages/role/Role"));
const Permission = React.lazy(() => import("./pages/permission/Permission"));

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
    permissions: ["show_user", "add_user", "update_user", "delete_user"],
  },
  {
    path: "/settings/users",
    name: t("menu.users"),
    breadcrumbName: t("menu.users"),
    component: User,
    permissions: ["show_user", "add_user", "update_user", "delete_user"],
  },
  {
    path: "/settings/roles",
    name: t("menu.roles"),
    breadcrumbName: t("menu.roles"),
    component: Role,
    permissions: ["show_role", "add_role", "update_role", "delete_role"],
  },
  {
    path: "/settings/permissions",
    name: t("menu.permissions"),
    breadcrumbName: t("menu.permissions"),
    component: Permission,
    permissions: [
      "show_permission",
      "add_permission",
      "update_permission",
      "delete_permission",
    ],
  },
];

export default routes;