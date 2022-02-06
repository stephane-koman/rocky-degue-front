import React, { useEffect, useState } from "react";
import { Button, Space, Table } from "antd";
import { EditOutlined, UnlockOutlined, SyncOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { searchRoles } from "../../services/role.service";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, showTotat } from "../../utils/helpers/constantHelpers";
import { IPagination, IPermission, IRole } from "../../utils/interface";
import RoleModal from "./modal/Role.modal";
import { findAllPermissions } from "../../services/permission.service";

const Role = () => {
  const { t } = useTranslation();
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<boolean>(true);
  const [roles, setRoles] = useState<IRole[]>([]);
  const [permissions, setPermissions] = useState<IPermission[]>([]);
  const [role, setRole] = useState<IRole>(null);

  const [pagination, setPagination] = useState<IPagination>({
    currentPage: DEFAULT_PAGE,
    size: DEFAULT_PAGE_SIZE,
    total: 0,
  });

  const columns = [
    {
      title: t("common.name"),
      dataIndex: "name",
      key: "name",
    },
    {
      title: t("common.description"),
      dataIndex: "description",
      key: "description",
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
    findAllPermissions().then((res: any) => {
      setPermissions(res?.data);
    })
  }, []);
  

  useEffect(() => {
    let mounted = true;

    if (refresh) {
      setLoading(mounted);
      searchRoles({ ...pagination })
        .then((res: any) => {
          const data: any = res?.data;
          setRoles(data?.data);
          setPagination({
            currentPage: data?.current_page,
            size: data?.per_page ? parseInt(data?.per_page) : pagination.size,
            total: data?.total,
          });
        })
        .catch((err: any) => {
          console.log(err);
        })
        .finally(() => {
          setLoading(false);
          setRefresh(false);
        });
    }

    return () => {
      mounted = false;
    };
  }, [refresh]);

  const handleEdit = (role: any) => {
    setRole(role);
    setIsModalVisible(true);
  };

  const onChange = (currentPagination: any, filters: any, sorter: any, extra: any) => {
    switch (extra?.action) {
      case "paginate":
        console.log(currentPagination);

        setPagination({
          ...pagination,
          currentPage: currentPagination?.current,
          size: currentPagination?.pageSize,
        });

        setRefresh(true);

        break;

      case "filters":
        console.log(filters);

        break;

      case "sorters":
        console.log(sorter);

        break;

      default:
        break;
    }
  };

  const onCloseModal = (change?: boolean) => {
    if(change){
      setRefresh(true);
    }
    setIsModalVisible(false);
    setRole(null);
  };

  const onRefresh = () => {
    setPagination({
      size: DEFAULT_PAGE_SIZE,
      currentPage: DEFAULT_PAGE,
      total: 0
    });
    setRefresh(true);
  }

  return (
    <div>
      <RoleModal role={role} permissions={permissions} isOpen={isModalVisible} onClose={onCloseModal} />
      <Space
        style={{
          marginBottom: 16,
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        <h2 className="">{t("role.table_title")}</h2>
        <div>
          <Button
            style={{
              marginRight: 4,
            }}
            icon={<SyncOutlined />}
            onClick={onRefresh}
          >
            {t("common.refresh")}
          </Button>
          <Button
            icon={<UnlockOutlined />}
            type="primary"
            onClick={() => setIsModalVisible(true)}
          >
            {t("role.add_role")}
          </Button>
        </div>
      </Space>
      <Table
        rowKey="id"
        dataSource={roles}
        columns={columns}
        loading={loading}
        scroll={{ scrollToFirstRowOnChange: true, y: "500px" }}
        pagination={{
          defaultPageSize: DEFAULT_PAGE_SIZE,
          defaultCurrent: DEFAULT_PAGE,
          current: pagination.currentPage,
          pageSize: pagination.size,
          total: pagination.total,
          showSizeChanger: true,
          showTotal: (total, range) => showTotat(total, range, t),
        }}
        onChange={onChange}
      />
    </div>
  );
};

export default Role;
