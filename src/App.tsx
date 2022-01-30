import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import "antd/dist/antd.css";
import CLayout from "./containers/CLayout";
import Login from "./pages/login/Login";
import Spinner from "./components/Spinner/Spinner";
import GuardedRoute from "./components/Guard/GuardedRoute";
import { AuthProvider } from "./context/auth";

function App() {

  return (
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
  );
}

export default App;
