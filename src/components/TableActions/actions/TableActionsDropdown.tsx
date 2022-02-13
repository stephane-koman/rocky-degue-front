import React from "react";
import { Button, Dropdown, Menu, Popconfirm, Space } from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  DownOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import { ITableActions } from "../../../utils/interface";
import { EActionType } from "../../../utils/enum";
import { useTranslation } from "react-i18next";
import { getUserPermissions } from "../../../utils/helpers/authHelpers";

const TableActionsDropdown = ({
  data,
  children,
  deleteInfo,
  permissions,
  handleAction,
  onCancelDelete,
  onConfirmDelete,
  handleOtherAction,
}: ITableActions) => {
  const { t } = useTranslation();
  const userPermissions: any[] = getUserPermissions();

  const handleMenuClick = (e?: any) => {
    switch (e?.key) {
      case EActionType.Show:
        handleAction && handleAction(data, EActionType.Show);
        break;

      case EActionType.Edit:
        handleAction && handleAction(data, EActionType.Edit);
        break;

      case EActionType.Delete:
        break;

      default:
        handleOtherAction(data, e?.key);
        break;
    }
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      {userPermissions.includes(permissions.show) && (
        <Menu.Item key={EActionType.Show} icon={<EyeOutlined />}>
          {t("common.show")}
        </Menu.Item>
      )}
      {userPermissions.includes(permissions.edit) && (
        <Menu.Item key={EActionType.Edit} icon={<EditOutlined />}>
          {t("common.edit")}
        </Menu.Item>
      )}
      {children}
      {userPermissions.includes(permissions.delete) && (
        <Menu.Item key={EActionType.Delete} icon={<DeleteOutlined />} danger>
          <Popconfirm
            placement="topRight"
            title={deleteInfo}
            icon={<QuestionCircleOutlined style={{ color: "red" }} />}
            onConfirm={() => onConfirmDelete(data?.id)}
            onCancel={onCancelDelete}
            okText={t("common.yes")}
            cancelText={t("common.no")}
          >
            {t("common.delete")}
          </Popconfirm>
        </Menu.Item>
      )}
    </Menu>
  );

  return (
    <Space wrap>
      <Dropdown overlay={menu}>
        <Button>
          {t("common.actions")} <DownOutlined />
        </Button>
      </Dropdown>
    </Space>
  );
};

export default TableActionsDropdown;
