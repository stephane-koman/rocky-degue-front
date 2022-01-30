import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Header } from "antd/lib/layout/layout";
import { message, Dropdown, Menu, Row, Col, Select, Typography } from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  FrownOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from "@ant-design/icons";
import CBreadcrumb from "./CBreadcrumb";
import routes from "../routes";
import { AuthContext } from "../context/auth";
import CNavBar from "./CNavBar";
import { Language } from "../enums/Language";
import { TFunction } from "i18next";

interface IProps {
  collapsed: boolean;
  onToggle: () => void;
}

const config = (t: TFunction) => ({
  content: t("login.logout_message"),
  icon: <FrownOutlined />,
});

const CHeader = ({ collapsed, onToggle }: IProps) => {
  const {user, logout} = useContext(AuthContext);
  const history = useHistory();
  const { t, i18n } = useTranslation();
  const [lang, setLang] = useState<Language>(i18n.language as Language);


  const handleMenuClick = (e: any) => {
    if (e?.key === "logout") {
      logout();
      message.error(config(t));
      history.replace("/login");
    }
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

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="logout" icon={<LogoutOutlined />}>
        {t("common.logout")}
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <Header className="site-layout-background">
        <Row>
          <Col span="6" className="navbar">
            <CNavBar />
          </Col>
          <Col span="6" className="toggle">
            {React.createElement(
              collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
              {
                className: "trigger",
                style: { fontSize: "20px" },
                onClick: onToggle,
              }
            )}
          </Col>
          <Col span="18" style={{ textAlign: "right" }}>
            <Select
              defaultValue={lang}
              style={{ width: 80, marginRight: "8px" }}
              bordered={false}
              onChange={onChangeLanguage}
            >
              <Select.Option value={Language.FR}>FR</Select.Option>
              <Select.Option value={Language.EN}>EN</Select.Option>
            </Select>

            <Dropdown.Button
              overlay={menu}
              placement="bottomRight"
              icon={<UserOutlined />}
              size="large"
              key="1"
            >
              <Typography.Text type="secondary">
                {t("common.welcome")},{" "}
                <span className="text-capitalize">{user?.username}</span>
              </Typography.Text>
            </Dropdown.Button>
          </Col>
        </Row>
      </Header>
      <CBreadcrumb routes={routes(t)} />
    </>
  );
};

export default CHeader;
