import { View, ScrollView, TouchableOpacity, TextInput } from "react-native";
import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";

export default function Checkout() {
  return (
    <ThemedView className="flex-1">
      {/* Header */}
      <View className="p-4 border-b border-gray-200">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => {}}>
            <IconSymbol name="arrow-left" size={24} color="#000" />
          </TouchableOpacity>
          <ThemedText className="ml-4 text-xl font-bold">Thanh toán</ThemedText>
        </View>
      </View>

      <ScrollView className="flex-1 p-4">
        {/* Contact Information */}
        <View className="bg-white p-4 rounded-lg shadow mb-6">
          <ThemedText className="text-lg font-bold mb-4">
            Thông tin liên hệ
          </ThemedText>
          <View className="space-y-4">
            <View>
              <ThemedText className="mb-2">Họ và tên</ThemedText>
              <TextInput
                className="border border-gray-200 rounded-lg p-3 bg-gray-50"
                placeholder="Nhập họ và tên"
              />
            </View>
            <View>
              <ThemedText className="mb-2">Email</ThemedText>
              <TextInput
                className="border border-gray-200 rounded-lg p-3 bg-gray-50"
                placeholder="Nhập email"
                keyboardType="email-address"
              />
            </View>
            <View>
              <ThemedText className="mb-2">Số điện thoại</ThemedText>
              <TextInput
                className="border border-gray-200 rounded-lg p-3 bg-gray-50"
                placeholder="Nhập số điện thoại"
                keyboardType="phone-pad"
              />
            </View>
          </View>
        </View>

        {/* Payment Method */}
        <View className="bg-white p-4 rounded-lg shadow mb-6">
          <ThemedText className="text-lg font-bold mb-4">
            Phương thức thanh toán
          </ThemedText>
          {[
            { id: "momo", name: "Ví MoMo", icon: "wallet" },
            { id: "bank", name: "Chuyển khoản ngân hàng", icon: "credit-card" },
            { id: "cash", name: "Tiền mặt", icon: "dollar-sign" },
          ].map((method) => (
            <TouchableOpacity
              key={method.id}
              className="flex-row items-center p-4 border border-gray-200 rounded-lg mb-2"
            >
              <IconSymbol name={method.icon} size={24} color="#4B5563" />
              <ThemedText className="ml-3">{method.name}</ThemedText>
            </TouchableOpacity>
          ))}
        </View>

        {/* Order Summary */}
        <View className="bg-white p-4 rounded-lg shadow">
          <ThemedText className="text-lg font-bold mb-4">
            Tổng quan đơn hàng
          </ThemedText>
          <View className="space-y-2">
            <View className="flex-row justify-between">
              <ThemedText className="text-gray-600">Tổng tiền hàng</ThemedText>
              <ThemedText>4,300,000đ</ThemedText>
            </View>
            <View className="flex-row justify-between">
              <ThemedText className="text-gray-600">Phí dịch vụ</ThemedText>
              <ThemedText>50,000đ</ThemedText>
            </View>
            <View className="flex-row justify-between pt-2 border-t border-gray-200 mt-2">
              <ThemedText className="font-bold">Tổng cộng</ThemedText>
              <ThemedText className="font-bold text-blue-600">
                4,350,000đ
              </ThemedText>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Checkout Button */}
      <View className="p-4 border-t border-gray-200 bg-white">
        <TouchableOpacity
          className="bg-blue-600 py-3 rounded-lg items-center"
          onPress={() => {}}
        >
          <ThemedText className="text-white font-semibold text-lg">
            Xác nhận thanh toán
          </ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}
