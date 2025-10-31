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
import CustomMapView from "@/app/components/common/MapView";

const { width } = Dimensions.get("window");

export default function HotelDetail() {
  const { destinationId } = useLocalSearchParams<{ destinationId: string }>();
  const [destination, setDestination] = useState<Destination | null>(null);
  const [loading, setLoading] = useState(true);

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

  const handleBookTour = () => {
    if (!destination) return;

    // Navigate to tour detail (core) - RoomList là bổ sung nếu cần
    router.push({
      pathname: "/screens/tours/TourDetail",
      params: { destinationId: destination.id },
    });
  };

  const handleSelectRoom = () => {
    if (!destination) return;

    // Navigate to room list screen (bổ sung - không phải core)
    router.push({
      pathname: "/screens/rooms/RoomList",
      params: { destinationId: destination.id, destinationName: destination.name },
    });
  };

  const handleShare = () => {
    Alert.alert("Chia sẻ", "Tính năng chia sẻ sẽ được cập nhật sớm!");
  };

  const handleAddToWishlist = async () => {
    if (!user) {
      Alert.alert(
        "Cần đăng nhập",
        "Vui lòng đăng nhập để thêm vào danh sách yêu thích",
        [
          { text: "Hủy", style: "cancel" },
          {
            text: "Đăng nhập",
            onPress: () => router.push("/(auth)/login"),
          },
        ]
      );
      return;
    }

    try {
      await api.addToWishlist(destinationId!);
      Alert.alert("Thành công", "Đã thêm vào danh sách yêu thích!");
    } catch (error: any) {
      console.error("Error adding to wishlist:", error);
      Alert.alert(
        "Lỗi",
        error.message || "Không thể thêm vào danh sách yêu thích"
      );
    }
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
            className="w-full h-80"
            contentFit="cover"
          />

          {/* Gradient overlay nhẹ chỉ ở phía trên */}
          <View className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent" />

          {/* Back, Share, Heart */}
          <View className="absolute top-12 left-4 right-4 flex-row justify-between items-center z-10">
            <Animated.View entering={FadeInDown.delay(100).duration(500)}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => router.back()}
                className="bg-black/50 backdrop-blur-md rounded-full p-3.5 shadow-2xl border border-black/30"
              >
                <IconSymbol name="arrow-left" size={22} color="#FFF" />
              </TouchableOpacity>
            </Animated.View>

            <View className="flex-row">
              <Animated.View entering={FadeInDown.delay(200).duration(500)}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={handleShare}
                  className="bg-black/50 backdrop-blur-md rounded-full p-3.5 shadow-2xl border border-black/30 mr-2"
                >
                  <IconSymbol name="share" size={20} color="#FFF" />
                </TouchableOpacity>
              </Animated.View>
              <Animated.View entering={FadeInDown.delay(300).duration(500)}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={handleAddToWishlist}
                  className="bg-black/50 backdrop-blur-md rounded-full p-3.5 shadow-2xl border border-black/30"
                >
                  <IconSymbol name="heart" size={20} color="#FFF" />
                </TouchableOpacity>
              </Animated.View>
            </View>
          </View>
        </View>

        {/* === CARD INFO PHÍA DƯỚI ẢNH === */}
        <Animated.View 
          entering={FadeInDown.delay(300).duration(500)}
          className="px-6 -mt-8 z-20"
        >
          <View className={`rounded-3xl p-5 shadow-2xl ${isDark ? "bg-slate-800" : "bg-white"}`}>
            <ThemedText className={`text-3xl font-extrabold leading-tight mb-3 ${isDark ? "text-white" : "text-gray-900"}`}>
              {destination.name}
            </ThemedText>
            
            {/* Duration và Location */}
            <View className="flex-row items-center flex-wrap mb-4">
              <View className={`px-3 py-1.5 rounded-full mr-2 mb-2 ${isDark ? "bg-purple-500/30" : "bg-purple-50"}`}>
                <ThemedText className={`font-bold text-sm ${isDark ? "text-purple-300" : "text-purple-700"}`}>
                  3 ngày 2 đêm
                </ThemedText>
              </View>
              <View className={`flex-row items-center px-3 py-1.5 rounded-full mr-2 mb-2 ${isDark ? "bg-blue-500/30" : "bg-blue-50"}`}>
                <IconSymbol name="map-pin" size={14} color={isDark ? "#93c5fd" : "#3b82f6"} />
                <ThemedText className={`ml-1 font-bold text-sm ${isDark ? "text-blue-300" : "text-blue-700"}`}>
                  {destination.city}, {destination.country}
                </ThemedText>
              </View>
            </View>

            {/* Price */}
            <View className="flex-row items-baseline pt-3 border-t border-gray-200">
              <ThemedText className={`font-extrabold text-3xl ${isDark ? "text-purple-300" : "text-purple-600"}`}>
                {destination.price}
              </ThemedText>
              <ThemedText className={`text-sm ml-2 font-medium ${isDark ? "text-gray-400" : "text-gray-600"}`}>/ người</ThemedText>
            </View>
          </View>
        </Animated.View>

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
            <View className="rounded-3xl overflow-hidden shadow-lg">
              <CustomMapView
                latitude={destination.coordinates.latitude}
                longitude={destination.coordinates.longitude}
                height={300}
                showUserLocation={true}
                isDark={isDark}
              />
            </View>
            <ThemedText className={`text-sm mt-2 text-center ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              {destination.coordinates.latitude.toFixed(6)}, {destination.coordinates.longitude.toFixed(6)}
            </ThemedText>
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

            <View className="flex-row gap-3">
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={handleBookTour}
                className="flex-1 rounded-2xl overflow-hidden shadow-xl bg-blue-600"
                style={{ paddingHorizontal: 24, paddingVertical: 16 }}
              >
                <ThemedText className="text-white font-extrabold text-base text-center">
                  Đặt tour
                </ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={handleSelectRoom}
                className="rounded-2xl overflow-hidden shadow-xl bg-orange-500"
                style={{ paddingHorizontal: 20, paddingVertical: 16 }}
              >
                <ThemedText className="text-white font-extrabold text-sm text-center">
                  Lưu trú
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ThemedView>
    </SafeAreaView>
  );
}