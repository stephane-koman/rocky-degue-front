import React from "react";
import { Layout } from "antd";
import { useLocation } from "react-router-dom";

// Menu config
import { getMenu } from "./CMenu";

const { Sider } = Layout;

interface IProps {
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
}

const CSidebar = ({ collapsed, onCollapse }: IProps) => {
  const currPath = useLocation().pathname;

  return (
    <Sider
      style={{ flexGrow: 1 }}
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
    >
      <div className="logo">
        ROCKY DEGUE
      </div>
      {getMenu(currPath)}
    </Sider>
  );
};

export default React.memo(CSidebar);
