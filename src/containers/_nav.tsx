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
    permissions: ["show_user", "add_user", "update_user", "delete_user"],
    _children: [
      {
        name: t("menu.users"),
        to: "/settings/users",
        icon: <TeamOutlined />,
        permissions: ["show_user", "add_user", "update_user", "delete_user"],
      },
      {
        name: t("menu.roles"),
        to: "/settings/roles",
        icon: <ToolOutlined />,
        permissions: ["show_role", "add_role", "update_role", "delete_role"],
      },
      {
        name: t("menu.permissions"),
        to: "/settings/permissions",
        icon: <AppstoreAddOutlined />,
        permissions: [
          "show_permission",
          "add_permission",
          "update_permission",
          "delete_permission",
        ],
      },
    ],
  },
];

export default _nav;