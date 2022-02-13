import { useState } from "react";
import { Drawer, Button, Image } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import { useLocation } from "react-router-dom";
import { getMenu } from "./CMenu";
import LogoRD from "../assets/images/logo-rd.svg";

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
        title={<Image height={40} src={LogoRD} preview={false} />}
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
