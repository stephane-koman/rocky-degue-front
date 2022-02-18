import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
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
import "./Role.modal.scss";
import { EActionType, EAgainType } from "../../../utils/enum";
import { roleService } from "../../../services/role.service";
import ModalFooterActions from "../../../components/ModalFooterActions/ModalFooterActions";

interface IProps {
  isOpen: boolean;
  type?: EActionType;
  role?: IRole;
  permissions?: IPermission[];
  onClose: (change?: boolean) => void;
}
export const RoleModal = ({ isOpen, type, role, permissions, onClose }: IProps) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [addAgain, setAddAgain] = useState<boolean>(false);
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
    if (!addAgain) onClose(change);
    setDataSource([]);
    setTargetKeys([]);
    setAddAgain(false);
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
    roleService.add(data)
      .then((resp: any) => {
        onUpdate(resp);
      })
      .catch((err: any) => console.error(err))
      .finally(() => setLoading(false));
  };

  const onUpdateRole = (data: IRole) => {
    setLoading(true);
    data.permissions = targetKeys;
    roleService.update(role?.id, data)
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
      title={t(`role.${type}_role`)}
      onCancel={() => handleClose()}
      onOk={form.submit}
      footer={
        <ModalFooterActions
          again={{
            text: t("common.role"),
            type: EAgainType.Un,
          }}
          type={type}
          loading={loading}
          addAgain={addAgain}
          onAddAgain={(check: boolean) => setAddAgain(check)}
          onClose={handleClose}
          onSubmit={form.submit}
        />
      }
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
              <Input disabled={type === EActionType.Show} />
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={12}>
            <Form.Item
              className="mb-0"
              name="description"
              label={t("common.description")}
            >
              <Input disabled={type === EActionType.Show} />
            </Form.Item>
          </Col>
        </Row>

        <Divider />

        <Transfer
          disabled={type === EActionType.Show}
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
