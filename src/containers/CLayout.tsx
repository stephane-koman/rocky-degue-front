import React, { useState } from "react";
import "antd/dist/antd.css";
import { Layout } from "antd";
import { CHeader, CFooter, CSidebar, CContent } from ".";
import "./CLayout.scss";

const CLayout = () => {

  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  const onCollapseHandler = (collapsed: boolean) => {
    setIsCollapsed(collapsed);
  };

  const onToggleHandler = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <Layout
      className="CLayout"
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        left: 0,
        bottom: 0,
      }}
    >
      <CSidebar collapsed={isCollapsed} onCollapse={onCollapseHandler} />
      <Layout className="site-layout" style={{ flexGrow: 5 }}>
        
        <CHeader collapsed={isCollapsed} onToggle={onToggleHandler} />
        <CContent />
        <CFooter />
      </Layout>
    </Layout>
  );
};

export default CLayout;
