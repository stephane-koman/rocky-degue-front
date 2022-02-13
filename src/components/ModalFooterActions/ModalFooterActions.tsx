import { Button, Checkbox } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";
import { EActionType, EAgainType } from "../../utils/enum";
import "./ModalFooterActions.scss";

interface IProps {
  again?: {
    text?: string;
    type?: EAgainType;
  };

  type?: EActionType;
  loading?: boolean;
  addAgain?: boolean;
  children?: React.ReactNode;
  onClose: () => void;
  onAddAgain?: (check: boolean) => void;
  onSubmit?: (addAgain?: boolean) => void;
}
const ModalFooterActions = ({
  again,
  type,
  loading,
  children,
  addAgain,
  onAddAgain,
  onClose,
  onSubmit,
}: IProps) => {
  const { t } = useTranslation();

  const onCheck = (e: any) => {
    onAddAgain(e?.target?.checked);
  };

  return (
    <div className="ModalFooterActions">
      <div>
        {again && (
          <Checkbox checked={addAgain} onChange={onCheck}>{`${
            again.type === EAgainType.Un
              ? t("common.add_another_un")
              : t("common.add_another_une")
          } ${again.text.toLowerCase()}`}</Checkbox>
        )}
      </div>
      <div>
        <Button key="back" onClick={() => onClose()}>
          {t("common.cancel")}
        </Button>
        {(type === EActionType.Edit || type === EActionType.Add) && (
          <Button
            key="submit"
            type={"primary"}
            onClick={(_) => onSubmit && onSubmit()}
            loading={loading}
          >
            {type === EActionType.Edit ? t("common.update") : t("common.save")}
          </Button>
        )}
        {children}
      </div>
    </div>
  );
};

export default ModalFooterActions;
