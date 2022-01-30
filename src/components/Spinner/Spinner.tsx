import React from 'react'
import { Spin } from "antd";
import './Spinner.scss';

interface IProps {
  size: "small" | "default" | "large";
  height: string;
}

const Spinner = ({size, height}: IProps) => {
  return (
    <div
      className="Spinner"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: height,
      }}
    >
      <Spin size={size} />
    </div>
  );
};

export default Spinner;
