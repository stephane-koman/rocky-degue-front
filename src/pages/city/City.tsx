import React, { useEffect, useRef, useState } from "react";
import { Button, Table } from "antd";
import { UnlockOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  showTotat,
} from "../../utils/helpers/constantHelpers";
import { IPagination, ICity, ICountry } from "../../utils/interface";
import CityModal from "./modal/City.modal";
import TableActions from "../../components/TableActions/TableActions";
import { getUserPermissions } from "../../utils/helpers/authHelpers";
import { EActionType, ETableActionType } from "../../utils/enum";
import { cityService } from "../../services/city.service";
import {
  getColumnFilter,
  getColumnSearchProps,
  getColumnSelectProps,
  getColumnSorter,
} from "../../utils/helpers/menuHelpers";
import PageTitle from "../../components/PageTitle/PageTitle";
import TableHeaderActions from "../../components/TableHeaderActions/TableHeaderActions";
import {
  getPermission,
  getPermissions,
  CITY_PERMISSIONS,
} from "../../utils/helpers/permissionHelpers";
import { countryService } from "../../services/country.service";

enum columnType {
  Name = "name",
  Code = "code",
  Country = "country",
}

const initFiliters = {
  name: null,
  description: null,
  text_search: null,
};
const City = () => {
  const userConnectePermissions: any[] = getUserPermissions();
  const { t } = useTranslation();
  const searchInputRef = useRef(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<boolean>(true);
  const [countries, setCountries] = useState<ICountry[]>([]);
  const [actionType, setActionType] = useState<EActionType>(EActionType.Show);
  const [city, setCity] = useState<ICity>(null);
  const [cities, setCities] = useState<ICity[]>([]);
  const [sorter, setSorter] = useState<string>(null);
  const [filters, setFilters] = useState<any>(initFiliters);
  const [reset, setReset] = useState<boolean>(false);

  const [pagination, setPagination] = useState<IPagination>({
    currentPage: DEFAULT_PAGE,
    size: DEFAULT_PAGE_SIZE,
    total: 0,
  });

  const getColumns = () => {
    const countriesT: any[] = countries.map((r) => ({
      value: r.name?.toUpperCase(),
      text: r.name?.toUpperCase(),
    }));

    const columns: any[] = [
      {
        title: t("common." + columnType.Code),
        dataIndex: columnType.Code,
        key: columnType.Code,
        sorter: true,
        filterSearch: true,
        filteredValue: getColumnFilter(columnType.Code, filters),
        sortOrder: getColumnSorter(columnType.Code, sorter),
        ...getColumnSearchProps(columnType.Code, reset),
      },
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
        title: t("common." + columnType.Country),
        key: columnType.Country,
        dataIndex: ["country", "name"],
        filters: countriesT,
        filteredValue: getColumnFilter(columnType.Country, filters),
        ...getColumnSelectProps(columnType.Country, true, reset),
      },
    ];

    if (
      CITY_PERMISSIONS.some((p: string) => userConnectePermissions.includes(p))
    ) {
      columns.push({
        title: t("common.actions"),
        dataIndex: "",
        key: "x",
        render: (_: any, data: any) => (
          <TableActions
            type={
              getPermissions(userConnectePermissions, "city").length > 2
                ? ETableActionType.Dropdown
                : ETableActionType.Button
            }
            data={data}
            permissions={{
              show: getPermission(CITY_PERMISSIONS, EActionType.Show),
              edit: getPermission(CITY_PERMISSIONS, EActionType.Edit),
              delete: getPermission(CITY_PERMISSIONS, EActionType.Delete),
            }}
            deleteInfo={`${t("common.confirm_delete_info.cette")} ${t(
              "common.city"
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
    cityService.delete(userId).then((_: any) => {
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
      cityService
        .search({ ...pagination, ...filters, sort: sorter })
        .then((res: any) => {
          const data: any = res?.data;
          setCities(data?.data);
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

  const handleModal = (r: any, type: EActionType) => {
    setActionType(type);
    setCity(r);
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
          code: currentFilters.code ? currentFilters.code[0] : null,
          country: currentFilters.country || [],
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
    setCity(null);
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
      <CityModal
        type={actionType}
        city={city}
        countries={countries}
        isOpen={isModalVisible}
        onClose={onCloseModal}
      />
      <PageTitle title={t("city.page_title")} />
      <TableHeaderActions
        search
        refresh
        searchInputRef={searchInputRef}
        onSearch={onSearchInput}
        onRefresh={onRefresh}
      >
        {userConnectePermissions.includes(
          getPermission(CITY_PERMISSIONS, EActionType.Add)
        ) && (
          <Button icon={<UnlockOutlined />} type="primary" onClick={showModal}>
            {t("city.add_city")}
          </Button>
        )}
      </TableHeaderActions>

      <Table
        rowKey="id"
        dataSource={cities}
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

export default City;
