import {
  View,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
} from "react-native";
import { ThemedView } from "@/ui-components/themed-view";
import { ThemedText } from "@/ui-components/themed-text";
import { IconSymbol } from "@/ui-components/ui/icon-symbol";
import { useUser } from "../_layout";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useState, useEffect } from "react";
import { api } from "@/services/api";
import { ActivityIndicator } from "react-native";
import { BlurView } from "expo-blur";

const { width } = Dimensions.get("window");

interface StatCard {
  title: string;
  value: string;
  change: string;
  icon: string;
  color: string[];
  bgColor: string;
}

export default function AdminDashboard() {
  const { user, logout } = useUser();

  // Only admin can access this screen
  if (user?.role !== "admin") {
    return (
      <ThemedView className="flex-1 justify-center items-center bg-gradient-to-br from-gray-50 to-gray-100 px-6">
        <View className="bg-white rounded-3xl p-8 shadow-2xl items-center">
          <View className="bg-red-100 rounded-full p-6 mb-4">
            <IconSymbol name="lock" size={64} color="#ef4444" />
          </View>
          <ThemedText className="text-gray-900 text-2xl font-bold mb-2 text-center">
            Truy cập bị từ chối
          </ThemedText>
          <ThemedText className="text-gray-600 text-base text-center mb-6">
            Chỉ Admin mới có quyền truy cập trang này
          </ThemedText>
          <TouchableOpacity
            onPress={() => {
              if (user?.role === "staff") {
                router.replace("/screens/StaffDashboard" as any);
              } else {
                router.replace("/(tabs)" as any);
              }
            }}
            className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-4 rounded-2xl shadow-lg"
          >
            <ThemedText className="text-white font-bold text-base">
              Quay lại
            </ThemedText>
          </TouchableOpacity>
        </View>
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
      const [bookings, toursData] = await Promise.all([
        api.getAllBookings().catch(() => []),
        api.getTours({ limit: 1000 }).catch(() => ({ tours: [], total: 0 })),
      ]);

      const totalRevenue = bookings.reduce((sum: number, b: any) => {
        const price =
          typeof b.totalPrice === "number"
            ? b.totalPrice
            : parseFloat(String(b.totalPrice || 0).replace(/[^\d.]/g, ""));
        return sum + price;
      }, 0);

      const pendingBookings = bookings.filter(
        (b: any) => b.status === "pending"
      ).length;
      const confirmedBookings = bookings.filter(
        (b: any) => b.status === "confirmed"
      ).length;

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

  // Modern stat cards with new design
  const statCards: StatCard[] = [
    {
      title: "Doanh thu",
      value: `${(stats.totalRevenue / 1000000).toFixed(1)}M`,
      change: "+12.3%",
      icon: "dollar-sign",
      color: ["#667eea", "#764ba2"],
      bgColor: "#EEF2FF",
    },
    {
      title: "Đơn hàng",
      value: `${stats.newOrders}`,
      change: "+8.1%",
      icon: "shopping-bag",
      color: ["#f093fb", "#f5576c"],
      bgColor: "#FEF2F2",
    },
    {
      title: "Tours",
      value: `${stats.totalTours}`,
      change: "+5.4%",
      icon: "map-pin",
      color: ["#4facfe", "#00f2fe"],
      bgColor: "#F0FDFA",
    },
    {
      title: "Chờ duyệt",
      value: `${stats.pendingBookings}`,
      change: "pending",
      icon: "clock",
      color: ["#fa709a", "#fee140"],
      bgColor: "#FFFBEB",
    },
  ];

  // Enhanced quick actions
  const quickActions = [
    {
      icon: "users",
      label: "Quản lý Users",
      route: "/screens/admin/ManageUsers",
      gradient: ["#667eea", "#764ba2"],
      description: "Quản lý người dùng",
    },
    {
      icon: "user-check",
      label: "Quản lý Staff",
      route: "/screens/admin/ManageStaff",
      gradient: ["#f093fb", "#f5576c"],
      description: "Quản lý nhân viên",
    },
    {
      icon: "check-circle",
      label: "Duyệt Tours",
      route: "/screens/admin/ApproveTours",
      gradient: ["#4facfe", "#00f2fe"],
      description: "Phê duyệt tours",
    },
    {
      icon: "settings",
      label: "Cài đặt",
      route: "/screens/admin/SystemSettings",
      gradient: ["#43e97b", "#38f9d7"],
      description: "Cấu hình hệ thống",
    },
    {
      icon: "bar-chart",
      label: "Phân tích",
      route: "/screens/admin/Analytics",
      gradient: ["#fa709a", "#fee140"],
      description: "Thống kê dữ liệu",
    },
    {
      icon: "bell",
      label: "Thông báo",
      route: "/screens/admin/Notifications",
      gradient: ["#30cfd0", "#330867"],
      description: "Quản lý thông báo",
    },
  ];

  if (loading && !refreshing) {
    return (
      <ThemedView className="flex-1 justify-center items-center bg-gray-50">
        <LinearGradient
          colors={["#667eea", "#764ba2"]}
          className="w-20 h-20 rounded-3xl items-center justify-center mb-4"
          style={{ transform: [{ rotate: "45deg" }] }}
        >
          <ActivityIndicator size="large" color="#FFF" />
        </LinearGradient>
        <ThemedText className="mt-4 text-gray-700 font-semibold">
          Đang tải dữ liệu...
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView className="flex-1 bg-gray-50">
      {/* Modern Header with Glassmorphism Effect */}
      <LinearGradient
        colors={["#667eea", "#764ba2", "#f093fb"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="pt-16 pb-32"
      >
        <View className="px-6">
          <View className="flex-row items-center justify-between mb-8">
            <View className="flex-1">
              <View className="flex-row items-center mb-2">
                <View className="bg-white/20 rounded-2xl p-3 mr-3">
                  <IconSymbol name="shield" size={28} color="#FFF" />
                </View>
                <View>
                  <ThemedText className="text-white text-2xl font-bold">
                    Admin Panel
                  </ThemedText>
                  <ThemedText className="text-white/80 text-sm">
                    Xin chào, {user?.name || "Admin"}
                  </ThemedText>
                </View>
              </View>
            </View>

            <TouchableOpacity
              onPress={handleLogout}
              activeOpacity={0.8}
              className="bg-white/20 backdrop-blur-xl rounded-2xl p-3"
            >
              <IconSymbol name="log-out" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>

          {/* Quick Stats Preview */}
          <View className="flex-row justify-between">
            <View className="bg-white/10 backdrop-blur-xl rounded-2xl px-4 py-3 flex-1 mr-2">
              <ThemedText className="text-white/70 text-xs mb-1">
                Confirmed
              </ThemedText>
              <ThemedText className="text-white text-xl font-bold">
                {stats.confirmedBookings}
              </ThemedText>
            </View>
            <View className="bg-white/10 backdrop-blur-xl rounded-2xl px-4 py-3 flex-1 ml-2">
              <ThemedText className="text-white/70 text-xs mb-1">
                Pending
              </ThemedText>
              <ThemedText className="text-white text-xl font-bold">
                {stats.pendingBookings}
              </ThemedText>
            </View>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        className="flex-1 -mt-24"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#667eea"
          />
        }
      >
        <View className="px-6">
          {/* Stats Cards - Modern Card Design */}
          <View className="mb-6">
            {statCards.map((stat, index) => (
              <View
                key={index}
                className="bg-white rounded-3xl p-5 mb-4 shadow-lg"
                style={{
                  shadowColor: stat.color[0],
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.15,
                  shadowRadius: 12,
                  elevation: 5,
                }}
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <View className="flex-row items-center mb-2">
                      <LinearGradient
                        colors={stat.color as [string, string]}
                        className="w-12 h-12 rounded-2xl items-center justify-center mr-3"
                      >
                        <IconSymbol name={stat.icon} size={24} color="#FFF" />
                      </LinearGradient>
                      <View>
                        <ThemedText className="text-gray-500 text-sm font-medium">
                          {stat.title}
                        </ThemedText>
                        <ThemedText className="text-gray-900 text-3xl font-bold">
                          {stat.value}
                        </ThemedText>
                      </View>
                    </View>
                  </View>

                  {stat.change !== "pending" && (
                    <View className="bg-green-50 px-3 py-2 rounded-xl">
                      <View className="flex-row items-center">
                        <IconSymbol
                          name="trending-up"
                          size={14}
                          color="#10b981"
                        />
                        <ThemedText className="text-green-600 text-sm font-bold ml-1">
                          {stat.change}
                        </ThemedText>
                      </View>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </View>

          {/* Quick Actions - Grid Layout */}
          <View className="mb-6">
            <View className="flex-row items-center justify-between mb-4">
              <ThemedText className="text-gray-900 text-xl font-bold">
                Thao tác nhanh
              </ThemedText>
              <TouchableOpacity>
                <ThemedText className="text-blue-600 text-sm font-semibold">
                  Xem tất cả →
                </ThemedText>
              </TouchableOpacity>
            </View>

            <View className="flex-row flex-wrap justify-between">
              {quickActions.map((action, idx) => (
                <TouchableOpacity
                  key={idx}
                  activeOpacity={0.85}
                  onPress={() => {
                    if (action.route) {
                      router.push(action.route as any);
                    }
                  }}
                  className="w-[48%] bg-white rounded-3xl p-5 mb-4 shadow-md"
                  style={{
                    shadowColor: action.gradient[0],
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 8,
                    elevation: 3,
                  }}
                >
                  <LinearGradient
                    colors={action.gradient as [string, string]}
                    className="w-14 h-14 rounded-2xl items-center justify-center mb-3"
                  >
                    <IconSymbol name={action.icon} size={26} color="#FFF" />
                  </LinearGradient>
                  <ThemedText className="text-gray-900 font-bold text-base mb-1">
                    {action.label}
                  </ThemedText>
                  <ThemedText className="text-gray-500 text-xs">
                    {action.description}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* User Profile Card */}
          <View className="bg-white rounded-3xl p-6 mb-6 shadow-lg">
            <View className="flex-row items-center mb-5">
              <LinearGradient
                colors={["#667eea", "#764ba2"]}
                className="w-16 h-16 rounded-2xl items-center justify-center mr-4"
              >
                <ThemedText className="text-white text-2xl font-bold">
                  {user?.name?.charAt(0).toUpperCase() || "A"}
                </ThemedText>
              </LinearGradient>
              <View className="flex-1">
                <ThemedText className="text-gray-900 text-xl font-bold mb-1">
                  {user?.name}
                </ThemedText>
                <View className="flex-row items-center">
                  <View className="bg-purple-100 px-3 py-1 rounded-full mr-2">
                    <ThemedText className="text-purple-700 font-bold text-xs">
                      {user?.role?.toUpperCase() || "ADMIN"}
                    </ThemedText>
                  </View>
                  <View className="bg-green-100 px-3 py-1 rounded-full">
                    <View className="flex-row items-center">
                      <View className="w-2 h-2 rounded-full bg-green-500 mr-1" />
                      <ThemedText className="text-green-700 font-bold text-xs">
                        Online
                      </ThemedText>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            <View className="border-t border-gray-100 pt-4">
              <View className="flex-row items-center mb-3">
                <View className="bg-gray-100 w-10 h-10 rounded-xl items-center justify-center mr-3">
                  <IconSymbol name="mail" size={20} color="#6b7280" />
                </View>
                <View className="flex-1">
                  <ThemedText className="text-gray-500 text-xs mb-1">
                    Email
                  </ThemedText>
                  <ThemedText className="text-gray-900 font-semibold">
                    {user?.email}
                  </ThemedText>
                </View>
              </View>
            </View>
          </View>

          {/* Admin Privileges Card */}
          <View className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-3xl p-6 mb-6">
            <View className="flex-row items-center mb-4">
              <View className="bg-purple-100 w-12 h-12 rounded-2xl items-center justify-center mr-3">
                <IconSymbol name="shield" size={24} color="#9333ea" />
              </View>
              <ThemedText className="text-gray-900 text-lg font-bold flex-1">
                Quyền hạn Admin
              </ThemedText>
            </View>

            <View className="space-y-2">
              {[
                "Quản lý users và staff",
                "Cấu hình hệ thống",
                "Xem phân tích và thống kê",
                "Quản trị toàn bộ nền tảng",
              ].map((privilege, idx) => (
                <View key={idx} className="flex-row items-center mb-2">
                  <View className="bg-purple-100 w-6 h-6 rounded-lg items-center justify-center mr-3">
                    <IconSymbol name="check" size={14} color="#9333ea" />
                  </View>
                  <ThemedText className="text-gray-700 text-sm">
                    {privilege}
                  </ThemedText>
                </View>
              ))}
            </View>
          </View>

          <View className="h-8" />
        </View>
      </ScrollView>
    </ThemedView>
  );
}
