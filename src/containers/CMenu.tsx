import { Menu } from "antd";
import memoize from "memoize-one";

import navigation from "./_nav";
import { useTranslation } from "react-i18next";
import { recursiveMenu } from "../utils/helpers/menuHelpers";

export const getMenu = memoize((currPath: any, onToggleVisible?: any) => {
  const { t } = useTranslation();
  
  return (
    <Menu theme="dark" mode="inline">
      {navigation.length > 0 &&
        navigation(t).map((nav: any) =>
          recursiveMenu(nav, currPath, onToggleVisible)
        )}
    </Menu>
  );
});
