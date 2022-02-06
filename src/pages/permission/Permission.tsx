import React, { useEffect, useState } from "react";
import { Button, Space, Table } from "antd";
import { SyncOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, showTotat } from "../../utils/helpers/constantHelpers";
import { IPagination, IPermission } from "../../utils/interface";
import { searchPermissions } from "../../services/permission.service";

const Permission = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<boolean>(true);
  const [permissions, setPermissions] = useState<IPermission[]>([]);

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
  ];

  useEffect(() => {
    let mounted = true;

    if (refresh) {
      setLoading(mounted);
      searchPermissions({ ...pagination })
        .then((res: any) => {
          const data: any = res?.data;
          setPermissions(data?.data);
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

  const onChange = (
    currentPagination: any,
    filters: any,
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
      <Space
        style={{
          marginBottom: 16,
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        <h2 className="">{t("permission.table_title")}</h2>
        <Button icon={<SyncOutlined />} onClick={onRefresh}>
          {t("common.refresh")}
        </Button>
      </Space>
      <Table
        rowKey="id"
        dataSource={permissions}
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

export default Permission;
