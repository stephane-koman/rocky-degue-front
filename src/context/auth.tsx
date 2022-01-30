import { useReducer, createContext } from "react";
import { JWT_TOKEN } from "../utils/constantHelpers";

const initialState = {
  user: null,
};

type ContextProps = {
  user: any;
  login: (userData: any) => void;
  logout: () => void;
};

const AuthContext = createContext<ContextProps>({
  user: null,
  login: (_) => {},
  logout: () => {},
});

const authReducer = (state: any, action: any) => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        user: action.payload,
      };

    case "LOGOUT":
      return {
        ...state,
        user: null,
      };
    default:
      return state;
  }
};

const AuthProvider = ({children}: any) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  function login(userData: any) {
    localStorage.setItem(JWT_TOKEN, userData.token);
    dispatch({
      type: "LOGIN",
      payload: userData,
    });
  }

  function logout() {
    localStorage.removeItem(JWT_TOKEN);
    dispatch({
      type: "LOGOUT",
    });
  }

  return (
    <AuthContext.Provider value={{ user: state.user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
