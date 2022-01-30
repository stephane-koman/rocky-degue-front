import React, { useEffect, useState } from "react";
import { Button, Space, Table } from "antd";
import { EditOutlined, UserAddOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { search } from "../../services/user.service";

const User = () => {
  const { t } = useTranslation();
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [users, setUsers] = useState<any[]>([]);

  const columns = [
    {
      title: t("common.name"),
      dataIndex: "name",
      key: "name",
    },
    {
      title: t("common.email"),
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Action",
      dataIndex: "",
      key: "x",
      render: (_: any, record: any) => (
        <div>
          <Button
            icon={<EditOutlined />}
            type="link"
            onClick={() => handleEdit(record)}
          />
        </div>
      ),
    },
  ];

  useEffect(() => {
    let mounted = true;
    setLoading(mounted);

    search(null)
      .then((res: any) => {
        setUsers(res?.data?.result);
      })
      .catch((err: any) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const handleEdit = (user: any) => {
    console.log(user);
  };

  return (
    <div>
      <Space
        style={{
          marginBottom: 16,
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        <h2 className="">{t("user.table_title")}</h2>
        <Button
          icon={<UserAddOutlined />}
          type="primary"
          onClick={() => setIsModalVisible(true)}
        >
          {t("user.add_user")}
        </Button>
      </Space>
      <Table
        rowKey="id"
        dataSource={users}
        columns={columns}
        loading={loading}
      />
    </div>
  );
};

export default User;
