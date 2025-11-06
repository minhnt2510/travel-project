// Chat API methods
import { apiRequest } from "./client";

export const chatApi = {
  sendMessage: async (message: string): Promise<{ response: string }> => {
    return await apiRequest("/chat", {
      method: "POST",
      body: JSON.stringify({ message }),
    });
  },
};

