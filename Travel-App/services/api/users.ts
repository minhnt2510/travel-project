// Users API methods
import { apiRequest } from "./client";
import { User } from "./types";

export const usersApi = {
  getCurrentUser: async (): Promise<User> => {
    return await apiRequest("/me");
  },

  updateUser: async (userData: Partial<User>): Promise<User> => {
    return await apiRequest("/me", {
      method: "PUT",
      body: JSON.stringify(userData),
    });
  },

  // Admin endpoints
  getAllUsers: async (): Promise<User[]> => {
    return await apiRequest("/admin/users");
  },

  getUserById: async (id: string): Promise<User> => {
    return await apiRequest(`/admin/users/${id}`);
  },

  deleteUser: async (id: string): Promise<{ message: string }> => {
    return await apiRequest(`/admin/users/${id}`, {
      method: "DELETE",
    });
  },

  updateUserRole: async (
    id: string,
    role: "user" | "admin"
  ): Promise<User> => {
    return await apiRequest(`/admin/users/${id}/role`, {
      method: "PUT",
      body: JSON.stringify({ role }),
    });
  },

  changePassword: async (data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<{ message: string }> => {
    return await apiRequest("/me/password", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
};

