import { useState } from "react";
import { Alert } from "react-native";
import { api, type User } from "@/services/api";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const result = await api.login(email, password);
      if (result.success && result.user) {
        setUser(result.user);
        return true;
      } else {
        Alert.alert("Lỗi", result.message || "Đăng nhập thất bại");
        return false;
      }
    } catch (error) {
      Alert.alert("Lỗi", "Có lỗi xảy ra khi đăng nhập");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await api.logout();
    setUser(null);
  };

  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      const result = await api.register({ name, email, password });
      if (result.success && result.user) {
        setUser(result.user);
        return true;
      } else {
        Alert.alert("Lỗi", result.message || "Đăng ký thất bại");
        return false;
      }
    } catch (error) {
      Alert.alert("Lỗi", "Có lỗi xảy ra khi đăng ký");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, login, logout, register, setUser };
}

