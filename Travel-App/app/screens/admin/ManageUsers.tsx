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

interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: "user" | "admin";
  createdAt: string;
}

export default function ManageUsersScreen() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await usersApi.getAllUsers();
      setUsers(data);
    } catch (error: any) {
      console.error("Error loading users:", error);
      if (error.message?.includes("Forbidden") || error.message?.includes("403")) {
        Alert.alert(
          "Không có quyền",
          "Bạn không có quyền truy cập tính năng này. Chỉ admin mới có thể quản lý users."
        );
      } else {
        Alert.alert("Lỗi", error.message || "Không thể tải danh sách users");
      }
      setUsers([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadUsers();
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const userCounts = {
    total: users.length,
    admins: users.filter((u) => u.role === "admin").length,
    regular: users.filter((u) => u.role === "user").length,
  };

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
            Quản lý Users
          </ThemedText>
        </View>

        {/* Stats */}
        <View className="flex-row justify-around mt-4 pt-4 border-t border-white/20">
          <View className="items-center">
            <ThemedText className="text-white text-2xl font-extrabold">
              {userCounts.total}
            </ThemedText>
            <ThemedText className="text-white/80 text-xs">Tổng</ThemedText>
          </View>
          <View className="items-center">
            <ThemedText className="text-white text-2xl font-extrabold">
              {userCounts.admins}
            </ThemedText>
            <ThemedText className="text-white/80 text-xs">Admin</ThemedText>
          </View>
          <View className="items-center">
            <ThemedText className="text-white text-2xl font-extrabold">
              {userCounts.regular}
            </ThemedText>
            <ThemedText className="text-white/80 text-xs">User</ThemedText>
          </View>
        </View>
      </LinearGradient>

      {/* Search */}
      <View className="px-4 pt-4">
        <View className="bg-white rounded-2xl px-4 py-3 flex-row items-center shadow-sm">
          <IconSymbol name="search" size={20} color="#9ca3af" />
          <TextInput
            placeholder="Tìm kiếm user..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="flex-1 ml-3 text-gray-900"
            placeholderTextColor="#9ca3af"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <IconSymbol name="x" size={18} color="#9ca3af" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#10b981" />
          <ThemedText className="mt-4 text-gray-600">Đang tải...</ThemedText>
        </View>
      ) : (
        <ScrollView
          className="flex-1 px-4 pt-4"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {filteredUsers.length === 0 ? (
            <View className="items-center py-12">
              <IconSymbol name="users" size={64} color="#d1d5db" />
              <ThemedText className="text-gray-500 mt-4 text-center">
                {searchQuery
                  ? "Không tìm thấy user nào"
                  : "Chưa có users trong hệ thống."}
              </ThemedText>
            </View>
          ) : (
            filteredUsers.map((user) => (
              <UserCard
                key={user._id}
                user={user}
                onRefresh={loadUsers}
              />
            ))
          )}
        </ScrollView>
      )}
    </ThemedView>
  );
}

// User Card Component with actions
function UserCard({
  user,
  onRefresh,
}: {
  user: User;
  onRefresh: () => void;
}) {
  const [loading, setLoading] = useState(false);

  const handleDelete = () => {
    Alert.alert(
      "Xác nhận xóa",
      `Bạn có chắc chắn muốn xóa user "${user.name}"?`,
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);
              await usersApi.deleteUser(user._id);
              Alert.alert("Thành công", "User đã được xóa");
              onRefresh();
            } catch (error: any) {
              console.error("Error deleting user:", error);
              Alert.alert(
                "Lỗi",
                error.message || "Không thể xóa user. Vui lòng thử lại."
              );
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleChangeRole = () => {
    const newRole = user.role === "admin" ? "user" : "admin";
    const roleLabel = newRole === "admin" ? "Admin" : "User";
    
    Alert.alert(
      "Thay đổi quyền",
      `Bạn có muốn thay đổi quyền của "${user.name}" thành ${roleLabel}?`,
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
              : "bg-blue-100"
          }`}
        >
          <ThemedText
            className={`font-extrabold text-xs ${
              user.role === "admin"
                ? "text-purple-700"
                : "text-blue-700"
            }`}
          >
            {user.role.toUpperCase()}
          </ThemedText>
        </View>
      </View>

      {/* Action Buttons */}
      <View className="flex-row mt-3 gap-2">
        <TouchableOpacity
          onPress={handleChangeRole}
          disabled={loading}
          className={`flex-1 py-2 px-4 rounded-xl ${
            user.role === "admin"
              ? "bg-blue-50 border border-blue-200"
              : "bg-purple-50 border border-purple-200"
          }`}
        >
          <ThemedText
            className={`text-center font-semibold text-sm ${
              user.role === "admin"
                ? "text-blue-700"
                : "text-purple-700"
            }`}
          >
            {user.role === "admin" ? "⬇️ Hạ quyền" : "⬆️ Nâng quyền"}
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleDelete}
          disabled={loading}
          className="px-4 py-2 rounded-xl bg-red-50 border border-red-200"
        >
          {loading ? (
            <ActivityIndicator size="small" color="#ef4444" />
          ) : (
            <IconSymbol name="trash-2" size={18} color="#ef4444" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

