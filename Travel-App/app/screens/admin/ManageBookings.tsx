import { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from "react-native";
import { ThemedView } from "@/ui-components/themed-view";
import { ThemedText } from "@/ui-components/themed-text";
import { IconSymbol } from "@/ui-components/ui/icon-symbol";
import { router } from "expo-router";
import { Image } from "expo-image";
import { api } from "@/services/api";
import { useColorScheme } from "react-native";
import { useUser } from "@/app/_layout";

// Helper function to format date
const formatDate = (dateString: string): string => {
  if (!dateString) return "";
  const dateOnly = dateString.split("T")[0];
  const [year, month, day] = dateOnly.split("-");
  return `${day}/${month}/${year}`;
};

interface Booking {
  _id: string;
  tourId: any;
  userId: any;
  quantity: number;
  totalPrice: number;
  status: "pending" | "confirmed" | "cancelled" | "completed" | "in_progress";
  paymentStatus: "pending" | "paid" | "refunded";
  travelDate: string;
  travelers: Array<{ name: string; age: number; idCard?: string }>;
  contactInfo: { phone: string; email: string };
  specialRequests?: string;
  createdAt: string;
}

export default function ManageBookings() {
  const { user } = useUser();
  
  // Only staff or admin can access
  if (user?.role !== "staff" && user?.role !== "admin") {
    return (
      <ThemedView className="flex-1 justify-center items-center bg-gray-50 px-6">
        <IconSymbol name="lock" size={64} color="#9ca3af" />
        <ThemedText className="text-gray-600 text-lg font-semibold mt-4 text-center">
          Chỉ Staff hoặc Admin mới có quyền truy cập trang này
        </ThemedText>
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-6 bg-blue-600 px-6 py-3 rounded-full"
        >
          <ThemedText className="text-white font-semibold">Quay lại</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }
  
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<"all" | "pending" | "confirmed" | "in_progress" | "completed">("all");
  const isDark = useColorScheme() === "dark";

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      // Admin should see all bookings
      const data = await api.getAllBookings();
      setBookings(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.error("Error loading bookings:", error);
      // If admin endpoint fails, try regular endpoint as fallback
      try {
        const fallbackData = await api.getBookings();
        setBookings(Array.isArray(fallbackData) ? fallbackData : []);
      } catch (fallbackError) {
        Alert.alert("Lỗi", "Không thể tải danh sách đơn hàng. Vui lòng đăng nhập lại với tài khoản admin.");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadBookings();
  };

  const handleUpdateStatus = async (bookingId: string, newStatus: string) => {
    try {
      await api.updateBookingStatus?.(bookingId, newStatus);
      Alert.alert("Thành công", `Đã cập nhật trạng thái thành "${getStatusText(newStatus)}"`);
      await loadBookings();
    } catch (error: any) {
      console.error("Error updating status:", error);
      Alert.alert("Lỗi", error.message || "Không thể cập nhật trạng thái");
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Chờ xác nhận";
      case "confirmed":
        return "Đã xác nhận";
      case "in_progress":
        return "Đang phục vụ";
      case "completed":
        return "Hoàn thành";
      case "cancelled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "#f59e0b";
      case "confirmed":
        return "#3b82f6";
      case "in_progress":
        return "#8b5cf6";
      case "completed":
        return "#10b981";
      case "cancelled":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (filter === "all") return true;
    return b.status === filter;
  });

  if (loading && !refreshing) {
    return (
      <ThemedView className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#667eea" />
        <ThemedText className="mt-4 text-gray-600">Đang tải...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView className={`flex-1 ${isDark ? "bg-slate-900" : "bg-gray-50"}`}>
      {/* Header */}
      <View className={`px-4 pt-16 pb-6 ${isDark ? "bg-slate-800" : "bg-white"} border-b ${isDark ? "border-slate-700" : "border-gray-200"}`}>
        <View className="flex-row items-center justify-between mb-4">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <IconSymbol name="arrow-left" size={24} color={isDark ? "#fff" : "#000"} />
          </TouchableOpacity>
          <ThemedText className={`flex-1 text-2xl font-extrabold ${isDark ? "text-white" : "text-gray-900"}`}>
            Quản lý đơn hàng
          </ThemedText>
        </View>

        {/* Filter Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-4">
          {[
            { key: "all", label: "Tất cả" },
            { key: "pending", label: "Chờ xác nhận" },
            { key: "confirmed", label: "Đã xác nhận" },
            { key: "in_progress", label: "Đang phục vụ" },
            { key: "completed", label: "Hoàn thành" },
          ].map((tab) => (
            <TouchableOpacity
              key={tab.key}
              onPress={() => setFilter(tab.key as any)}
              className={`px-4 py-2 rounded-full mr-2 ${
                filter === tab.key
                  ? "bg-blue-600"
                  : isDark
                  ? "bg-slate-700"
                  : "bg-gray-200"
              }`}
            >
              <ThemedText
                className={`font-semibold ${
                  filter === tab.key ? "text-white" : isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {tab.label}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Bookings List */}
      <ScrollView
        className="flex-1 px-4 pt-4"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {filteredBookings.length === 0 ? (
          <View className="flex-1 justify-center items-center py-20">
            <IconSymbol name="calendar" size={64} color={isDark ? "#64748b" : "#9ca3af"} />
            <ThemedText className={`mt-4 text-lg ${isDark ? "text-gray-300" : "text-gray-600"}`}>
              Không có đơn hàng nào
            </ThemedText>
          </View>
        ) : (
          filteredBookings.map((booking) => {
            const tour = booking.tourId && typeof booking.tourId === "object" ? booking.tourId : null;
            const user = booking.userId && typeof booking.userId === "object" ? booking.userId : null;

            return (
              <View
                key={booking._id}
                className={`mb-4 rounded-2xl shadow-lg overflow-hidden ${
                  isDark ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"
                } border`}
              >
                {/* Booking Header */}
                <View className={`p-4 ${isDark ? "bg-slate-700" : "bg-gray-50"}`}>
                  <View className="flex-row items-center justify-between mb-2">
                    <View className="flex-1">
                      <ThemedText className={`text-lg font-extrabold ${isDark ? "text-white" : "text-gray-900"}`}>
                        {tour?.title || "Tour"}
                      </ThemedText>
                      <ThemedText className={`text-sm mt-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                        Khách hàng:{" "}
                        {booking.contactInfo?.fullName ||
                          user?.name ||
                          booking.contactInfo?.email ||
                          "N/A"}
                      </ThemedText>
                    </View>
                    <View
                      className="px-3 py-1.5 rounded-full"
                      style={{ backgroundColor: getStatusColor(booking.status) + "20" }}
                    >
                      <ThemedText
                        className="text-xs font-bold"
                        style={{ color: getStatusColor(booking.status) }}
                      >
                        {getStatusText(booking.status)}
                      </ThemedText>
                    </View>
                  </View>

                  <View className="flex-row items-center justify-between mt-2">
                    <View className="flex-row items-center">
                      <IconSymbol name="calendar" size={16} color={isDark ? "#94a3b8" : "#6b7280"} />
                      <ThemedText className={`ml-2 text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                        {formatDate(booking.travelDate)}
                      </ThemedText>
                    </View>
                    <ThemedText className={`text-base font-bold ${isDark ? "text-blue-400" : "text-blue-600"}`}>
                      {booking.totalPrice.toLocaleString("vi-VN")}₫
                    </ThemedText>
                  </View>
                </View>

                {/* Booking Details */}
                <View className="p-4">
                  <View className="flex-row items-center justify-between mb-3">
                    <ThemedText className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                      Số lượng: {booking.quantity} người
                    </ThemedText>
                    <ThemedText className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                      {formatDate(booking.createdAt)}
                    </ThemedText>
                  </View>

                  {booking.contactInfo && (
                    <View className="mb-3">
                      <ThemedText className={`text-sm font-semibold mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                        Liên hệ:
                      </ThemedText>
                      {booking.contactInfo.fullName && (
                        <ThemedText className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                          👤 {booking.contactInfo.fullName}
                        </ThemedText>
                      )}
                      <ThemedText className={`text-sm mt-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                        📧 {booking.contactInfo.email}
                      </ThemedText>
                      <ThemedText className={`text-sm mt-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                        📞 {booking.contactInfo.phone}
                      </ThemedText>
                    </View>
                  )}

                  {/* Action Buttons */}
                  <View className="flex-row gap-2 mt-4">
                    {booking.status === "pending" && (
                      <>
                        <TouchableOpacity
                          onPress={() => handleUpdateStatus(booking._id, "confirmed")}
                          className="flex-1 bg-blue-600 py-3 rounded-xl items-center"
                        >
                          <ThemedText className="text-white font-bold">Xác nhận</ThemedText>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => handleUpdateStatus(booking._id, "cancelled")}
                          className="flex-1 bg-red-600 py-3 rounded-xl items-center"
                        >
                          <ThemedText className="text-white font-bold">Từ chối</ThemedText>
                        </TouchableOpacity>
                      </>
                    )}
                    {booking.status === "confirmed" && (
                      <TouchableOpacity
                        onPress={() => handleUpdateStatus(booking._id, "in_progress")}
                        className="flex-1 bg-purple-600 py-3 rounded-xl items-center"
                      >
                        <ThemedText className="text-white font-bold">Bắt đầu phục vụ</ThemedText>
                      </TouchableOpacity>
                    )}
                    {booking.status === "in_progress" && (
                      <TouchableOpacity
                        onPress={() => handleUpdateStatus(booking._id, "completed")}
                        className="flex-1 bg-green-600 py-3 rounded-xl items-center"
                      >
                        <ThemedText className="text-white font-bold">Hoàn thành</ThemedText>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </ThemedView>
  );
}

