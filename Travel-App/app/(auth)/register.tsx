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

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateForm = () => {
    if (!name.trim())
      return Alert.alert("Lỗi", "Vui lòng nhập họ và tên"), false;
    if (!email.trim()) return Alert.alert("Lỗi", "Vui lòng nhập email"), false;
    if (!/\S+@\S+\.\S+/.test(email))
      return Alert.alert("Lỗi", "Email không hợp lệ"), false;
    if (password.length < 6)
      return Alert.alert("Lỗi", "Mật khẩu phải có ít nhất 6 ký tự"), false;
    if (password !== confirmPassword)
      return Alert.alert("Lỗi", "Mật khẩu xác nhận không khớp"), false;
    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const result = await api.register({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      if (result.success && result.user) {
        Alert.alert("Thành công", "Đăng ký thành công! Vui lòng đăng nhập.", [
          { text: "OK", onPress: () => router.replace("/(auth)/login") },
        ]);
      } else {
        Alert.alert("Lỗi", result.message || "Đăng ký thất bại");
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
        colors={["#ec4899", "#f97316", "#fbbf24"]}
        className="absolute inset-0"
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            className="flex-1"
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "center",
              paddingVertical: 20,
            }}
            keyboardShouldPersistTaps="handled"
          >
            <View className="px-6 w-full max-w-md mx-auto">
              {/* Logo & Title */}
              <View className="items-center mb-8">
                <View className="bg-white rounded-3xl p-6 shadow-2xl mb-4">
                  <IconSymbol name="user-plus" size={64} color="#ec4899" />
                </View>
                <ThemedText className="text-gray-700 text-4xl font-extrabold mb-2">
                  Đăng ký
                </ThemedText>
                <ThemedText className="text-pink-600 text-lg font-medium">
                  Tạo tài khoản để bắt đầu hành trình
                </ThemedText>
              </View>

              {/* Register Card */}
              <View className="bg-white rounded-3xl p-7 shadow-2xl">
                {/* Name Field */}
                <View className="mb-4">
                  <View className="flex-row items-center bg-gray-50 rounded-2xl px-5 h-14 border-2 border-gray-200">
                    <IconSymbol name="user" size={20} color="#ec4899" />
                    <TextInput
                      className="flex-1 ml-3 text-gray-900 font-semibold text-base"
                      placeholder="Họ và tên"
                      placeholderTextColor="#9ca3af"
                      value={name}
                      onChangeText={setName}
                    />
                  </View>
                </View>

                {/* Email Field */}
                <View className="mb-4">
                  <View className="flex-row items-center bg-gray-50 rounded-2xl px-5 h-14 border-2 border-gray-200">
                    <IconSymbol name="mail" size={20} color="#ec4899" />
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
                    <IconSymbol name="lock" size={20} color="#ec4899" />
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
                        color="#ec4899"
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Confirm Password Field */}
                <View className="mb-6">
                  <View className="flex-row items-center bg-gray-50 rounded-2xl px-5 h-14 border-2 border-gray-200">
                    <IconSymbol name="lock" size={20} color="#ec4899" />
                    <TextInput
                      className="flex-1 ml-3 text-gray-900 font-semibold text-base"
                      placeholder="Xác nhận mật khẩu"
                      placeholderTextColor="#9ca3af"
                      secureTextEntry={!showConfirmPassword}
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                    />
                    <TouchableOpacity
                      onPress={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="ml-2"
                    >
                      <IconSymbol
                        name={showConfirmPassword ? "eye-off" : "eye"}
                        size={20}
                        color="#ec4899"
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Register Button */}
                <TouchableOpacity
                  onPress={handleRegister}
                  disabled={isLoading}
                  activeOpacity={0.9}
                  className="rounded-2xl overflow-hidden shadow-lg"
                >
                  <LinearGradient
                    colors={["#ec4899", "#f97316"]}
                    className="h-14 justify-center items-center"
                  >
                    {isLoading ? (
                      <ActivityIndicator size="small" color="white" />
                    ) : (
                      <ThemedText className="text-white font-extrabold text-lg">
                        Đăng ký
                      </ThemedText>
                    )}
                  </LinearGradient>
                </TouchableOpacity>

                {/* Login Link */}
                <View className="flex-row justify-center mt-6">
                  <ThemedText className="text-gray-600 text-sm">
                    Đã có tài khoản?{" "}
                  </ThemedText>
                  <Link href="/(auth)/login">
                    <ThemedText className="text-pink-600 font-extrabold text-sm">
                      Đăng nhập
                    </ThemedText>
                  </Link>
                </View>
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}
