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

export default function AnalyticsScreen() {
  return (
    <RoleGuard allowedRoles={["admin"]}>
      <AnalyticsContent />
    </RoleGuard>
  );
}

function AnalyticsContent() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [analytics, setAnalytics] = useState({
    totalUsers: 0,
    totalBookings: 0,
    totalRevenue: 0,
    averageBookingValue: 0,
    bookingsByMonth: [] as any[],
    topTours: [] as any[],
  });

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const [bookings, tours] = await Promise.all([
        api.getAllBookings().catch(() => []),
        api.getTours({ limit: 1000 }).catch(() => ({ tours: [] })),
      ]);

      const totalRevenue = bookings.reduce((sum: number, b: any) => {
        return sum + (b.totalPrice || 0);
      }, 0);

      const averageBookingValue = bookings.length > 0 
        ? totalRevenue / bookings.length 
        : 0;

      // Group bookings by month (simplified)
      const bookingsByMonth = Array.from({ length: 12 }, (_, i) => ({
        month: i + 1,
        count: bookings.filter((b: any) => {
          const date = new Date(b.createdAt);
          return date.getMonth() === i;
        }).length,
      }));

      setAnalytics({
        totalUsers: 0, // Would need users API
        totalBookings: bookings.length,
        totalRevenue,
        averageBookingValue,
        bookingsByMonth,
        topTours: tours.tours?.slice(0, 5) || [],
      });
    } catch (error) {
      console.error("Error loading analytics:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAnalytics();
  };

  if (loading && !refreshing) {
    return (
      <ThemedView className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#8b5cf6" />
        <ThemedText className="mt-4 text-gray-600">Đang tải phân tích...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView className="flex-1 bg-gray-50">
      {/* Header */}
      <LinearGradient
        colors={["#8b5cf6", "#7c3aed"]}
        className="px-4 pt-16 pb-8 rounded-b-3xl shadow-xl"
      >
        <View className="flex-row items-center justify-between mb-4">
          <TouchableOpacity onPress={() => router.back()}>
            <IconSymbol name="arrow-left" size={24} color="#FFF" />
          </TouchableOpacity>
          <ThemedText className="text-white text-2xl font-extrabold flex-1 ml-4">
            Phân tích & Báo cáo
          </ThemedText>
        </View>
      </LinearGradient>

      <ScrollView
        className="flex-1 px-4 pt-6"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Key Metrics */}
        <View className="flex-row flex-wrap justify-between mb-6">
          <View className="w-[48%] bg-white rounded-2xl p-4 mb-4 shadow-sm">
            <ThemedText className="text-gray-600 text-sm mb-1">Tổng đơn hàng</ThemedText>
            <ThemedText className="text-gray-900 text-2xl font-extrabold">
              {analytics.totalBookings}
            </ThemedText>
          </View>
          <View className="w-[48%] bg-white rounded-2xl p-4 mb-4 shadow-sm">
            <ThemedText className="text-gray-600 text-sm mb-1">Tổng doanh thu</ThemedText>
            <ThemedText className="text-gray-900 text-2xl font-extrabold">
              {(analytics.totalRevenue / 1000000).toFixed(1)}M
            </ThemedText>
          </View>
          <View className="w-[48%] bg-white rounded-2xl p-4 mb-4 shadow-sm">
            <ThemedText className="text-gray-600 text-sm mb-1">Giá trị TB/đơn</ThemedText>
            <ThemedText className="text-gray-900 text-2xl font-extrabold">
              {(analytics.averageBookingValue / 1000).toFixed(0)}k
            </ThemedText>
          </View>
          <View className="w-[48%] bg-white rounded-2xl p-4 mb-4 shadow-sm">
            <ThemedText className="text-gray-600 text-sm mb-1">Tổng tours</ThemedText>
            <ThemedText className="text-gray-900 text-2xl font-extrabold">
              {analytics.topTours.length}
            </ThemedText>
          </View>
        </View>

        {/* Monthly Breakdown */}
        <View className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
          <ThemedText className="text-xl font-extrabold text-gray-900 mb-4">
            Đơn hàng theo tháng
          </ThemedText>
          {analytics.bookingsByMonth.map((item, idx) => (
            <View key={idx} className="flex-row items-center justify-between py-2 border-b border-gray-100">
              <ThemedText className="text-gray-600">Tháng {item.month}</ThemedText>
              <ThemedText className="text-gray-900 font-extrabold">{item.count} đơn</ThemedText>
            </View>
          ))}
        </View>

        {/* Top Tours */}
        <View className="bg-white rounded-2xl p-5 mb-6 shadow-sm">
          <ThemedText className="text-xl font-extrabold text-gray-900 mb-4">
            Top Tours
          </ThemedText>
          {analytics.topTours.length === 0 ? (
            <ThemedText className="text-gray-600 text-center py-4">
              Chưa có dữ liệu
            </ThemedText>
          ) : (
            analytics.topTours.map((tour: any, idx: number) => (
              <View key={tour._id} className="flex-row items-center justify-between py-2 border-b border-gray-100">
                <View className="flex-1">
                  <ThemedText className="text-gray-900 font-semibold" numberOfLines={1}>
                    {idx + 1}. {tour.title}
                  </ThemedText>
                  <ThemedText className="text-gray-600 text-sm">
                    {tour.location}
                  </ThemedText>
                </View>
                <ThemedText className="text-purple-600 font-extrabold ml-2">
                  {tour.price.toLocaleString("vi-VN")}đ
                </ThemedText>
              </View>
            ))
          )}
        </View>

        <View className="h-8" />
      </ScrollView>
    </ThemedView>
  );
}

