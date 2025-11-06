import { useState, useEffect } from "react";
import {
  ScrollView,
  TouchableOpacity,
  View,
  RefreshControl,
  Alert,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { router } from "expo-router";
import { ThemedText } from "@/ui-components/themed-text";
import { ThemedView } from "@/ui-components/themed-view";
import { IconSymbol } from "@/ui-components/ui/icon-symbol";
import { LinearGradient } from "expo-linear-gradient";
import { api } from "@/services/api";
import { usersApi } from "@/services/api/users";
import { useUser } from "@/app/_layout";

interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: "client" | "staff" | "admin";
  createdAt: string;
}

export default function ManageStaffScreen() {
  const { user: currentUser } = useUser();
  
  // Only admin can access this screen
  if (currentUser?.role !== "admin") {
    return (
      <ThemedView className="flex-1 justify-center items-center bg-gray-50 px-6">
        <IconSymbol name="lock" size={64} color="#9ca3af" />
        <ThemedText className="text-gray-600 text-lg font-semibold mt-4 text-center">
          Chỉ Admin mới có quyền truy cập trang này
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
  
  const [staff, setStaff] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadStaff();
  }, []);

  const loadStaff = async () => {
    try {
      setLoading(true);
      const allUsers = await usersApi.getAllUsers();
      // Filter only staff and admin
      const staffUsers = allUsers.filter((u: User) => u.role === "staff" || u.role === "admin");
      setStaff(staffUsers);
    } catch (error: any) {
      console.error("Error loading staff:", error);
      Alert.alert("Lỗi", error.message || "Không thể tải danh sách staff");
      setStaff([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadStaff();
  };

  const filteredStaff = staff.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const staffCounts = {
    total: staff.length,
    staff: staff.filter((u) => u.role === "staff").length,
    admins: staff.filter((u) => u.role === "admin").length,
  };

  if (loading && !refreshing) {
    return (
      <ThemedView className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#8b5cf6" />
        <ThemedText className="mt-4 text-gray-600">Đang tải...</ThemedText>
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
            Quản lý Staff
          </ThemedText>
        </View>

        {/* Stats */}
        <View className="flex-row justify-around mt-4 pt-4 border-t border-white/20">
          <View className="items-center">
            <ThemedText className="text-white text-2xl font-extrabold">
              {staffCounts.total}
            </ThemedText>
            <ThemedText className="text-white/80 text-xs">Tổng</ThemedText>
          </View>
          <View className="items-center">
            <ThemedText className="text-white text-2xl font-extrabold">
              {staffCounts.staff}
            </ThemedText>
            <ThemedText className="text-white/80 text-xs">Staff</ThemedText>
          </View>
          <View className="items-center">
            <ThemedText className="text-white text-2xl font-extrabold">
              {staffCounts.admins}
            </ThemedText>
            <ThemedText className="text-white/80 text-xs">Admin</ThemedText>
          </View>
        </View>
      </LinearGradient>

      {/* Search */}
      <View className="px-4 pt-4">
        <View className="bg-white rounded-2xl px-4 py-3 flex-row items-center shadow-sm">
          <IconSymbol name="search" size={20} color="#9ca3af" />
          <TextInput
            className="flex-1 ml-3 text-base"
            placeholder="Tìm kiếm staff..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9ca3af"
          />
        </View>
      </View>

      {/* Staff List */}
      <ScrollView
        className="flex-1 px-4 pt-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {filteredStaff.length === 0 ? (
          <View className="items-center justify-center py-20">
            <IconSymbol name="users" size={64} color="#9ca3af" />
            <ThemedText className="text-gray-600 text-lg font-semibold mt-4">
              {searchQuery ? "Không tìm thấy staff" : "Chưa có staff nào"}
            </ThemedText>
          </View>
        ) : (
          filteredStaff.map((user) => (
            <StaffCard key={user._id} user={user} onRefresh={loadStaff} />
          ))
        )}
        <View className="h-8" />
      </ScrollView>
    </ThemedView>
  );
}

// Staff Card Component
function StaffCard({
  user,
  onRefresh,
}: {
  user: User;
  onRefresh: () => void;
}) {
  const [loading, setLoading] = useState(false);

  const handleChangeRole = () => {
    // Toggle between staff and admin (not client)
    const newRole = user.role === "admin" ? "staff" : "admin";
    const roleLabel = newRole === "admin" ? "Admin" : "Staff";
    
    Alert.alert(
      "Thay đổi quyền",
      `Bạn có muốn thay đổi quyền của "${user.name}" từ ${user.role.toUpperCase()} thành ${roleLabel}?`,
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xác nhận",
          onPress: async () => {
            try {
              setLoading(true);
              await usersApi.updateUserRole(user._id, newRole);
              Alert.alert("Thành công", `Quyền đã được thay đổi thành ${roleLabel}`);
              onRefresh();
            } catch (error: any) {
              console.error("Error updating user role:", error);
              Alert.alert(
                "Lỗi",
                error.message || "Không thể thay đổi quyền. Vui lòng thử lại."
              );
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <View className="bg-white rounded-2xl p-4 mb-3 shadow-sm border border-gray-100">
      <View className="flex-row items-center justify-between">
        <View className="flex-1 pr-3">
          <ThemedText className="text-gray-900 font-extrabold text-lg">
            {user.name}
          </ThemedText>
          <ThemedText className="text-gray-600 text-sm mt-1">
            {user.email}
          </ThemedText>
          {user.phone && (
            <ThemedText className="text-gray-500 text-xs mt-1">
              📞 {user.phone}
            </ThemedText>
          )}
          {user.createdAt && (
            <ThemedText className="text-gray-400 text-xs mt-1">
              Đăng ký: {new Date(user.createdAt).toLocaleDateString("vi-VN")}
            </ThemedText>
          )}
        </View>
        <View
          className={`px-3 py-1 rounded-full mb-2 ${
            user.role === "admin"
              ? "bg-purple-100"
              : "bg-green-100"
          }`}
        >
          <ThemedText
            className={`font-extrabold text-xs ${
              user.role === "admin"
                ? "text-purple-700"
                : "text-green-700"
            }`}
          >
            {user.role.toUpperCase()}
          </ThemedText>
        </View>
      </View>

      {/* Action Button */}
      <View className="flex-row mt-3 gap-2">
        <TouchableOpacity
          onPress={handleChangeRole}
          disabled={loading}
          className="flex-1 py-2 px-4 rounded-xl bg-purple-50 border border-purple-200"
        >
          <ThemedText className="text-center font-semibold text-sm text-purple-700">
            {user.role === "admin" ? "⬇️ Chuyển thành Staff" : "⬆️ Chuyển thành Admin"}
          </ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

