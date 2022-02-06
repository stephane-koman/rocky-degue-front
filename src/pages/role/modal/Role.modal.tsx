import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Button,
  List,
  Row,
  Col,
  Transfer,
  Divider,
} from "antd";
import { WarningOutlined } from "@ant-design/icons";
import { red } from "@ant-design/colors";
import { useTranslation } from "react-i18next";
import { IPermission, IRole } from "../../../utils/interface";
import { addRole, updateRole } from "../../../services/role.service";
import "./Role.modal.scss";

interface IProps {
  isOpen: boolean;
  role?: IRole;
  permissions?: IPermission[];
  onClose: (change?: boolean) => void;
}
export const RoleModal = ({ isOpen, role, permissions, onClose }: IProps) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<any[]>([]);
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [targetKeys, setTargetKeys] = useState<any[]>([]);

  useEffect(() => {
    if (isOpen && role) {
      form.setFieldsValue(role);
      
      setDataSource(permissions);
      
      setTargetKeys(role.permissions.map((p: IPermission) => p.id));
    }

    if (isOpen && !role) {
      form.resetFields();
      setDataSource(permissions.map((p: IPermission) => {
        return {
          ...p,
          key: p.id
        }
      }));
    }
  }, [role, isOpen, permissions, form]);

  const handleClose = (change?: boolean) => {
    form.resetFields();
    setErrors([]);
    onClose(change);
    setDataSource([]);
    setTargetKeys([]);
  };

  const onUpdate = (resp: any) => {
    if (resp?.data?.errors) {
      setErrors(resp?.data?.errors);
    } else {
      handleClose(true);
    }
  };

  const onAddRole = (data: IRole) => {
    setLoading(true);
    data.permissions = targetKeys;
    addRole(data)
      .then((resp: any) => {
        onUpdate(resp);
      })
      .catch((err: any) => console.error(err))
      .finally(() => setLoading(false));
  };

  const onUpdateRole = (data: IRole) => {
    setLoading(true);
    data.permissions = targetKeys;
    updateRole(role?.id, data)
      .then((resp: any) => {
        onUpdate(resp);
      })
      .catch((err: any) => console.error(err))
      .finally(() => setLoading(false));
  };

  const handleSubmit = (values: any) => {
    if (role) onUpdateRole(values);
    else onAddRole(values);
  };

  const filterOption = (inputValue: any, option: any) =>
    option.name.indexOf(inputValue) > -1;

  const handleChange = (targetKeysChange: any) => {
    setTargetKeys(targetKeysChange);
  };

  return (
    <Modal
      className="Role"
      visible={isOpen}
      destroyOnClose
      width={1000}
      title={role ? t("role.update_role") : t("role.add_role")}
      onCancel={() => handleClose()}
      onOk={form.submit}
      footer={[
        <Button key="back" onClick={() => handleClose()}>
          {t("common.cancel")}
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={form.submit}
          loading={loading}
        >
          {role ? t("common.update") : t("common.save")}
        </Button>,
      ]}
    >
      <Form
        form={form}
        name="role-ref"
        labelCol={{
          span: 6,
        }}
        wrapperCol={{
          span: 18,
        }}
        initialValues={{
          id: "",
          name: "",
          description: "",
        }}
        onFinish={handleSubmit}
      >
        {Object.keys(errors).length > 0 && (
          <List
            dataSource={Object.values(errors)}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  className="text-center"
                  description={
                    <span style={{ color: red.primary }}>
                      <WarningOutlined style={{ marginRight: "16px" }} />
                      {item}
                    </span>
                  }
                />
              </List.Item>
            )}
          />
        )}
        <Input name="id" type="hidden" />

        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col className="gutter-row" span={12}>
            <Form.Item
              className="mb-0"
              name="name"
              label={t("common.name")}
              rules={[
                {
                  required: true,
                  message: t("required.name"),
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={12}>
            <Form.Item
              className="mb-0"
              name="description"
              label={t("common.description")}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Divider />

        <Transfer
          rowKey={(record) => record.id}
          dataSource={dataSource}
          showSearch
          filterOption={filterOption}
          targetKeys={targetKeys}
          onChange={handleChange}
          render={(item) => item?.name}
        />
      </Form>
    </Modal>
  );
};

export default RoleModal;
