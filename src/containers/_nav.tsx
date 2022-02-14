import React from "react";
import {
  DashboardOutlined,
  SettingOutlined,
  TeamOutlined,
  ToolOutlined,
  AppstoreAddOutlined,
  GlobalOutlined,
  ApartmentOutlined
} from "@ant-design/icons";
import { TFunction } from "i18next";
import { CITY_PERMISSIONS, COUNTRY_PERMISSIONS, PERMISSION_PERMISSIONS, ROLE_PERMISSIONS, USER_PERMISSIONS } from "../utils/helpers/permissionHelpers";

const _nav = (t: TFunction) => [
  {
    name: t("menu.dashboard"),
    to: "/dashboard",
    icon: <DashboardOutlined />,
  },
  {
    name: t("menu.settings"),
    to: "/settings",
    icon: <SettingOutlined />,
    permissions: USER_PERMISSIONS,
    _children: [
      {
        name: t("menu.users"),
        to: "/settings/users",
        icon: <TeamOutlined />,
        permissions: USER_PERMISSIONS,
      },
      {
        name: t("menu.roles"),
        to: "/settings/roles",
        icon: <ToolOutlined />,
        permissions: ROLE_PERMISSIONS,
      },
      {
        name: t("menu.permissions"),
        to: "/settings/permissions",
        icon: <AppstoreAddOutlined />,
        permissions: PERMISSION_PERMISSIONS,
      },
      {
        name: t("menu.countries"),
        to: "/settings/countries",
        icon: <GlobalOutlined />,
        permissions: COUNTRY_PERMISSIONS,
      },
      {
        name: t("menu.cities"),
        to: "/settings/cities",
        icon: <ApartmentOutlined />,
        permissions: CITY_PERMISSIONS,
      },
    ],
  },
];

export default _nav;