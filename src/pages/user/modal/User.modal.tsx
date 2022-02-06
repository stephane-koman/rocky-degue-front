import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Button,
  List,
  Row,
  Col,
  Select,
  Divider,
  Transfer,
} from "antd";
import { WarningOutlined } from "@ant-design/icons";
import { red } from "@ant-design/colors";
import { useTranslation } from "react-i18next";
import { IRole, IUser, IPermission } from "../../../utils/interface";
import { addUser, updateUser } from "../../../services/user.service";

const { Option } = Select;

interface IProps {
  isOpen: boolean;
  user?: IUser;
  roles?: IRole[];
  permissions?: IPermission[];
  onClose: (change?: boolean) => void;
}
export const UserModal = ({
  isOpen,
  user,
  roles,
  permissions,
  onClose,
}: IProps) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<any[]>([]);
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [targetKeys, setTargetKeys] = useState<any[]>([]);

  useEffect(() => {
    if (isOpen && user) {
      form.setFieldsValue({
        ...user,
        role: user?.role?.id
      });

      setDataSource(permissions);

      setTargetKeys(user.permissions.map((p: IPermission) => p.id));
    }

    if (isOpen && !user) {
      form.resetFields();

      setDataSource(
        permissions.map((p: IPermission) => {
          return {
            ...p,
            key: p.id,
          };
        })
      );
    }
  }, [user, isOpen, form]);

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

  const onAddUser = (data: IUser) => {
    setLoading(true);
    data.permissions = targetKeys;
    addUser(data)
      .then((resp: any) => {
        onUpdate(resp);
      })
      .catch((err: any) => console.error(err))
      .finally(() => setLoading(false));
  };

  const onUpdateUser = (data: IUser) => {
    setLoading(true);
    data.permissions = targetKeys;
    updateUser(user?.id, data)
      .then((resp: any) => {
        onUpdate(resp);
      })
      .catch((err: any) => console.error(err))
      .finally(() => setLoading(false));
  };

  const handleSubmit = (values: any) => {
    if (user) onUpdateUser(values);
    else onAddUser(values);
  };

  const onRoleChange = (value: string) => {
    form.setFieldsValue({ role: value });
  };

  const filterOption = (inputValue: any, option: any) =>
    option.name.indexOf(inputValue) > -1;

  const handleChange = (targetKeysChange: any) => {
    setTargetKeys(targetKeysChange);
  };

  const selectComponent = (
    <Col className="gutter-row" span={12}>
      <Form.Item
        className="mb-0"
        name="role"
        label={t("common.role")}
        rules={[{ required: true }]}
      >
        <Select
          showSearch
          allowClear
          placeholder={t("role.select_role")}
          onChange={onRoleChange}
          filterOption={(input: any, option: any) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {roles.map((role: IRole) => (
            <Option key={role.id} value={role.id}>
              {role.name.toUpperCase()}
            </Option>
          ))}
        </Select>
      </Form.Item>
    </Col>
  );

  return (
    <Modal
      visible={isOpen}
      destroyOnClose
      title={user ? t("user.update_user") : t("user.add_user")}
      width={1000}
      onCancel={() => handleClose()}
      onOk={form.submit}
      footer={[
        <Button key="back" onClick={() => handleClose()}>
          {t("common.cancel")}
        </Button>,
        <Button
          key="submit"
          type={"primary"}
          onClick={form.submit}
          loading={loading}
        >
          {user ? t("common.update") : t("common.save")}
        </Button>,
      ]}
    >
      <Form
        form={form}
        name="user-ref"
        labelCol={{
          span: 6,
        }}
        wrapperCol={{
          span: 18,
        }}
        initialValues={{
          id: "",
          name: "",
          email: "",
          role: null,
          permissions: [],
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
          {user && selectComponent}
          {!user && (
            <Col className="gutter-row" span={12}>
              <Form.Item
                name="password"
                label={t("common.password")}
                rules={[
                  { required: true, message: t("user.password_required") },
                ]}
              >
                <Input.Password />
              </Form.Item>
            </Col>
          )}
        </Row>

        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col className="gutter-row" span={12}>
            <Form.Item
              name="email"
              label={t("common.email")}
              rules={[
                {
                  required: true,
                  type: "email",
                  message: t("required.email"),
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          {!user && (
            <Col className="gutter-row" span={12}>
              <Form.Item
                name="password_confirm"
                label={<div>{t("common.confirm_password")}</div>}
                dependencies={["password"]}
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: t("user.confirm_password_required"),
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error(t("user.password_not_match"))
                      );
                    },
                  }),
                ]}
              >
                <Input.Password />
              </Form.Item>
            </Col>
          )}
        </Row>
        {!user && (
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            {selectComponent}
          </Row>
        )}

        <Divider />

        <div className="ant-form-item-label" style={{ marginBottom: "24px" }}>
          Permissions
        </div>

        <Transfer
          rowKey={(record) => record.id}
          titles={[t("common.transfert.source"), t("common.transfert.target")]}
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

export default UserModal;
