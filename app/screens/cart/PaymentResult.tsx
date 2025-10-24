import { ThemedText } from "@/ui-components/themed-text";
import { ThemedView } from "@/ui-components/themed-view";
import { IconSymbol } from "@/ui-components/ui/icon-symbol";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";

interface OrderData {
  orderNumber: string;
  items: any[];
  contactInfo: any;
  paymentMethod: string;
  totals: any;
  status: string;
  createdAt: string;
}

export default function PaymentResult() {
  const params = useLocalSearchParams();
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  
  const status = params.status as "success" | "failure" || "success";
  const orderNumber = params.orderNumber as string || "DH123456789";
  const amount = parseInt(params.amount as string) || 4350000;

  useEffect(() => {
    loadOrderData();
  }, [orderNumber]);

  const loadOrderData = async () => {
    try {
      const order = await AsyncStorage.getItem(`order_${orderNumber}`);
      if (order) {
        setOrderData(JSON.parse(order));
      }
    } catch (error) {
      console.error("Error loading order data:", error);
    }
  };
  return (
    <ThemedView className="flex-1">
      <View className="flex-1 items-center justify-center p-4">
        {/* Status Icon */}
        <View
          className={`w-20 h-20 rounded-full items-center justify-center mb-6 ${
            status === "success" ? "bg-green-100" : "bg-red-100"
          }`}
        >
          <IconSymbol
            name={status === "success" ? "check-circle" : "x-circle"}
            size={40}
            color={status === "success" ? "#10B981" : "#EF4444"}
          />
        </View>

        {/* Status Message */}
        <ThemedText className="text-2xl font-bold mb-2">
          {status === "success"
            ? "Thanh toán thành công!"
            : "Thanh toán thất bại!"}
        </ThemedText>
        <ThemedText className="text-gray-600 mb-6 text-center">
          {status === "success"
            ? "Cảm ơn bạn đã đặt dịch vụ. Chúng tôi sẽ xử lý đơn hàng của bạn ngay lập tức."
            : "Đã xảy ra lỗi trong quá trình thanh toán. Vui lòng thử lại sau."}
        </ThemedText>

        {/* Order Details */}
        <View className="w-full bg-white p-6 rounded-lg shadow mb-6">
          <View className="flex-row justify-between mb-4">
            <ThemedText className="text-gray-600">Mã đơn hàng:</ThemedText>
            <ThemedText className="font-semibold">{orderNumber}</ThemedText>
          </View>
          <View className="flex-row justify-between">
            <ThemedText className="text-gray-600">Số tiền:</ThemedText>
            <ThemedText className="font-semibold text-blue-600">
              {amount.toLocaleString()}đ
            </ThemedText>
          </View>
        </View>

        {/* Order Details */}
        {orderData && (
          <View className="w-full bg-white p-4 rounded-lg shadow mb-6">
            <ThemedText className="text-lg font-bold mb-4">Chi tiết đơn hàng</ThemedText>
            {orderData.items.map((item, index) => (
              <View key={index} className="flex-row justify-between py-2 border-b border-gray-100">
                <View className="flex-1">
                  <ThemedText className="font-medium">{item.name}</ThemedText>
                  <ThemedText className="text-gray-600 text-sm">
                    {item.type === "tour" ? "Tour" : "Khách sạn"} • SL: {item.quantity}
                  </ThemedText>
                </View>
                <ThemedText className="font-semibold">
                  {(item.price * item.quantity).toLocaleString()}đ
                </ThemedText>
              </View>
            ))}
            <View className="flex-row justify-between pt-2 mt-2">
              <ThemedText className="font-bold">Tổng cộng:</ThemedText>
              <ThemedText className="font-bold text-blue-600">
                {orderData.totals.total.toLocaleString()}đ
              </ThemedText>
            </View>
          </View>
        )}

        {/* Action Buttons */}
        <View className="w-full space-y-4">
          {status === "success" ? (
            <>
              <TouchableOpacity
                className="bg-blue-600 py-3 px-6 rounded-lg items-center"
                onPress={() => router.push("/(tabs)/bookings")}
              >
                <ThemedText className="text-white font-semibold">
                  Xem đơn hàng của tôi
                </ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                className="py-3 px-6 rounded-lg items-center"
                onPress={() => router.push("/")}
              >
                <ThemedText className="text-blue-600">
                  Trở về trang chủ
                </ThemedText>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                className="bg-blue-600 py-3 px-6 rounded-lg items-center"
                onPress={() => router.push("/screens/Checkout")}
              >
                <ThemedText className="text-white font-semibold">
                  Thử lại
                </ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                className="py-3 px-6 rounded-lg items-center"
                onPress={() => router.push("/screens/Chat")}
              >
                <ThemedText className="text-blue-600">
                  Liên hệ hỗ trợ
                </ThemedText>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </ThemedView>
  );
}
