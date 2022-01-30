import React, { useState, useContext } from "react";
import { Redirect, useHistory } from "react-router-dom";
import { Layout, Form, Input, Button, Card, Image, List, message } from "antd";
import {
  UserOutlined,
  LockOutlined,
  SmileOutlined,
  LoginOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import Logo from "../../assets/images/logo-login.png";
import { red } from "@ant-design/colors";
import "./Login.scss";
import { getIsLoggedIn } from "../../utils/authHelpers";
import { AuthContext } from "../../context/auth";
import { useTranslation } from "react-i18next";
import { TFunction } from "i18next";
import { login } from "../../services/user.service";
import { JWT_TOKEN } from "../../utils/constantHelpers";

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

const Login = () => {
  const { t } = useTranslation();
  const context = useContext(AuthContext);
  const [form] = Form.useForm();
  const [errors, setErrors] = useState<any>({});
  const isAuthenticated = getIsLoggedIn();
  const history = useHistory();

  const onFinish = (data: any) => {
    login(data).then((res: any) => {
      const userData: any = res?.data;
      
      message.success(config(userData, t));
      context.login(userData);
      history.replace('/');
      
    }).catch((err: any) => {
      console.log("err", err);
    })
  };

  if (isAuthenticated) {
    return <Redirect to="/" />;
  }

  return (
    <div className="Login">
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
              fontSize: "2rem"
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
                extra={errors?.email}
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
                extra={errors?.password}
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
                    //loading={loading}
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
