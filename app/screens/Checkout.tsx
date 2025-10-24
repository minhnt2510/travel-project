import { ThemedText } from "@/ui-components/themed-text";
import { ThemedView } from "@/ui-components/themed-view";
import { IconSymbol } from "@/ui-components/ui/icon-symbol";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, TextInput, TouchableOpacity, View } from "react-native";

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
    icon: "wallet",
    description: "Thanh toán nhanh chóng và an toàn"
  },
  {
    id: "bank",
    name: "Chuyển khoản ngân hàng",
    icon: "credit-card",
    description: "Chuyển khoản qua ngân hàng"
  },
  {
    id: "cash",
    name: "Tiền mặt",
    icon: "dollar-sign",
    description: "Thanh toán khi nhận dịch vụ"
  },
];

export default function Checkout() {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("");
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
      // Load cart items from storage
      const cartData = await AsyncStorage.getItem("cart_items");
      if (cartData) {
        setOrderItems(JSON.parse(cartData));
      } else {
        // Default demo data
        setOrderItems([
          {
            id: "1",
            name: "Tour Đà Lạt 3N2Đ",
            price: 2500000,
            quantity: 2,
            type: "tour"
          },
          {
            id: "2",
            name: "Khách sạn Dalat Palace",
            price: 1800000,
            quantity: 1,
            type: "hotel"
          }
        ]);
      }
    } catch (error) {
      console.error("Error loading order data:", error);
    }
  };

  const calculateTotal = () => {
    const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const serviceFee = Math.round(subtotal * 0.02); // 2% service fee
    return {
      subtotal,
      serviceFee,
      total: subtotal + serviceFee
    };
  };

  const validateForm = () => {
    if (!contactInfo.fullName.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập họ và tên");
      return false;
    }
    if (!contactInfo.email.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập email");
      return false;
    }
    if (!contactInfo.phone.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập số điện thoại");
      return false;
    }
    if (!selectedPaymentMethod) {
      Alert.alert("Lỗi", "Vui lòng chọn phương thức thanh toán");
      return false;
    }
    return true;
  };

  const processPayment = async () => {
    if (!validateForm()) return;

    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate order number
      const orderNumber = `DH${Date.now()}`;
      const totals = calculateTotal();
      
      // Save order to storage
      const orderData = {
        orderNumber,
        items: orderItems,
        contactInfo,
        paymentMethod: selectedPaymentMethod,
        totals,
        status: "completed",
        createdAt: new Date().toISOString()
      };
      
      await AsyncStorage.setItem(`order_${orderNumber}`, JSON.stringify(orderData));
      
      // Clear cart
      await AsyncStorage.removeItem("cart_items");
      
      // Navigate to payment result
      router.push({
        pathname: "/screens/PaymentResult",
        params: {
          status: "success",
          orderNumber,
          amount: totals.total
        }
      });
      
    } catch (error) {
      console.error("Payment processing error:", error);
      router.push({
        pathname: "/screens/PaymentResult",
        params: {
          status: "failure",
          orderNumber: `DH${Date.now()}`,
          amount: calculateTotal().total
        }
      });
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
            <View key={item.id} className="flex-row justify-between items-center py-2 border-b border-gray-100">
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
                onChangeText={(text) => setContactInfo(prev => ({ ...prev, fullName: text }))}
              />
            </View>
            <View>
              <ThemedText className="mb-2">Email</ThemedText>
              <TextInput
                className="border border-gray-200 rounded-lg p-3 bg-gray-50"
                placeholder="Nhập email"
                keyboardType="email-address"
                value={contactInfo.email}
                onChangeText={(text) => setContactInfo(prev => ({ ...prev, email: text }))}
              />
            </View>
            <View>
              <ThemedText className="mb-2">Số điện thoại</ThemedText>
              <TextInput
                className="border border-gray-200 rounded-lg p-3 bg-gray-50"
                placeholder="Nhập số điện thoại"
                keyboardType="phone-pad"
                value={contactInfo.phone}
                onChangeText={(text) => setContactInfo(prev => ({ ...prev, phone: text }))}
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
                color={selectedPaymentMethod === method.id ? "#3B82F6" : "#4B5563"} 
              />
              <View className="flex-1 ml-3">
                <ThemedText className={`font-medium ${
                  selectedPaymentMethod === method.id ? "text-blue-600" : ""
                }`}>
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
              <ThemedText className="text-gray-600">Phí dịch vụ (2%)</ThemedText>
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
