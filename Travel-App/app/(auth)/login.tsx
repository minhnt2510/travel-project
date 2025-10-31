import { api } from "@/services/api";
import { ThemedText } from "@/ui-components/themed-text";
import { ThemedView } from "@/ui-components/themed-view";
import { IconSymbol } from "@/ui-components/ui/icon-symbol";
import { Link, Stack, router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useUser } from "../_layout";

export default function LoginScreen() {
  const { login } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    if (!email.trim()) return Alert.alert("Lỗi", "Vui lòng nhập email"), false;
    if (!/\S+@\S+\.\S+/.test(email))
      return Alert.alert("Lỗi", "Email không hợp lệ"), false;
    if (password.length < 6)
      return Alert.alert("Lỗi", "Mật khẩu ít nhất 6 ký tự"), false;
    return true;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const result = await api.login(email.trim(), password);
      console.log("Login result:", result); // Debug log

      if (result.success && result.user && result.accessToken) {
        const userData = {
          _id: result.user._id || (result.user as any).id,
          name: result.user.name,
          email: result.user.email,
          role: (result.user.role === "admin" ? "admin" : "user") as
            | "admin"
            | "user",
          avatar: result.user.avatar,
          phone: result.user.phone,
        };

        console.log("User data:", userData); // Debug log
        console.log("User role:", userData.role); // Debug log

        login(userData, result.accessToken);

        // Redirect based on role - using push instead of replace for better navigation
        if (userData.role === "admin") {
          console.log("Redirecting to Admin Dashboard");
          // Use push and then clear history
          router.dismissAll();
          router.push("/screens/AdminDashboard" as any);
        } else {
          console.log("Redirecting to tabs");
          router.replace("/(tabs)" as any);
        }
      } else {
        Alert.alert("Lỗi", result.message || "Đăng nhập thất bại");
      }
    } catch {
      Alert.alert("Lỗi", "Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemedView className="flex-1 bg-white">
      <Stack.Screen options={{ headerShown: false }} />

      {/* Gradient Background */}
      <LinearGradient
        colors={["#667eea", "#764ba2"]}
        className="absolute inset-0"
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 justify-center px-6"
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="w-full max-w-md mx-auto">
            {/* Logo & Title */}
            <View className="items-center mb-10">
              <View className="bg-white rounded-3xl p-6 shadow-2xl mb-4">
                <IconSymbol name="airplane" size={64} color="#667eea" />
              </View>
              <ThemedText className="text-gray-700 text-4xl font-extrabold mb-2">
                Travel App
              </ThemedText>
              <ThemedText className="text-purple-600 text-lg font-medium">
                Khám phá thế giới, bắt đầu hành trình
              </ThemedText>
            </View>

            {/* Login Card */}
            <View className="bg-white rounded-3xl p-7 shadow-2xl">
              <ThemedText className="text-gray-900 text-2xl font-extrabold text-center mb-6">
                Đăng nhập
              </ThemedText>

              {/* Email Field */}
              <View className="mb-5">
                <View className="flex-row items-center bg-gray-50 rounded-2xl px-5 h-14 border-2 border-gray-200">
                  <IconSymbol name="mail" size={20} color="#667eea" />
                  <TextInput
                    className="flex-1 ml-3 text-gray-900 font-semibold text-base"
                    placeholder="Email"
                    placeholderTextColor="#9ca3af"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                  />
                </View>
              </View>

              {/* Password Field */}
              <View className="mb-4">
                <View className="flex-row items-center bg-gray-50 rounded-2xl px-5 h-14 border-2 border-gray-200">
                  <IconSymbol name="lock" size={20} color="#667eea" />
                  <TextInput
                    className="flex-1 ml-3 text-gray-900 font-semibold text-base"
                    placeholder="Mật khẩu"
                    placeholderTextColor="#9ca3af"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    className="ml-2"
                  >
                    <IconSymbol
                      name={showPassword ? "eye-off" : "eye"}
                      size={20}
                      color="#667eea"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Forgot Password */}
              <TouchableOpacity className="mb-6 self-end">
                <ThemedText className="text-purple-600 font-semibold text-sm">
                  Quên mật khẩu?
                </ThemedText>
              </TouchableOpacity>

              {/* Login Button */}
              <TouchableOpacity
                onPress={handleLogin}
                disabled={isLoading}
                activeOpacity={0.9}
                className="rounded-2xl overflow-hidden shadow-lg"
              >
                <LinearGradient
                  colors={["#667eea", "#764ba2"]}
                  className="h-14 justify-center items-center"
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <ThemedText className="text-white font-extrabold text-lg">
                      Đăng nhập
                    </ThemedText>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              {/* Register Link */}
              <View className="flex-row justify-center mt-6">
                <ThemedText className="text-gray-600 text-sm">
                  Chưa có tài khoản?{" "}
                </ThemedText>
                <Link href="/(auth)/register">
                  <ThemedText className="text-purple-600 font-extrabold text-sm">
                    Đăng ký ngay
                  </ThemedText>
                </Link>
              </View>
            </View>

            {/* Demo Info */}
            <View className="mt-6 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl p-4">
              <ThemedText className="text-white text-sm font-semibold text-center mb-2">
                Tài khoản Admin:
              </ThemedText>
              <View className="bg-white/20 rounded-xl p-3 mb-2">
                <ThemedText className="text-white text-xs font-medium mb-1">
                  Email: admin@travel.com
                </ThemedText>
                <ThemedText className="text-white text-xs font-medium">
                  Password: admin123
                </ThemedText>
              </View>
              <ThemedText className="text-white/80 text-xs text-center">
                Đăng nhập để xem Dashboard Admin
              </ThemedText>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}
