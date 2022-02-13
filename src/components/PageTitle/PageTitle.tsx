import React from "react";
import { Divider } from "antd";
import "./PageTitle.scss";

interface IProps {
  title: React.ReactNode | string;
}
const PageTitle = ({ title }: IProps) => {
  return (
    <div className="PageTitle">
      <h2>{title}</h2>
      <Divider />
    </div>
  );
};

export default PageTitle;
