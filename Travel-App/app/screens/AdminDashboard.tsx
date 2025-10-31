import { View, ScrollView, TouchableOpacity, RefreshControl } from "react-native";
import { ThemedView } from "@/ui-components/themed-view";
import { ThemedText } from "@/ui-components/themed-text";
import { IconSymbol } from "@/ui-components/ui/icon-symbol";
import { useUser } from "../_layout";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useState, useEffect } from "react";
import { api } from "@/services/api";
import { ActivityIndicator } from "react-native";

interface StatCard {
  title: string;
  value: string;
  change: string;
  icon: string;
  color: string[];
}

export default function AdminDashboard() {
  const { user, logout } = useUser();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    newOrders: 0,
    totalTours: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      // Fetch real data từ API
      const [bookings, toursData] = await Promise.all([
        api.getBookings().catch(() => []),
        api.getTours({ limit: 1000 }).catch(() => ({ tours: [], total: 0 })),
      ]);

      const totalRevenue = bookings.reduce((sum: number, b: any) => {
        const price = typeof b.totalPrice === "number" ? b.totalPrice : parseFloat(String(b.totalPrice || 0).replace(/[^\d.]/g, ""));
        return sum + price;
      }, 0);

      // Count pending bookings
      const pendingBookings = bookings.filter((b: any) => b.status === "pending").length;
      const confirmedBookings = bookings.filter((b: any) => b.status === "confirmed").length;

      setStats({
        totalRevenue,
        newOrders: bookings.length,
        totalTours: toursData.tours?.length || 0,
        pendingBookings,
        confirmedBookings,
      });
    } catch (error) {
      console.error("Error loading stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadStats();
    setRefreshing(false);
  };

  const handleLogout = () => {
    logout();
    router.replace("/(auth)/login");
  };

  const statCards: StatCard[] = [
    {
      title: "Tổng doanh thu",
      value: `${(stats.totalRevenue / 1000000).toFixed(1)}M`,
      change: "+12.3%",
      icon: "trending-up",
      color: ["#3b82f6", "#2563eb"],
    },
    {
      title: "Đơn hàng",
      value: `${stats.newOrders}`,
      change: "+8.1%",
      icon: "shopping-bag",
      color: ["#10b981", "#059669"],
    },
    {
      title: "Tổng tour",
      value: `${stats.totalTours}`,
      change: "+5.4%",
      icon: "map",
      color: ["#8b5cf6", "#7c3aed"],
    },
    {
      title: "Chờ xác nhận",
      value: `${stats.pendingBookings}`,
      change: `${stats.confirmedBookings} đã xác nhận`,
      icon: "clock",
      color: ["#f59e0b", "#d97706"],
    },
  ];

  const quickActions = [
    { 
      icon: "users", 
      label: "Quản lý Users", 
      route: "/screens/admin/ManageUsers", 
      color: ["#10b981", "#059669"] 
    },
    { 
      icon: "map", 
      label: "Quản lý Tours", 
      route: "/screens/tours/AllTours", 
      color: ["#667eea", "#764ba2"] 
    },
    { 
      icon: "calendar", 
      label: "Quản lý đơn hàng", 
      route: "/screens/admin/ManageBookings", 
      color: ["#3b82f6", "#2563eb"] 
    },
    { 
      icon: "bar-chart", 
      label: "Thống kê", 
      route: "/screens/admin/Statistics", 
      color: ["#f59e0b", "#d97706"] 
    },
  ];

  if (loading && !refreshing) {
    return (
      <ThemedView className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#667eea" />
        <ThemedText className="mt-4 text-gray-600">Đang tải...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView className="flex-1 bg-gray-50">
      {/* Header with gradient */}
      <LinearGradient
        colors={["#667eea", "#764ba2"]}
        className="px-4 pt-16 pb-8 rounded-b-3xl shadow-xl"
      >
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-1">
            <ThemedText className="text-white text-3xl font-extrabold mb-1">
              Dashboard Admin 👨‍💼
            </ThemedText>
            <ThemedText className="text-white/90 text-base font-medium">
              Chào mừng, {user?.name || "Admin"}
            </ThemedText>
          </View>
          <TouchableOpacity
            onPress={handleLogout}
            activeOpacity={0.8}
            className="bg-white/20 backdrop-blur-md rounded-full p-3 border border-white/30"
          >
            <IconSymbol name="log-out" size={22} color="#FFF" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView
        className="flex-1 px-4 pt-6"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Stats Grid */}
        <View className="flex-row flex-wrap justify-between mb-6">
          {statCards.map((stat, index) => (
            <View
              key={index}
              className="w-[48%] mb-4 overflow-hidden rounded-2xl shadow-lg"
            >
              <LinearGradient colors={stat.color as [string, string, ...string[]]} className="p-5">
                <View className="flex-row items-center justify-between mb-3">
                  <View className="bg-white/20 backdrop-blur-md w-12 h-12 rounded-xl items-center justify-center">
                    <IconSymbol name={stat.icon} size={24} color="#FFF" />
                  </View>
                  <ThemedText className="text-white/80 text-xs font-bold bg-white/20 px-3 py-1 rounded-full">
                    {stat.change}
                  </ThemedText>
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

        {/* Quick Actions */}
        <View className="mb-6">
          <ThemedText className="text-xl font-extrabold text-gray-900 mb-4">
            Thao tác nhanh ⚡
          </ThemedText>
          <View className="flex-row flex-wrap justify-between">
            {quickActions.map((action, idx) => (
              <TouchableOpacity
                key={idx}
                activeOpacity={0.9}
                onPress={() => {
                  if (action.route) {
                    router.push(action.route as any);
                  }
                }}
                className="w-[48%] mb-4 overflow-hidden rounded-2xl shadow-lg"
              >
                <LinearGradient colors={action.color as [string, string, ...string[]]} className="p-5 items-center">
                  <View className="bg-white/20 backdrop-blur-md w-14 h-14 rounded-xl items-center justify-center mb-3">
                    <IconSymbol name={action.icon} size={28} color="#FFF" />
                  </View>
                  <ThemedText className="text-white font-extrabold text-center">
                    {action.label}
                  </ThemedText>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* User Info */}
        <View className="bg-white rounded-2xl shadow-lg p-5 mb-4">
          <ThemedText className="text-xl font-extrabold text-gray-900 mb-4">
            Thông tin tài khoản 👤
          </ThemedText>
          <View>
            <View className="flex-row items-center justify-between py-2 border-b border-gray-100">
              <ThemedText className="text-gray-600 font-medium">Email</ThemedText>
              <ThemedText className="text-gray-900 font-extrabold">{user?.email}</ThemedText>
            </View>
            <View className="flex-row items-center justify-between py-2 border-b border-gray-100">
              <ThemedText className="text-gray-600 font-medium">Vai trò</ThemedText>
              <View className="bg-purple-100 px-3 py-1 rounded-full">
                <ThemedText className="text-purple-700 font-extrabold text-xs">
                  {user?.role?.toUpperCase() || "ADMIN"}
                </ThemedText>
              </View>
            </View>
            <View className="flex-row items-center justify-between py-2">
              <ThemedText className="text-gray-600 font-medium">Tên</ThemedText>
              <ThemedText className="text-gray-900 font-extrabold">{user?.name}</ThemedText>
            </View>
          </View>
        </View>

        {/* System Info */}
        <View className="bg-purple-50 border border-purple-200 rounded-2xl p-5 mb-6">
          <ThemedText className="text-lg font-extrabold text-gray-900 mb-2">
            📝 Ghi chú Admin
          </ThemedText>
          <ThemedText className="text-gray-700 text-sm leading-6">
            • Quản lý tours, bookings và users{"\n"}
            • Xem thống kê và báo cáo{"\n"}
            • Xử lý đơn hàng và phản hồi{"\n"}
            • Cài đặt hệ thống
          </ThemedText>
        </View>

        <View className="h-8" />
      </ScrollView>
    </ThemedView>
  );
}
