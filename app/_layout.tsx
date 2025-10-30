import React, { createContext, useContext, useState } from "react";
import { Slot } from "expo-router";

export type User = {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  avatar?: string;
  phone?: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  setUser: (u: User | null) => void;
  setToken: (t: string | null) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function useUser() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useUser: outside AuthProvider");
  return ctx;
}

export default function RootLayout() {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const login = (u: User, t: string) => {
    setUser(u);
    setToken(t);
    // TODO: persist token (AsyncStorage/SecureStore etc)
  };
  const logout = () => {
    setUser(null);
    setToken(null);
    // TODO: clear token from storage
  };
  return (
    <AuthContext.Provider
      value={{ user, token, setUser, setToken, login, logout }}
    >
      <Slot />
    </AuthContext.Provider>
  );
}
