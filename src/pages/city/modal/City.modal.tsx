import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  List,
  Row,
  Col,
  Select,
} from "antd";
import { WarningOutlined } from "@ant-design/icons";
import { red } from "@ant-design/colors";
import { useTranslation } from "react-i18next";
import { ICity, IDefault } from "../../../utils/interface";
import "./City.modal.scss";
import { EActionType, EAgainType } from "../../../utils/enum";
import { cityService } from "../../../services/city.service";
import ModalFooterActions from "../../../components/ModalFooterActions/ModalFooterActions";

const { Option } = Select;

interface IProps {
  isOpen: boolean;
  type?: EActionType;
  city?: ICity;
  countries?: IDefault[];
  onClose: (change?: boolean) => void;
}

export const CityModal = ({ isOpen, type, city, countries, onClose }: IProps) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [addAgain, setAddAgain] = useState<boolean>(false);
  const [errors, setErrors] = useState<any[]>([]);

  useEffect(() => {
    if (isOpen && city) {
      form.setFieldsValue({
        ...city,
        country: city?.country?.id
      });
    }
  }, [city, isOpen, form]);

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

  const onAddCity = (data: ICity) => {
    setLoading(true);
    cityService.add(data)
      .then((resp: any) => {
        onUpdate(resp);
      })
      .catch((err: any) => console.error(err))
      .finally(() => setLoading(false));
  };

  const onUpdateCity = (data: ICity) => {
    setLoading(true);
    cityService.update(city?.id, data)
      .then((resp: any) => {
        onUpdate(resp);
      })
      .catch((err: any) => console.error(err))
      .finally(() => setLoading(false));
  };

  const handleSubmit = (values: any) => {
    if (city) onUpdateCity(values);
    else onAddCity(values);
  };

  const onCountryChange = (value: string) => {
    form.setFieldsValue({ role: value });
  };


  return (
    <Modal
      className="City"
      visible={isOpen}
      destroyOnClose
      title={t(`city.${type}_city`)}
      onCancel={() => handleClose()}
      onOk={form.submit}
      footer={
        <ModalFooterActions
          again={{
            text: t("common.city"),
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
        name="city-ref"
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
          country: countries[0]?.id || null,
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
              name="code"
              label={t("common.code")}
              rules={[
                {
                  required: true,
                  message: t("required.code"),
                },
              ]}
            >
              <Input disabled={type === EActionType.Show} />
            </Form.Item>
          </Col>
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
              name="country"
              label={t("common.country")}
              rules={[{ required: true }]}
            >
              <Select
                disabled={type === EActionType.Show}
                allowClear
                placeholder={t("country.select_country")}
                onChange={onCountryChange}
                filterOption={(input: any, option: any) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
              >
                {countries.map((country: IDefault) => (
                  <Option key={country.id} value={country.id}>
                    {country?.name?.toUpperCase()}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default CityModal;
