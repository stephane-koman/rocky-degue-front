import { useState } from "react";
import { Drawer, Button, Image } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import { useLocation } from "react-router-dom";
import Logo from "../assets/images/logo-login.png";
import { getMenu } from "./CMenu";

const CNavBar = () => {
  const [visible, setVisible] = useState(false);
  const currPath = useLocation().pathname;

  const onHideMenuHandler = () => {
    setVisible(false);
  };

  return (
    <div className="navbar">
      <Button
        className="menu"
        type="dashed"
        icon={<MenuOutlined />}
        onClick={() => setVisible(true)}
      />

      <Drawer
        title={<Image src={Logo} preview={false} />}
        placement="left"
        closable={false}
        onClose={onHideMenuHandler}
        visible={visible}
      >
        {getMenu(currPath, onHideMenuHandler)}
      </Drawer>
    </div>
  );
};
export default CNavBar;
