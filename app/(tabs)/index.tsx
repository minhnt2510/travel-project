import { useState, useEffect } from "react";
import { ThemedText } from "@/ui-components/themed-text";
import { ThemedView } from "@/ui-components/themed-view";
import { IconSymbol } from "@/ui-components/ui/icon-symbol";
import { Image } from "expo-image";
import { router } from "expo-router";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
  RefreshControl,
} from "react-native";
import { IMAGES } from "../Util_Images";
import { api, type Tour } from "@/services/api";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";

export default function HomeScreen() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [featuredTours, setFeaturedTours] = useState<Tour[]>([]);
  const [allTours, setAllTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const topDestinations = [
    { id: "1", name: "Đà Lạt", image: IMAGES.dalat, count: "150+ địa điểm" },
    {
      id: "2",
      name: "Phú Quốc",
      image: IMAGES.phuquoc,
      count: "120+ địa điểm",
    },
    { id: "3", name: "Hội An", image: IMAGES.hoian, count: "90+ địa điểm" },
    { id: "4", name: "Hạ Long", image: IMAGES.halong, count: "80+ địa điểm" },
    { id: "5", name: "Sa Pa", image: IMAGES.sapa, count: "60+ địa điểm" },
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [featured, all] = await Promise.all([
        api.getFeaturedTours(),
        api.getTours({ limit: 10 }),
      ]);
      setFeaturedTours(featured);
      setAllTours(all.tours);
    } catch (error) {
      console.error("Error loading data:", error);
      Alert.alert(
        "Lỗi",
        "Không thể tải dữ liệu. Vui lòng kiểm tra kết nối backend."
      );
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push({
        pathname: "/screens/tours/AllTours",
        params: { search: searchQuery },
      });
    }
  };

  const openDetail = (tourId: string) => {
    router.push({
      pathname: "/screens/destinations/HotelDetail",
      params: { destinationId: tourId },
    });
  };

  const addToWishlist = async (tourId: string) => {
    try {
      await api.addToWishlist(tourId);
      Alert.alert("Thành công", "Đã thêm vào danh sách yêu thích!");
    } catch (error) {
      Alert.alert("Lỗi", "Không thể thêm vào wishlist");
    }
  };

  if (loading) {
    return (
      <ThemedView className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#2563eb" />
        <ThemedText className="mt-4 text-gray-600">
          Đang tải dữ liệu...
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView className="flex-1 bg-gray-50">
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Hero Header */}
        <View className="bg-gradient-to-br from-blue-600 to-indigo-700 px-4 pt-12 pb-8">
          <View className="flex-row items-center mb-4">
            <View className="flex-1">
              <ThemedText className="text-white text-2xl font-bold">
                Chào mừng! 👋
              </ThemedText>
              <ThemedText className="text-blue-100 text-sm mt-1">
                Khám phá những điểm đến tuyệt vời
              </ThemedText>
            </View>
            <TouchableOpacity
              onPress={() => setMenuVisible(true)}
              className="w-12 h-12 rounded-full items-center justify-center bg-white/20"
            >
              <IconSymbol name="user" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>

          {/* Search Bar - Enhanced */}
          <TouchableOpacity
            className="bg-white rounded-2xl px-4 py-4 flex-row items-center shadow-lg"
            onPress={handleSearch}
          >
            <IconSymbol name="search" size={22} color="#2563eb" />
            <View className="flex-1 ml-3">
              <ThemedText className="text-gray-900 font-medium">
                Tìm kiếm tour, điểm đến...
              </ThemedText>
              <ThemedText className="text-gray-500 text-xs mt-0.5">
                Khám phá hơn 500+ địa điểm
              </ThemedText>
            </View>
            <View className="bg-blue-50 px-3 py-2 rounded-xl">
              <IconSymbol name="sliders" size={18} color="#2563eb" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Quick Filters */}
        <View className="px-4 py-3 bg-white">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row space-x-3">
              {[
                {
                  icon: "sparkles",
                  label: "Nổi bật",
                  color: "bg-gradient-to-r from-yellow-400 to-orange-500",
                },
                {
                  icon: "fire",
                  label: "Hot",
                  color: "bg-gradient-to-r from-red-500 to-pink-500",
                },
                {
                  icon: "beach",
                  label: "Biển",
                  color: "bg-gradient-to-r from-cyan-400 to-blue-500",
                },
                {
                  icon: "mountain",
                  label: "Núi",
                  color: "bg-gradient-to-r from-green-400 to-emerald-500",
                },
                {
                  icon: "city",
                  label: "Thành phố",
                  color: "bg-gradient-to-r from-purple-400 to-indigo-500",
                },
              ].map((filter, idx) => (
                <TouchableOpacity
                  key={idx}
                  className="bg-blue-50 px-4 py-2 rounded-full flex-row items-center"
                >
                  <ThemedText className="mr-2">
                    {filter.label === "Nổi bật"
                      ? "✨"
                      : filter.label === "Hot"
                      ? "🔥"
                      : filter.label === "Biển"
                      ? "🏖️"
                      : filter.label === "Núi"
                      ? "🏔️"
                      : "🏙️"}
                  </ThemedText>
                  <ThemedText className="text-blue-700 font-semibold text-sm">
                    {filter.label}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Top Destinations */}
        <View className="px-4 py-4">
          <View className="flex-row justify-between items-center mb-4">
            <View>
              <ThemedText className="text-xl font-bold text-gray-900">
                Điểm đến phổ biến
              </ThemedText>
              <ThemedText className="text-gray-500 text-sm">
                Khám phá ngay
              </ThemedText>
            </View>
            <TouchableOpacity
              onPress={() =>
                router.push("/screens/destinations/AllDestinations")
              }
              className="flex-row items-center"
            >
              <ThemedText className="text-blue-600 font-semibold mr-2">
                Xem tất cả
              </ThemedText>
              <IconSymbol name="chevron-right" size={20} color="#2563eb" />
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {topDestinations.map((d, idx) => (
              <Animated.View
                key={d.id}
                entering={FadeInDown.delay(idx * 100).duration(500)}
              >
                <TouchableOpacity
                  className="mr-4 w-48"
                  onPress={() => openDetail(d.id)}
                >
                  <View className="relative">
                    <Image
                      source={d.image}
                      className="w-48 h-48 rounded-2xl"
                      contentFit="cover"
                    />
                    <View className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-2xl" />
                    <View className="absolute bottom-3 left-3 right-3">
                      <ThemedText className="text-white font-bold text-lg">
                        {d.name}
                      </ThemedText>
                      <View className="flex-row items-center mt-1">
                        <IconSymbol name="map-pin" size={14} color="#FFF" />
                        <ThemedText className="text-white/90 text-xs ml-1">
                          {d.count}
                        </ThemedText>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </ScrollView>
        </View>

        {/* Featured Tours */}
        <View className="px-4 py-4">
          <View className="flex-row justify-between items-center mb-4">
            <View>
              <ThemedText className="text-xl font-bold text-gray-900">
                Tour nổi bật
              </ThemedText>
              <ThemedText className="text-gray-500 text-sm">
                Được yêu thích nhất
              </ThemedText>
            </View>
            <TouchableOpacity
              onPress={() => router.push("/screens/tours/AllTours")}
              className="flex-row items-center"
            >
              <ThemedText className="text-blue-600 font-semibold mr-2">
                Xem tất cả
              </ThemedText>
              <IconSymbol name="chevron-right" size={20} color="#2563eb" />
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {featuredTours.map((tour, idx) => (
              <Animated.View
                key={tour._id}
                entering={FadeIn.delay(idx * 100).duration(500)}
              >
                <TouchableOpacity
                  className="mr-4 w-72 bg-white rounded-2xl shadow-lg overflow-hidden"
                  onPress={() => openDetail(tour._id)}
                >
                  <View className="relative">
                    <Image
                      source={{
                        uri: tour.imageUrl || "https://via.placeholder.com/400",
                      }}
                      className="w-72 h-48"
                      contentFit="cover"
                    />
                    <View className="absolute top-3 left-3">
                      <View className="bg-white px-3 py-1.5 rounded-full flex-row items-center">
                        <IconSymbol name="star" size={14} color="#FFB800" />
                        <ThemedText className="text-gray-900 font-bold text-xs ml-1">
                          {tour.rating.toFixed(1)}
                        </ThemedText>
                      </View>
                    </View>
                    <View className="absolute top-3 right-3">
                      <TouchableOpacity
                        onPress={() => addToWishlist(tour._id)}
                        className="bg-white/90 w-9 h-9 rounded-full items-center justify-center"
                      >
                        <IconSymbol name="heart" size={18} color="#EF4444" />
                      </TouchableOpacity>
                    </View>
                    {tour.originalPrice && (
                      <View className="absolute bottom-3 left-3 bg-red-500 px-3 py-1 rounded-full">
                        <ThemedText className="text-white font-bold text-xs">
                          -
                          {Math.round(
                            (1 - tour.price / tour.originalPrice) * 100
                          )}
                          %
                        </ThemedText>
                      </View>
                    )}
                  </View>
                  <View className="p-4">
                    <ThemedText
                      className="text-lg font-bold text-gray-900 mb-1"
                      numberOfLines={1}
                    >
                      {tour.title}
                    </ThemedText>
                    <ThemedText
                      className="text-gray-500 text-sm mb-2"
                      numberOfLines={2}
                    >
                      {tour.description}
                    </ThemedText>
                    <View className="flex-row items-center mb-3">
                      <IconSymbol name="location" size={14} color="#6B7280" />
                      <ThemedText className="text-gray-600 text-sm ml-1">
                        {tour.location}
                      </ThemedText>
                      <ThemedText className="text-gray-400 mx-2">•</ThemedText>
                      <IconSymbol name="calendar" size={14} color="#6B7280" />
                      <ThemedText className="text-gray-600 text-sm ml-1">
                        {tour.duration} ngày
                      </ThemedText>
                    </View>
                    <View className="flex-row justify-between items-center">
                      <View>
                        <ThemedText className="text-blue-600 font-bold text-xl">
                          {tour.price.toLocaleString("vi-VN")}đ
                        </ThemedText>
                        {tour.originalPrice && (
                          <ThemedText className="text-gray-400 text-xs line-through">
                            {tour.originalPrice.toLocaleString("vi-VN")}đ
                          </ThemedText>
                        )}
                      </View>
                      <TouchableOpacity
                        className="bg-blue-600 px-5 py-2.5 rounded-full"
                        onPress={() => openDetail(tour._id)}
                      >
                        <ThemedText className="text-white font-semibold">
                          Xem ngay
                        </ThemedText>
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </ScrollView>

          {featuredTours.length === 0 && (
            <View className="items-center py-12">
              <IconSymbol name="compass" size={64} color="#D1D5DB" />
              <ThemedText className="text-gray-500 text-center mt-4">
                Chưa có tour nổi bật
              </ThemedText>
            </View>
          )}
        </View>

        {/* Hot Deals */}
        {allTours.length > 0 && (
          <View className="px-4 py-4">
            <View className="flex-row justify-between items-center mb-4">
              <View>
                <ThemedText className="text-xl font-bold text-gray-900">
                  Ưu đãi hot 🔥
                </ThemedText>
                <ThemedText className="text-gray-500 text-sm">
                  Đặt ngay để nhận ưu đãi
                </ThemedText>
              </View>
              <TouchableOpacity
                onPress={() => router.push("/screens/deals/AllDeals")}
                className="flex-row items-center"
              >
                <ThemedText className="text-blue-600 font-semibold mr-2">
                  Xem tất cả
                </ThemedText>
                <IconSymbol name="chevron-right" size={20} color="#2563eb" />
              </TouchableOpacity>
            </View>

            {allTours.slice(0, 3).map((tour, idx) => (
              <Animated.View
                key={tour._id}
                entering={FadeIn.delay(idx * 100).duration(500)}
              >
                <TouchableOpacity
                  className="mb-4 bg-white rounded-2xl shadow-md overflow-hidden flex-row"
                  onPress={() => openDetail(tour._id)}
                >
                  <Image
                    source={{
                      uri: tour.imageUrl || "https://via.placeholder.com/200",
                    }}
                    className="w-32 h-32"
                    contentFit="cover"
                  />
                  <View className="flex-1 p-3 justify-between">
                    <View>
                      <ThemedText
                        className="font-bold text-gray-900 mb-1"
                        numberOfLines={1}
                      >
                        {tour.title}
                      </ThemedText>
                      <View className="flex-row items-center mb-2">
                        <IconSymbol name="location" size={12} color="#6B7280" />
                        <ThemedText className="text-gray-600 text-xs ml-1">
                          {tour.location}
                        </ThemedText>
                      </View>
                      <View className="flex-row items-center">
                        <IconSymbol name="star" size={14} color="#FFB800" />
                        <ThemedText className="text-gray-600 text-xs ml-1">
                          {tour.rating} ({tour.reviewCount})
                        </ThemedText>
                      </View>
                    </View>
                    <View className="flex-row justify-between items-center mt-2">
                      <ThemedText className="text-blue-600 font-bold">
                        {tour.price.toLocaleString("vi-VN")}đ
                      </ThemedText>
                      {tour.originalPrice && (
                        <View className="bg-red-100 px-2 py-1 rounded">
                          <ThemedText className="text-red-600 font-bold text-xs">
                            -
                            {Math.round(
                              (1 - tour.price / tour.originalPrice) * 100
                            )}
                            %
                          </ThemedText>
                        </View>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        )}

        {/* Bottom Padding */}
        <View className="h-24" />
      </ScrollView>

      {/* User Menu Modal */}
      <Modal
        transparent
        visible={menuVisible}
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable
          className="flex-1 bg-black/40"
          onPress={() => setMenuVisible(false)}
        >
          <View className="flex-1 justify-end" />
        </Pressable>

        <View className="bg-white rounded-t-3xl p-6 pb-12">
          <View className="w-12 h-1.5 bg-gray-300 self-center rounded-full mb-6" />
          <MenuItem
            icon="user"
            label="Hồ sơ cá nhân"
            onPress={() => {
              setMenuVisible(false);
              router.push("/(tabs)/profile");
            }}
          />
          <MenuItem
            icon="calendar"
            label="Đơn đặt gần đây"
            onPress={() => {
              setMenuVisible(false);
              router.push("/(tabs)/bookings");
            }}
          />
          <MenuItem
            icon="heart"
            label="Danh sách yêu thích"
            onPress={() => {
              setMenuVisible(false);
              router.push("/(tabs)/wishlist");
            }}
          />
          <MenuItem
            icon="bell"
            label="Thông báo"
            onPress={() => {
              setMenuVisible(false);
              router.push("/screens/notifications/Notifications");
            }}
          />
          <MenuItem
            icon="settings"
            label="Cài đặt"
            onPress={() => {
              setMenuVisible(false);
              Alert.alert("Thông báo", "Tính năng đang phát triển");
            }}
          />
          <View className="h-px bg-gray-200 my-3" />
          <MenuItem
            icon="log-out"
            label="Đăng xuất"
            onPress={() => {
              setMenuVisible(false);
              router.push("/(auth)/login");
            }}
            textColor="text-red-600"
          />
        </View>
      </Modal>
    </ThemedView>
  );
}

/** Menu Item Component */
function MenuItem({
  icon,
  label,
  onPress,
  textColor = "text-gray-900",
}: {
  icon: string;
  label: string;
  onPress: () => void;
  textColor?: string;
}) {
  return (
    <TouchableOpacity onPress={onPress} className="flex-row items-center py-4">
      <View className="w-10 h-10 rounded-xl bg-gray-100 items-center justify-center mr-4">
        <IconSymbol name={icon} size={20} color="#374151" />
      </View>
      <ThemedText className={`flex-1 text-base font-medium ${textColor}`}>
        {label}
      </ThemedText>
      <IconSymbol name="chevron-right" size={20} color="#9CA3AF" />
    </TouchableOpacity>
  );
}
