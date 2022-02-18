import { Button, Checkbox, Divider, Input, Menu, Radio } from "antd";
import SubMenu from "antd/lib/menu/SubMenu";
import { Link } from "react-router-dom";
import { getUserPermissions } from "./authHelpers";
import {
  ColumnFilterItem,
  FilterDropdownProps,
} from "antd/lib/table/interface";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

interface IColumnSelectProps extends FilterDropdownProps, IProps {}

export const recursiveMenu = (
  nav: any,
  currPath: any,
  onToggleVisible?: any
) => {
  if (
    (!nav?._children &&
      nav?.permissions?.some((p: any) => getUserPermissions()?.includes(p))) ||
    (!nav?._children && !nav?.permissions)
  ) {
    return (
      <Menu.Item
        key={nav?.name}
        icon={nav?.icon}
        className={currPath === nav?.to ? "ant-menu-item-selected" : ""}
        onClick={onToggleVisible}
      >
        <Link to={nav?.to}>{nav?.name}</Link>
      </Menu.Item>
    );
  } else {
    return (
      (nav?.permissions?.some((p: any) => getUserPermissions()?.includes(p)) ||
        !nav?.permissions) && (
        <SubMenu key={nav?.name} icon={nav?.icon} title={nav?.name}>
          {nav?._children?.map((navChild: any) =>
            recursiveMenu(navChild, currPath, onToggleVisible)
          )}
        </SubMenu>
      )
    );
  }
};

const handleReset = (
  confirm: any,
  clearFilters: any,
  filters?: any,
  setFiltersTmp?: any,
  setSearch?: any
) => {
  if (setFiltersTmp) {
    setFiltersTmp(filters);
  }
  if (setSearch) {
    setSearch(null);
  }
  clearFilters();
  confirm();
};

export const ColumnSearchProps = ({
  setSelectedKeys,
  selectedKeys,
  confirm,
  clearFilters,
  visible,
  dataIndex,
  reset
}: IColumnSelectProps) => {
  const [search, setSearch] = useState(null);
  const { t } = useTranslation();
  const inputRef = useRef<any>(null);

  useEffect(() => {
    if (visible) {
      inputRef?.current?.focus();
    }
  }, [visible]);

  useEffect(() => {
    if (reset) {
      setSearch(null);
    }
  }, [reset]);

  const onChange = (e: any) => {
    setSearch(e.target.value);
    setSelectedKeys(e.target.value ? [e.target.value] : []);
  };

  return (
    <div className="custom-filter-dropdown">
      <Input
        ref={inputRef}
        placeholder={`${t("common.search")} ${t(`common.${dataIndex}`)}`}
        value={search}
        onChange={onChange}
        onPressEnter={() => confirm()}
        style={{ width: 200, marginBottom: 8, display: "block" }}
        autoFocus
      />
      <Button
        type="link"
        disabled={selectedKeys.length === 0}
        onClick={() => handleReset(confirm, clearFilters)}
        size="small"
        style={{ width: 96, marginRight: 8 }}
      >
        {t("common.reset")}
      </Button>
      <Button
        type="primary"
        onClick={() => confirm()}
        size="small"
        style={{ width: 96 }}
      >
        {t("common.search")}
      </Button>
    </div>
  );
};

export const getColumnSearchProps = (dataIndex: any, reset?: boolean) => ({
  filterDropdown: (props: FilterDropdownProps) => (
    <ColumnSearchProps
      dataIndex={dataIndex}
      reset={reset}
      {...props}
    />
  ),
});

const onInputSelectChange = (
  e: React.ChangeEvent<HTMLInputElement>,
  filters: ColumnFilterItem[],
  setFiltersTmp: (selectedKeys: ColumnFilterItem[]) => void,
  setSearch: any
) => {
  const value: any = e?.target?.value;
  setSearch(value);
  const data: any[] = filters.filter((f: any) =>
    f?.value?.toLowerCase()?.includes(value?.toLowerCase())
  );
  setFiltersTmp(data);
};

interface IPropsComponent {
  filterMultiple: boolean;
  checked: boolean;
  onChange?: (e: any) => void;
}

const Component = ({ filterMultiple, checked, onChange }: IPropsComponent) =>
  filterMultiple ? (
    <Checkbox checked={checked} onChange={onChange} />
  ) : (
    <Radio checked={checked} onChange={onChange} />
  );

