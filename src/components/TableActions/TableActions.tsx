import React from "react";
import { ETableActionType } from "../../utils/enum";
import { ITableActions } from "../../utils/interface";
import TableActionsButton from "./actions/TableActionsButton";
import TableActionsDropdown from "./actions/TableActionsDropdown";

const TableActions = (props: ITableActions) => {
  return (
    <div className="ant-table-actions">
      {(!props.type || props.type === ETableActionType.Button) && (
        <TableActionsButton {...props} />
      )}

      {props.type === ETableActionType.Dropdown && (
        <TableActionsDropdown {...props} />
      )}
    </div>
  );
};

export default TableActions;
