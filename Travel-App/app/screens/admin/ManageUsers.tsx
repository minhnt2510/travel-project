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
      // Note: This endpoint needs to be implemented in backend
      // For now, we'll show a message
      Alert.alert(
        "Thông báo",
        "API quản lý users chưa được implement. Vui lòng liên hệ developer để thêm endpoint này."
      );
      setUsers([]);
    } catch (error) {
      console.error("Error loading users:", error);
      Alert.alert("Lỗi", "Không thể tải danh sách users");
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
                  : "Chưa có users. API endpoint cần được implement."}
              </ThemedText>
            </View>
          ) : (
            filteredUsers.map((user) => (
              <View
                key={user._id}
                className="bg-white rounded-2xl p-4 mb-3 shadow-sm"
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <ThemedText className="text-gray-900 font-extrabold text-lg">
                      {user.name}
                    </ThemedText>
                    <ThemedText className="text-gray-600 text-sm mt-1">
                      {user.email}
                    </ThemedText>
                    {user.phone && (
                      <ThemedText className="text-gray-500 text-xs mt-1">
                        {user.phone}
                      </ThemedText>
                    )}
                  </View>
                  <View
                    className={`px-3 py-1 rounded-full ${
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
              </View>
            ))
          )}
        </ScrollView>
      )}
    </ThemedView>
  );
}

