// Notifications API methods
import { apiRequest } from "./client";
import { Notification } from "./types";

export const notificationsApi = {
  getNotifications: async (): Promise<Notification[]> => {
    return await apiRequest("/notifications");
  },

  markNotificationRead: async (id: string): Promise<Notification> => {
    return await apiRequest(`/notifications/${id}/read`, {
      method: "PUT",
    });
  },

  markAllNotificationsRead: async (): Promise<void> => {
    await apiRequest("/notifications/read-all", {
      method: "PUT",
    });
  },

  deleteNotification: async (id: string): Promise<void> => {
    await apiRequest(`/notifications/${id}`, {
      method: "DELETE",
    });
  },
};

