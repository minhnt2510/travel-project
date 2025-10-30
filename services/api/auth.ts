// Auth API methods
import { apiRequest } from "./client";
import { saveToken } from "./client";
import { User } from "./types";

export const authApi = {
  login: async (
    email: string,
    password: string
  ): Promise<{
    success: boolean;
    user?: User;
    accessToken?: string;
    message?: string;
  }> => {
    try {
      const data = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (data.accessToken) {
        await saveToken(data.accessToken);
      }

      return {
        success: true,
        user: data.user,
        accessToken: data.accessToken,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Đăng nhập thất bại",
      };
    }
  },

  register: async (userData: {
    name: string;
    email: string;
    password: string;
  }): Promise<{ success: boolean; user?: User; message?: string }> => {
    try {
      const data = await apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify(userData),
      });

      return { success: true, user: data };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Đăng ký thất bại",
      };
    }
  },
};

