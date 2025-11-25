import {
  View,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
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
    cancellationsToday: 0,
  });
  const [recentPending, setRecentPending] = useState<any[]>([]);
  const [recentCancellations, setRecentCancellations] = useState<any[]>([]);

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
      const pendingList = bookings.filter((b: any) => b.status === "pending");
      const pendingBookings = pendingList.length;

      // Assigned tasks (pending + in_progress bookings)
      const assignedTasks = bookings.filter(
        (b: any) => b.status === "pending" || b.status === "in_progress"
      ).length;

      // Cancellations today
      const cancellationsToday = bookings.filter((b: any) => {
        if (b.status !== "cancelled") return false;
        const d = new Date(b.updatedAt || b.createdAt);
        d.setHours(0, 0, 0, 0);
        return d.getTime() === today.getTime();
      });

      // Recent short lists for Workbox
      setRecentPending(pendingList.slice(0, 4));
      setRecentCancellations(cancellationsToday.slice(0, 4));

      setStats({
        totalRevenue: 0, // Not shown in staff dashboard
        newOrders: todayOrders.length,
        totalTours: 0, // Not shown in staff dashboard
        pendingBookings,
        confirmedBookings: assignedTasks,
        cancellationsToday: cancellationsToday.length,
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

  // Quick glance chips (horizontal) - operations only
  const glanceChips = [
    {
      label: "Hôm nay",
      value: stats.newOrders,
      icon: "calendar",
      bg: "bg-emerald-50",
      fg: "text-emerald-700",
      bd: "border-emerald-200",
    },
    {
      label: "Chờ xác nhận",
      value: stats.pendingBookings,
      icon: "clock",
      bg: "bg-amber-50",
      fg: "text-amber-700",
      bd: "border-amber-200",
    },
    {
      label: "Đang xử lý",
      value: stats.confirmedBookings,
      icon: "check-circle",
      bg: "bg-blue-50",
      fg: "text-blue-700",
      bd: "border-blue-200",
    },
    {
      label: "Đơn hủy",
      value: stats.cancellationsToday,
      icon: "x-circle",
      bg: "bg-rose-50",
      fg: "text-rose-700",
      bd: "border-rose-200",
    },
  ];

  // Staff Quick Actions: Operations only
  const quickActions = [
    {
      icon: "plus-circle",
      label: "Thêm Tour",
      route: "/screens/staff/CreateTour",
      color: ["#10b981", "#059669"],
    },
    {
      icon: "calendar-check",
      label: "Quản lý đơn hàng",
      route: "/screens/admin/ManageBookings",
      color: ["#3b82f6", "#2563eb"],
    },
    {
      icon: "map",
      label: "Quản lý Tours",
      route: "/screens/staff/ManageTours",
      color: ["#667eea", "#764ba2"],
    },
    {
      icon: "x-circle",
      label: "Xem hủy đơn",
      route: "/screens/staff/ViewCancellations",
      color: ["#ef4444", "#dc2626"],
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
      {/* Top bar - clean, no gradient, distinct from Admin */}
      <View className="px-4 pt-14 pb-4 border-b border-gray-200 bg-white">
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <View className="flex-row items-center">
              <IconSymbol name="briefcase" size={26} color="#065f46" />
              <ThemedText className="text-emerald-700 text-2xl font-extrabold ml-2">
                Vận hành hôm nay
              </ThemedText>
            </View>
            <ThemedText className="text-gray-600 text-sm mt-1">
              {new Date().toLocaleDateString("vi-VN")} • {user?.name}
            </ThemedText>
          </View>
          <TouchableOpacity
            onPress={handleLogout}
            activeOpacity={0.8}
            className="bg-emerald-50 rounded-full p-3 border border-emerald-200"
          >
            <IconSymbol name="log-out" size={20} color="#047857" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        className="flex-1 px-4 pt-6"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Horizontal glance chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-6"
        >
          <View className="flex-row">
            {glanceChips.map((c, i) => (
              <View
                key={i}
                className={`mr-3 px-4 py-3 rounded-2xl border ${c.bg} ${c.bd}`}
              >
                <View className="flex-row items-center">
                  <IconSymbol name={c.icon as any} size={18} color="#111827" />
                  <ThemedText className="ml-2 text-gray-700 font-semibold">
                    {c.label}
                  </ThemedText>
                </View>
                <ThemedText className={`mt-1 text-xl font-extrabold ${c.fg}`}>
                  {c.value}
                </ThemedText>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Workbox - Cần xử lý */}
        <View className="mb-6">
          <ThemedText className="text-xl font-extrabold text-gray-900 mb-3">
            Cần xử lý hôm nay 🧰
          </ThemedText>
          <View className="bg-white rounded-2xl border border-gray-100 shadow-sm">
            <View className="flex-row justify-between px-5 py-4 border-b border-gray-100">
              <TouchableOpacity
                onPress={() =>
                  router.push("/screens/admin/ManageBookings" as any)
                }
                className="flex-1 mr-2 bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3"
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <IconSymbol name="clock" size={18} color="#d97706" />
                    <ThemedText className="ml-2 text-yellow-800 font-extrabold">
                      Chờ xác nhận
                    </ThemedText>
                  </View>
                  <ThemedText className="text-yellow-900 font-extrabold">
                    {stats.pendingBookings}
                  </ThemedText>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  router.push("/screens/staff/ViewCancellations" as any)
                }
                className="flex-1 ml-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3"
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <IconSymbol name="x-circle" size={18} color="#dc2626" />
                    <ThemedText className="ml-2 text-red-800 font-extrabold">
                      Đơn hủy 
                    </ThemedText>
                  </View>
                  <ThemedText className="text-red-900 font-extrabold">
                    {stats.cancellationsToday}
                  </ThemedText>
                </View>
              </TouchableOpacity>
            </View>
            {/* Recent lists */}
            <View className="px-5 py-4">
              {recentPending.length > 0 && (
                <>
                  <ThemedText className="text-gray-900 font-extrabold mb-2">
                    Chờ xác nhận ({recentPending.length > 3 ? "mới nhất" : ""})
                  </ThemedText>
                  <View className="mb-3">
                    {recentPending.map((b: any, idx: number) => (
                      <View
                        key={b._id || idx}
                        className="flex-row items-center justify-between py-2"
                      >
                        <ThemedText
                          className="text-gray-700 flex-1 mr-3"
                          numberOfLines={1}
                        >
                          {b?.tourTitle || "Đơn hàng"} •{" "}
                          {b?.customerName || b?.user?.name || "Khách"}
                        </ThemedText>
                        <ThemedText className="text-gray-900 font-extrabold">
                          {(b?.totalPrice || 0).toLocaleString("vi-VN")}đ
                        </ThemedText>
                      </View>
                    ))}
                  </View>
                </>
              )}
              {recentCancellations.length > 0 && (
                <>
                  <ThemedText className="text-gray-900 font-extrabold mb-2">
                    Đơn hủy 
                  </ThemedText>
                  <View>
                    {recentCancellations.map((b: any, idx: number) => (
                      <View
                        key={b._id || idx}
                        className="flex-row items-center justify-between py-2"
                      >
                        <ThemedText
                          className="text-gray-700 flex-1 mr-3"
                          numberOfLines={1}
                        >
                          {b?.tourTitle || "Đơn hàng"} •{" "}
                          {b?.customerName || b?.user?.name || "Khách"}
                        </ThemedText>
                        <ThemedText className="text-red-600 font-extrabold">
                          {(b?.totalPrice || 0).toLocaleString("vi-VN")}đ
                        </ThemedText>
                      </View>
                    ))}
                  </View>
                </>
              )}
              {recentPending.length === 0 &&
                recentCancellations.length === 0 && (
                  <ThemedText className="text-gray-500">
                    Không có công việc cần xử lý ngay.
                  </ThemedText>
                )}
            </View>
          </View>
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
                <View className="p-5 items-center rounded-2xl border border-gray-200 bg-white">
                  <View className="bg-gray-100 w-14 h-14 rounded-xl items-center justify-center mb-3">
                    <IconSymbol name={action.icon} size={26} color="#111827" />
                  </View>
                  <ThemedText className="text-gray-900 font-extrabold text-center">
                    {action.label}
                  </ThemedText>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Shift Info */}
        <View className="bg-white rounded-2xl shadow-lg p-5 mb-4">
          <ThemedText className="text-xl font-extrabold text-gray-900 mb-4">
            Ca làm hôm nay ⏱️
          </ThemedText>
          <View className="flex-row items-center justify-between py-2 border-b border-gray-100">
            <ThemedText className="text-gray-600 font-medium">
              Nhân viên
            </ThemedText>
            <ThemedText className="text-gray-900 font-extrabold">
              {user?.name}
            </ThemedText>
          </View>
          <View className="flex-row items-center justify-between py-2 border-b border-gray-100">
            <ThemedText className="text-gray-600 font-medium">Email</ThemedText>
            <ThemedText className="text-gray-900 font-extrabold">
              {user?.email}
            </ThemedText>
          </View>
          <View className="flex-row items-center justify-between py-2">
            <ThemedText className="text-gray-600 font-medium">Ngày</ThemedText>
            <ThemedText className="text-gray-900 font-extrabold">
              {new Date().toLocaleDateString("vi-VN")}
            </ThemedText>
          </View>
        </View>

        {/* System Info */}
        <View className="bg-green-50 border-2 border-green-300 rounded-2xl p-5 mb-6">
          <ThemedText className="text-lg font-extrabold text-green-900 mb-2">
            💼 Nhiệm vụ Staff
          </ThemedText>
          <ThemedText className="text-green-800 text-sm leading-6">
            • Xử lý đơn hàng và xác nhận{"\n"}• Quản lý tours và cập nhật thông
            tin{"\n"}• Theo dõi đơn hủy và xử lý{"\n"}• Hỗ trợ khách hàng
          </ThemedText>
        </View>

        <View className="h-8" />
      </ScrollView>
    </ThemedView>
  );
}
