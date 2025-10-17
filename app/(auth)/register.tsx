import { View, TextInput, TouchableOpacity, Image, Text } from "react-native";
import { Link, Stack } from "expo-router";

export default function RegisterScreen() {
  return (
    <View className="flex-1 bg-white">
      <Stack.Screen
        options={{
          title: "Đăng ký",
          headerShown: false,
        }}
      />

      <View className="flex-1 justify-center px-8">
        {/* Header */}
        <View className="items-center mb-8">
          <Text className="text-2xl font-bold text-blue-600">Travel App</Text>
        </View>

        {/* Form đăng ký */}
        <View className="space-y-4">
          <View className="space-y-2">
            <Text className="text-gray-700 text-base">Họ và tên</Text>
            <TextInput
              className="w-full h-12 px-4 border border-gray-300 rounded-lg bg-gray-50"
              placeholder="Nhập họ và tên của bạn"
            />
          </View>

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

          <View className="space-y-2">
            <Text className="text-gray-700 text-base">Xác nhận mật khẩu</Text>
            <TextInput
              className="w-full h-12 px-4 border border-gray-300 rounded-lg bg-gray-50"
              placeholder="Nhập lại mật khẩu"
              secureTextEntry
            />
          </View>

          <TouchableOpacity className="w-full h-12 bg-blue-600 rounded-lg items-center justify-center">
            <Text className="text-white font-semibold text-base">Đăng ký</Text>
          </TouchableOpacity>

          <View className="flex-row justify-center space-x-1">
            <Text className="text-gray-600">Đã có tài khoản?</Text>
            <TouchableOpacity>
              <Link href="/(auth)/login">
                <Text className="text-blue-600 font-semibold">Đăng nhập</Text>
              </Link>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
