import { api, type User } from "@/services/api";
import { ThemedText } from "@/ui-components/themed-text";
import { ThemedView } from "@/ui-components/themed-view";
import { IconSymbol } from "@/ui-components/ui/icon-symbol";
import { Image } from "expo-image";
import { Link, router } from "expo-router";
import { useEffect, useState, useCallback } from "react";
import { useFocusEffect } from "expo-router";
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
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
  const [avatar, setAvatar] = useState("");
  const [avatarUri, setAvatarUri] = useState<string | null>(null); // For picked image
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // Animation values
  const fadeAnimation = useSharedValue(0);

  useEffect(() => {
    loadUser();
    requestImagePickerPermission();
  }, []);

  const requestImagePickerPermission = async () => {
    if (Platform.OS !== "web") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Cần quyền truy cập",
          "Cần quyền truy cập thư viện ảnh để upload avatar!"
        );
      }
    }
  };

  useEffect(() => {
    if (user) {
      fadeAnimation.value = withSpring(1, { damping: 15 });
    }
  }, [user]);

  // Reload user data when tab comes into focus (to refresh avatar if it was updated)
  useFocusEffect(
    useCallback(() => {
      // Only reload if user is already loaded (to avoid race conditions on initial mount)
      if (user?._id) {
        // Reload user data when tab is focused
        loadUser();
      }
    }, [user?._id]) // Only reload if user ID changes
  );

  const loadUser = async () => {
    try {
      setLoading(true);
      const userData = await api.getUser();

      // Update local form state
      setName(userData.name);
      setEmail(userData.email);
      setPhone(userData.phone || "");
      setAvatar(userData.avatar || "");
      setAvatarUri(null); // Reset picked image

      // Update user context (for display in header)
      const updatedUserData = {
        ...userData,
        role: (userData.role || "client") as "client" | "staff" | "admin",
      };

      // Load user data

      // Update both local state and context
      setUser(updatedUserData);
    } catch (error) {
      console.error("Error loading user:", error);
      Alert.alert("Lỗi", "Không thể tải thông tin người dùng");
    } finally {
      setLoading(false);
    }
  };

  const handleEditProfile = () => {
    setIsEditMode(true);
    setIsModalVisible(true);
    setAvatarUri(null); // Reset picked image when opening modal
  };

  const handlePickImage = async () => {
    try {
      // Request permission first
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Cần quyền truy cập",
          "Cần quyền truy cập thư viện ảnh để upload avatar!"
        );
        return;
      }

      // Show action sheet for camera or library
      Alert.alert("Chọn ảnh đại diện", "Bạn muốn chọn ảnh từ đâu?", [
        {
          text: "Thư viện ảnh",
          onPress: async () => {
            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.5, // Reduce quality to decrease file size
              allowsMultipleSelection: false,
            });

            if (!result.canceled && result.assets[0]) {
              setAvatarUri(result.assets[0].uri);
            }
          },
        },
        {
          text: "Camera",
          onPress: async () => {
            const { status: cameraStatus } =
              await ImagePicker.requestCameraPermissionsAsync();
            if (cameraStatus !== "granted") {
              Alert.alert(
                "Cần quyền truy cập",
                "Cần quyền truy cập camera để chụp ảnh!"
              );
              return;
            }

            const result = await ImagePicker.launchCameraAsync({
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.5, // Reduce quality to decrease file size
            });

            if (!result.canceled && result.assets[0]) {
              setAvatarUri(result.assets[0].uri);
            }
          },
        },
        {
          text: "Hủy",
          style: "cancel",
        },
      ]);
    } catch (error: any) {
      console.error("Error picking image:", error);
      Alert.alert("Lỗi", "Không thể mở image picker");
    }
  };

  const convertImageToBase64 = async (uri: string): Promise<string> => {
    try {
      // Convert image to base64

      // Use fetch + FileReader for both web and React Native
      // This approach works reliably across platforms
      try {
        // For React Native, file:// URIs need special handling
        // Use FileSystem if available, otherwise use fetch
        if (Platform.OS !== "web" && uri.startsWith("file://")) {
          try {
            // Try FileSystem first for file:// URIs
            const base64 = await FileSystem.readAsStringAsync(uri, {
              encoding: "base64" as any, // Use string literal to avoid type errors
            });

            // Get file extension from URI or default to jpeg
            let mimeType = "image/jpeg";
            if (uri.includes(".png")) {
              mimeType = "image/png";
            } else if (uri.includes(".gif")) {
              mimeType = "image/gif";
            }

            const dataUri = `data:${mimeType};base64,${base64}`;
            // Image converted via FileSystem
            return dataUri;
          } catch (fileSystemError: any) {
            // FileSystem failed, trying fetch
            // Fall through to fetch method
          }
        }

        // Use fetch + FileReader (works for both web and React Native)
        const response = await fetch(uri);
        if (!response.ok) {
          throw new Error(`Failed to fetch image: ${response.status}`);
        }

        const blob = await response.blob();
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64String = reader.result as string;
            if (!base64String) {
              reject(new Error("Failed to convert image to base64"));
              return;
            }
            // Image converted successfully
            resolve(base64String);
          };
          reader.onerror = (error) => {
            console.error("FileReader error:", error);
            reject(new Error("Failed to read image file"));
          };
          reader.readAsDataURL(blob);
        });
      } catch (fetchError: any) {
        console.error("Error converting image:", fetchError);
        throw new Error(
          `Không thể xử lý ảnh: ${fetchError.message || "Lỗi không xác định"}`
        );
      }
    } catch (error: any) {
      console.error("Error converting image to base64:", error);
      console.error("Error details:", error.message, error.stack);
      throw new Error(
        `Không thể xử lý ảnh: ${error.message || "Lỗi không xác định"}`
      );
    }
  };

  const handleSaveProfile = async () => {
    if (!name.trim() || !email.trim()) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin");
      return;
    }

    try {
      setIsUpdating(true);
      let avatarUrl = avatar.trim();

      // If user picked a new image, convert to base64 and use as data URL
      // In production, you should upload to a server and get URL back
      if (avatarUri) {
        setUploadingAvatar(true);
        try {
          // Convert image to base64
          const base64 = await convertImageToBase64(avatarUri);

          if (!base64 || base64.length === 0) {
            throw new Error("Không thể convert ảnh thành base64");
          }

          // Limit size if too large (MongoDB String has 16MB limit, but we should keep it reasonable)
          // Express body parser limit is now 50MB, but we'll limit to 5MB for safety
          if (base64.length > 5000000) {
            // ~5MB limit for base64
            Alert.alert(
              "Cảnh báo",
              "Ảnh quá lớn (" +
                Math.round((base64.length / 1024 / 1024) * 100) / 100 +
                "MB). Vui lòng chọn ảnh nhỏ hơn hoặc chất lượng thấp hơn."
            );
            setUploadingAvatar(false);
            setIsUpdating(false);
            return;
          }

          avatarUrl = base64; // Use base64 data URI
          // Note: In production, you should upload to server and get URL back
          // Example: avatarUrl = await uploadImageToServer(base64);
        } catch (error: any) {
          Alert.alert(
            "Lỗi xử lý ảnh",
            error.message ||
              "Không thể xử lý ảnh. Vui lòng thử lại hoặc chọn ảnh khác."
          );
          setUploadingAvatar(false);
          setIsUpdating(false);
          return;
        }
        setUploadingAvatar(false);
      }

      const updateData: any = {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
      };

      // Only include avatar if we have one (either from picker or manual URL)
      if (avatarUrl) {
        updateData.avatar = avatarUrl;
      } else if (avatar.trim()) {
        updateData.avatar = avatar.trim();
      }

      const updatedUser = await api.updateUser(updateData);

      // Update all states - prioritize returned avatar from server
      const finalAvatar =
        updatedUser.avatar || avatarUrl || avatar.trim() || "";

      setAvatar(finalAvatar);
      setAvatarUri(null); // Clear picked image

      // Update user context with the final avatar IMMEDIATELY
      const updatedUserData = {
        ...updatedUser,
        avatar: finalAvatar, // Use the final avatar
        role: (updatedUser.role || "client") as "client" | "staff" | "admin",
      };

      setUser(updatedUserData);

      setIsEditMode(false);
      setIsModalVisible(false);

      // Reload user after a short delay to get fresh data from server
      setTimeout(async () => {
        try {
          await loadUser();
        } catch (error) {
          // Silent error
        }
      }, 500);

      Alert.alert("Thành công", "Đã cập nhật thông tin thành công!");
    } catch (error: any) {
      console.error("Error updating profile:", error);
      Alert.alert(
        "Lỗi",
        error.message || "Không thể cập nhật thông tin. Vui lòng thử lại."
      );
    } finally {
      setIsUpdating(false);
      setUploadingAvatar(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin");
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert("Lỗi", "Mật khẩu mới phải có ít nhất 6 ký tự");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Lỗi", "Mật khẩu mới và xác nhận không khớp");
      return;
    }

    setChangingPassword(true);
    try {
      await api.changePassword({
        currentPassword,
        newPassword,
      });
      Alert.alert("Thành công", "Đổi mật khẩu thành công!");
      setShowPasswordModal(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      Alert.alert(
        "Lỗi",
        error.message ||
          "Không thể đổi mật khẩu. Vui lòng kiểm tra mật khẩu hiện tại."
      );
    } finally {
      setChangingPassword(false);
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

  const menuItems: {
    icon: string;
    label: string;
    href?: string;
    onPress?: () => void;
  }[] = [
    {
      icon: "user",
      label: "Thông tin cá nhân",
      onPress: handleEditProfile,
    },
    {
      icon: "credit-card",
      label: "Phương thức thanh toán",
      href: "/screens/payment/PaymentMethods",
    },
    {
      icon: "lock",
      label: "Đổi mật khẩu",
      onPress: () => setShowPasswordModal(true),
    },
    { icon: "settings", label: "Cài đặt", href: "/(tabs)/profile" },
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
            colors={["#667eea", "#764ba2", "#f093fb"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="p-6 pt-16 rounded-b-3xl"
          >
            <View className="items-center">
              <View className="relative">
                <Image
                  source={{
                    uri:
                      avatarUri && !isUpdating
                        ? avatarUri // Show picked image only if not saving
                        : user.avatar && user.avatar.length > 0
                        ? user.avatar // Show saved avatar
                        : "https://ui-avatars.com/api/?name=" +
                          encodeURIComponent(user.name) +
                          "&background=667eea&color=fff&size=128",
                  }}
                  className="w-28 h-28 rounded-full border-4 border-white shadow-2xl"
                  cachePolicy="memory"
                />
              </View>
              <View className="flex-row items-center mt-4">
                <ThemedText className="text-white text-2xl font-extrabold">
                  {user.name}
                </ThemedText>
              </View>
              <ThemedText className="text-white/90 mt-1">
                {user.email}
              </ThemedText>
              {user.phone && (
                <View className="flex-row items-center mt-2">
                  <IconSymbol name="phone" size={14} color="#FFF" />
                  <ThemedText className="text-white/90 text-sm ml-1">
                    {user.phone}
                  </ThemedText>
                </View>
              )}

              {/* Quick Actions for Staff/Admin */}
              {(user.role === "staff" || user.role === "admin") && (
                <View className="flex-row gap-2 mt-4">
                  <TouchableOpacity
                    onPress={() => {
                      router.push(
                        user.role === "admin"
                          ? "/screens/AdminDashboard"
                          : "/screens/StaffDashboard"
                      );
                    }}
                    className="flex-1 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30"
                  >
                    <ThemedText className="text-white text-xs font-bold text-center">
                      {user.role === "admin"
                        ? "🛡️ Admin Dashboard"
                        : "💼 Staff Dashboard"}
                    </ThemedText>
                  </TouchableOpacity>
                  {user.role === "admin" && (
                    <TouchableOpacity
                      onPress={() => router.push("/screens/admin/ManageUsers")}
                      className="flex-1 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30"
                    >
                      <ThemedText className="text-white text-xs font-bold text-center">
                        👥 Quản lý Users
                      </ThemedText>
                    </TouchableOpacity>
                  )}
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
          {menuItems.map((item, idx) => {
            const content = (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={item.onPress}
                className="flex-row items-center py-4 px-3 mb-2 bg-white rounded-2xl shadow-sm border border-gray-100"
              >
                <View className="w-10 h-10 rounded-xl bg-purple-50 items-center justify-center mr-3">
                  <IconSymbol name={item.icon} size={20} color="#667eea" />
                </View>
                <ThemedText className="flex-1 font-semibold text-gray-900">
                  {item.label}
                </ThemedText>
                <IconSymbol name="chevron-right" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            );

            if (item.href) {
              return (
                <Link key={idx} href={item.href as any} asChild>
                  {content}
                </Link>
              );
            }

            return <View key={idx}>{content}</View>;
          })}
        </View>

        {/* Đăng xuất */}
        <View className="p-4 pb-8">
          <TouchableOpacity
            activeOpacity={0.9}
            className="rounded-2xl overflow-hidden shadow-lg"
            onPress={handleLogout}
          >
            <LinearGradient
              colors={["#ef4444", "#dc2626"]}
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
          <LinearGradient colors={["#667eea", "#764ba2"]} className="p-6 pt-12">
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

            <View className="mb-4">
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

            {/* Avatar Upload */}
            <View className="mb-6">
              <ThemedText className="text-lg font-semibold mb-3">
                Ảnh đại diện
              </ThemedText>

              {/* Preview picked image */}
              {avatarUri && (
                <View className="mb-4 items-center">
                  <Image
                    source={{ uri: avatarUri }}
                    className="w-32 h-32 rounded-full border-2 border-gray-300"
                    contentFit="cover"
                  />
                  <TouchableOpacity
                    onPress={handlePickImage}
                    className="mt-2 bg-purple-600 px-4 py-2 rounded-xl"
                  >
                    <ThemedText className="text-white font-semibold">
                      Chọn ảnh khác
                    </ThemedText>
                  </TouchableOpacity>
                </View>
              )}

              {/* Pick image button if no image selected */}
              {!avatarUri && (
                <TouchableOpacity
                  onPress={handlePickImage}
                  className="border-2 border-dashed border-gray-300 rounded-xl p-6 items-center bg-gray-50"
                >
                  <IconSymbol name="camera" size={32} color="#667eea" />
                  <ThemedText className="text-gray-700 font-semibold mt-2">
                    Chọn ảnh từ điện thoại
                  </ThemedText>
                  <ThemedText className="text-gray-500 text-xs mt-1">
                    Camera hoặc thư viện ảnh
                  </ThemedText>
                </TouchableOpacity>
              )}

              {/* Manual URL input (optional) */}
              <View className="mt-4">
                <ThemedText className="text-sm font-semibold mb-2 text-gray-600">
                  Hoặc nhập URL (tùy chọn)
                </ThemedText>
                <TextInput
                  className="border border-gray-300 rounded-xl p-3 text-gray-900 bg-white text-sm"
                  placeholder="https://example.com/avatar.jpg"
                  placeholderTextColor="#9ca3af"
                  value={avatar}
                  onChangeText={setAvatar}
                  keyboardType="url"
                  autoCapitalize="none"
                />
              </View>
            </View>
          </ScrollView>

          <View className="p-4 border-t border-gray-200">
            <TouchableOpacity
              onPress={handleSaveProfile}
              disabled={isUpdating || uploadingAvatar}
              activeOpacity={0.9}
              className="rounded-2xl overflow-hidden shadow-lg"
              style={{
                opacity: isUpdating || uploadingAvatar ? 0.6 : 1,
              }}
            >
              <LinearGradient
                colors={["#667eea", "#764ba2"] as [string, string, ...string[]]}
                className="py-4 items-center"
              >
                {isUpdating || uploadingAvatar ? (
                  <View className="flex-row items-center">
                    <ActivityIndicator size="small" color="#FFF" />
                    <ThemedText className="text-white font-extrabold text-lg ml-2">
                      {uploadingAvatar ? "Đang xử lý ảnh..." : "Đang lưu..."}
                    </ThemedText>
                  </View>
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

      {/* Change Password Modal */}
      <Modal
        visible={showPasswordModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <ThemedView className="flex-1">
          <LinearGradient
            colors={["#667eea", "#764ba2"] as [string, string, ...string[]]}
            className="p-6 pt-12"
          >
            <View className="flex-row justify-between items-center">
              <ThemedText className="text-2xl font-extrabold text-white">
                Đổi mật khẩu
              </ThemedText>
              <TouchableOpacity
                onPress={() => {
                  setShowPasswordModal(false);
                  setCurrentPassword("");
                  setNewPassword("");
                  setConfirmPassword("");
                }}
                className="w-10 h-10 rounded-full bg-white/20 items-center justify-center"
              >
                <IconSymbol name="x" size={20} color="#FFF" />
              </TouchableOpacity>
            </View>
          </LinearGradient>

          <ScrollView className="p-4">
            <View className="mb-4">
              <ThemedText className="text-lg font-semibold mb-2">
                Mật khẩu hiện tại *
              </ThemedText>
              <TextInput
                className="border border-gray-300 rounded-xl p-4 text-gray-900 bg-white text-base"
                placeholder="Nhập mật khẩu hiện tại"
                placeholderTextColor="#9ca3af"
                value={currentPassword}
                onChangeText={setCurrentPassword}
                secureTextEntry
              />
            </View>

            <View className="mb-4">
              <ThemedText className="text-lg font-semibold mb-2">
                Mật khẩu mới *
              </ThemedText>
              <TextInput
                className="border border-gray-300 rounded-xl p-4 text-gray-900 bg-white text-base"
                placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                placeholderTextColor="#9ca3af"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
              />
            </View>

            <View className="mb-6">
              <ThemedText className="text-lg font-semibold mb-2">
                Xác nhận mật khẩu mới *
              </ThemedText>
              <TextInput
                className="border border-gray-300 rounded-xl p-4 text-gray-900 bg-white text-base"
                placeholder="Nhập lại mật khẩu mới"
                placeholderTextColor="#9ca3af"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
            </View>
          </ScrollView>

          <View className="p-4 border-t border-gray-200">
            <TouchableOpacity
              onPress={handleChangePassword}
              disabled={changingPassword}
              activeOpacity={0.9}
              className="rounded-2xl overflow-hidden shadow-lg"
              style={{
                opacity: changingPassword ? 0.6 : 1,
              }}
            >
              <LinearGradient
                colors={["#667eea", "#764ba2"] as [string, string, ...string[]]}
                className="py-4 items-center"
              >
                {changingPassword ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <ThemedText className="text-white font-extrabold text-lg">
                    Đổi mật khẩu
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
