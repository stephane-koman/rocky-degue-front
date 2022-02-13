import { useReducer, createContext } from "react";
import { JWT_TOKEN, USER_INFOS } from "../utils/helpers/constantHelpers";

const initialState = {
  user: null,
};

type ContextProps = {
  user: any;
  login: (userData: any) => void;
  logout: () => void;
  setUser: (userData: any) => void;
};

const AuthContext = createContext<ContextProps>({
  user: null,
  login: (_) => {},
  logout: () => {},
  setUser: (_) => {},
});

const authReducer = (state: any, action: any) => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state
      };

    case "USER":
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
    localStorage.setItem(JWT_TOKEN, JSON.stringify(userData.token));
    dispatch({
      type: "LOGIN",
      payload: userData,
    });
  }

  function logout() {
    localStorage.clear();
    dispatch({
      type: "LOGOUT",
    });
  }

  function setUser(userData: any) {
    localStorage.setItem(USER_INFOS, JSON.stringify(userData));
    dispatch({
      type: "USER",
      payload: userData,
    });
  }

  return (
    <AuthContext.Provider value={{ user: state.user, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
