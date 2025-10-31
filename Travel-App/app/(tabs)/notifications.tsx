import { useState, useEffect } from "react";
import { ThemedText } from "@/ui-components/themed-text";
import { ThemedView } from "@/ui-components/themed-view";
import { IconSymbol } from "@/ui-components/ui/icon-symbol";
import {
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  View,
  RefreshControl,
} from "react-native";
import { api } from "@/services/api";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useUser } from "@/app/_layout";

interface Notification {
  _id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function NotificationsScreen() {
  const { user } = useUser();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user) {
      loadNotifications();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const data = await api.getNotifications();
      setNotifications(data || []);
    } catch (error) {
      console.error("Error loading notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadNotifications();
    setRefreshing(false);
  };

  const markAsRead = async (id: string) => {
    try {
      await api.markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await api.deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "booking":
        return "calendar";
      case "payment":
        return "credit-card";
      case "tour":
        return "map";
      default:
        return "bell";
    }
  };

  if (!user) {
    return (
      <ThemedView className="flex-1 justify-center items-center bg-gray-50 px-6">
        <IconSymbol name="bell" size={64} color="#9ca3af" />
        <ThemedText className="text-gray-600 text-lg font-semibold mt-4 text-center">
          Vui lòng đăng nhập để xem thông báo
        </ThemedText>
      </ThemedView>
    );
  }

  if (loading) {
    return (
      <ThemedView className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#667eea" />
        <ThemedText className="mt-4 text-gray-600">Đang tải...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView className="flex-1 bg-gray-50">
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        className="px-4 pt-16 pb-8 rounded-b-3xl"
      >
        <ThemedText className="text-white text-3xl font-extrabold mb-2">
          Thông báo 🔔
        </ThemedText>
        <ThemedText className="text-white/90 text-base font-medium">
          {notifications.length} thông báo
        </ThemedText>
      </LinearGradient>

      <ScrollView
        className="flex-1 px-4 pt-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {notifications.length === 0 ? (
          <View className="items-center justify-center py-20">
            <IconSymbol name="bell" size={64} color="#9ca3af" />
            <ThemedText className="text-gray-600 text-lg font-semibold mt-4">
              Chưa có thông báo nào
            </ThemedText>
            <ThemedText className="text-gray-500 text-sm mt-2">
              Các thông báo mới sẽ xuất hiện ở đây
            </ThemedText>
          </View>
        ) : (
          <View>
            {notifications.map((notification, idx) => (
              <Animated.View
                key={notification._id}
                entering={FadeInDown.delay(idx * 50).duration(500)}
              >
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => !notification.read && markAsRead(notification._id)}
                  className={`mb-3 bg-white rounded-2xl p-4 shadow-sm border-l-4 ${
                    notification.read
                      ? "border-gray-300 opacity-60"
                      : "border-purple-600"
                  }`}
                >
                  <View className="flex-row">
                    <View className={`w-12 h-12 rounded-full items-center justify-center mr-3 ${
                      notification.read ? "bg-gray-100" : "bg-purple-100"
                    }`}>
                      <IconSymbol
                        name={getIcon(notification.type)}
                        size={24}
                        color={notification.read ? "#9ca3af" : "#667eea"}
                      />
                    </View>
                    <View className="flex-1">
                      <ThemedText
                        className={`font-extrabold mb-1 ${
                          notification.read ? "text-gray-600" : "text-gray-900"
                        }`}
                      >
                        {notification.title}
                      </ThemedText>
                      <ThemedText className="text-gray-600 text-sm mb-2">
                        {notification.message}
                      </ThemedText>
                      <View className="flex-row items-center justify-between mt-2">
                        <ThemedText className="text-gray-400 text-xs">
                          {new Date(notification.createdAt).toLocaleDateString("vi-VN")}
                        </ThemedText>
                        {!notification.read && (
                          <View className="bg-purple-600 w-2 h-2 rounded-full" />
                        )}
                      </View>
                    </View>
                    <TouchableOpacity
                      onPress={() => deleteNotification(notification._id)}
                      className="ml-2"
                    >
                      <IconSymbol name="x" size={20} color="#9ca3af" />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        )}

        <View className="h-24" />
      </ScrollView>
    </ThemedView>
  );
}

