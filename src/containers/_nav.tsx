import React from "react";
import {
  DashboardOutlined,
  SettingOutlined,
  TeamOutlined,
  ToolOutlined,
  AppstoreAddOutlined,
} from "@ant-design/icons";
import { TFunction } from "i18next";

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
    _children: [
      {
        name: t("menu.users"),
        to: "/settings/users",
        icon: <TeamOutlined />,
      },
      {
        name: t("menu.roles"),
        to: "/settings/roles",
        icon: <ToolOutlined />,
      },
      {
        name: t("menu.permissions"),
        to: "/settings/permissions",
        icon: <AppstoreAddOutlined />,
      },
    ],
  },
];

export default _nav;