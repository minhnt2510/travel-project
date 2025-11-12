import { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
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

interface BookingFlowProps {
  tourId: string;
  tourTitle: string;
  selectedSlot: {
    id: string;
    time: string;
    price: number;
  };
  selectedPickupPoint?: {
    id: string;
    name: string;
    address: string;
    coordinates: { latitude: number; longitude: number };
  };
  selectedAddOns: string[];
  basePrice: number;
  addOnsTotal: number;
  onClose: () => void;
}

export default function BookingFlow({
  tourId,
  tourTitle,
  selectedSlot,
  selectedPickupPoint,
  selectedAddOns,
  basePrice,
  addOnsTotal,
  onClose,
}: BookingFlowProps) {
  const { user } = useUser();
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("");
  const [contactInfo, setContactInfo] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  // Load saved payment method on mount
  useEffect(() => {
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
    loadSavedPaymentMethod();
  }, []);

  const calculateTotal = () => {
    const adultPrice = basePrice * adults;
    const childrenPrice = basePrice * 0.7 * children; // Trẻ em giảm 30%
    const serviceFee = (adultPrice + childrenPrice + addOnsTotal) * 0.02; // 2% phí dịch vụ
    const total = adultPrice + childrenPrice + addOnsTotal + serviceFee;
    return {
      adultPrice,
      childrenPrice,
      addOnsTotal,
      serviceFee,
      total,
    };
  };

  const handleConfirmBooking = async () => {
    // Check if user is logged in
    if (!user) {
      Alert.alert(
        "Cần đăng nhập",
        "Vui lòng đăng nhập để đặt tour",
        [
          { text: "Hủy", style: "cancel" },
          {
            text: "Đăng nhập",
            onPress: () => {
              onClose();
              router.push("/(auth)/login");
            },
          },
        ]
      );
      return;
    }

    if (!contactInfo.fullName || !contactInfo.email || !contactInfo.phone) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin liên hệ");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactInfo.email)) {
      Alert.alert("Lỗi", "Email không hợp lệ");
      return;
    }

    // Validate phone format (at least 10 digits)
    const phoneRegex = /^[0-9]{10,}$/;
    if (!phoneRegex.test(contactInfo.phone.replace(/\s/g, ""))) {
      Alert.alert("Lỗi", "Số điện thoại không hợp lệ (tối thiểu 10 số)");
      return;
    }

    if (adults + children === 0) {
      Alert.alert("Lỗi", "Vui lòng chọn ít nhất 1 người");
      return;
    }

    if (!selectedPaymentMethod) {
      Alert.alert("Lỗi", "Vui lòng chọn phương thức thanh toán");
      return;
    }

    setIsProcessing(true);
    try {
      const totals = calculateTotal();
      const totalTravelers = adults + children;

      // Step 1: Process payment (simulate 2s delay)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Step 2: Create travelers array
      const travelers = [];
      for (let i = 0; i < adults; i++) {
        travelers.push({ name: `Người lớn ${i + 1}`, age: 25 });
      }
      for (let i = 0; i < children; i++) {
        travelers.push({ name: `Trẻ em ${i + 1}`, age: 10 });
      }

      // Step 3: Create booking with "confirmed" status (payment already processed)
      const bookingData = {
        tourId: tourId,
        quantity: totalTravelers,
        travelDate: selectedSlot.time.includes("T") 
          ? selectedSlot.time.split("T")[0] 
          : new Date().toISOString().split("T")[0],
        travelers: travelers,
        contactInfo: {
          fullName: contactInfo.fullName,
          phone: contactInfo.phone,
          email: contactInfo.email,
        },
        specialRequests: `Slot: ${selectedSlot.time}, Điểm đón: ${selectedPickupPoint?.name || "Không"}, Thanh toán: ${paymentMethods.find(p => p.id === selectedPaymentMethod)?.name || selectedPaymentMethod}`,
      };

      await api.createBooking(bookingData);

      // Save payment method as default
      try {
        await AsyncStorage.setItem("default_payment_method", selectedPaymentMethod);
      } catch (error) {
        console.error("Error saving payment method:", error);
      }

      Alert.alert(
        "Đặt tour thành công!",
        `Tour "${tourTitle}" đã được đặt và thanh toán thành công.\nPhương thức: ${paymentMethods.find(p => p.id === selectedPaymentMethod)?.name}\nThời gian: ${selectedSlot.time}\nTổng tiền: ${totals.total.toLocaleString()}₫`,
        [
          {
            text: "Xem chuyến đi",
            onPress: () => {
              onClose();
              router.push("/(tabs)/bookings");
            },
          },
          { text: "Tiếp tục", onPress: onClose },
        ]
      );
    } catch (error: any) {
      console.error("Booking error:", error);
      
      // Handle specific error cases
      let errorMessage = "Không thể đặt tour. Vui lòng thử lại.";
      
      if (error.message?.includes("Forbidden") || error.message?.includes("403")) {
        errorMessage = "Bạn không có quyền thực hiện thao tác này. Vui lòng đăng nhập lại.";
      } else if (error.message?.includes("Not enough seats")) {
        errorMessage = "Không còn đủ chỗ cho tour này. Vui lòng chọn tour khác.";
      } else if (error.message?.includes("Tour not found")) {
        errorMessage = "Tour không tồn tại. Vui lòng thử lại.";
      } else if (error.message?.includes("Invalid email")) {
        errorMessage = "Email không hợp lệ. Vui lòng kiểm tra lại.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert("Lỗi", errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const totals = calculateTotal();

  return (
    <ThemedView className="flex-1">
      {/* Header */}
      <View className="p-4 border-b border-gray-200 bg-white flex-row items-center justify-between">
        <TouchableOpacity onPress={onClose}>
          <IconSymbol name="x" size={24} color="#000" />
        </TouchableOpacity>
        <ThemedText className="text-xl font-bold">Đặt tour</ThemedText>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView className="flex-1 p-4">
        {/* Tour Info */}
        <View className="bg-white rounded-xl p-4 mb-4 shadow-sm border border-gray-200">
          <ThemedText className="text-lg font-bold mb-2">{tourTitle}</ThemedText>
          <View className="flex-row items-center">
            <IconSymbol name="clock" size={16} color="#6b7280" />
            <ThemedText className="ml-2 text-gray-600 text-sm">
              {selectedSlot.time}
            </ThemedText>
          </View>
          {selectedPickupPoint && (
            <View className="flex-row items-center mt-2">
              <IconSymbol name="map-pin" size={16} color="#6b7280" />
              <ThemedText className="ml-2 text-gray-600 text-sm">
                {selectedPickupPoint.name}
              </ThemedText>
            </View>
          )}
        </View>

        {/* Number of People */}
        <View className="bg-white rounded-xl p-4 mb-4 shadow-sm border border-gray-200">
          <ThemedText className="text-lg font-bold mb-4">Số lượng khách</ThemedText>

          {/* Adults */}
          <View className="flex-row items-center justify-between mb-4">
            <View>
              <ThemedText className="font-semibold text-gray-900">Người lớn</ThemedText>
              <ThemedText className="text-sm text-gray-500">Từ 12 tuổi trở lên</ThemedText>
            </View>
            <View className="flex-row items-center">
              <TouchableOpacity
                onPress={() => setAdults(Math.max(1, adults - 1))}
                className="w-10 h-10 rounded-lg border border-gray-200 items-center justify-center"
              >
                <IconSymbol name="minus" size={20} color="#6b7280" />
              </TouchableOpacity>
              <ThemedText className="mx-4 text-xl font-bold w-12 text-center">
                {adults}
              </ThemedText>
              <TouchableOpacity
                onPress={() => setAdults(adults + 1)}
                className="w-10 h-10 rounded-lg border border-gray-200 items-center justify-center"
              >
                <IconSymbol name="plus" size={20} color="#6b7280" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Children */}
          <View className="flex-row items-center justify-between">
            <View>
              <ThemedText className="font-semibold text-gray-900">Trẻ em</ThemedText>
              <ThemedText className="text-sm text-gray-500">Dưới 12 tuổi (Giảm 30%)</ThemedText>
            </View>
            <View className="flex-row items-center">
              <TouchableOpacity
                onPress={() => setChildren(Math.max(0, children - 1))}
                className="w-10 h-10 rounded-lg border border-gray-200 items-center justify-center"
              >
                <IconSymbol name="minus" size={20} color="#6b7280" />
              </TouchableOpacity>
              <ThemedText className="mx-4 text-xl font-bold w-12 text-center">
                {children}
              </ThemedText>
              <TouchableOpacity
                onPress={() => setChildren(children + 1)}
                className="w-10 h-10 rounded-lg border border-gray-200 items-center justify-center"
              >
                <IconSymbol name="plus" size={20} color="#6b7280" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Contact Information */}
        <View className="bg-white rounded-xl p-4 mb-4 shadow-sm border border-gray-200">
          <ThemedText className="text-lg font-bold mb-4">Thông tin liên hệ</ThemedText>

          <View className="mb-3">
            <ThemedText className="text-sm text-gray-600 mb-2">Họ và tên *</ThemedText>
            <TextInput
              className="border border-gray-200 rounded-lg p-3 bg-gray-50"
              placeholder="Nhập họ và tên"
              value={contactInfo.fullName}
              onChangeText={(text) => setContactInfo({ ...contactInfo, fullName: text })}
            />
          </View>

          <View className="mb-3">
            <ThemedText className="text-sm text-gray-600 mb-2">Email nhận tour *</ThemedText>
            <TextInput
              className="border border-gray-200 rounded-lg p-3 bg-gray-50"
              placeholder="Nhập email"
              keyboardType="email-address"
              value={contactInfo.email}
              onChangeText={(text) => setContactInfo({ ...contactInfo, email: text })}
            />
          </View>

          <View>
            <ThemedText className="text-sm text-gray-600 mb-2">Số điện thoại *</ThemedText>
            <TextInput
              className="border border-gray-200 rounded-lg p-3 bg-gray-50"
              placeholder="Nhập số điện thoại"
              keyboardType="phone-pad"
              value={contactInfo.phone}
              onChangeText={(text) => setContactInfo({ ...contactInfo, phone: text })}
            />
          </View>
        </View>

        {/* Price Breakdown */}
        <View className="bg-white rounded-xl p-4 mb-4 shadow-sm border border-gray-200">
          <ThemedText className="text-lg font-bold mb-4">Chi tiết giá</ThemedText>

          <View className="flex-row justify-between mb-2">
            <ThemedText className="text-gray-600">Người lớn ({adults}x)</ThemedText>
            <ThemedText className="font-semibold">
              {totals.adultPrice.toLocaleString()}₫
            </ThemedText>
          </View>

          {children > 0 && (
            <View className="flex-row justify-between mb-2">
              <ThemedText className="text-gray-600">Trẻ em ({children}x)</ThemedText>
              <ThemedText className="font-semibold">
                {totals.childrenPrice.toLocaleString()}₫
              </ThemedText>
            </View>
          )}

          {selectedAddOns.length > 0 && (
            <View className="flex-row justify-between mb-2">
              <ThemedText className="text-gray-600">Dịch vụ bổ sung</ThemedText>
              <ThemedText className="font-semibold">
                {addOnsTotal.toLocaleString()}₫
              </ThemedText>
            </View>
          )}

          <View className="flex-row justify-between mb-2">
            <ThemedText className="text-gray-600">Phí dịch vụ (2%)</ThemedText>
            <ThemedText className="font-semibold">
              {totals.serviceFee.toLocaleString()}₫
            </ThemedText>
          </View>

          <View className="border-t border-gray-200 pt-3 mt-3">
            <View className="flex-row justify-between">
              <ThemedText className="text-xl font-bold">Tổng cộng</ThemedText>
              <ThemedText className="text-xl font-bold text-blue-600">
                {totals.total.toLocaleString()}₫
              </ThemedText>
            </View>
          </View>
        </View>

        {/* Payment Method Selection */}
        <View className="bg-white rounded-xl p-4 mb-4 shadow-sm border border-gray-200">
          <ThemedText className="text-lg font-bold mb-4">Phương thức thanh toán *</ThemedText>
          
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              onPress={() => setSelectedPaymentMethod(method.id)}
              className={`flex-row items-center p-4 rounded-xl mb-3 border-2 ${
                selectedPaymentMethod === method.id
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-200 bg-gray-50"
              }`}
            >
              <View
                className={`w-5 h-5 rounded-full border-2 mr-3 items-center justify-center ${
                  selectedPaymentMethod === method.id
                    ? "border-blue-600 bg-blue-600"
                    : "border-gray-400"
                }`}
              >
                {selectedPaymentMethod === method.id && (
                  <View className="w-3 h-3 rounded-full bg-white" />
                )}
              </View>
              <IconSymbol
                name={method.icon as any}
                size={24}
                color={selectedPaymentMethod === method.id ? "#2563eb" : "#6b7280"}
              />
              <View className="ml-3 flex-1">
                <ThemedText className="font-semibold text-gray-900">
                  {method.name}
                </ThemedText>
                <ThemedText className="text-sm text-gray-500">
                  {method.description}
                </ThemedText>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Confirm Button */}
      <View className="p-4 border-t border-gray-200 bg-white">
        <TouchableOpacity
          onPress={handleConfirmBooking}
          disabled={isProcessing}
          className={`py-4 rounded-xl items-center ${
            isProcessing ? "bg-gray-400" : "bg-blue-600"
          }`}
        >
          {isProcessing ? (
            <View className="flex-row items-center">
              <ActivityIndicator size="small" color="#fff" />
              <ThemedText className="text-white font-bold ml-2">Đang xử lý...</ThemedText>
            </View>
          ) : (
            <ThemedText className="text-white font-bold text-lg">
              Xác nhận và thanh toán
            </ThemedText>
          )}
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

