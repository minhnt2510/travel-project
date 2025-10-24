import { api } from "@/services/api";
import { ThemedText } from "@/ui-components/themed-text";
import { ThemedView } from "@/ui-components/themed-view";
import { IconSymbol } from "@/ui-components/ui/icon-symbol";
import { Link, Stack, router } from "expo-router";
import { useEffect, useState } from "react";
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
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming
} from "react-native-reanimated";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Animation
  const fade = useSharedValue(0);
  const scale = useSharedValue(0.95);
  const translateY = useSharedValue(30);

  useEffect(() => {
    fade.value = withTiming(1, { duration: 600 });
    scale.value = withSpring(1, { damping: 18 });
    translateY.value = withSpring(0, { damping: 18 });
  }, []);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: fade.value,
    transform: [{ scale: scale.value }, { translateY: translateY.value }],
  }));

  const validateForm = () => {
    if (!email.trim()) return Alert.alert("Lỗi", "Vui lòng nhập email"), false;
    if (!/\S+@\S+\.\S+/.test(email)) return Alert.alert("Lỗi", "Email không hợp lệ"), false;
    if (password.length < 6) return Alert.alert("Lỗi", "Mật khẩu ít nhất 6 ký tự"), false;
    return true;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const result = await api.login(email.trim(), password);
      if (result.success && result.user) {
        Alert.alert("Thành công", "Đăng nhập thành công!", [
          { text: "OK", onPress: () => router.replace("/(tabs)") }
        ]);
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
    <ThemedView className="flex-1 bg-gray-50">
      <Stack.Screen options={{ headerShown: false }} />

      {/* Background - Light & Clean */}
      <View className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 justify-center px-6"
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <Animated.View style={[containerStyle]} className="w-full max-w-md mx-auto">
            {/* Logo & Title */}
            <View className="items-center mb-10">
              <View className="bg-white rounded-3xl p-5 shadow-lg border border-gray-200">
                <IconSymbol name="airplane" size={60} color="#2563eb" />
              </View>
              <ThemedText className="text-gray-900 text-4xl font-bold mt-6">
                Travel App
              </ThemedText>
              <ThemedText className="text-gray-600 text-lg mt-2">
                Khám phá thế giới, bắt đầu hành trình
              </ThemedText>
            </View>

            {/* Login Card - Clean & High Contrast */}
            <View className="bg-white rounded-3xl p-7 shadow-xl border border-gray-200">
              <ThemedText className="text-gray-900 text-2xl font-bold text-center mb-6">
                Đăng nhập
              </ThemedText>

              {/* Email Field */}
              <View className="mb-5">
                <View className="flex-row items-center bg-gray-50 rounded-2xl px-4 h-14 border border-gray-300">
                  <IconSymbol name="mail" size={22} color="#6b7280" />
                  <TextInput
                    className="flex-1 ml-3 text-gray-900 font-medium"
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
                <View className="flex-row items-center bg-gray-50 rounded-2xl px-4 h-14 border border-gray-300">
                  <IconSymbol name="lock" size={22} color="#6b7280" />
                  <TextInput
                    className="flex-1 ml-3 text-gray-900 font-medium"
                    placeholder="Mật khẩu"
                    placeholderTextColor="#9ca3af"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <IconSymbol
                      name={showPassword ? "eye-off" : "eye"}
                      size={22}
                      color="#6b7280"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Forgot Password */}
              <TouchableOpacity className="mb-6 self-end">
                <ThemedText className="text-blue-600 font-medium text-sm underline">
                  Quên mật khẩu?
                </ThemedText>
              </TouchableOpacity>

              {/* Login Button */}
              <TouchableOpacity
                onPress={handleLogin}
                disabled={isLoading}
                className="bg-blue-600 rounded-2xl h-14 justify-center items-center shadow-md active:opacity-90"
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <ThemedText className="text-white font-bold text-lg">
                    Đăng nhập
                  </ThemedText>
                )}
              </TouchableOpacity>

              {/* Register Link */}
              <View className="flex-row justify-center mt-6">
                <ThemedText className="text-gray-600 text-sm">
                  Chưa có tài khoản?{" "}
                </ThemedText>
                <Link href="/(auth)/register">
                  <ThemedText className="text-blue-600 font-semibold underline text-sm">
                    Đăng ký ngay
                  </ThemedText>
                </Link>
              </View>
            </View>

            {/* Demo Info - Clean */}
            <View className="mt-6 bg-blue-50 border border-blue-200 rounded-2xl p-4">
              <ThemedText className="text-blue-900 text-sm font-medium text-center mb-1">
                Dùng tài khoản demo:
              </ThemedText>
              <ThemedText className="text-blue-700 text-xs text-center">
                Email: test@email.com | Mật khẩu: 123456
              </ThemedText>
            </View>
          </Animated.View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}