import React, { createContext, useContext, useReducer, useEffect } from "react";
import {
  User,
  AuthState,
  LoginForm,
  SignupUserForm,
  SignupBusinessForm,
} from "@/lib/types";
import { authAPI } from "@/lib/api";

interface AuthContextType extends AuthState {
  login: (credentials: LoginForm) => Promise<void>;
  signupUser: (data: SignupUserForm) => Promise<void>;
  signupBusiness: (data: SignupBusinessForm) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction =
  | { type: "AUTH_START" }
  | { type: "AUTH_SUCCESS"; payload: User }
  | { type: "AUTH_FAILURE" }
  | { type: "LOGOUT" };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "AUTH_START":
      return { ...state, isLoading: true };
    case "AUTH_SUCCESS":
      return {
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
      };
    case "AUTH_FAILURE":
      return {
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case "LOGOUT":
      return {
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };
    default:
      return state;
  }
};

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = async (credentials: LoginForm) => {
    dispatch({ type: "AUTH_START" });
    try {
      const { user } = await authAPI.login(credentials);
      dispatch({ type: "AUTH_SUCCESS", payload: user });
    } catch (error) {
      dispatch({ type: "AUTH_FAILURE" });
      throw error;
    }
  };

  const signupUser = async (data: SignupUserForm) => {
    dispatch({ type: "AUTH_START" });
    try {
      const { user } = await authAPI.signupUser(data);
      dispatch({ type: "AUTH_SUCCESS", payload: user });
    } catch (error) {
      dispatch({ type: "AUTH_FAILURE" });
      throw error;
    }
  };

  const signupBusiness = async (data: SignupBusinessForm) => {
    dispatch({ type: "AUTH_START" });
    try {
      const { user } = await authAPI.signupBusiness(data);
      dispatch({ type: "AUTH_SUCCESS", payload: user });
    } catch (error) {
      dispatch({ type: "AUTH_FAILURE" });
      throw error;
    }
  };

  const logout = () => {
    authAPI.logout();
    dispatch({ type: "LOGOUT" });
  };

  const checkAuth = async () => {
    dispatch({ type: "AUTH_START" });
    try {
      const user = await authAPI.getCurrentUser();
      if (user) {
        dispatch({ type: "AUTH_SUCCESS", payload: user });
      } else {
        dispatch({ type: "AUTH_FAILURE" });
      }
    } catch {
      dispatch({ type: "AUTH_FAILURE" });
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        signupUser,
        signupBusiness,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
