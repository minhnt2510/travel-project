import { useState } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from "react-native";
import { ThemedView } from "@/ui-components/themed-view";
import { ThemedText } from "@/ui-components/themed-text";
import { IconSymbol } from "@/ui-components/ui/icon-symbol";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import RoleGuard from "@/app/components/common/RoleGuard";

export default function SystemSettingsScreen() {
  return (
    <RoleGuard allowedRoles={["admin"]}>
      <SystemSettingsContent />
    </RoleGuard>
  );
}

function SystemSettingsContent() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [autoBackup, setAutoBackup] = useState(true);

  const handleSave = () => {
    Alert.alert("Thành công", "Đã lưu cài đặt hệ thống");
  };

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
            Cài đặt hệ thống
          </ThemedText>
        </View>
      </LinearGradient>

      <ScrollView className="flex-1 px-4 pt-6" showsVerticalScrollIndicator={false}>
        {/* General Settings */}
        <View className="bg-white rounded-2xl shadow-sm p-5 mb-4">
          <ThemedText className="text-xl font-extrabold text-gray-900 mb-4">
            Cài đặt chung
          </ThemedText>
          
          <View className="flex-row items-center justify-between py-3 border-b border-gray-100">
            <View className="flex-1">
              <ThemedText className="text-gray-900 font-semibold">Thông báo hệ thống</ThemedText>
              <ThemedText className="text-gray-600 text-sm mt-1">
                Bật/tắt thông báo cho tất cả users
              </ThemedText>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: "#d1d5db", true: "#8b5cf6" }}
              thumbColor="#fff"
            />
          </View>

          <View className="flex-row items-center justify-between py-3 border-b border-gray-100">
            <View className="flex-1">
              <ThemedText className="text-gray-900 font-semibold">Chế độ bảo trì</ThemedText>
              <ThemedText className="text-gray-600 text-sm mt-1">
                Tạm dừng hệ thống để bảo trì
              </ThemedText>
            </View>
            <Switch
              value={maintenanceMode}
              onValueChange={setMaintenanceMode}
              trackColor={{ false: "#d1d5db", true: "#ef4444" }}
              thumbColor="#fff"
            />
          </View>

          <View className="flex-row items-center justify-between py-3">
            <View className="flex-1">
              <ThemedText className="text-gray-900 font-semibold">Sao lưu tự động</ThemedText>
              <ThemedText className="text-gray-600 text-sm mt-1">
                Tự động sao lưu dữ liệu hàng ngày
              </ThemedText>
            </View>
            <Switch
              value={autoBackup}
              onValueChange={setAutoBackup}
              trackColor={{ false: "#d1d5db", true: "#10b981" }}
              thumbColor="#fff"
            />
          </View>
        </View>

        {/* Security Settings */}
        <View className="bg-white rounded-2xl shadow-sm p-5 mb-4">
          <ThemedText className="text-xl font-extrabold text-gray-900 mb-4">
            Bảo mật
          </ThemedText>
          
          <TouchableOpacity className="flex-row items-center justify-between py-3 border-b border-gray-100">
            <View className="flex-1">
              <ThemedText className="text-gray-900 font-semibold">Đổi mật khẩu Admin</ThemedText>
              <ThemedText className="text-gray-600 text-sm mt-1">
                Thay đổi mật khẩu tài khoản admin
              </ThemedText>
            </View>
            <IconSymbol name="chevron-right" size={20} color="#9ca3af" />
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center justify-between py-3">
            <View className="flex-1">
              <ThemedText className="text-gray-900 font-semibold">Lịch sử đăng nhập</ThemedText>
              <ThemedText className="text-gray-600 text-sm mt-1">
                Xem lịch sử đăng nhập của tất cả users
              </ThemedText>
            </View>
            <IconSymbol name="chevron-right" size={20} color="#9ca3af" />
          </TouchableOpacity>
        </View>

        {/* Danger Zone */}
        <View className="bg-red-50 border-2 border-red-200 rounded-2xl p-5 mb-6">
          <ThemedText className="text-xl font-extrabold text-red-900 mb-4">
            ⚠️ Vùng nguy hiểm
          </ThemedText>
          
          <TouchableOpacity
            onPress={() => {
              Alert.alert(
                "Xác nhận",
                "Bạn có chắc chắn muốn xóa tất cả dữ liệu? Hành động này không thể hoàn tác!",
                [
                  { text: "Hủy", style: "cancel" },
                  { text: "Xóa", style: "destructive" },
                ]
              );
            }}
            className="bg-red-600 px-4 py-3 rounded-xl mb-3"
          >
            <ThemedText className="text-white font-extrabold text-center">
              Xóa tất cả dữ liệu
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              Alert.alert(
                "Xác nhận",
                "Bạn có chắc chắn muốn reset hệ thống?",
                [
                  { text: "Hủy", style: "cancel" },
                  { text: "Reset", style: "destructive" },
                ]
              );
            }}
            className="bg-red-500 px-4 py-3 rounded-xl"
          >
            <ThemedText className="text-white font-extrabold text-center">
              Reset hệ thống
            </ThemedText>
          </TouchableOpacity>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          onPress={handleSave}
          className="bg-purple-600 px-6 py-4 rounded-2xl mb-6"
        >
          <ThemedText className="text-white font-extrabold text-center text-lg">
            Lưu cài đặt
          </ThemedText>
        </TouchableOpacity>

        <View className="h-8" />
      </ScrollView>
    </ThemedView>
  );
}

