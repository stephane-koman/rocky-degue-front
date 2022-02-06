import React, { useEffect, useRef, useState } from "react";
import { Button, Input, Space, Table } from "antd";
import { EditOutlined, UserAddOutlined, SyncOutlined, SearchOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { searchUsers } from "../../services/user.service";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, showTotat } from "../../utils/helpers/constantHelpers";
import { IPagination, IPermission, IRole, IUser } from "../../utils/interface";
import UserModal from "./modal/User.modal";
import { findAllRoles } from "../../services/role.service";
import { findAllPermissions } from "../../services/permission.service";

const User = () => {
  const { t } = useTranslation();
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<boolean>(true);
  const [users, setUsers] = useState<IUser[]>([]);
  const [roles, setRoles] = useState<IRole[]>([]);
  const [permissions, setPermissions] = useState<IPermission[]>([]);
  const [user, setUser] = useState<IUser>(null);
  const [sort, setSort] = useState<string>(null);
  const [filters, setFilters] = useState<any>({
    name: null,
    email: null,
  });
  const searchInput: any = useRef();

  const [pagination, setPagination] = useState<IPagination>({
    currentPage: DEFAULT_PAGE,
    size: DEFAULT_PAGE_SIZE,
    total: 0,
  });

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div className="custom-filter-dropdown">
        <Input
          ref={(node) => {
            searchInput.current = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => confirm()}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Button
          type="primary"
          onClick={() => confirm()}
          icon={<SearchOutlined />}
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button
          onClick={() => handleReset(confirm, clearFilters)}
          size="small"
          style={{ width: 90 }}
        >
          Reset
        </Button>
      </div>
    ),
  });

  const handleReset = (confirm, clearFilters) => {
    clearFilters();
    confirm();
  };

  const columns = [
    {
      title: t("common.name"),
      dataIndex: "name",
      key: "name",
      filters: [],
      sorter: true,
      filterSearch: true,
      ...getColumnSearchProps("name"),
    },
    {
      title: t("common.email"),
      dataIndex: "email",
      key: "email",
      filters: [],
      sorter: true,
      filterSearch: true,
      ...getColumnSearchProps("email"),
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
    findAllRoles().then((res: any) => {
      setRoles(res.data);
    })

    findAllPermissions().then((res: any) => {
      setPermissions(res?.data);
    });
  }, []);
  

  useEffect(() => {
    let mounted = true;

    if (refresh) {
      setLoading(mounted);
      
      searchUsers({ ...pagination, ...filters, sort: sort })
        .then((res: any) => {
          const data: any = res?.data;
          setUsers(data?.data);
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

  const handleEdit = (user: any) => {
    setUser(user);
    setIsModalVisible(true);
  };

  const onChange = (currentPagination: any, filters: any, sorter: any, extra: any) => {
        
    switch (extra?.action) {
      case "paginate":
        setPagination({
          ...pagination,
          currentPage: currentPagination?.current,
          size: currentPagination?.pageSize,
        });

        setRefresh(true);

        break;

      case "filter":
        console.log(filters);
        setFilters({
          name: filters.name ? filters.name[0] : null,
          email: filters.email ? filters.email[0] : null,
        });
        setRefresh(true);
        break;

      case "sort":
        setSort(sorter.order ? sorter.field + "." + sorter.order : null);
        setRefresh(true);
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
    setUser(null);
  };

  const onRefresh = () => {
    setPagination({
      size: DEFAULT_PAGE_SIZE,
      currentPage: DEFAULT_PAGE,
      total: 0,
    });
    setRefresh(true);
  };

  return (
    <div>
      <UserModal
        user={user}
        roles={roles}
        permissions={permissions}
        isOpen={isModalVisible}
        onClose={onCloseModal}
      />
      <Space
        style={{
          marginBottom: 16,
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        <h2 className="">{t("user.table_title")}</h2>
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
            icon={<UserAddOutlined />}
            type="primary"
            onClick={() => setIsModalVisible(true)}
          >
            {t("user.add_user")}
          </Button>
        </div>
      </Space>
      <Table
        rowKey="id"
        dataSource={users}
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

export default User;
