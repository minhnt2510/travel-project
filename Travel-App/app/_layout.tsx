import React, { createContext, useContext, useState, useEffect } from "react";
import { Slot } from "expo-router";
import { connectSocket, disconnectSocket } from "@/services/socket";

export type User = {
  _id: string;
  name: string;
  email: string;
  role: "client" | "staff" | "admin";
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

  const login = async (u: User, t: string) => {
    setUser(u);
    setToken(t);
    // Connect Socket.IO after login
    await connectSocket();
  };
  const logout = () => {
    setUser(null);
    setToken(null);
    // Disconnect Socket.IO on logout
    disconnectSocket();
  };

  // Connect socket when user exists (on app start if already logged in)
  useEffect(() => {
    if (user && token) {
      connectSocket();
    } else {
      disconnectSocket();
    }
  }, [user, token]);
  return (
    <AuthContext.Provider
      value={{ user, token, setUser, setToken, login, logout }}
    >
      <Slot />
    </AuthContext.Provider>
  );
}
