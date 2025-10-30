import { View, ScrollView, TouchableOpacity } from "react-native";
import { ThemedView } from "@/ui-components/themed-view";
import { ThemedText } from "@/ui-components/themed-text";
import { IconSymbol } from "@/ui-components/ui/icon-symbol";
import { Image } from "expo-image";

interface Notification {
  id: string;
  type: "booking" | "promotion" | "system";
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const notifications: Notification[] = [
  {
    id: "1",
    type: "booking",
    title: "Đặt tour thành công",
    message: "Tour Đà Lạt 3N2Đ của bạn đã được xác nhận. Xem chi tiết ngay!",
    time: "2 giờ trước",
    read: false,
  },
  {
    id: "2",
    type: "promotion",
    title: "Ưu đãi mới",
    message: "Giảm 20% cho tour Phú Quốc trong tháng 10. Đặt ngay!",
    time: "1 ngày trước",
    read: true,
  },
  {
    id: "3",
    type: "system",
    title: "Cập nhật hệ thống",
    message: "Ứng dụng sẽ bảo trì từ 23:00 - 24:00 ngày 20/10/2025",
    time: "2 ngày trước",
    read: true,
  },
];

export default function Notifications() {
  return (
    <ThemedView className="flex-1">
      {/* Header */}
      <View className="p-4 border-b border-gray-200">
        <View className="flex-row items-center justify-between">
          <ThemedText className="text-xl font-bold">Thông báo</ThemedText>
          <TouchableOpacity>
            <ThemedText className="text-blue-600">
              Đánh dấu tất cả đã đọc
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1">
        {notifications.map((notification) => (
          <TouchableOpacity
            key={notification.id}
            className={`p-4 border-b border-gray-100 flex-row ${
              notification.read ? "bg-white" : "bg-blue-50"
            }`}
          >
            {/* Icon */}
            <View
              className={`w-10 h-10 rounded-full items-center justify-center ${
                notification.type === "booking"
                  ? "bg-green-100"
                  : notification.type === "promotion"
                  ? "bg-yellow-100"
                  : "bg-blue-100"
              }`}
            >
              <IconSymbol
                name={
                  notification.type === "booking"
                    ? "calendar"
                    : notification.type === "promotion"
                    ? "gift"
                    : "info"
                }
                size={20}
                color={
                  notification.type === "booking"
                    ? "#10B981"
                    : notification.type === "promotion"
                    ? "#F59E0B"
                    : "#3B82F6"
                }
              />
            </View>

            {/* Content */}
            <View className="flex-1 ml-3">
              <View className="flex-row justify-between">
                <ThemedText className="font-semibold">
                  {notification.title}
                </ThemedText>
                <ThemedText className="text-gray-500 text-sm">
                  {notification.time}
                </ThemedText>
              </View>
              <ThemedText className="text-gray-600 mt-1">
                {notification.message}
              </ThemedText>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </ThemedView>
  );
}
