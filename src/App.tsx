import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import "antd/dist/antd.css";
import CLayout from "./containers/CLayout";
import Login from "./pages/login/Login";
import Spinner from "./components/Spinner/Spinner";
import GuardedRoute from "./components/Guard/GuardedRoute";
import { AuthProvider } from "./context/auth";
import { Language } from "./enums/Language";
import frFR from "antd/lib/locale/fr_FR";
import enUS from "antd/lib/locale/en_US";
import { ConfigProvider } from "antd";
import { useTranslation } from "react-i18next";

function App() {
  const { i18n } = useTranslation();
  
  return (
    <ConfigProvider
      locale={i18n && i18n.language === Language.EN ? enUS : frFR}
      virtual={false}
    >
      <AuthProvider>
        <BrowserRouter>
          <React.Suspense fallback={<Spinner size="large" height="100vh" />}>
            <Switch>
              <Route path="/login" component={Login} />
              <GuardedRoute path="/">
                <CLayout />
              </GuardedRoute>
            </Switch>
          </React.Suspense>
        </BrowserRouter>
      </AuthProvider>
    </ConfigProvider>
  );
}

export default App;
