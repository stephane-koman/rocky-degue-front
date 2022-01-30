import { Menu } from "antd";
import { Link } from "react-router-dom";
import memoize from "memoize-one";

import navigation from "./_nav";
import { useTranslation } from "react-i18next";

const { SubMenu } = Menu;

export const getMenu = memoize((currPath: any, onToggleVisible?: any) => {
  const { t } = useTranslation();
  return (
    <Menu theme="dark" mode="inline">
      {navigation.length > 0 &&
        navigation(t).map((nav: any) => {
          if (nav?._children) {
            return (
              <SubMenu key={nav?.name} icon={nav?.icon} title={nav?.name}>
                {nav?._children?.map((navChild: any) => (
                  <Menu.Item
                    key={navChild?.name}
                    icon={navChild?.icon}
                    className={
                      currPath === navChild?.to ? "ant-menu-item-selected" : ""
                    }
                    onClick={onToggleVisible}
                  >
                    <Link to={navChild?.to}>{navChild?.name}</Link>
                  </Menu.Item>
                ))}
              </SubMenu>
            );
          } else {
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
          }
        })}
    </Menu>
  );
});
