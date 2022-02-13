import React from "react";
import { Button, Popconfirm, Tooltip } from "antd";
import { DeleteOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { IDeleteModal } from "../../utils/interface";
import "./Delete.modal.scss";
import { useTranslation } from "react-i18next";

const DeleteModal = ({ id, info, onConfirm, onCancel }: IDeleteModal) => {
  const { t } = useTranslation();

  const confirm = (_: any) => {
    onConfirm(id);
  };

  const cancel = (_: any) => {
    onCancel();
  };

  return (
    <Popconfirm
      placement="topRight"
      title={info}
      icon={<QuestionCircleOutlined style={{ color: "red" }} />}
      onConfirm={confirm}
      onCancel={cancel}
      okText={t("common.yes")}
      cancelText={t("common.no")}
    >
      <Tooltip title={t("common.delete")} zIndex={0}>
        <Button icon={<DeleteOutlined />} type="primary" danger />
      </Tooltip>{" "}
    </Popconfirm>
  );
};

export default DeleteModal;
