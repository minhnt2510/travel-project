import { View, ScrollView, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { ThemedView } from "@/ui-components/themed-view";
import { ThemedText } from "@/ui-components/themed-text";
import { IconSymbol } from "@/ui-components/ui/icon-symbol";

interface CartItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

const cartItems: CartItem[] = [
  {
    id: "1",
    name: "Tour Đà Lạt 3N2Đ",
    image: "https://placekitten.com/200/200",
    price: 2500000,
    quantity: 2,
  },
  {
    id: "2",
    name: "Khách sạn Dalat Palace",
    image: "https://placekitten.com/201/201",
    price: 1800000,
    quantity: 1,
  },
];

export default function Cart() {
  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <ThemedView className="flex-1">
      {/* Header */}
      <View className="p-4 border-b border-gray-200">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => {}}>
            <IconSymbol name="arrow-left" size={24} color="#000" />
          </TouchableOpacity>
          <ThemedText className="ml-4 text-xl font-bold">
            Giỏ hàng ({cartItems.length})
          </ThemedText>
        </View>
      </View>

      <ScrollView className="flex-1">
        {/* Cart Items */}
        <View className="p-4">
          {cartItems.map((item) => (
            <View
              key={item.id}
              className="flex-row bg-white p-4 rounded-lg shadow mb-4"
            >
              <Image
                source={{ uri: item.image }}
                className="w-24 h-24 rounded-lg"
                contentFit="cover"
              />
              <View className="flex-1 ml-4">
                <ThemedText className="font-semibold">{item.name}</ThemedText>
                <ThemedText className="text-blue-600 mt-1">
                  {item.price.toLocaleString()}đ
                </ThemedText>

                {/* Quantity Controls */}
                <View className="flex-row items-center mt-2">
                  <TouchableOpacity className="w-8 h-8 bg-gray-100 rounded-full items-center justify-center">
                    <IconSymbol name="minus" size={16} color="#4B5563" />
                  </TouchableOpacity>
                  <ThemedText className="mx-4">{item.quantity}</ThemedText>
                  <TouchableOpacity className="w-8 h-8 bg-gray-100 rounded-full items-center justify-center">
                    <IconSymbol name="plus" size={16} color="#4B5563" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Delete Button */}
              <TouchableOpacity className="p-2">
                <IconSymbol name="trash-2" size={20} color="#EF4444" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Summary and Checkout */}
      <View className="p-4 border-t border-gray-200 bg-white">
        <View className="flex-row justify-between mb-4">
          <ThemedText className="text-gray-600">Tổng tiền:</ThemedText>
          <ThemedText className="text-xl font-bold">
            {total.toLocaleString()}đ
          </ThemedText>
        </View>

        <TouchableOpacity
          className="bg-blue-600 py-3 rounded-lg items-center"
          onPress={() => {}}
        >
          <ThemedText className="text-white font-semibold text-lg">
            Tiến hành thanh toán
          </ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}
