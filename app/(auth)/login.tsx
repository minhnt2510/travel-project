import { View, TextInput, TouchableOpacity, Image, Text } from "react-native";
import { Link, Stack } from "expo-router";

export default function LoginScreen() {
  return (
    <View className="flex-1 bg-white">
      <Stack.Screen
        options={{
          title: "Đăng nhập",
          headerShown: false,
        }}
      />

      <View className="flex-1 justify-center px-8">
        {/* Header */}
        <View className="items-center mb-8">
          <Text className="text-2xl font-bold text-blue-600">Travel App</Text>
        </View>

        {/* Form đăng nhập */}
        <View className="space-y-4">
          <View className="space-y-2">
            <Text className="text-gray-700 text-base">Email</Text>
            <TextInput
              className="w-full h-12 px-4 border border-gray-300 rounded-lg bg-gray-50"
              placeholder="Nhập email của bạn"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View className="space-y-2">
            <Text className="text-gray-700 text-base">Mật khẩu</Text>
            <TextInput
              className="w-full h-12 px-4 border border-gray-300 rounded-lg bg-gray-50"
              placeholder="Nhập mật khẩu"
              secureTextEntry
            />
          </View>

          <TouchableOpacity className="items-end">
            <Text className="text-blue-600">Quên mật khẩu?</Text>
          </TouchableOpacity>

          <TouchableOpacity className="w-full h-12 bg-blue-600 rounded-lg items-center justify-center">
            <Text className="text-white font-semibold text-base">
              Đăng nhập
            </Text>
          </TouchableOpacity>

          <View className="flex-row justify-center space-x-1">
            <Text className="text-gray-600">Chưa có tài khoản?</Text>
            <TouchableOpacity>
              <Link href="/(auth)/register">
                <Text className="text-blue-600 font-semibold">
                  Đăng ký ngay
                </Text>
              </Link>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
