import React, { createContext, useContext, useReducer, useEffect } from "react";
import {
  User,
  AuthContextType,
  UserSignupData,
  BusinessSignupData,
} from "../types";
import {
  mockUsers,
  mockBusinesses,
  addUser,
  addBusiness,
} from "../data/mockData";
import { toast } from "sonner";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

type AuthAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "LOGIN_SUCCESS"; payload: User }
  | { type: "LOGOUT" }
  | { type: "UPDATE_USER"; payload: User };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "LOGIN_SUCCESS":
      return {
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
      };
    case "LOGOUT":
      return {
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case "UPDATE_USER":
      return {
        ...state,
        user: action.payload,
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

  // Check for existing session on mount
  useEffect(() => {
    const checkExistingSession = () => {
      dispatch({ type: "SET_LOADING", payload: true });

      const storedUser = localStorage.getItem("skiply_user");
      const storedToken = localStorage.getItem("skiply_token");

      if (storedUser && storedToken) {
        try {
          const user = JSON.parse(storedUser);
          dispatch({ type: "LOGIN_SUCCESS", payload: user });
        } catch (error) {
          console.error("Error parsing stored user:", error);
          localStorage.removeItem("skiply_user");
          localStorage.removeItem("skiply_token");
        }
      }

      dispatch({ type: "SET_LOADING", payload: false });
    };

    checkExistingSession();
  }, []);

  const login = async (
    email: string,
    password: string,
    role: "user" | "business",
  ): Promise<void> => {
    dispatch({ type: "SET_LOADING", payload: true });

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Demo credentials check
      let user: User | undefined;

      if (role === "user") {
        user = mockUsers.find((u) => u.email === email && u.role === "user");
      } else if (role === "business") {
        user = mockUsers.find(
          (u) => u.email === email && u.role === "business",
        );
      }

      // Special admin check
      if (email === "admin@skiply.com" && password === "admin123") {
        user = mockUsers.find((u) => u.role === "admin");
      }

      // Demo password validation (in real app, this would be handled by backend)
      const validPasswords = ["password123", "admin123"];
      if (!user || !validPasswords.includes(password)) {
        throw new Error("Invalid email or password");
      }

      // Store session
      const token = `token_${user.id}_${Date.now()}`;
      localStorage.setItem("skiply_user", JSON.stringify(user));
      localStorage.setItem("skiply_token", token);

      dispatch({ type: "LOGIN_SUCCESS", payload: user });
      toast.success(`Welcome back, ${user.name}!`);
    } catch (error) {
      dispatch({ type: "SET_LOADING", payload: false });
      const message = error instanceof Error ? error.message : "Login failed";
      toast.error(message);
      throw error;
    }
  };

  const signupUser = async (data: UserSignupData): Promise<void> => {
    dispatch({ type: "SET_LOADING", payload: true });

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Check if email already exists
      const existingUser = mockUsers.find((u) => u.email === data.email);
      if (existingUser) {
        throw new Error("Email already registered");
      }

      if (data.password !== data.confirmPassword) {
        throw new Error("Passwords do not match");
      }

      // Create new user
      const newUser: User = {
        id: `user-${Date.now()}`,
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: "user",
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.name}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Add to mock data
      addUser(newUser);

      // Store session
      const token = `token_${newUser.id}_${Date.now()}`;
      localStorage.setItem("skiply_user", JSON.stringify(newUser));
      localStorage.setItem("skiply_token", token);

      dispatch({ type: "LOGIN_SUCCESS", payload: newUser });
      toast.success("Account created successfully!");
    } catch (error) {
      dispatch({ type: "SET_LOADING", payload: false });
      const message = error instanceof Error ? error.message : "Signup failed";
      toast.error(message);
      throw error;
    }
  };

  const signupBusiness = async (data: BusinessSignupData): Promise<void> => {
    dispatch({ type: "SET_LOADING", payload: true });

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Check if email already exists
      const existingUser = mockUsers.find((u) => u.email === data.email);
      if (existingUser) {
        throw new Error("Email already registered");
      }

      if (data.password !== data.confirmPassword) {
        throw new Error("Passwords do not match");
      }

      // Create new business owner
      const newOwnerId = `business-${Date.now()}`;
      const newOwner: User = {
        id: newOwnerId,
        name: data.ownerName,
        email: data.email,
        role: "business",
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.ownerName}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Create new business
      const newBusinessId = `business-${Date.now()}`;
      const newBusiness = {
        id: newBusinessId,
        name: data.businessName,
        ownerId: newOwnerId,
        category: data.category,
        address: data.address,
        description: data.description,
        rating: 0,
        totalReviews: 0,
        openingHours: data.openingHours,
        departments: data.departments.map((name, index) => ({
          id: `dept-${Date.now()}-${index}`,
          name,
          estimatedWaitTime: 30,
          maxQueueSize: 15,
          currentQueueSize: 0,
          isActive: true,
        })),
        isAcceptingBookings: true,
        location: { lat: 40.7128, lng: -74.006 }, // Default to NYC
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Add to mock data
      addUser(newOwner);
      addBusiness(newBusiness);

      // Store session
      const token = `token_${newOwner.id}_${Date.now()}`;
      localStorage.setItem("skiply_user", JSON.stringify(newOwner));
      localStorage.setItem("skiply_token", token);

      dispatch({ type: "LOGIN_SUCCESS", payload: newOwner });
      toast.success("Business registered successfully!");
    } catch (error) {
      dispatch({ type: "SET_LOADING", payload: false });
      const message =
        error instanceof Error ? error.message : "Business registration failed";
      toast.error(message);
      throw error;
    }
  };

  const logout = (): void => {
    localStorage.removeItem("skiply_user");
    localStorage.removeItem("skiply_token");
    dispatch({ type: "LOGOUT" });
    toast.success("Logged out successfully");
  };

  const updateProfile = async (data: Partial<User>): Promise<void> => {
    if (!state.user) return;

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      const updatedUser = {
        ...state.user,
        ...data,
        updatedAt: new Date().toISOString(),
      };

      // Update in mock data
      const userIndex = mockUsers.findIndex((u) => u.id === state.user!.id);
      if (userIndex !== -1) {
        mockUsers[userIndex] = updatedUser;
      }

      // Update local storage
      localStorage.setItem("skiply_user", JSON.stringify(updatedUser));

      dispatch({ type: "UPDATE_USER", payload: updatedUser });
      toast.success("Profile updated successfully");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Profile update failed";
      toast.error(message);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        isLoading: state.isLoading,
        login,
        signupUser,
        signupBusiness,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
