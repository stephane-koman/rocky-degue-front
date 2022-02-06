import { Footer } from 'antd/lib/layout/layout';
import React from 'react'
import { useTranslation } from "react-i18next";
import { SITE_TITLE_FOOTER } from '../utils/helpers/constantHelpers';

const CFooter = () => {
  const { t } = useTranslation();
    return (
      <Footer
        className="footer"
        style={{ textAlign: "center", fontWeight: "bold" }}
      >
        {SITE_TITLE_FOOTER} Inc ©{new Date().getFullYear()}, {t("common.copyright")}.
      </Footer>
    );
}

export default CFooter;
