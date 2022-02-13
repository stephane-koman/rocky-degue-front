import React, { useEffect, useRef, useState } from "react";
import { Button, Menu, Table } from "antd";
import { UserAddOutlined, LockOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  showTotat,
} from "../../utils/helpers/constantHelpers";
import { IPagination, IPermission, IRole, IUser } from "../../utils/interface";
import UserModal from "./modal/User.modal";
import { getUserPermissions } from "../../utils/helpers/authHelpers";
import { EActionType, ETableActionType } from "../../utils/enum";
import TableActions from "../../components/TableActions/TableActions";
import { userService } from "../../services/user.service";
import { roleService } from "../../services/role.service";
import { permissionService } from "../../services/permission.service";
import {
  ColumnSelectProps,
  getColumnFilter,
  getColumnSearchProps,
  getColumnSelectProps,
  getColumnSorter,
} from "../../utils/helpers/menuHelpers";
import UserPasswordModal from "./modal/UserPassword.modal";
import {
  getPermission,
  getPermissions,
  USER_PERMISSIONS,
} from "../../utils/helpers/permissionHelpers";
import TableHeaderActions from "../../components/TableHeaderActions/TableHeaderActions";
import PageTitle from "../../components/PageTitle/PageTitle";
import { FilterDropdownProps } from "antd/lib/table/interface";

enum columnType {
  Name = "name",
  Email = "email",
  Role = "role",
}

const initFilters = {
  name: null,
  email: null,
  role: [],
  text_search: null,
};

