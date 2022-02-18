import React, { useEffect, useState } from "react";
import { Modal, Form, Input, List, Row, Col, Select } from "antd";
import { WarningOutlined } from "@ant-design/icons";
import { red } from "@ant-design/colors";
import { useTranslation } from "react-i18next";
import { ICustomer, ICountry } from "../../../utils/interface";
import { EActionType, EAgainType } from "../../../utils/enum";
import { customerService } from "../../../services/customer.service";
import ModalFooterActions from "../../../components/ModalFooterActions/ModalFooterActions";

const { Option } = Select;

interface IProps {
  isOpen: boolean;
  type?: EActionType;
  customer?: ICustomer;
  countries?: ICountry[];
  onClose: (change?: boolean) => void;
}

export const CustomerModal = ({
  isOpen,
  type,
  customer,
  countries,
  onClose,
}: IProps) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [addAgain, setAddAgain] = useState<boolean>(false);
  const [errors, setErrors] = useState<any[]>([]);

  useEffect(() => {
    if (isOpen && customer) {
      form.setFieldsValue({
        ...customer,
        country: customer?.country?.id,
      });
    }

    if (isOpen && !customer) {
      form.resetFields();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customer, isOpen, form]);

  const handleClose = (change?: boolean) => {
    form.resetFields();
    setErrors([]);
    if (!addAgain) onClose(change);
    setAddAgain(false);
  };

  const onUpdate = (resp: any) => {
    if (resp?.data?.errors) {
      setErrors(resp?.data?.errors);
    } else {
      handleClose(true);
    }
  };

  const onAddCustomer = (data: ICustomer) => {
    setLoading(true);
    customerService
      .add(data)
      .then((resp: any) => {
        onUpdate(resp);
      })
      .catch((err: any) => console.error(err))
      .finally(() => setLoading(false));
  };

  const onUpdateCustomer = (data: ICustomer) => {
    setLoading(true);
    customerService
      .update(customer?.id, data)
      .then((resp: any) => {
        onUpdate(resp);
      })
      .catch((err: any) => console.error(err))
      .finally(() => setLoading(false));
  };

  const handleSubmit = (values: any) => {
    if (customer) onUpdateCustomer(values);
    else onAddCustomer(values);
  };

  const onRoleChange = (value: string) => {
    form.setFieldsValue({ role: value });
  };

  return (
    <Modal
      visible={isOpen}
      destroyOnClose
      title={t(`customer.${type}_customer`)}
      width={1000}
      onCancel={() => handleClose()}
      onOk={form.submit}
      footer={
        <ModalFooterActions
          again={{
            text: t("common.customer"),
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
        name="customer-ref"
        scrollToFirstError
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
          phone: "",
          address: "",
          description: "",
          country: countries[0]?.id,
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
              <Input disabled={type === EActionType.Show} />
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={12}>
            <Form.Item
              className="mb-0"
              name="country"
              label={t("common.country")}
              rules={[{ required: true }]}
            >
              <Select
                disabled={type === EActionType.Show}
                showSearch
                allowClear
                placeholder={t("country.select_country")}
                onChange={onRoleChange}
                filterOption={(input: any, option: any) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
              >
                {countries.map((country: ICountry) => (
                  <Option key={country.id} value={country.id}>
                    {country.name.toUpperCase()}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
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
              <Input disabled={type === EActionType.Show} />
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={12}>
            <Form.Item
              name="phone"
              label={t("common.phone")}
              rules={[
                {
                  required: true,
                  min: 8,
                  max: 11,
                  message: t("required.phone"),
                },
              ]}
            >
              <Input disabled={type === EActionType.Show} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col className="gutter-row" span={12}>
            <Form.Item
              name="address"
              label={t("common.address")}
              rules={[
                {
                  required: true,
                  message: t("required.address"),
                },
              ]}
            >
              <Input disabled={type === EActionType.Show} />
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={12}>
            <Form.Item name="description" label={t("common.description")}>
              <Input.TextArea
                rows={4}
                maxLength={6}
                disabled={type === EActionType.Show}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default CustomerModal;
