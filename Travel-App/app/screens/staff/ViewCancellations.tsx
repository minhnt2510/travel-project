import { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { ThemedView } from "@/ui-components/themed-view";
import { ThemedText } from "@/ui-components/themed-text";
import { IconSymbol } from "@/ui-components/ui/icon-symbol";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { api } from "@/services/api";
import RoleGuard from "@/app/components/common/RoleGuard";

interface Booking {
  _id: string;
  tourId: any;
  userId: any;
  quantity: number;
  totalPrice: number;
  status: "pending" | "confirmed" | "cancelled" | "completed" | "in_progress";
  travelDate: string;
  createdAt: string;
}

export default function ViewCancellationsScreen() {
  return (
    <RoleGuard allowedRoles={["staff", "admin"]}>
      <ViewCancellationsContent />
    </RoleGuard>
  );
}

function ViewCancellationsContent() {
  const [cancellations, setCancellations] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadCancellations();
  }, []);

  const loadCancellations = async () => {
    try {
      setLoading(true);
      const bookings = await api.getAllBookings().catch(() => []);
      const cancelled = bookings.filter((b: Booking) => b.status === "cancelled");
      setCancellations(cancelled);
    } catch (error) {
      console.error("Error loading cancellations:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCancellations();
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (loading && !refreshing) {
    return (
      <ThemedView className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#10b981" />
        <ThemedText className="mt-4 text-gray-600">Đang tải...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView className="flex-1 bg-gray-50">
      {/* Header */}
      <LinearGradient
        colors={["#10b981", "#059669"]}
        className="px-4 pt-16 pb-8 rounded-b-3xl shadow-xl"
      >
        <View className="flex-row items-center justify-between mb-4">
          <TouchableOpacity onPress={() => router.back()}>
            <IconSymbol name="arrow-left" size={24} color="#FFF" />
          </TouchableOpacity>
          <ThemedText className="text-white text-2xl font-extrabold flex-1 ml-4">
            Đơn đã hủy
          </ThemedText>
        </View>
      </LinearGradient>

      <ScrollView
        className="flex-1 px-4 pt-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {cancellations.length === 0 ? (
          <View className="items-center justify-center py-20">
            <IconSymbol name="check-circle" size={64} color="#10b981" />
            <ThemedText className="text-gray-600 text-lg font-semibold mt-4">
              Không có đơn hủy nào
            </ThemedText>
          </View>
        ) : (
          cancellations.map((booking) => (
            <View
              key={booking._id}
              className="bg-white rounded-2xl p-4 mb-3 shadow-sm border border-gray-100"
            >
              <View className="flex-row items-center justify-between mb-2">
                <ThemedText className="text-gray-900 font-extrabold text-lg">
                  Đơn #{booking._id.slice(-6)}
                </ThemedText>
                <View className="bg-red-100 px-3 py-1 rounded-full">
                  <ThemedText className="text-red-700 font-bold text-xs">
                    ĐÃ HỦY
                  </ThemedText>
                </View>
              </View>
              <View className="flex-row items-center justify-between mt-2">
                <View>
                  <ThemedText className="text-gray-600 text-sm">
                    Số lượng: {booking.quantity}
                  </ThemedText>
                  <ThemedText className="text-gray-600 text-sm">
                    Ngày đi: {formatDate(booking.travelDate)}
                  </ThemedText>
                  <ThemedText className="text-gray-600 text-sm">
                    Hủy lúc: {formatDate(booking.createdAt)}
                  </ThemedText>
                </View>
                <ThemedText className="text-gray-900 font-extrabold text-lg">
                  {booking.totalPrice.toLocaleString("vi-VN")}đ
                </ThemedText>
              </View>
            </View>
          ))
        )}
        <View className="h-8" />
      </ScrollView>
    </ThemedView>
  );
}

