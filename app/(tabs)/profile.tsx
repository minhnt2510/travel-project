import { api, type User } from "@/services/api";
import { ThemedText } from "@/ui-components/themed-text";
import { ThemedView } from "@/ui-components/themed-view";
import { IconSymbol } from "@/ui-components/ui/icon-symbol";
import { Image } from "expo-image";
import { Link, router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Modal, ScrollView, TextInput, TouchableOpacity, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

export default function ProfileScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Animation values
  const fadeAnimation = useSharedValue(0);

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    if (user) {
      fadeAnimation.value = withSpring(1, { damping: 15 });
    }
  }, [user]);

  const loadUser = async () => {
    try {
      setLoading(true);
      const userData = await api.getUser();
      setUser(userData);
      setName(userData.name);
      setEmail(userData.email);
      setPhone(userData.phone || "");
    } catch (error) {
      Alert.alert("Lỗi", "Không thể tải thông tin người dùng");
    } finally {
      setLoading(false);
    }
  };

  const handleEditProfile = () => {
    setIsEditMode(true);
    setIsModalVisible(true);
  };

  const handleSaveProfile = async () => {
    if (!name.trim() || !email.trim()) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin");
      return;
    }

    try {
      setIsUpdating(true);
      const updatedUser = await api.updateUser({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
      });
      setUser(updatedUser);
      setIsEditMode(false);
      setIsModalVisible(false);
      Alert.alert("Thành công", "Đã cập nhật thông tin thành công!");
    } catch (error) {
      Alert.alert("Lỗi", "Không thể cập nhật thông tin");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      "Đăng xuất",
      "Bạn có chắc chắn muốn đăng xuất?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Đăng xuất",
          style: "destructive",
          onPress: () => {
            // Navigate to login screen
            router.replace("/(auth)/login");
          }
        }
      ]
    );
  };

  const userStats = [
    { label: "Chuyến đi", value: "12" },
    { label: "Đánh giá", value: "28" },
    { label: "Điểm thưởng", value: "2,450" },
  ];

  const menuItems: { icon: string; label: string; href: string }[] = [
    { icon: "user", label: "Thông tin cá nhân", href: "/screens/ReviewCreate" },
    { icon: "heart", label: "Danh sách yêu thích", href: "/(tabs)/wishlist" },
    {
      icon: "credit-card",
      label: "Phương thức thanh toán",
      href: "/screens/Checkout",
    },
    { icon: "settings", label: "Cài đặt", href: "/screens/Search" },
    {
      icon: "help-circle",
      label: "Trợ giúp & Hỗ trợ",
      href: "/screens/Search",
    },
    { icon: "info", label: "Về chúng tôi", href: "/screens/Search" },
  ];

  // Animated styles
  const fadeAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: fadeAnimation.value,
    };
  });

  if (loading) {
    return (
      <ThemedView className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#2563eb" />
        <ThemedText className="mt-4 text-gray-600">Đang tải thông tin...</ThemedText>
      </ThemedView>
    );
  }

  if (!user) {
    return (
      <ThemedView className="flex-1 justify-center items-center">
        <ThemedText className="text-gray-600">Không thể tải thông tin người dùng</ThemedText>
        <TouchableOpacity
          onPress={loadUser}
          className="mt-4 bg-blue-600 px-6 py-3 rounded-full"
        >
          <ThemedText className="text-white font-semibold">Thử lại</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  return (
    <ThemedView className="flex-1">
      <ScrollView>
        {/* Header hồ sơ */}
        <Animated.View style={[fadeAnimatedStyle]} className="bg-blue-600 p-6">
          <View className="items-center">
            <View className="relative">
              <Image
                source={{ uri: user.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100" }}
                className="w-24 h-24 rounded-full"
              />
              <TouchableOpacity
                onPress={handleEditProfile}
                className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg"
              >
                <IconSymbol name="camera" size={16} color="#2563eb" />
              </TouchableOpacity>
            </View>
            <ThemedText className="text-white text-xl font-bold mt-4">
              {user.name}
            </ThemedText>
            <ThemedText className="text-blue-100">
              {user.email}
            </ThemedText>
            {user.phone && (
              <ThemedText className="text-blue-100 text-sm mt-1">
                {user.phone}
              </ThemedText>
            )}
          </View>

          {/* Thống kê */}
          <View className="flex-row justify-between mt-6 bg-white/10 rounded-lg p-4">
            {userStats.map((stat, idx) => (
              <View key={idx} className="items-center">
                <ThemedText className="text-white text-lg font-bold">
                  {stat.value}
                </ThemedText>
                <ThemedText className="text-blue-100">{stat.label}</ThemedText>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Menu */}
        <View className="p-4">
          {menuItems.map((item, idx) => (
            <Link key={idx} href={item.href as any} asChild>
              <TouchableOpacity className="flex-row items-center py-4 border-b border-gray-100">
                <IconSymbol name={item.icon} size={24} color="#4B5563" />
                <ThemedText className="flex-1 ml-4">{item.label}</ThemedText>
                <IconSymbol name="chevron-right" size={24} color="#9CA3AF" />
              </TouchableOpacity>
            </Link>
          ))}
        </View>

        {/* Đăng xuất */}
        <View className="p-4">
          <TouchableOpacity
            className="flex-row items-center justify-center py-3 bg-red-600 rounded-lg"
            onPress={handleLogout}
          >
            <IconSymbol name="log-out" size={20} color="#FFF" />
            <ThemedText className="text-white ml-2">Đăng xuất</ThemedText>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <ThemedView className="flex-1">
          <View className="p-4 border-b border-gray-200">
            <View className="flex-row justify-between items-center">
              <ThemedText className="text-xl font-bold">
                Chỉnh sửa thông tin
              </ThemedText>
              <TouchableOpacity
                onPress={() => setIsModalVisible(false)}
                className="p-2"
              >
                <IconSymbol name="x" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView className="p-4">
            <View className="mb-4">
              <ThemedText className="text-lg font-semibold mb-2">
                Họ và tên
              </ThemedText>
              <TextInput
                className="border border-gray-300 rounded-lg p-3 text-gray-700"
                placeholder="Nhập họ và tên"
                value={name}
                onChangeText={setName}
              />
            </View>

            <View className="mb-4">
              <ThemedText className="text-lg font-semibold mb-2">
                Email
              </ThemedText>
              <TextInput
                className="border border-gray-300 rounded-lg p-3 text-gray-700"
                placeholder="Nhập email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View className="mb-6">
              <ThemedText className="text-lg font-semibold mb-2">
                Số điện thoại
              </ThemedText>
              <TextInput
                className="border border-gray-300 rounded-lg p-3 text-gray-700"
                placeholder="Nhập số điện thoại"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </View>
          </ScrollView>

          <View className="p-4 border-t border-gray-200">
            <TouchableOpacity
              onPress={handleSaveProfile}
              disabled={isUpdating}
              className="bg-blue-600 py-4 rounded-lg items-center"
            >
              {isUpdating ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <ThemedText className="text-white font-bold text-lg">
                  Lưu thay đổi
                </ThemedText>
              )}
            </TouchableOpacity>
          </View>
        </ThemedView>
      </Modal>
    </ThemedView>
  );
}
