import React, { createContext, useContext, useState, useEffect } from "react";
import { authApi } from "../lib/api/auth";
import type { User } from "../lib/api/types";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem("travel_app_token");
        const userStr = localStorage.getItem("travel_app_user");

        if (token && userStr) {
          try {
            const user = JSON.parse(userStr);
            setUser(user);
            // Verify with API (non-blocking)
            authApi
              .getCurrentUser()
              .then((currentUser) => {
                setUser(currentUser);
                localStorage.setItem(
                  "travel_app_user",
                  JSON.stringify(currentUser)
                );
              })
              .catch(() => {
                // Token might be expired, but keep user from localStorage for now
              });
          } catch (error) {
            localStorage.removeItem("travel_app_token");
            localStorage.removeItem("travel_app_user");
          }
        }
      } catch (error) {
        console.error("Error loading user:", error);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authApi.login({ email, password });
    setUser(response.user);
    localStorage.setItem("travel_app_user", JSON.stringify(response.user));
  };

  const logout = () => {
    authApi.logout();
    localStorage.removeItem("travel_app_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
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