const User = () => {
  const userConnectePermissions: any[] = getUserPermissions();
  const { t } = useTranslation();
  const searchInputRef = useRef(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<boolean>(true);
  const [reset, setReset] = useState<boolean>(false);
  const [showModalPassword, setShowModalPassword] = useState<boolean>(false);
  const [users, setUsers] = useState<IUser[]>([]);
  const [roles, setRoles] = useState<IRole[]>([]);
  const [permissions, setPermissions] = useState<IPermission[]>([]);
  const [user, setUser] = useState<IUser>(null);
  const [actionType, setActionType] = useState<EActionType>(EActionType.Show);
  const [sorter, setSorter] = useState<string>(null);
  const [filters, setFilters] = useState<any>(initFilters);

  const [pagination, setPagination] = useState<IPagination>({
    currentPage: DEFAULT_PAGE,
    size: DEFAULT_PAGE_SIZE,
    total: 0,
  });

  const getColumns = () => {
    const rolesT: any[] = roles.map((r) => ({
      value: r.name,
      text: r.name,
    }));

    const columns: any[] = [
      {
        title: t("common." + columnType.Name),
        dataIndex: columnType.Name,
        key: columnType.Name,
        sorter: true,
        filterSearch: true,
        filteredValue: getColumnFilter(columnType.Name, filters),
        sortOrder: getColumnSorter(columnType.Name, sorter),
        ...getColumnSearchProps(columnType.Name, t),
      },
      {
        title: t("common." + columnType.Email),
        dataIndex: columnType.Email,
        key: columnType.Email,
        filters: [],
        sorter: true,
        filterSearch: true,
        filteredValue: getColumnFilter(columnType.Email, filters),
        sortOrder: getColumnSorter(columnType.Email, sorter),
        ...getColumnSearchProps(columnType.Email, t),
      },
      {
        title: t("common." + columnType.Role),
        key: columnType.Role,
        dataIndex: ["role", "name"],
        filters: rolesT,
        filteredValue: getColumnFilter(columnType.Role, filters),
        ...getColumnSelectProps(columnType.Role, true, reset),
      },
    ];

    if (
      USER_PERMISSIONS.some((p: string) => userConnectePermissions.includes(p))
    ) {
      columns.push({
        title: t("common.actions"),
        dataIndex: "",
        key: "x",
        render: (_: any, data: any) => (
          <TableActions
            type={
              getPermissions(userConnectePermissions, "user").length > 2
                ? ETableActionType.Dropdown
                : ETableActionType.Button
            }
            data={data}
            permissions={{
              show: getPermission(USER_PERMISSIONS, EActionType.Show),
              edit: getPermission(USER_PERMISSIONS, EActionType.Edit),
              delete: getPermission(USER_PERMISSIONS, EActionType.Delete),
            }}
            deleteInfo={`${t("common.confirm_delete_info.cet")} ${t(
              "common.user"
            ).toLowerCase()}?`}
            handleAction={handleModal}
            handleOtherAction={handlePasswordModal}
            onConfirmDelete={onConfirmDelete}
          >
            {userConnectePermissions.includes(
              getPermission(USER_PERMISSIONS, EActionType.Edit)
            ) && (
              <Menu.Item key="password" icon={<LockOutlined />}>
                {t("common.password")}
              </Menu.Item>
            )}
          </TableActions>
        ),
      });
    }

    return columns;
  };

  const onConfirmDelete = (userId: any) => {
    userService.delete(userId).then((_: any) => {
      setRefresh(true);
    });
  };

  useEffect(() => {
    roleService.findAll().then((res: any) => {
      setRoles(res.data);
    });

    permissionService.findAll().then((res: any) => {
      setPermissions(res?.data);
    });

    setReset(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (refresh) {
      setLoading(true);
      userService
        .search({ ...pagination, ...filters, sort: sorter })
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
          if (reset) setReset(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh]);

  const handleModal = (u: any, type: EActionType) => {
    setActionType(type);
    setUser(u);
    setIsModalVisible(true);
  };

  const handlePasswordModal = (u: any) => {
    setUser(u);
    setShowModalPassword(true);
  };

  const onChange = (
    currentPagination: any,
    currentFilters: any,
    sorter: any,
    extra: any
  ) => {
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
        setFilters({
          name: currentFilters.name ? currentFilters.name[0] : null,
          email: currentFilters.email ? currentFilters.email[0] : null,
          role: currentFilters.role || [],
        });
        setRefresh(true);
        break;

      case "sort":
        setSorter(sorter.order ? sorter.field + "." + sorter.order : null);
        setRefresh(true);
        break;

      default:
        break;
    }
  };

  const onCloseModal = (change?: boolean) => {
    if (change) {
      setRefresh(true);
    }
    setIsModalVisible(false);
    setUser(null);
  };

  const onCloseModalPassword = () => {
    setShowModalPassword(false);
    setUser(null);
  };

  const onRefresh = () => {
    if (searchInputRef?.current?.state?.value) {
      searchInputRef.current.state.value = "";
    }
    setPagination({
      size: DEFAULT_PAGE_SIZE,
      currentPage: DEFAULT_PAGE,
      total: 0,
    });
    setSorter(null);
    setFilters(initFilters);
    setRefresh(true);
    setReset(true);
  };

  const showModal = () => {
    setActionType(EActionType.Add);
    setIsModalVisible(true);
  };

  const onSearchInput = (value: string) => {
    setFilters((f: any) => ({
      ...f,
      text_search: value,
    }));
    setRefresh(true);
  };

  return (
    <div>
      <UserPasswordModal
        user={user}
        isOpen={showModalPassword}
        onClose={onCloseModalPassword}
      />
      <UserModal
        type={actionType}
        user={user}
        roles={roles}
        permissions={permissions}
        isOpen={isModalVisible}
        onClose={onCloseModal}
      />
      <PageTitle title={t("user.page_title")} />
      <TableHeaderActions
        search
        refresh
        searchInputRef={searchInputRef}
        onSearch={onSearchInput}
        onRefresh={onRefresh}
      >
        {userConnectePermissions.includes(
          getPermission(USER_PERMISSIONS, EActionType.Add)
        ) && (
          <Button icon={<UserAddOutlined />} type="primary" onClick={showModal}>
            {t("user.add_user")}
          </Button>
        )}
      </TableHeaderActions>
      <Table
        rowKey="id"
        dataSource={users}
        columns={getColumns()}
        loading={loading}
        scroll={{ scrollToFirstRowOnChange: true, y: "450px" }}
        pagination={{
          defaultPageSize: DEFAULT_PAGE_SIZE,
          defaultCurrent: DEFAULT_PAGE,
          current: pagination.currentPage,
          pageSize: pagination.size,
          total: pagination.total,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => showTotat(total, range, t),
        }}
        onChange={onChange}
      />
    </div>
  );
};

export default User;
