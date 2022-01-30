import React from "react";
import { useTranslation } from "react-i18next";

const Dashboard = () => {
  const { t } = useTranslation();
  return <div>{t('common.welcome')}</div>;
};

export default Dashboard;
