import React from "react";
import { Button, Tooltip } from "antd";
import { useTranslation } from "react-i18next";
import { EActionType } from "../../../utils/enum";
import { EyeOutlined, EditOutlined } from "@ant-design/icons";
import { getUserPermissions } from "../../../utils/helpers/authHelpers";
import { ITableActions } from "../../../utils/interface";
import DeleteModal from "../../DeleteModal/Delete.modal";

const TableActionsButton = ({
  data,
  children,
  deleteInfo,
  permissions,
  handleAction,
  onCancelDelete, 
  onConfirmDelete,
}: ITableActions) => {
  const { t } = useTranslation();
  const userPermissions: any[] = getUserPermissions();
  return (
    <>
      {userPermissions.includes(permissions.show) && (
        <Tooltip title={t("common.show")} zIndex={0}>
          <Button
            icon={<EyeOutlined />}
            type="default"
            onClick={() => handleAction && handleAction(data, EActionType.Show)}
          />
        </Tooltip>
      )}
      {userPermissions.includes(permissions.edit) && (
        <Tooltip title={t("common.edit")} zIndex={0}>
          <Button
            icon={<EditOutlined />}
            type="primary"
            onClick={() => handleAction && handleAction(data, EActionType.Edit)}
          />
        </Tooltip>
      )}
      {userPermissions.includes(permissions.delete) && (
        <DeleteModal
          id={data?.id}
          info={deleteInfo}
          onCancel={() => onCancelDelete && onCancelDelete()}
          onConfirm={() => onConfirmDelete && onConfirmDelete(data?.id)}
        />
      )}
      {children}
    </>
  );
};

export default TableActionsButton;
