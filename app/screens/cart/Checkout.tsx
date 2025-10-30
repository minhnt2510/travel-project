import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, router } from "expo-router";

import { ThemedText } from "@/ui-components/themed-text";
import { ThemedView } from "@/ui-components/themed-view";
import { IconSymbol } from "@/ui-components/ui/icon-symbol";
import { api } from "@/services/api";

interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  description: string;
}
interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  type: "tour" | "hotel";
}

const paymentMethods: PaymentMethod[] = [
  {
    id: "momo",
    name: "Ví MoMo",
    icon: "smartphone",
    description: "Thanh toán nhanh chóng và an toàn",
  },
  {
    id: "bank",
    name: "Chuyển khoản ngân hàng",
    icon: "credit-card",
    description: "Chuyển khoản qua ngân hàng",
  },
  {
    id: "cash",
    name: "Tiền mặt",
    icon: "dollar-sign",
    description: "Thanh toán khi nhận dịch vụ",
  },
];

export default function Checkout() {
  const { tripId } = useLocalSearchParams<{ tripId?: string | string[] }>();
  const normalizedTripId = Array.isArray(tripId) ? tripId[0] : tripId;

  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [contactInfo, setContactInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    loadOrderData();
  }, []);

  const loadOrderData = async () => {
    try {
      const cartData = await AsyncStorage.getItem("cart_items");
      if (cartData) {
        setOrderItems(JSON.parse(cartData));
      } else {
        // demo nếu chưa có giỏ hàng
        setOrderItems([
          {
            id: "1",
            name: "Tour Đà Lạt 3N2Đ",
            price: 2_500_000,
            quantity: 2,
            type: "tour",
          },
          {
            id: "2",
            name: "Khách sạn Dalat Palace",
            price: 1_800_000,
            quantity: 1,
            type: "hotel",
          },
        ]);
      }
    } catch (error) {
      console.error("Error loading order data:", error);
    }
  };

  const calculateTotal = () => {
    const subtotal = orderItems.reduce((s, i) => s + i.price * i.quantity, 0);
    const serviceFee = Math.round(subtotal * 0.02);
    return { subtotal, serviceFee, total: subtotal + serviceFee };
  };

  const validateForm = () => {
    if (!contactInfo.fullName.trim())
      return Alert.alert("Lỗi", "Vui lòng nhập họ và tên"), false;
    if (!contactInfo.email.trim())
      return Alert.alert("Lỗi", "Vui lòng nhập email"), false;
    if (!contactInfo.phone.trim())
      return Alert.alert("Lỗi", "Vui lòng nhập số điện thoại"), false;
    if (!selectedPaymentMethod)
      return Alert.alert("Lỗi", "Vui lòng chọn phương thức thanh toán"), false;
    return true;
  };

  const processPayment = async () => {
    if (!validateForm()) return;

    setIsProcessing(true);

    try {
      // Giả lập xử lý thanh toán 2s
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const totals = calculateTotal();

      // === TẠO TRIP ĐÃ XÁC NHẬN (confirmed) ===
      // Lấy item chính (nếu có nhiều thì lấy item đầu)
      const primary = orderItems[0];

      // Thời gian mặc định: hôm nay -> +3 ngày
      const today = new Date();
      const start = today.toISOString().split("T")[0];
      const end = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];

      // Ảnh placeholder (nếu bạn muốn truyền ảnh thật thì thêm imageUrl vào cart_items ở Wishlist)
      const PLACEHOLDER_IMG =
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800";

      await api.createTrip({
        destinationId: primary?.id || Date.now().toString(),
        destinationName: primary?.name || "Chuyến đi của bạn",
        destinationImage: PLACEHOLDER_IMG,
        startDate: start,
        endDate: end,
        travelers: 2,
        totalPrice: `${totals.total.toLocaleString()}đ`,
        status: "confirmed",
      });

      // Dọn giỏ hàng
      await AsyncStorage.removeItem("cart_items");

      // Nhảy thẳng sang tab Lịch sử và ép reload
      router.replace("/(tabs)/history?refresh=1");
    } catch (error) {
      console.error("Payment processing error:", error);
      Alert.alert("Thanh toán thất bại", "Vui lòng thử lại sau.");
    } finally {
      setIsProcessing(false);
    }
  };

  const totals = calculateTotal();

  return (
    <ThemedView className="flex-1">
      {/* Header */}
      <View className="p-4 border-b border-gray-200">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()}>
            <IconSymbol name="arrow-left" size={24} color="#000" />
          </TouchableOpacity>
          <ThemedText className="ml-4 text-xl font-bold">Thanh toán</ThemedText>
        </View>
      </View>

      <ScrollView className="flex-1 p-4">
        {/* Order Items */}
        <View className="bg-white p-4 rounded-lg shadow mb-6">
          <ThemedText className="text-lg font-bold mb-4">
            Chi tiết đơn hàng
          </ThemedText>
          {orderItems.map((item) => (
            <View
              key={item.id}
              className="flex-row justify-between items-center py-2 border-b border-gray-100"
            >
              <View className="flex-1">
                <ThemedText className="font-medium">{item.name}</ThemedText>
                <ThemedText className="text-gray-600 text-sm">
                  {item.type === "tour" ? "Tour" : "Khách sạn"} • SL:{" "}
                  {item.quantity}
                </ThemedText>
              </View>
              <ThemedText className="font-semibold">
                {(item.price * item.quantity).toLocaleString()}đ
              </ThemedText>
            </View>
          ))}
        </View>

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
                value={contactInfo.fullName}
                onChangeText={(text) =>
                  setContactInfo((p) => ({ ...p, fullName: text }))
                }
              />
            </View>
            <View>
              <ThemedText className="mb-2">Email</ThemedText>
              <TextInput
                className="border border-gray-200 rounded-lg p-3 bg-gray-50"
                placeholder="Nhập email"
                keyboardType="email-address"
                value={contactInfo.email}
                onChangeText={(text) =>
                  setContactInfo((p) => ({ ...p, email: text }))
                }
              />
            </View>
            <View>
              <ThemedText className="mb-2">Số điện thoại</ThemedText>
              <TextInput
                className="border border-gray-200 rounded-lg p-3 bg-gray-50"
                placeholder="Nhập số điện thoại"
                keyboardType="phone-pad"
                value={contactInfo.phone}
                onChangeText={(text) =>
                  setContactInfo((p) => ({ ...p, phone: text }))
                }
              />
            </View>
          </View>
        </View>

        {/* Payment Method */}
        <View className="bg-white p-4 rounded-lg shadow mb-6">
          <ThemedText className="text-lg font-bold mb-4">
            Phương thức thanh toán
          </ThemedText>
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              className={`flex-row items-center p-4 border rounded-lg mb-2 ${
                selectedPaymentMethod === method.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200"
              }`}
              onPress={() => setSelectedPaymentMethod(method.id)}
            >
              <IconSymbol
                name={method.icon}
                size={24}
                color={
                  selectedPaymentMethod === method.id ? "#3B82F6" : "#4B5563"
                }
              />
              <View className="flex-1 ml-3">
                <ThemedText
                  className={`font-medium ${
                    selectedPaymentMethod === method.id ? "text-blue-600" : ""
                  }`}
                >
                  {method.name}
                </ThemedText>
                <ThemedText className="text-gray-500 text-sm">
                  {method.description}
                </ThemedText>
              </View>
              {selectedPaymentMethod === method.id && (
                <IconSymbol name="check-circle" size={20} color="#3B82F6" />
              )}
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
              <ThemedText>{totals.subtotal.toLocaleString()}đ</ThemedText>
            </View>
            <View className="flex-row justify-between">
              <ThemedText className="text-gray-600">
                Phí dịch vụ (2%)
              </ThemedText>
              <ThemedText>{totals.serviceFee.toLocaleString()}đ</ThemedText>
            </View>
            <View className="flex-row justify-between pt-2 border-t border-gray-200 mt-2">
              <ThemedText className="font-bold">Tổng cộng</ThemedText>
              <ThemedText className="font-bold text-blue-600">
                {totals.total.toLocaleString()}đ
              </ThemedText>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Checkout Button */}
      <View className="p-4 border-t border-gray-200 bg-white">
        <TouchableOpacity
          className={`py-3 rounded-lg items-center ${
            isProcessing ? "bg-gray-400" : "bg-blue-600"
          }`}
          onPress={processPayment}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <View className="flex-row items-center">
              <ActivityIndicator color="white" size="small" />
              <ThemedText className="text-white font-semibold text-lg ml-2">
                Đang xử lý...
              </ThemedText>
            </View>
          ) : (
            <ThemedText className="text-white font-semibold text-lg">
              Xác nhận thanh toán
            </ThemedText>
          )}
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}
