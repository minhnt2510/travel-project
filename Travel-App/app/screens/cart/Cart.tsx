import { ThemedText } from "@/ui-components/themed-text";
import { ThemedView } from "@/ui-components/themed-view";
import { IconSymbol } from "@/ui-components/ui/icon-symbol";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, ScrollView, TouchableOpacity, View } from "react-native";

interface CartItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  type: "tour" | "hotel";
}

const defaultCartItems: CartItem[] = [
  {
    id: "1",
    name: "Tour Đà Lạt 3N2Đ",
    image: "https://placekitten.com/200/200",
    price: 2500000,
    quantity: 2,
    type: "tour",
  },
  {
    id: "2",
    name: "Khách sạn Dalat Palace",
    image: "https://placekitten.com/201/201",
    price: 1800000,
    quantity: 1,
    type: "hotel",
  },
];

export default function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    loadCartItems();
  }, []);

  const loadCartItems = async () => {
    try {
      const storedItems = await AsyncStorage.getItem("cart_items");
      if (storedItems) {
        setCartItems(JSON.parse(storedItems));
      } else {
        setCartItems(defaultCartItems);
        await AsyncStorage.setItem("cart_items", JSON.stringify(defaultCartItems));
      }
    } catch (error) {
      console.error("Error loading cart items:", error);
      setCartItems(defaultCartItems);
    }
  };

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(itemId);
      return;
    }
    
    const updatedItems = cartItems.map(item =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedItems);
    await AsyncStorage.setItem("cart_items", JSON.stringify(updatedItems));
  };

  const removeItem = async (itemId: string) => {
    Alert.alert(
      "Xóa sản phẩm",
      "Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: async () => {
            const updatedItems = cartItems.filter(item => item.id !== itemId);
            setCartItems(updatedItems);
            await AsyncStorage.setItem("cart_items", JSON.stringify(updatedItems));
          },
        },
      ]
    );
  };

  const proceedToCheckout = () => {
    if (cartItems.length === 0) {
      Alert.alert("Giỏ hàng trống", "Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán");
      return;
    }
    router.push("/screens/cart/Checkout");
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <ThemedView className="flex-1">
      {/* Header */}
      <View className="p-4 border-b border-gray-200">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()}>
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
                  <TouchableOpacity 
                    className="w-8 h-8 bg-gray-100 rounded-full items-center justify-center"
                    onPress={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    <IconSymbol name="minus" size={16} color="#4B5563" />
                  </TouchableOpacity>
                  <ThemedText className="mx-4">{item.quantity}</ThemedText>
                  <TouchableOpacity 
                    className="w-8 h-8 bg-gray-100 rounded-full items-center justify-center"
                    onPress={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <IconSymbol name="plus" size={16} color="#4B5563" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Delete Button */}
              <TouchableOpacity 
                className="p-2"
                onPress={() => removeItem(item.id)}
              >
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
          onPress={proceedToCheckout}
        >
          <ThemedText className="text-white font-semibold text-lg">
            Tiến hành thanh toán
          </ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}
