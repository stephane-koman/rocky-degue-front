import React from "react";
import { Route, Redirect } from "react-router-dom";
import { getIsLoggedIn } from "../../utils/authHelpers";

const GuardedRoute = ({ children, ...rest }) => {
  const auth = getIsLoggedIn();

  return (
    <Route
      {...rest}
      render={({ location }) =>
        auth ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
};

export default GuardedRoute;
