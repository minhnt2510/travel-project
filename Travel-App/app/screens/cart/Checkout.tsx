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
import { useUser } from "@/app/_layout";

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
  const { user } = useUser();

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
    loadUserInfo();
    loadSavedPaymentMethod();
  }, [user]);

  const loadUserInfo = async () => {
    try {
      // Load user info from context first
      if (user) {
        setContactInfo({
          fullName: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
        });
      } else {
        // If not in context, try to get from API
        const userData = await api.getUser();
        setContactInfo({
          fullName: userData.name || "",
          email: userData.email || "",
          phone: userData.phone || "",
        });
      }
    } catch (error) {
      console.error("Error loading user info:", error);
      // Keep empty if can't load
    }
  };

  const loadOrderData = async () => {
    try {
      // If tripId is provided, load booking data instead of cart
      if (normalizedTripId) {
        try {
          // Check if user is logged in first
          if (!user) {
            Alert.alert(
              "Cần đăng nhập",
              "Vui lòng đăng nhập để thanh toán chuyến đi",
              [
                { text: "Hủy", style: "cancel", onPress: () => router.back() },
                {
                  text: "Đăng nhập",
                  onPress: () => router.push("/(auth)/login"),
                },
              ]
            );
            return;
          }

          const booking = await api.getBookingById(normalizedTripId);
          
          // Convert booking to orderItem format
          const tripPrice = typeof booking.totalPrice === "string" 
            ? parseFloat(booking.totalPrice.replace(/[^\d.]/g, "")) 
            : (typeof booking.totalPrice === "number" ? booking.totalPrice : 0);
          
          const destinationName = booking.tourId && typeof booking.tourId === "object"
            ? (booking.tourId as any).title || "Tour"
            : "Tour đã đặt";
          
          setOrderItems([
            {
              id: booking._id,
              name: destinationName,
              price: tripPrice,
              quantity: booking.quantity || 1,
              type: "tour" as const,
            },
          ]);
          return;
        } catch (error: any) {
          // Handle Forbidden error - try fallback from bookings list
          if (error.message?.includes("Forbidden") || error.message?.includes("403")) {
            try {
              // Try to get booking from user's bookings list (which they have access to)
              const bookings = await api.getBookings();
              const matchingBooking = bookings.find((b) => b._id === normalizedTripId);
              
              if (matchingBooking) {
                // Fallback successful - use it silently (no error log)
                
                // Convert booking to orderItem format
                const tripPrice = typeof matchingBooking.totalPrice === "string" 
                  ? parseFloat(matchingBooking.totalPrice.replace(/[^\d.]/g, "")) 
                  : (typeof matchingBooking.totalPrice === "number" ? matchingBooking.totalPrice : 0);
                
                const destinationName = matchingBooking.tourId && typeof matchingBooking.tourId === "object"
                  ? (matchingBooking.tourId as any).title || "Tour"
                  : "Tour đã đặt";
                
                setOrderItems([
                  {
                    id: matchingBooking._id,
                    name: destinationName,
                    price: tripPrice,
                    quantity: matchingBooking.quantity || 1,
                    type: "tour" as const,
                  },
                ]);
                return;
              }
            } catch (fallbackError) {
              // Only log if fallback also fails
              console.error("Error in fallback:", fallbackError);
            }
            
            // If fallback fails, then log error
            console.error("Error loading booking (fallback failed):", error);
            
            // If fallback also fails, show error
            Alert.alert(
              "Lỗi truy cập",
              "Bạn không có quyền xem chuyến đi này. Vui lòng đăng nhập lại.",
              [
                { text: "Hủy", style: "cancel", onPress: () => router.back() },
                {
                  text: "Đăng nhập",
                  onPress: () => router.push("/(auth)/login"),
                },
              ]
            );
            router.back();
            return;
          } else {
            Alert.alert("Lỗi", "Không thể tải thông tin chuyến đi. Vui lòng thử lại.");
            router.back();
            return;
          }
        }
      }
      
      // Otherwise, load from cart (original flow)
      const cartData = await AsyncStorage.getItem("cart_items");
      if (cartData) {
        const items = JSON.parse(cartData);
        if (Array.isArray(items) && items.length > 0) {
          setOrderItems(items);
        } else {
          // No items in cart
          Alert.alert("Thông báo", "Giỏ hàng của bạn đang trống");
          router.back();
        }
      } else {
        // No cart data
        Alert.alert("Thông báo", "Giỏ hàng của bạn đang trống");
        router.back();
      }
    } catch (error) {
      console.error("Error loading order data:", error);
      Alert.alert("Lỗi", "Không thể tải dữ liệu");
      router.back();
    }
  };

  const loadSavedPaymentMethod = async () => {
    try {
      const saved = await AsyncStorage.getItem("default_payment_method");
      if (saved) {
        setSelectedPaymentMethod(saved);
      }
    } catch (error) {
      console.error("Error loading saved payment method:", error);
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

      // If paying for an existing trip (from bookings tab)
      if (normalizedTripId) {
        // Update booking status to confirmed
        // Note: The backend should have an endpoint to confirm payment
        // For now, we'll just show success and refresh
        Alert.alert(
          "Thanh toán thành công",
          "Chuyến đi của bạn đã được xác nhận thanh toán!"
        );
        
        // Go back to bookings tab
        router.replace("/(tabs)/bookings");
        return;
      }

      // Otherwise, create new trip from cart (original flow)
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
