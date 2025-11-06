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
  ScrollView,
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

      if (result.success && result.user && result.accessToken) {
        const userData = {
          _id: result.user._id || (result.user as any).id,
          name: result.user.name,
          email: result.user.email,
          role: (result.user.role || "client") as "client" | "staff" | "admin",
          avatar: result.user.avatar,
          phone: result.user.phone,
        };

        await login(userData, result.accessToken);

        // Redirect based on role
        if (userData.role === "admin") {
          router.dismissAll();
          router.push("/screens/AdminDashboard" as any);
        } else if (userData.role === "staff") {
          router.dismissAll();
          router.push("/screens/StaffDashboard" as any);
        } else {
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
    <View style={{ flex: 1 }}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Gradient Background */}
      <LinearGradient
        colors={["#667eea", "#764ba2"]}
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            paddingHorizontal: 24,
            paddingVertical: 40,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View className="w-full max-w-md mx-auto">
              {/* Logo & Title */}
              <View className="items-center mb-10">
                <View className="bg-white rounded-3xl p-6 shadow-2xl mb-4">
                  <IconSymbol name="send" size={64} color="#667eea" />
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
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
