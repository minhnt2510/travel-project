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
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useUser } from "@/app/_layout";

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
      if (data) {
        setDestination(data);
      } else {
        throw new Error("Không tìm thấy tour");
      }
    } catch (error: any) {
      console.error("Error loading destination:", error);
      Alert.alert(
        "Lỗi", 
        error?.message || "Không thể tải thông tin tour. Vui lòng kiểm tra kết nối mạng và thử lại."
      );
      router.back();
    } finally {
      setLoading(false);
    }
  };

  // Check if user is logged in
  const { user } = useUser();
  
  const handleBookTrip = async () => {
    if (!destination) return;

    // Guest mode: redirect to login
    if (!user) {
      router.push({
        pathname: "/(auth)/login",
        params: { redirect: `/screens/destinations/HotelDetail?destinationId=${destinationId}` },
      });
      return;
    }

    setIsBooking(true);
    try {
      // Validate user has email
      if (!user?.email) {
        Alert.alert(
          "Thông tin chưa đầy đủ",
          "Vui lòng cập nhật email trong thông tin cá nhân trước khi đặt tour.",
          [{ text: "OK" }]
        );
        setIsBooking(false);
        return;
      }

      const newTrip = {
        destinationId: destination.id,
        destinationName: destination.name,
        destinationImage: destination.image,
        startDate: new Date().toISOString().split("T")[0], // Hôm nay
        endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // +5 ngày
        travelers: 2,
        totalPrice: destination.price, // This will be converted in helpers
        status: "pending" as const,
      };

      await api.createTrip(newTrip, user.email, user.phone);

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
    } catch (error: any) {
      console.error("Booking error:", error);
      const errorMessage = error?.message || "Không thể đặt chuyến đi";
      Alert.alert(
        "Lỗi đặt tour",
        errorMessage,
        [{ text: "OK" }]
      );
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
          <View className="absolute top-12 left-4 right-4 flex-row justify-between items-center z-10">
            <Animated.View entering={FadeInDown.delay(100).duration(500)}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => router.back()}
                className="bg-white/20 backdrop-blur-md rounded-full p-3.5 shadow-2xl border border-white/30"
              >
                <IconSymbol name="arrow-left" size={22} color="#FFF" />
              </TouchableOpacity>
            </Animated.View>

            <View className="flex-row">
              <Animated.View entering={FadeInDown.delay(200).duration(500)}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={handleShare}
                  className="bg-white/20 backdrop-blur-md rounded-full p-3.5 shadow-2xl border border-white/30 mr-2"
                >
                  <IconSymbol name="share" size={20} color="#FFF" />
                </TouchableOpacity>
              </Animated.View>
              <Animated.View entering={FadeInDown.delay(300).duration(500)}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={handleAddToWishlist}
                  className="bg-white/20 backdrop-blur-md rounded-full p-3.5 shadow-2xl border border-white/30"
                >
                  <IconSymbol name="heart" size={20} color="#FFF" />
                </TouchableOpacity>
              </Animated.View>
            </View>
          </View>

          {/* Price Badge */}
          <Animated.View 
            entering={FadeInDown.delay(400).duration(500)}
            className="absolute bottom-6 right-6 overflow-hidden rounded-2xl shadow-2xl"
          >
            <LinearGradient
              colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.9)']}
              className="px-6 py-4"
            >
              <ThemedText className="text-purple-600 font-extrabold text-2xl">
                {destination.price}
              </ThemedText>
              <ThemedText className="text-gray-600 text-xs text-center mt-1 font-medium">/ người</ThemedText>
            </LinearGradient>
          </Animated.View>

          {/* Tiêu đề trên ảnh */}
          <Animated.View 
            entering={FadeInDown.delay(300).duration(500)}
            className="absolute bottom-6 left-6 right-24"
          >
            <ThemedText className="text-white text-3xl font-extrabold leading-tight mb-2 shadow-lg">
              {destination.name}
            </ThemedText>
            <View className="flex-row items-center">
              <View className="bg-white/20 backdrop-blur-md px-2 py-1 rounded-lg mr-2">
                <IconSymbol name="location" size={16} color="#FFF" />
              </View>
              <ThemedText className="text-white/95 ml-1 font-bold text-base">
                {destination.city}, {destination.country}
              </ThemedText>
            </View>
          </Animated.View>
        </View>

        {/* === NỘI DUNG === */}
        <View className="px-6 py-6">
          {/* Rating */}
          <Animated.View 
            entering={FadeInDown.delay(100).duration(500)}
            className="flex-row items-center mb-6 bg-white rounded-2xl px-5 py-4 shadow-sm"
          >
            <View className="flex-row mr-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <IconSymbol
                  key={star}
                  name="star"
                  size={24}
                  color={star <= Math.floor(destination.rating) ? "#fbbf24" : "#e5e7eb"}
                />
              ))}
            </View>
            <View className="flex-1">
              <ThemedText className="font-extrabold text-gray-900 text-xl">
                {destination.rating}
              </ThemedText>
              <ThemedText className="text-gray-600 text-sm">
                ({destination.reviews} đánh giá)
              </ThemedText>
            </View>
          </Animated.View>

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
          <Animated.View 
            entering={FadeInDown.delay(200).duration(500)}
            className="mb-6"
          >
            <ThemedText className={`text-xl font-extrabold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
              Tiện ích nổi bật ✨
            </ThemedText>
            <View className="flex-row flex-wrap">
              {["WiFi miễn phí", "Bãi đỗ xe", "Nhà hàng", "Hồ bơi", "Spa", "Gym"].map((feature, i) => (
                <View
                  key={i}
                  className="mr-3 mb-3 overflow-hidden rounded-2xl shadow-sm"
                >
                  <LinearGradient
                    colors={['#e0e7ff', '#c7d2fe']}
                    className="px-5 py-3"
                  >
                    <ThemedText className="text-sm font-extrabold text-purple-700">
                      {feature}
                    </ThemedText>
                  </LinearGradient>
                </View>
              ))}
            </View>
          </Animated.View>

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
              activeOpacity={0.9}
              onPress={handleBookTrip}
              disabled={isBooking}
              className="rounded-2xl overflow-hidden shadow-xl"
            >
              <LinearGradient
                colors={['#667eea', '#764ba2']}
                className="px-8 py-4 flex-row items-center justify-center"
              >
                {isBooking ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <>
                    <IconSymbol name="calendar" size={22} color="#FFF" />
                    <ThemedText className="text-white font-extrabold ml-2 text-base">
                      Đặt ngay
                    </ThemedText>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </ThemedView>
    </SafeAreaView>
  );
}