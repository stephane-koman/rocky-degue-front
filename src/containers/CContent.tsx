import React, { Suspense } from "react";
import { Redirect, Switch, Route } from "react-router-dom";
import { Content } from "antd/lib/layout/layout";

import routes from "../routes";
import Spinner from "../components/Spinner/Spinner";
import { useTranslation } from "react-i18next";

const CContent = () => {
  const { t } = useTranslation();
  return (
    <Content style={{ margin: "0 16px 16px 16px", overflowY: "auto" }}>
      <div
        className="site-layout-background"
        style={{
          overflowY: "auto",
          padding: "16px",
          background: "#FFF",
          height: "100%",
        }}
      >
        <Suspense fallback={<Spinner size="large" height="60vh" />}>
          <Switch>
            {routes(t).map((route, idx) => {
              return (
                route.component && (
                  <Route
                    key={idx}
                    path={route.path}
                    exact={route.exact}
                    name={route.name}
                    render={(props: any) => <route.component {...props} />}
                  />
                )
              );
            })}
            <Redirect from="/" to="/dashboard" />
          </Switch>
        </Suspense>
      </div>
    </Content>
  );
};

export default CContent;
