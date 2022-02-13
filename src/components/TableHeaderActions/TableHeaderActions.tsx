import React from "react";
import { Button, Input, Space } from "antd";
import { SyncOutlined } from "@ant-design/icons";
import "./TableHeaderActions.scss";
import { ITableHeaderActions } from "../../utils/interface";
import { useTranslation } from "react-i18next";

const TableHeaderActions = ({
  search,
  refresh,
  children,
  onRefresh,
  onSearch,
  searchInputRef,
}: ITableHeaderActions) => {
  const { t } = useTranslation();
  let timer = null;

  const handleSearch = (e: any) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      onSearch && onSearch(e?.target?.value);
    }, 500);
  };

  return (
    <Space
      className="TableHeaderActions"
      style={{
        marginBottom: 24,
        width: "100%",
        justifyContent: "space-between",
      }}
    >
      {search && (
        <Input.Search ref={searchInputRef} allowClear onChange={handleSearch} />
      )}
      <div>
        {refresh && (
          <Button
            style={{
              marginRight: 4,
            }}
            icon={<SyncOutlined />}
            onClick={() => onRefresh && onRefresh()}
          >
            {t("common.refresh")}
          </Button>
        )}
        {children}
      </div>
    </Space>
  );
};

export default TableHeaderActions;
