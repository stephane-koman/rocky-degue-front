import React, { useEffect, useState } from "react";
import { Col, Form, Input, List, Modal, Row } from "antd";
import { useTranslation } from "react-i18next";
import { ICountry } from "../../../utils/interface";
import { WarningOutlined } from "@ant-design/icons";
import { red } from "@ant-design/colors";
import { countryService } from "../../../services/country.service";
import ModalFooterActions from "../../../components/ModalFooterActions/ModalFooterActions";
import { EActionType, EAgainType } from "../../../utils/enum";

interface IProps {
  isOpen: boolean;
  type?: EActionType;
  country: ICountry;
  onClose: (change?: boolean) => void;
}

const CountryModal = ({ isOpen, type, country, onClose }: IProps) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [errors, setErrors] = useState<any[]>([]);
  const [addAgain, setAddAgain] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen && country) {
      form.setFieldsValue(country);
    }
  }, [country, isOpen, form]);

  const onUpdate = (resp: any) => {
    if (resp?.data?.errors) {
      setErrors(resp?.data?.errors);
    } else {
      handleClose(true);
    }
  };

  const onAddUser = (data: ICountry) => {
    setLoading(true);
    countryService
      .add(data)
      .then((resp: any) => {
        onUpdate(resp);
      })
      .catch((err: any) => console.error(err))
      .finally(() => setLoading(false));
  };

  const onUpdateUser = (data: ICountry) => {
    setLoading(true);
    countryService
      .update(country?.id, data)
      .then((resp: any) => {
        onUpdate(resp);
      })
      .catch((err: any) => console.error(err))
      .finally(() => setLoading(false));
  };

  const handleSubmit = (values: any) => {
    if (country) onUpdateUser(values);
    else onAddUser(values);
  };

  useEffect(() => {
    if (isOpen && country) {
      form.setFieldsValue((value: any) => ({
        ...value,
        id: country?.id,
      }));
    }
  }, [isOpen, country]);

  const handleClose = (change?: boolean) => {
    form.resetFields();
    setErrors([]);
    if (!addAgain) onClose(change);
    setAddAgain(false);
  };

  return (
    <Modal
      visible={isOpen}
      destroyOnClose
      title={t("country.add_country")}
      onCancel={() => handleClose()}
      onOk={form.submit}
      footer={
        <ModalFooterActions
          again={{
            text: t("common.country"),
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
        name="country-ref"
        labelCol={{
          span: 6,
        }}
        wrapperCol={{
          span: 18,
        }}
        initialValues={{
          id: "",
          code: "",
          name: "",
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
          <Col className="gutter-row" span={24}>
            <Form.Item
              name="code"
              label={t("common.code")}
              rules={[{ required: true, message: t("required.code") }]}
            >
              <Input disabled={type === EActionType.Show} />
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={24}>
            <Form.Item
              name="name"
              label={t("common.name")}
              rules={[{ required: true, message: t("required.name") }]}
            >
              <Input disabled={type === EActionType.Show} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default CountryModal;
