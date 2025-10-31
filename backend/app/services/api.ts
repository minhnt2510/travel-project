import axios from "axios";
import * as SecureStore from "expo-secure-store";

const LAN_IP = "192.168.1.7";       
const PORT = 4000;                       
export const BASE_URL = `http://${LAN_IP}:${PORT}`;

const http = axios.create({ baseURL: BASE_URL });

function setAuth(token?: string) {
  if (token) http.defaults.headers.common.Authorization = `Bearer ${token}`;
  else delete http.defaults.headers.common.Authorization;
}

type User = { id: number; email: string; name: string };

export const api = {
  // đăng nhập
  async login(email: string, password: string): Promise<{ success: boolean; user?: User; message?: string }> {
    try {
      const { data } = await http.post("/auth/login", { email, password });
      const { accessToken, user } = data;
      await SecureStore.setItemAsync("accessToken", accessToken);
      await SecureStore.setItemAsync("user", JSON.stringify(user));
      setAuth(accessToken);
      return { success: true, user };
    } catch (e: any) {
      return { success: false, message: e?.response?.data?.message || "Đăng nhập thất bại" };
    }
  },

  // đăng ký
  async register(payload: { name: string; email: string; password: string }): 
    Promise<{ success: boolean; user?: User; message?: string }> {
    try {
      const { data } = await http.post("/auth/register", payload);
      return { success: true, user: data };
    } catch (e: any) {
      return { success: false, message: e?.response?.data?.message || "Đăng ký thất bại" };
    }
  },

  // lấy thông tin user hiện tại từ token
  async me(): Promise<User | undefined> {
    const token = await SecureStore.getItemAsync("accessToken");
    setAuth(token || undefined);
    if (!token) return;
    try {
      const { data } = await http.get("/me");
      await SecureStore.setItemAsync("user", JSON.stringify(data));
      return data;
    } catch {
      return;
    }
  },

  async logout() {
    await SecureStore.deleteItemAsync("accessToken");
    await SecureStore.deleteItemAsync("user");
    setAuth(undefined);
  },
};
