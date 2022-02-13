import React, { useEffect, useRef, useState } from "react";
import { Button, Table } from "antd";
import { UnlockOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  showTotat,
} from "../../utils/helpers/constantHelpers";
import { IPagination, IPermission, IRole } from "../../utils/interface";
import RoleModal from "./modal/Role.modal";
import TableActions from "../../components/TableActions/TableActions";
import { getUserPermissions } from "../../utils/helpers/authHelpers";
import { EActionType, ETableActionType } from "../../utils/enum";
import { roleService } from "../../services/role.service";
import { permissionService } from "../../services/permission.service";
import { getColumnFilter, getColumnSearchProps, getColumnSorter } from "../../utils/helpers/menuHelpers";
import PageTitle from "../../components/PageTitle/PageTitle";
import TableHeaderActions from "../../components/TableHeaderActions/TableHeaderActions";
import { getPermission, getPermissions, ROLE_PERMISSIONS } from "../../utils/helpers/permissionHelpers";

enum columnType {
  Name = "name",
  Description = "description",
}

const initFiliters = {
  name: null,
  description: null,
  text_search: null,
};
const Role = () => {
  const userConnectePermissions: any[] = getUserPermissions();
  const { t } = useTranslation();
  const searchInputRef = useRef(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<boolean>(true);
  const [roles, setRoles] = useState<IRole[]>([]);
  const [permissions, setPermissions] = useState<IPermission[]>([]);
  const [actionType, setActionType] = useState<EActionType>(EActionType.Show);
  const [role, setRole] = useState<IRole>(null);
  const [sorter, setSorter] = useState<string>(null);
  const [filters, setFilters] = useState<any>(initFiliters);

  const [pagination, setPagination] = useState<IPagination>({
    currentPage: DEFAULT_PAGE,
    size: DEFAULT_PAGE_SIZE,
    total: 0,
  });

  const getColumns = () => {
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
        title: t("common." + columnType.Description),
        dataIndex: columnType.Description,
        key: columnType.Description,
        sorter: true,
        filterSearch: true,
        filteredValue: getColumnFilter(columnType.Description, filters),
        sortOrder: getColumnSorter(columnType.Description, sorter),
        ...getColumnSearchProps(columnType.Description, t),
      },
    ];

    if (
      ROLE_PERMISSIONS.some((p: string) => userConnectePermissions.includes(p))
    ) {
      columns.push({
        title: t("common.actions"),
        dataIndex: "",
        key: "x",
        render: (_: any, data: any) => (
          <TableActions
            type={
              getPermissions(userConnectePermissions, "role").length > 2
                ? ETableActionType.Dropdown
                : ETableActionType.Button
            }
            data={data}
            permissions={{
              show: getPermission(ROLE_PERMISSIONS, EActionType.Show),
              edit: getPermission(ROLE_PERMISSIONS, EActionType.Edit),
              delete: getPermission(ROLE_PERMISSIONS, EActionType.Delete),
            }}
            deleteInfo={`${t("common.confirm_delete_info.cet")} ${t(
              "common.role"
            ).toLowerCase()}?`}
            handleAction={handleModal}
            onConfirmDelete={onConfirmDelete}
            onCancelDelete={onCancelDelete}
          />
        ),
      });
    }
    return columns;
  };

  const onCancelDelete = (e: any) => {
    console.log(e);
  };

  const onConfirmDelete = (userId: any) => {
    roleService.delete(userId).then((_: any) => {
      setRefresh(true);
    });
  };

  useEffect(() => {
    permissionService.findAll().then((res: any) => {
      setPermissions(res?.data);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (refresh) {
      setLoading(true);
      roleService
        .search({ ...pagination, ...filters, sort: sorter })
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh]);

  const handleModal = (r: any, type: EActionType) => {
    setActionType(type);
    setRole(r);
    setIsModalVisible(true);
  };

  const onChange = (
    currentPagination: any,
    currentFilters: any,
    sorter: any,
    extra: any
  ) => {
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

      case "filter":
        setFilters({
          name: currentFilters.name ? currentFilters.name[0] : null,
          description: currentFilters.description
            ? currentFilters.description[0]
            : null,
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
    setRole(null);
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
    setFilters(initFiliters);
    setRefresh(true);
  };

  const showModal = () => {
    setActionType(EActionType.Edit);
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
      <RoleModal
        type={actionType}
        role={role}
        permissions={permissions}
        isOpen={isModalVisible}
        onClose={onCloseModal}
      />
      <PageTitle title={t("role.page_title")} />
      <TableHeaderActions
        search
        refresh
        searchInputRef={searchInputRef}
        onSearch={onSearchInput}
        onRefresh={onRefresh}
      >
        {userConnectePermissions.includes(
          getPermission(ROLE_PERMISSIONS, EActionType.Add)
        ) && (
          <Button icon={<UnlockOutlined />} type="primary" onClick={showModal}>
            {t("role.add_role")}
          </Button>
        )}
      </TableHeaderActions>

      <Table
        rowKey="id"
        dataSource={roles}
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

export default Role;
