import { api, type Destination } from "@/services/api";
import { ThemedText } from "@/ui-components/themed-text";
import { ThemedView } from "@/ui-components/themed-view";
import { IconSymbol } from "@/ui-components/ui/icon-symbol";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert, Dimensions, ScrollView,
  TouchableOpacity, useColorScheme, View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export default function HotelDetail() {
  const { destinationId } = useLocalSearchParams<{ destinationId: string }>();
  const [destination, setDestination] = useState<Destination | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);

  const isDark = useColorScheme() === "dark";

  useEffect(() => {
    if (destinationId) {
      loadDestination();
    }
  }, [destinationId]);

  const loadDestination = async () => {
    try {
      setLoading(true);
      const data = await api.getDestinationById(destinationId!);
      setDestination(data);
    } catch {
      Alert.alert("Lỗi", "Không thể tải thông tin địa điểm");
    } finally {
      setLoading(false);
    }
  };

 // Trong handleBookTrip
const handleBookTrip = async () => {
  if (!destination) return;

  setIsBooking(true);
  try {
    const newTrip = {
      destinationId: destination.id,
      destinationName: destination.name,
      destinationImage: destination.image,
      startDate: new Date().toISOString().split("T")[0], // Hôm nay
      endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // +5 ngày
      travelers: 2,
      totalPrice: destination.price,
      status: "pending" as const,
    };

    await api.createTrip(newTrip);

    Alert.alert(
      "Thành công!",
      `Đã đặt chuyến đi đến ${destination.name}!`,
      [
        {
          text: "Xem chuyến đi",
          onPress: () => {
            router.push("/(tabs)/bookings");  
          },
        },
        { text: "Ở lại", style: "cancel" },
      ]
    );
  } catch (error) {
    console.error(error);
    Alert.alert("Lỗi", "Không thể đặt chuyến đi");
  } finally {
    setIsBooking(false);
  }
};

  const handleShare = () => {
    Alert.alert("Chia sẻ", "Tính năng chia sẻ sẽ được cập nhật sớm!");
  };

  const handleAddToWishlist = () => {
    Alert.alert("Yêu thích", "Đã thêm vào danh sách yêu thích!");
  };

  if (loading) {
    return (
      <ThemedView className={`flex-1 justify-center items-center ${isDark ? "bg-slate-900" : "bg-gray-50"}`}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <ThemedText className={`mt-4 ${isDark ? "text-gray-300" : "text-gray-600"} font-medium`}>
          Đang tải...
        </ThemedText>
      </ThemedView>
    );
  }

  if (!destination) {
    return (
      <ThemedView className={`flex-1 justify-center items-center ${isDark ? "bg-slate-900" : "bg-gray-50"}`}>
        <ThemedText className={`text-lg ${isDark ? "text-gray-400" : "text-gray-600"}`}>
          Không tìm thấy thông tin
        </ThemedText>
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-6 bg-blue-600 px-8 py-3.5 rounded-2xl"
        >
          <ThemedText className="text-white font-bold">Quay lại</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  return (
    <SafeAreaView className={`flex-1 ${isDark ? "bg-slate-900" : "bg-gray-50"}`}>
    <ThemedView className="flex-1">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }} // THÊM DÒNG NÀY
      >
        {/* === HÌNH ẢNH + HEADER === */}
        <View className="relative">
          <Image
            source={{ uri: destination.image }}
            className="w-full h-96"
            contentFit="cover"
          />

          {/* Gradient overlay */}
          <View className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Back, Share, Heart */}
          <View className="absolute top-12 left-4 right-4 flex-row justify-between items-center">
            <TouchableOpacity
              onPress={() => router.back()}
              className="bg-white/20 backdrop-blur-md rounded-full p-3 shadow-lg"
            >
              <IconSymbol name="arrow-left" size={24} color="#FFF" />
            </TouchableOpacity>

            <View className="flex-row space-x-2">
              <TouchableOpacity
                onPress={handleShare}
                className="bg-white/20 backdrop-blur-md rounded-full p-3 shadow-lg"
              >
                <IconSymbol name="share" size={22} color="#FFF" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleAddToWishlist}
                className="bg-white/20 backdrop-blur-md rounded-full p-3 shadow-lg"
              >
                <IconSymbol name="heart" size={22} color="#FFF" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Price Badge */}
          <View className="absolute bottom-6 right-6 bg-white rounded-2xl px-5 py-3 shadow-2xl">
            <ThemedText className="text-blue-600 font-extrabold text-xl">
              {destination.price}
            </ThemedText>
            <ThemedText className="text-gray-500 text-xs text-center">/ người</ThemedText>
          </View>

          {/* Tiêu đề trên ảnh */}
          <View className="absolute bottom-6 left-6">
            <ThemedText className="text-white text-3xl font-extrabold leading-tight">
              {destination.name}
            </ThemedText>
            <View className="flex-row items-center mt-1">
              <IconSymbol name="location" size={18} color="#FFF" />
              <ThemedText className="text-white/90 ml-1 font-medium">
                {destination.city}, {destination.country}
              </ThemedText>
            </View>
          </View>
        </View>

        {/* === NỘI DUNG === */}
        <View className="px-6 py-6">
          {/* Rating */}
          <View className="flex-row items-center mb-5">
            <View className="flex-row">
              {[1, 2, 3, 4, 5].map((star) => (
                <IconSymbol
                  key={star}
                  name="star"
                  size={22}
                  color={star <= Math.floor(destination.rating) ? "#fbbf24" : "#e5e7eb"}
                />
              ))}
            </View>
            <ThemedText className={`ml-2 font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
              {destination.rating}
            </ThemedText>
            <ThemedText className={`ml-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              ({destination.reviews} đánh giá)
            </ThemedText>
          </View>

          {/* Mô tả */}
          <View className="mb-6">
            <ThemedText className={`text-lg font-extrabold mb-3 ${isDark ? "text-white" : "text-gray-900"}`}>
              Giới thiệu
            </ThemedText>
            <ThemedText className={`leading-7 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              {destination.description}
            </ThemedText>
          </View>

          {/* Bản đồ */}
          <View className="mb-6">
            <ThemedText className={`text-lg font-extrabold mb-3 ${isDark ? "text-white" : "text-gray-900"}`}>
              Vị trí
            </ThemedText>
            <View className={`rounded-3xl h-56 ${isDark ? "bg-slate-800" : "bg-gray-100"} flex items-center justify-center shadow-lg`}>
              <IconSymbol name="map" size={56} color={isDark ? "#64748b" : "#9ca3af"} />
              <ThemedText className={`mt-3 font-semibold ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                {destination.name}
              </ThemedText>
              <ThemedText className={`text-sm ${isDark ? "text-gray-500" : "text-gray-500"}`}>
                {destination.coordinates.latitude}, {destination.coordinates.longitude}
              </ThemedText>
            </View>
          </View>

          {/* Tiện ích */}
          <View className="mb-6">
            <ThemedText className={`text-lg font-extrabold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
              Tiện ích nổi bật
            </ThemedText>
            <View className="flex-row flex-wrap">
              {["WiFi miễn phí", "Bãi đỗ xe", "Nhà hàng", "Hồ bơi", "Spa", "Gym"].map((feature, i) => (
                <View
                  key={i}
                  className={`px-4 py-2.5 rounded-full mr-2 mb-2 ${
                    isDark ? "bg-slate-700" : "bg-blue-50"
                  }`}
                >
                  <ThemedText className={`text-sm font-semibold ${isDark ? "text-blue-300" : "text-blue-700"}`}>
                    {feature}
                  </ThemedText>
                </View>
              ))}
            </View>
          </View>

          {/* Đánh giá */}
          <View className="mb-8">
            <ThemedText className={`text-lg font-extrabold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
              Đánh giá từ khách hàng
            </ThemedText>
            <View className={`p-5 rounded-3xl ${isDark ? "bg-slate-800" : "bg-gray-50"} shadow-md`}>
              <View className="flex-row items-center mb-3">
                <View className="flex-row">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <IconSymbol
                      key={s}
                      name="star"
                      size={18}
                      color={s <= 4 ? "#fbbf24" : "#e5e7eb"}
                    />
                  ))}
                </View>
                <ThemedText className={`ml-2 font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                  4.8/5
                </ThemedText>
              </View>
              <ThemedText className={`${isDark ? "text-gray-300" : "text-gray-700"} italic`}>
                "{destination.name} là điểm đến lý tưởng! Cảnh đẹp, dịch vụ tốt, nhân viên thân thiện."
              </ThemedText>
              <ThemedText className={`text-xs mt-2 ${isDark ? "text-gray-500" : "text-gray-500"}`}>
                — Nguyễn Thị B, 2 ngày trước
              </ThemedText>
            </View>
          </View>
        </View>
      </ScrollView>

      <View className={`absolute bottom-0 left-0 right-0 p-6 ${isDark ? "bg-slate-900" : "bg-white"} border-t ${isDark ? "border-slate-700" : "border-gray-200"} shadow-2xl`}>
          <View className="flex-row justify-between items-center">
            <View>
              <ThemedText className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>Giá từ</ThemedText>
              <ThemedText className="text-blue-600 font-extrabold text-2xl">
                {destination?.price}
              </ThemedText>
              <ThemedText className={`text-xs ${isDark ? "text-gray-500" : "text-gray-500"}`}>/ người</ThemedText>
            </View>

            <TouchableOpacity
              onPress={handleBookTrip}
              disabled={isBooking}
              className="bg-blue-600 px-8 py-4 rounded-2xl flex-row items-center shadow-lg"
            >
              {isBooking ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <>
                  <IconSymbol name="calendar" size={22} color="#FFF" />
                  <ThemedText className="text-white font-bold ml-2 text-base">
                    Đặt ngay
                  </ThemedText>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ThemedView>
    </SafeAreaView>
  );
}