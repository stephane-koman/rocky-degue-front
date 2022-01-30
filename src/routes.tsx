import { TFunction } from "i18next";
import React from "react";

const Dashboard = React.lazy(() => import('./pages/dashborad/Dashboard'));
const NotFound = React.lazy(() => import("./pages/not-found/NotFound"));

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
    component: NotFound,
  },
  {
    path: "/settings/users",
    name: t("menu.users"),
    breadcrumbName: t("menu.users"),
    component: NotFound,
  },
  {
    path: "/settings/roles",
    name: t("menu.roles"),
    breadcrumbName: t("menu.roles"),
    component: NotFound,
  },
  {
    path: "/settings/permissions",
    name: t("menu.permissions"),
    breadcrumbName: t("menu.permissions"),
    component: NotFound,
  },
];

export default routes;