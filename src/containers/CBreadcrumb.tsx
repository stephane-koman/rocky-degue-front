import React from "react";
import { Link, useLocation, matchPath } from "react-router-dom";
import { Breadcrumb } from "antd";

interface IProps {
  routes: Array<any>;
}

const CBreadcrumbRouteItem = ({ name, currPath }, fullCurrPath: any) => {
  if (currPath === fullCurrPath) {
    return <Breadcrumb.Item key={currPath}>{name}</Breadcrumb.Item>;
  } else {
    return (
      <Breadcrumb.Item key={currPath}>
        <Link to={currPath}>{name}</Link>
      </Breadcrumb.Item>
    );
  }
};

const getPaths = (pathname: string) => {
  const paths = ["/"];
  if (pathname === "/") return paths;
  pathname.split("/").reduce((prev, curr) => {
    const currPath = `${prev}/${curr}`;
    paths.push(currPath);
    return currPath;
  });
  return paths;
};

const CBreadcrumb = (props: IProps) => {
  const { routes } = props;

  let items = null;
  const currPath = useLocation().pathname;

  if (routes) {
    const paths = getPaths(currPath);
    const currRoutes = paths
      .map((currPath) => {
        const route = routes.find((route) =>
          matchPath(currPath, {
            path: route.path,
            exact: route.exact,
          })
        );
        return { ...route, currPath };
      })
      .filter((route) => route && route.name);

    items = currRoutes.map((route) => {
      return CBreadcrumbRouteItem(route, currPath);
    });
  }

  //render
  return (
    <Breadcrumb
      style={{
        margin: "16px",
      }}
    >
      {items}
    </Breadcrumb>
  );
};

export default CBreadcrumb;
