import { useState, useEffect } from "react";
import {
  ScrollView,
  TouchableOpacity,
  View,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { ThemedText } from "@/ui-components/themed-text";
import { ThemedView } from "@/ui-components/themed-view";
import { IconSymbol } from "@/ui-components/ui/icon-symbol";
import { LinearGradient } from "expo-linear-gradient";
import { api } from "@/services/api";
import { useUser } from "@/app/_layout";

import RoleGuard from "@/app/components/common/RoleGuard";

export default function StatisticsScreen() {
  return (
    <RoleGuard allowedRoles={["admin"]}>
      <StatisticsContent />
    </RoleGuard>
  );
}

function StatisticsContent() {
  const { user } = useUser();
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalBookings: 0,
    totalTours: 0,
    totalUsers: 0,
    averageBookingValue: 0,
    bookingsByStatus: {
      pending: 0,
      confirmed: 0,
      cancelled: 0,
      completed: 0,
    },
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const [bookings, tours] = await Promise.all([
        api.getBookings().catch(() => []),
        api.getTours({ limit: 1000 }).catch(() => ({ tours: [], total: 0 })),
      ]);

      const totalRevenue = bookings.reduce(
        (sum: number, b: any) => sum + (b.totalPrice || 0),
        0
      );
      const averageBookingValue =
        bookings.length > 0 ? totalRevenue / bookings.length : 0;

      const bookingsByStatus = {
        pending: bookings.filter((b: any) => b.status === "pending").length,
        confirmed: bookings.filter((b: any) => b.status === "confirmed").length,
        cancelled: bookings.filter((b: any) => b.status === "cancelled")
          .length,
        completed: bookings.filter((b: any) => b.status === "completed")
          .length,
      };

      setStats({
        totalRevenue,
        totalBookings: bookings.length,
        totalTours: tours.tours?.length || 0,
        totalUsers: 0, // Need API endpoint
        averageBookingValue,
        bookingsByStatus,
      });
    } catch (error) {
      console.error("Error loading stats:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadStats();
  };

  const statCards = [
    {
      title: "Tổng doanh thu",
      value: `${(stats.totalRevenue / 1000000).toFixed(1)}M VNĐ`,
      icon: "dollar-sign",
      color: ["#10b981", "#059669"],
    },
    {
      title: "Tổng đơn hàng",
      value: `${stats.totalBookings}`,
      icon: "shopping-bag",
      color: ["#3b82f6", "#2563eb"],
    },
    {
      title: "Tổng tours",
      value: `${stats.totalTours}`,
      icon: "map",
      color: ["#8b5cf6", "#7c3aed"],
    },
    {
      title: "Giá trị TB/đơn",
      value: `${(stats.averageBookingValue / 1000).toFixed(0)}k VNĐ`,
      icon: "trending-up",
      color: ["#f59e0b", "#d97706"],
    },
  ];

  return (
    <ThemedView className="flex-1 bg-gray-50">
      {/* Header */}
      <LinearGradient
        colors={["#f59e0b", "#d97706"]}
        className="px-4 pt-16 pb-8 rounded-b-3xl shadow-xl"
      >
        <View className="flex-row items-center justify-between mb-4">
          <TouchableOpacity onPress={() => router.back()}>
            <IconSymbol name="arrow-left" size={24} color="#FFF" />
          </TouchableOpacity>
          <ThemedText className="text-white text-2xl font-extrabold flex-1 ml-4">
            Thống kê 📊
          </ThemedText>
        </View>
      </LinearGradient>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#f59e0b" />
          <ThemedText className="mt-4 text-gray-600">Đang tải...</ThemedText>
        </View>
      ) : (
        <ScrollView
          className="flex-1 px-4 pt-6"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* Stats Grid */}
          <View className="flex-row flex-wrap justify-between mb-6">
            {statCards.map((stat, idx) => (
              <View
                key={idx}
                className="w-[48%] mb-4 overflow-hidden rounded-2xl shadow-lg"
              >
                <LinearGradient colors={stat.color as [string, string, ...string[]]} className="p-5">
                  <View className="bg-white/20 backdrop-blur-md w-12 h-12 rounded-xl items-center justify-center mb-3">
                    <IconSymbol name={stat.icon} size={24} color="#FFF" />
                  </View>
                  <ThemedText className="text-white/90 text-sm font-medium mb-1">
                    {stat.title}
                  </ThemedText>
                  <ThemedText className="text-white text-2xl font-extrabold">
                    {stat.value}
                  </ThemedText>
                </LinearGradient>
              </View>
            ))}
          </View>

          {/* Bookings by Status */}
          <View className="bg-white rounded-2xl p-5 mb-6 shadow-sm">
            <ThemedText className="text-xl font-extrabold text-gray-900 mb-4">
              Đơn hàng theo trạng thái
            </ThemedText>
            <View className="space-y-3">
              {Object.entries(stats.bookingsByStatus).map(([status, count]) => {
                const statusConfig: Record<string, { label: string; color: string[] }> = {
                  pending: { label: "Đang chờ", color: ["#fbbf24", "#f59e0b"] },
                  confirmed: { label: "Đã xác nhận", color: ["#10b981", "#059669"] },
                  cancelled: { label: "Đã hủy", color: ["#ef4444", "#dc2626"] },
                  completed: { label: "Hoàn thành", color: ["#3b82f6", "#2563eb"] },
                };
                const config = statusConfig[status] || { label: status, color: ["#6b7280", "#4b5563"] };
                return (
                  <View key={status} className="overflow-hidden rounded-xl">
                    <LinearGradient colors={config.color as [string, string, ...string[]]} className="p-4 flex-row items-center justify-between">
                      <ThemedText className="text-white font-extrabold">
                        {config.label}
                      </ThemedText>
                      <ThemedText className="text-white text-xl font-extrabold">
                        {count}
                      </ThemedText>
                    </LinearGradient>
                  </View>
                );
              })}
            </View>
          </View>

          <View className="h-8" />
        </ScrollView>
      )}
    </ThemedView>
  );
}

