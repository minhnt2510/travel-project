import { api, type User } from "@/services/api";
import { ThemedText } from "@/ui-components/themed-text";
import { ThemedView } from "@/ui-components/themed-view";
import { IconSymbol } from "@/ui-components/ui/icon-symbol";
import { Image } from "expo-image";
import { Link, router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { useUser } from "../_layout";

export default function ProfileScreen() {
  const { user, setUser, logout } = useUser();
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
      setUser({
        ...userData,
        role: userData.role === "admin" ? "admin" : "user",
      });
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
      setUser({
        ...updatedUser,
        role: updatedUser.role === "admin" ? "admin" : "user",
      });
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
    Alert.alert("Đăng xuất", "Bạn có chắc chắn muốn đăng xuất?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Đăng xuất",
        style: "destructive",
        onPress: () => {
          logout();
          router.replace("/(auth)/login");
        },
      },
    ]);
  };

  const userStats = [
    { label: "Chuyến đi", value: "12" },
    { label: "Đánh giá", value: "28" },
    { label: "Điểm thưởng", value: "2,450" },
  ];

  const menuItems: { icon: string; label: string; href: string }[] = [
    {
      icon: "user",
      label: "Thông tin cá nhân",
      href: "/screens/reviews/ReviewCreate",
    },
    { icon: "heart", label: "Danh sách yêu thích", href: "/(tabs)/wishlist" },
    {
      icon: "credit-card",
      label: "Phương thức thanh toán",
      href: "/screens/Checkout",
    },
    { icon: "settings", label: "Cài đặt", href: "/screens/search/Search" },
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
        <ThemedText className="mt-4 text-gray-600">
          Đang tải thông tin...
        </ThemedText>
      </ThemedView>
    );
  }

  if (!user) {
    return (
      <ThemedView className="flex-1 justify-center items-center">
        <ThemedText className="text-gray-600">
          Không thể tải thông tin người dùng
        </ThemedText>
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
    <ThemedView className="flex-1 bg-gray-50">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header hồ sơ với gradient đẹp */}
        <Animated.View style={[fadeAnimatedStyle]}>
          <LinearGradient
            colors={['#667eea', '#764ba2', '#f093fb']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="p-6 pt-16 rounded-b-3xl"
          >
            <View className="items-center">
              <View className="relative">
                <Image
                  source={{
                    uri:
                      user.avatar ||
                      "https://ui-avatars.com/api/?name=" + encodeURIComponent(user.name) + "&background=667eea&color=fff&size=128",
                  }}
                  className="w-28 h-28 rounded-full border-4 border-white shadow-2xl"
                />
                <TouchableOpacity
                  onPress={handleEditProfile}
                  className="absolute bottom-0 right-0 bg-white rounded-full p-2.5 shadow-xl border-2 border-purple-200"
                >
                  <IconSymbol name="camera" size={18} color="#667eea" />
                </TouchableOpacity>
              </View>
              <ThemedText className="text-white text-2xl font-extrabold mt-4">
                {user.name}
              </ThemedText>
              <ThemedText className="text-white/90 mt-1">{user.email}</ThemedText>
              {user.phone && (
                <View className="flex-row items-center mt-2">
                  <IconSymbol name="phone" size={14} color="#FFF" />
                  <ThemedText className="text-white/90 text-sm ml-1">
                    {user.phone}
                  </ThemedText>
                </View>
              )}
            </View>

            {/* Thống kê */}
            <View className="flex-row justify-around mt-8 pt-6 border-t border-white/20">
              {userStats.map((stat, idx) => (
                <View key={idx} className="items-center">
                  <ThemedText className="text-white text-2xl font-extrabold">
                    {stat.value}
                  </ThemedText>
                  <ThemedText className="text-white/80 text-xs mt-1 font-medium">
                    {stat.label}
                  </ThemedText>
                </View>
              ))}
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Menu */}
        <View className="px-4 py-4">
          {menuItems.map((item, idx) => (
            <Link key={idx} href={item.href as any} asChild>
              <TouchableOpacity 
                activeOpacity={0.7}
                className="flex-row items-center py-4 px-3 mb-2 bg-white rounded-2xl shadow-sm border border-gray-100"
              >
                <View className="w-10 h-10 rounded-xl bg-purple-50 items-center justify-center mr-3">
                  <IconSymbol name={item.icon} size={20} color="#667eea" />
                </View>
                <ThemedText className="flex-1 font-semibold text-gray-900">{item.label}</ThemedText>
                <IconSymbol name="chevron-right" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            </Link>
          ))}
        </View>

        {/* Đăng xuất */}
        <View className="p-4 pb-8">
          <TouchableOpacity
            activeOpacity={0.9}
            className="rounded-2xl overflow-hidden shadow-lg"
            onPress={handleLogout}
          >
            <LinearGradient
              colors={['#ef4444', '#dc2626']}
              className="flex-row items-center justify-center py-4"
            >
              <IconSymbol name="log-out" size={20} color="#FFF" />
              <ThemedText className="text-white ml-2 font-extrabold text-base">
                Đăng xuất
              </ThemedText>
            </LinearGradient>
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
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            className="p-6 pt-12"
          >
            <View className="flex-row justify-between items-center">
              <ThemedText className="text-2xl font-extrabold text-white">
                Chỉnh sửa thông tin
              </ThemedText>
              <TouchableOpacity
                onPress={() => setIsModalVisible(false)}
                className="w-10 h-10 rounded-full bg-white/20 items-center justify-center"
              >
                <IconSymbol name="x" size={20} color="#FFF" />
              </TouchableOpacity>
            </View>
          </LinearGradient>

          <ScrollView className="p-4">
            <View className="mb-4">
              <ThemedText className="text-lg font-semibold mb-2">
                Họ và tên
              </ThemedText>
              <TextInput
                className="border border-gray-300 rounded-xl p-4 text-gray-900 bg-white text-base"
                placeholder="Nhập họ và tên"
                placeholderTextColor="#9ca3af"
                value={name}
                onChangeText={setName}
              />
            </View>

            <View className="mb-4">
              <ThemedText className="text-lg font-semibold mb-2">
                Email
              </ThemedText>
              <TextInput
                className="border border-gray-300 rounded-xl p-4 text-gray-900 bg-white text-base"
                placeholder="Nhập email"
                placeholderTextColor="#9ca3af"
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
                className="border border-gray-300 rounded-xl p-4 text-gray-900 bg-white text-base"
                placeholder="Nhập số điện thoại"
                placeholderTextColor="#9ca3af"
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
              activeOpacity={0.9}
              className="rounded-2xl overflow-hidden shadow-lg"
            >
              <LinearGradient
                colors={['#667eea', '#764ba2']}
                className="py-4 items-center"
              >
                {isUpdating ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <ThemedText className="text-white font-extrabold text-lg">
                    Lưu thay đổi
                  </ThemedText>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ThemedView>
      </Modal>
    </ThemedView>
  );
}
