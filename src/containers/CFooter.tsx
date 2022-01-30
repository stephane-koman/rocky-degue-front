import { Footer } from 'antd/lib/layout/layout';
import React from 'react'
import { useTranslation } from "react-i18next";

const CFooter = () => {
  const { t } = useTranslation();
    return (
      <Footer
        className="footer"
        style={{ textAlign: "center", fontWeight: "bold" }}
      >
        Rocky Degue Inc ©{new Date().getFullYear()}, {t("common.copyright")}.
      </Footer>
    );
}

export default CFooter;
