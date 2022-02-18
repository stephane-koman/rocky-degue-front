import React, { useEffect, useRef, useState } from "react";
import { Button, Menu, Table } from "antd";
import { UsergroupAddOutlined, LockOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  showTotat,
} from "../../utils/helpers/constantHelpers";
import { IPagination, ICustomer, ICountry } from "../../utils/interface";
import CustomerModal from "./modal/Customer.modal";
import { getUserPermissions } from "../../utils/helpers/authHelpers";
import { EActionType, ETableActionType } from "../../utils/enum";
import TableActions from "../../components/TableActions/TableActions";
import { customerService } from "../../services/customer.service";
import {
  getColumnFilter,
  getColumnSearchProps,
  getColumnSorter,
} from "../../utils/helpers/menuHelpers";
import {
  getPermission,
  getPermissions,
  CUSTOMER_PERMISSIONS,
} from "../../utils/helpers/permissionHelpers";
import TableHeaderActions from "../../components/TableHeaderActions/TableHeaderActions";
import PageTitle from "../../components/PageTitle/PageTitle";
import { countryService } from "../../services/country.service";

enum columnType {
  Name = "name",
  Email = "email",
  Phone = "phone",
  Address = "address",
}

const initFilters = {
  name: null,
  email: null,
  text_search: null,
};

const Customer = () => {
  const customerConnectePermissions: any[] = getUserPermissions();
  const { t } = useTranslation();
  const searchInputRef = useRef(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<boolean>(true);
  const [reset, setReset] = useState<boolean>(false);
  const [showModalPassword, setShowModalPassword] = useState<boolean>(false);
  const [customers, setCustomers] = useState<ICustomer[]>([]);
  const [countries, setCountries] = useState<ICountry[]>([]);
  const [customer, setCustomer] = useState<ICustomer>(null);
  const [actionType, setActionType] = useState<EActionType>(EActionType.Show);
  const [sorter, setSorter] = useState<string>(null);
  const [filters, setFilters] = useState<any>(initFilters);

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
        ...getColumnSearchProps(columnType.Name, reset),
      },
      {
        title: t("common." + columnType.Email),
        dataIndex: columnType.Email,
        key: columnType.Email,
        sorter: true,
        filterSearch: true,
        filteredValue: getColumnFilter(columnType.Email, filters),
        sortOrder: getColumnSorter(columnType.Email, sorter),
        ...getColumnSearchProps(columnType.Email, reset),
      },
      {
        title: t("common." + columnType.Phone),
        dataIndex: columnType.Phone,
        key: columnType.Phone,
        sorter: true,
        sortOrder: getColumnSorter(columnType.Phone, sorter),
      },
      {
        title: t("common." + columnType.Address),
        dataIndex: columnType.Address,
        key: columnType.Address,
        sorter: true,
        sortOrder: getColumnSorter(columnType.Address, sorter),
      },
    ];

    if (
      CUSTOMER_PERMISSIONS.some((p: string) => customerConnectePermissions.includes(p))
    ) {
      columns.push({
        title: t("common.actions"),
        dataIndex: "",
        key: "x",
        render: (_: any, data: any) => (
          <TableActions
            type={
              getPermissions(customerConnectePermissions, "customer").length > 2
                ? ETableActionType.Dropdown
                : ETableActionType.Button
            }
            data={data}
            permissions={{
              show: getPermission(CUSTOMER_PERMISSIONS, EActionType.Show),
              edit: getPermission(CUSTOMER_PERMISSIONS, EActionType.Edit),
              delete: getPermission(CUSTOMER_PERMISSIONS, EActionType.Delete),
            }}
            deleteInfo={`${t("common.confirm_delete_info.ce")} ${t(
              "common.customer"
            ).toLowerCase()}?`}
            handleAction={handleModal}
            handleOtherAction={handlePasswordModal}
            onConfirmDelete={onConfirmDelete}
          >
            {customerConnectePermissions.includes(
              getPermission(CUSTOMER_PERMISSIONS, EActionType.Edit)
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

  const onConfirmDelete = (customerId: any) => {
    customerService.delete(customerId).then((_: any) => {
      setRefresh(true);
    });
  };

  useEffect(() => {
    countryService.findAll().then((res: any) => {
      setCountries(res.data);
    });

    setReset(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (refresh) {
      setLoading(true);
      customerService
        .search({ ...pagination, ...filters, sort: sorter })
        .then((res: any) => {
          const data: any = res?.data;
          setCustomers(data?.data);
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
    setCustomer(u);
    setIsModalVisible(true);
  };

  const handlePasswordModal = (u: any) => {
    setCustomer(u);
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
    setCustomer(null);
  };

  const onCloseModalPassword = () => {
    setShowModalPassword(false);
    setCustomer(null);
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
      <CustomerModal
        type={actionType}
        customer={customer}
        countries={countries}
        isOpen={isModalVisible}
        onClose={onCloseModal}
      />
      <PageTitle title={t("customer.page_title")} />
      <TableHeaderActions
        search
        refresh
        searchInputRef={searchInputRef}
        onSearch={onSearchInput}
        onRefresh={onRefresh}
      >
        {customerConnectePermissions.includes(
          getPermission(CUSTOMER_PERMISSIONS, EActionType.Add)
        ) && (
          <Button
            icon={<UsergroupAddOutlined />}
            type="primary"
            onClick={showModal}
          >
            {t("customer.add_customer")}
          </Button>
        )}
      </TableHeaderActions>
      <Table
        rowKey="id"
        dataSource={customers}
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

export default Customer;