const onChangeCheck = (
  e: any,
  key: any,
  selectedKeys: React.Key[],
  setSelectedKeys: (selectedKeys: React.Key[]) => void
) => {
  const selectedKeysTmp: React.Key[] = [...selectedKeys];
  if (!e?.target?.checked) {
    if (selectedKeys.includes(key)) {
      const index: number = selectedKeys.findIndex((s: any) => s === key);
      selectedKeysTmp.splice(index, 1);
    }
  } else {
    selectedKeysTmp.push(key);
  }
  setSelectedKeys(selectedKeysTmp);
};

const onChangeCheckAll = (
  e: any,
  filters: ColumnFilterItem[],
  setSelectedKeys: (selectedKeys: React.Key[]) => void
) => {
  if (!e?.target?.checked) {
    setSelectedKeys([]);
  } else {
    setSelectedKeys(filters.map((f: ColumnFilterItem) => f.value.toString()));
  }
};

interface IProps {
  dataIndex: any;
  filterMultiple?: boolean;
  reset?: boolean;
}

export const ColumnSelectProps = ({
  filters,
  setSelectedKeys,
  selectedKeys,
  confirm,
  clearFilters,
  visible,
  dataIndex,
  filterMultiple,
  reset,
}: IColumnSelectProps) => {
  const menuKeys: any[] = selectedKeys;
  const { t } = useTranslation();
  const [filtersTmp, setFiltersTmp] = useState<ColumnFilterItem[]>(filters);
  const [search, setSearch] = useState(null);
  const inputRef = useRef<any>(null);

  useEffect(() => {
    if (visible) {
      inputRef?.current?.focus();
    }
  }, [visible]);

  useEffect(() => {
    if (reset) {
      setSearch([]);
      setFiltersTmp(filters);
    }
  }, [reset]);

  return (
    <div className="custom-filter-dropdown">
      <Input
        ref={inputRef}
        placeholder={`${t("common.search")} ${t(`common.${dataIndex}`)}`}
        value={search}
        onChange={(e) =>
          onInputSelectChange(e, filters, setFiltersTmp, setSearch)
        }
        onPressEnter={() => confirm()}
        style={{ width: 200, marginBottom: 8, display: "block" }}
      />

      <Menu multiple={filterMultiple} selectedKeys={menuKeys}>
        <Menu.Divider />
        {filterMultiple && (
          <Menu.Item key="all" style={{ marginBottom: 0, marginTop: 0 }}>
            <Component
              checked={
                selectedKeys?.length > 0 &&
                selectedKeys?.length === filters?.length
              }
              filterMultiple={filterMultiple}
              onChange={(e: any) =>
                onChangeCheckAll(e, filters, setSelectedKeys)
              }
            />
            <span>
              {t("common.select").toUpperCase() +
                " " +
                t("common.tout").toUpperCase()}
            </span>
          </Menu.Item>
        )}
        {filtersTmp?.map((filter: any, index: number) => {
          const key = String(filter.value);
          return (
            <Menu.Item
              key={filter.value !== undefined ? key : index}
              style={{ marginBottom: 0, marginTop: 0 }}
            >
              <Component
                checked={selectedKeys?.includes(key)}
                filterMultiple={filterMultiple}
                onChange={(e) =>
                  onChangeCheck(e, key, selectedKeys, setSelectedKeys)
                }
              />
              <span>{filter.text}</span>
            </Menu.Item>
          );
        })}
      </Menu>

      <div className={`custom-dropdown-btns`}>
        <Button
          type="link"
          disabled={selectedKeys?.length === 0 && (search === "" || !search)}
          onClick={() =>
            handleReset(
              confirm,
              clearFilters,
              filters,
              setFiltersTmp,
              setSearch
            )
          }
          size="small"
          style={{ width: 96, marginRight: 8 }}
        >
          {t("common.reset")}
        </Button>
        <Button
          type="primary"
          onClick={() => confirm()}
          size="small"
          style={{ width: 96 }}
        >
          {t("common.search")}
        </Button>
      </div>
    </div>
  );
};

export const getColumnSelectProps = (
  dataIndex: any,
  filterMultiple: boolean,
  reset?: boolean
) => ({
  filterDropdown: (props: FilterDropdownProps) => (
    <ColumnSelectProps
      dataIndex={dataIndex}
      filterMultiple={filterMultiple}
      reset={reset}
      {...props}
    />
  ),
});

export const getColumnFilter = (title: string, filters: any) => {
  return filters[title] || null;
};

export const getColumnSorter = (title: string, sorter: any) => {
  return sorter && sorter.includes(title) && sorter.split(".")[1];
};
