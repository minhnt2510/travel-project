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

export default function StaffDashboard() {
  const { user, logout } = useUser();
  
  // Only staff or admin can access this screen
  if (user?.role !== "staff" && user?.role !== "admin") {
    return (
      <ThemedView className="flex-1 justify-center items-center bg-gray-50 px-6">
        <IconSymbol name="lock" size={64} color="#9ca3af" />
        <ThemedText className="text-gray-600 text-lg font-semibold mt-4 text-center">
          Chỉ Staff hoặc Admin mới có quyền truy cập trang này
        </ThemedText>
        <TouchableOpacity
          onPress={() => router.replace("/(tabs)" as any)}
          className="mt-6 bg-blue-600 px-6 py-3 rounded-full"
        >
          <ThemedText className="text-white font-semibold">Quay lại</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }
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
      // Fetch real data từ API - Operations focus
      const bookings = await api.getAllBookings().catch(() => []);
      
      // Today's date
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Today's orders
      const todayOrders = bookings.filter((b: any) => {
        const bookingDate = new Date(b.createdAt);
        bookingDate.setHours(0, 0, 0, 0);
        return bookingDate.getTime() === today.getTime();
      });

      // Pending confirmations
      const pendingBookings = bookings.filter((b: any) => b.status === "pending").length;
      
      // Assigned tasks (pending + in_progress bookings)
      const assignedTasks = bookings.filter((b: any) => 
        b.status === "pending" || b.status === "in_progress"
      ).length;

      setStats({
        totalRevenue: 0, // Not shown in staff dashboard
        newOrders: todayOrders.length,
        totalTours: 0, // Not shown in staff dashboard
        pendingBookings,
        confirmedBookings: assignedTasks,
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

  // Staff KPIs: Operations metrics only
  const statCards: StatCard[] = [
    {
      title: "Đơn hàng hôm nay",
      value: `${stats.newOrders}`,
      change: "Hôm nay",
      icon: "calendar",
      color: ["#10b981", "#059669"], // Green theme for staff
    },
    {
      title: "Chờ xác nhận",
      value: `${stats.pendingBookings}`,
      change: "Cần xử lý",
      icon: "clock",
      color: ["#3b82f6", "#2563eb"], // Blue
    },
    {
      title: "Nhiệm vụ được giao",
      value: `${stats.confirmedBookings}`,
      change: "Đang xử lý",
      icon: "check-circle",
      color: ["#f59e0b", "#d97706"], // Orange
    },
  ];

  // Staff Quick Actions: Operations only
  const quickActions = [
    { 
      icon: "plus-circle", 
      label: "Thêm Tour", 
      route: "/screens/staff/CreateTour", 
      color: ["#10b981", "#059669"] 
    },
    { 
      icon: "calendar-check", 
      label: "Quản lý đơn hàng", 
      route: "/screens/admin/ManageBookings", 
      color: ["#3b82f6", "#2563eb"] 
    },
    { 
      icon: "map", 
      label: "Quản lý Tours", 
      route: "/screens/tours/AllTours", 
      color: ["#667eea", "#764ba2"] 
    },
    { 
      icon: "x-circle", 
      label: "Xem hủy đơn", 
      route: "/screens/staff/ViewCancellations", 
      color: ["#ef4444", "#dc2626"] 
    },
  ];

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
      {/* Header with gradient - Green theme for Staff */}
      <LinearGradient
        colors={["#10b981", "#059669", "#047857"]}
        className="px-4 pt-16 pb-8 rounded-b-3xl shadow-xl"
      >
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-1">
            <View className="flex-row items-center mb-1">
              <IconSymbol name="briefcase" size={32} color="#FFF" />
              <ThemedText className="text-white text-3xl font-extrabold ml-2">
                Dashboard Staff
              </ThemedText>
            </View>
            <ThemedText className="text-white/90 text-base font-medium">
              Quản lý vận hành • Chào mừng, {user?.name || "Staff"}
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
              <View className="bg-green-100 px-3 py-1 rounded-full border border-green-300">
                <ThemedText className="text-green-700 font-extrabold text-xs">
                  💼 STAFF
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
        <View className="bg-green-50 border-2 border-green-300 rounded-2xl p-5 mb-6">
          <ThemedText className="text-lg font-extrabold text-green-900 mb-2">
            💼 Nhiệm vụ Staff
          </ThemedText>
          <ThemedText className="text-green-800 text-sm leading-6">
            • Xử lý đơn hàng và xác nhận{"\n"}
            • Quản lý tours và cập nhật thông tin{"\n"}
            • Theo dõi đơn hủy và xử lý{"\n"}
            • Hỗ trợ khách hàng
          </ThemedText>
        </View>

        <View className="h-8" />
      </ScrollView>
    </ThemedView>
  );
}

