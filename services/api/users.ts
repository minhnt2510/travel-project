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
};

