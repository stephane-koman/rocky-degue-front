import React, { useState, useContext, useEffect } from "react";
import { Redirect, useHistory } from "react-router-dom";
import { Layout, Form, Input, Button, Card, message, Select } from "antd";
import {
  UserOutlined,
  LockOutlined,
  SmileOutlined,
  LoginOutlined,
  FrownOutlined,
} from "@ant-design/icons";
import { red } from "@ant-design/colors";
import "./Login.scss";
import { getIsLoggedIn } from "../../utils/authHelpers";
import { AuthContext } from "../../context/auth";
import { useTranslation } from "react-i18next";
import { TFunction } from "i18next";
import { login } from "../../services/user.service";
import { Language } from "../../enums/Language";
import i18n from "../../i18n";

const config = ({ username }, t: TFunction) => {
  return {
    content: (
      <span>
        {t("common.welcome")},{" "}
        <span className="text-capitalize font-weight-bold">{username}</span>!
      </span>
    ),
    icon: <SmileOutlined />,
  };
};

const configSession = (t: TFunction) => {
  return {
    content: <span>{t("common.session_expired")}</span>,
    icon: <FrownOutlined />,
  };
};

const Login = () => {
  const { t } = useTranslation();
  const [lang, setLang] = useState<Language>(i18n.language as Language);
  const context = useContext(AuthContext);
  const [form] = Form.useForm();
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const isAuthenticated = getIsLoggedIn();
  const history = useHistory();

  const onFinish = (data: any) => {
    setLoading(true);
    login(data).then((res: any) => {
      const userData: any = res?.data;
      message.success(config(userData, t));
      context.login(userData);
      history.replace('/');
      
    }).catch((err: any) => {
      setError(err);
    }).finally(() => {
      setLoading(false);
    })
  };

  const onChangeLanguage = (selectedValue: any) => {
    const language = selectedValue;

    switch (language) {
      case Language.EN:
        setLang(Language.EN);
        i18n.changeLanguage(Language.EN);
        localStorage.setItem("i18nextLng", Language.EN);
        break;
      case Language.FR:
      default:
        setLang(Language.FR);
        i18n.changeLanguage(Language.FR);
        localStorage.setItem("i18nextLng", Language.FR);
        break;
    }
  };

  useEffect(() => {
    const expired = new URLSearchParams(history.location.search).get("session");
    if(expired){
      message.error(configSession(t)); 
      history.replace('/login');
    } 
  }, []);
  

  if (isAuthenticated) {
    return <Redirect to="/" />;
  }

  return (
    <div className="Login">
      <Select
        defaultValue={lang}
        style={{ width: 70, marginRight: "8px", marginTop: "8px", position: "absolute", right: 0, background: "#FFF" }}
        bordered={false}
        onChange={onChangeLanguage}
      >
        <Select.Option value={Language.FR}>FR</Select.Option>
        <Select.Option value={Language.EN}>EN</Select.Option>
      </Select>
      <Layout style={{ minHeight: "100vh" }}>
        <div
          style={{
            width: "40%",
            height: "100%",
            margin: "auto",
          }}
        >
          <h1
            style={{
              width: "100%",
              marginBottom: "15%",
              textAlign: "center",
              color: "#FFF",
              fontSize: "2rem",
            }}
          >
            ROCKY DEGUE
          </h1>
          <Card
            title={t("login.title")}
            style={{
              marginRight: "auto",
              marginLeft: "auto",
            }}
            headStyle={{ textAlign: "center", fontSize: "30px" }}
          >
            {error && (
              <div className="text-center" style={{ color: red.primary }}>
                {t("login.auth_error")}
              </div>
            )}
            <Form
              form={form}
              style={{
                width: "100%",
                marginRight: "auto",
                marginLeft: "auto",
                padding: "30px",
                backgroundColor: "#FFFFFF",
              }}
              name="normal_login"
              size="large"
              initialValues={{
                email: "",
                password: "",
              }}
              onFinish={onFinish}
            >
              <Form.Item
                name="email"
                rules={[
                  {
                    required: true,
                    type: "email",
                    message: t("login.email_required"),
                  },
                ]}
              >
                <Input
                  className="ant-input-login"
                  prefix={<UserOutlined className="site-form-item-icon" />}
                  type="email"
                  placeholder={t("common.email")}
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[
                  {
                    required: true,
                    message: t("login.password_required"),
                  },
                ]}
              >
                <Input.Password
                  className="ant-input-login"
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  placeholder={t("common.password")}
                />
              </Form.Item>

              <Form.Item shouldUpdate>
                {() => (
                  <Button
                    className="ant-btn-login"
                    type="primary"
                    htmlType="submit"
                    block
                    loading={loading}
                    icon={<LoginOutlined />}
                    disabled={
                      !form.isFieldsTouched(true) ||
                      !!form
                        .getFieldsError()
                        .filter((data) => data.errors.length).length
                    }
                  >
                    {t("login.sign_in")}
                  </Button>
                )}
              </Form.Item>
            </Form>
          </Card>
        </div>
      </Layout>
    </div>
  );
};

export default Login;
