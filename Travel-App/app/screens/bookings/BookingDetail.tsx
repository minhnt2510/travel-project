import { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Image as ExpoImage } from "expo-image";
import { useLocalSearchParams, router } from "expo-router";
import { ThemedText } from "@/ui-components/themed-text";
import { ThemedView } from "@/ui-components/themed-view";
import { IconSymbol } from "@/ui-components/ui/icon-symbol";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUser } from "@/app/_layout";
import { api } from "@/services/api";
import { useColorScheme } from "react-native";

// Helper function to format date
const formatDate = (dateString: string): string => {
  if (!dateString) return "";
  const dateOnly = dateString.split("T")[0];
  const [year, month, day] = dateOnly.split("-");
  return `${day}/${month}/${year}`;
};

export default function BookingDetail() {
  const { bookingId } = useLocalSearchParams<{ bookingId: string }>();
  const [booking, setBooking] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const isDark = useColorScheme() === "dark";

  useEffect(() => {
    if (bookingId) {
      loadBooking();
    }
  }, [bookingId, user]);

  const loadBooking = async () => {
    try {
      setLoading(true);
      
      // Check if user is logged in
      if (!user) {
        Alert.alert(
          "Cần đăng nhập",
          "Vui lòng đăng nhập để xem chi tiết đặt tour",
          [
            { text: "Hủy", style: "cancel", onPress: () => router.back() },
            {
              text: "Đăng nhập",
              onPress: () => {
                router.replace("/(auth)/login");
              },
            },
          ]
        );
        return;
      }
      
      // Try to get booking detail from API
      try {
        const data = await api.getBookingById(bookingId!);
        setBooking(data);
        return;
      } catch (apiError: any) {
        // If Forbidden, try to get from bookings list (fallback)
        if (apiError.message?.includes("Forbidden") || apiError.message?.includes("403")) {
          // Try to get booking from list (which user has access to)
          try {
            const bookings = await api.getBookings();
            const matchingBooking = bookings.find((b) => b._id === bookingId);
            
            if (matchingBooking) {
              // Fallback successful - use it silently
              setBooking(matchingBooking);
              return;
            }
          } catch (listError) {
            // Only log if fallback also fails
            console.error("Error getting bookings list:", listError);
          }
          
          // If still no match, show error
          throw new Error("Forbidden - Booking not found in your account");
        }
        
        // Re-throw other errors
        throw apiError;
      }
    } catch (error: any) {
      console.error("Error loading booking:", error);
      
      // Handle specific error cases
      let errorMessage = "Không thể tải thông tin đặt tour";
      let showRelogin = false;
      
      if (error.message?.includes("Forbidden") || error.message?.includes("403")) {
        errorMessage = "Bạn không có quyền xem đặt tour này. Có thể đặt tour này không thuộc về tài khoản của bạn hoặc bạn cần đăng nhập lại.";
        showRelogin = true;
      } else if (error.message?.includes("Not found") || error.message?.includes("404")) {
        errorMessage = "Đặt tour không tồn tại hoặc đã bị xóa.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert(
        "Lỗi",
        errorMessage,
        showRelogin
          ? [
              { text: "Hủy", style: "cancel", onPress: () => router.back() },
              {
                text: "Đăng nhập lại",
                onPress: () => {
                  router.replace("/(auth)/login");
                },
              },
            ]
          : [{ text: "OK", onPress: () => router.back() }]
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading || !booking) {
    return (
      <ThemedView className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#3b82f6" />
        <ThemedText className="mt-4 text-gray-600">Đang tải...</ThemedText>
      </ThemedView>
    );
  }

  // Extract tour info
  const tour = booking.tourId && typeof booking.tourId === "object" ? booking.tourId : null;
  const tourImage = tour?.imageUrl || tour?.images?.[0] || "https://via.placeholder.com/800";
  const tourTitle = tour?.title || booking.tourId || "Tour đã đặt";
  const tourLocation = tour?.location || "";

  // Calculate price
  const totalPrice = typeof booking.totalPrice === "number" 
    ? booking.totalPrice 
    : parseFloat(String(booking.totalPrice || 0).replace(/[^\d.]/g, ""));

  // Get status text
  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Đã xác nhận";
      case "pending":
        return "Chờ xác nhận";
      case "in_progress":
        return "Đang phục vụ";
      case "completed":
        return "Hoàn thành";
      case "cancelled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "#10b981";
      case "pending":
        return "#f59e0b";
      case "in_progress":
        return "#8b5cf6";
      case "completed":
        return "#3b82f6";
      case "cancelled":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  return (
    <SafeAreaView className={`flex-1 ${isDark ? "bg-slate-900" : "bg-gray-50"}`}>
      <ThemedView className="flex-1">
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header Image */}
          <View className="relative">
            <ExpoImage
              source={{ uri: tourImage }}
              className="w-full h-80"
              contentFit="cover"
            />
            <View className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent" />

            <View className="absolute top-12 left-4 right-4 flex-row justify-between items-center z-10">
              <TouchableOpacity
                onPress={() => router.back()}
                className="bg-black/50 backdrop-blur-md rounded-full p-3.5"
              >
                <IconSymbol name="arrow-left" size={22} color="#FFF" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Booking Info Card */}
          <View className={`-mt-8 ${isDark ? "bg-slate-800" : "bg-white"} rounded-t-3xl px-6 pt-6 pb-4`}>
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-1">
                <ThemedText className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                  {tourTitle}
                </ThemedText>
                {tourLocation && (
                  <View className="flex-row items-center mt-2">
                    <IconSymbol name="map-pin" size={16} color={isDark ? "#94a3b8" : "#6b7280"} />
                    <ThemedText className={`ml-1 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                      {tourLocation}
                    </ThemedText>
                  </View>
                )}
              </View>
            </View>

            {/* Status Badge */}
            <View className="mb-4">
              <View
                className="px-4 py-2 rounded-full self-start"
                style={{ backgroundColor: getStatusColor(booking.status) + "20" }}
              >
                <ThemedText
                  className="font-bold text-sm"
                  style={{ color: getStatusColor(booking.status) }}
                >
                  {getStatusText(booking.status)}
                </ThemedText>
              </View>
            </View>

            {/* Booking Details */}
            <View className="space-y-4 mb-4">
              <View className="flex-row items-center">
                <IconSymbol name="calendar" size={20} color={isDark ? "#94a3b8" : "#6b7280"} />
                <ThemedText className={`ml-3 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                  Ngày đi: <ThemedText className="font-bold">{formatDate(booking.travelDate)}</ThemedText>
                </ThemedText>
              </View>

              <View className="flex-row items-center">
                <IconSymbol name="users" size={20} color={isDark ? "#94a3b8" : "#6b7280"} />
                <ThemedText className={`ml-3 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                  Số lượng: <ThemedText className="font-bold">{booking.quantity} người</ThemedText>
                </ThemedText>
              </View>

              {booking.travelers && booking.travelers.length > 0 && (
                <View className="mt-2">
                  <ThemedText className={`font-semibold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
                    Danh sách khách:
                  </ThemedText>
                  {booking.travelers.map((traveler: any, idx: number) => (
                    <View
                      key={idx}
                      className={`p-3 rounded-lg mb-2 ${
                        isDark ? "bg-slate-700" : "bg-gray-50"
                      }`}
                    >
                      <ThemedText className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}>
                        {traveler.name}
                      </ThemedText>
                      <ThemedText className={`text-sm mt-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                        Tuổi: {traveler.age}
                        {traveler.idCard && ` • CMND: ${traveler.idCard}`}
                      </ThemedText>
                    </View>
                  ))}
                </View>
              )}

              <View className="flex-row items-center">
                <IconSymbol name="dollar-sign" size={20} color={isDark ? "#94a3b8" : "#6b7280"} />
                <ThemedText className={`ml-3 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                  Tổng tiền: <ThemedText className={`font-bold ${isDark ? "text-blue-400" : "text-blue-600"}`}>
                    {totalPrice.toLocaleString("vi-VN")}₫
                  </ThemedText>
                </ThemedText>
              </View>

              {booking.contactInfo && (
                <View className="mt-4 pt-4 border-t" style={{ borderColor: isDark ? "#475569" : "#e5e7eb" }}>
                  <ThemedText className={`font-semibold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
                    Thông tin liên hệ:
                  </ThemedText>
                  <View className="space-y-2">
                    {booking.contactInfo.fullName && (
                      <View className="flex-row items-center">
                        <IconSymbol name="user" size={16} color={isDark ? "#94a3b8" : "#6b7280"} />
                        <ThemedText className={`ml-2 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                          {booking.contactInfo.fullName}
                        </ThemedText>
                      </View>
                    )}
                    <View className="flex-row items-center">
                      <IconSymbol name="mail" size={16} color={isDark ? "#94a3b8" : "#6b7280"} />
                      <ThemedText className={`ml-2 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                        {booking.contactInfo.email}
                      </ThemedText>
                    </View>
                    <View className="flex-row items-center">
                      <IconSymbol name="phone" size={16} color={isDark ? "#94a3b8" : "#6b7280"} />
                      <ThemedText className={`ml-2 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                        {booking.contactInfo.phone}
                      </ThemedText>
                    </View>
                  </View>
                </View>
              )}

              {booking.specialRequests && (
                <View className="mt-4">
                  <ThemedText className={`font-semibold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
                    Yêu cầu đặc biệt:
                  </ThemedText>
                  <ThemedText className={`${isDark ? "text-gray-300" : "text-gray-600"}`}>
                    {booking.specialRequests}
                  </ThemedText>
                </View>
              )}
            </View>
          </View>

          {/* Actions - Removed payment button, only show status */}
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}

