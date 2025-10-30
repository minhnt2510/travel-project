import { api } from "@/services/api";
import { ThemedText } from "@/ui-components/themed-text";
import { ThemedView } from "@/ui-components/themed-view";
import { IconSymbol } from "@/ui-components/ui/icon-symbol";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  TouchableOpacity,
  View,
  RefreshControl,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

export default function WishlistScreen() {
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    try {
      setLoading(true);
      const data = await api.getWishlist();
      setWishlistItems(data);
    } catch (error) {
      console.error("Error loading wishlist:", error);
      Alert.alert("Lỗi", "Không thể tải danh sách yêu thích");
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadWishlist();
    setRefreshing(false);
  };

  const removeFromWishlist = async (tourId: string) => {
    Alert.alert(
      "Xóa khỏi danh sách yêu thích",
      "Bạn có chắc chắn muốn xóa tour này khỏi danh sách yêu thích?",
      [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Xóa",
          style: "destructive",
          onPress: async () => {
            try {
              await api.removeFromWishlist(tourId);
              await loadWishlist();
              Alert.alert("Thành công", "Đã xóa khỏi danh sách yêu thích!");
            } catch (error) {
              Alert.alert("Lỗi", "Không thể xóa");
            }
          },
        },
      ]
    );
  };

  const handleItemPress = (tourId: string) => {
    router.push({
      pathname: "/screens/destinations/HotelDetail",
      params: { destinationId: tourId },
    });
  };

  const renderEmptyState = () => (
    <View className="flex-1 items-center justify-center p-8">
      <View className="bg-gradient-to-br from-pink-100 to-red-100 w-32 h-32 rounded-full items-center justify-center">
        <IconSymbol name="heart" size={64} color="#EF4444" />
      </View>
      <ThemedText className="text-2xl font-bold text-gray-900 mt-6 mb-2">
        Danh sách yêu thích trống
      </ThemedText>
      <ThemedText className="text-gray-500 text-center mb-8">
        Hãy khám phá và thêm những tour du lịch yêu thích vào đây nhé!
      </ThemedText>
      <TouchableOpacity
        className="bg-blue-600 px-8 py-4 rounded-full flex-row items-center"
        onPress={() => router.push("/")}
      >
        <ThemedText className="text-white font-bold text-lg mr-2">
          Khám phá ngay
        </ThemedText>
        <IconSymbol name="arrow-right" size={20} color="#FFF" />
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <ThemedView className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#2563eb" />
        <ThemedText className="mt-4 text-gray-600">Đang tải...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-gradient-to-r from-pink-500 to-red-500 p-6 pt-12">
        <ThemedText className="text-3xl font-extrabold text-white mb-2">
          Danh sách yêu thích
        </ThemedText>
        <ThemedText className="text-pink-100">
          {wishlistItems.length} tour đã lưu
        </ThemedText>
      </View>

      {wishlistItems.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={wishlistItems}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ padding: 16 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({ item, index }) => {
            const tour = typeof item.tourId === "object" ? item.tourId : null;
            if (!tour) return null;

            return (
              <Animated.View entering={FadeInDown.delay(index * 100).duration(500)}>
                <TouchableOpacity
                  className="bg-white rounded-2xl shadow-lg mb-4 overflow-hidden"
                  onPress={() => handleItemPress(tour._id)}
                >
                  <View className="relative">
                    <Image
                      source={{ uri: tour.imageUrl || "https://via.placeholder.com/400" }}
                      className="w-full h-56"
                      contentFit="cover"
                    />
                    <View className="absolute top-4 right-4">
                      <TouchableOpacity
                        onPress={() => removeFromWishlist(tour._id)}
                        className="bg-white w-12 h-12 rounded-full items-center justify-center shadow-lg"
                      >
                        <IconSymbol name="heart" size={24} color="#EF4444" />
                      </TouchableOpacity>
                    </View>
                    <View className="absolute top-4 left-4">
                      <View className="bg-white px-3 py-2 rounded-full flex-row items-center shadow-md">
                        <IconSymbol name="star" size={14} color="#FFB800" />
                        <ThemedText className="text-gray-900 font-bold text-xs ml-1">
                          {tour.rating?.toFixed(1) || "0.0"}
                        </ThemedText>
                      </View>
                    </View>
                    {tour.originalPrice && (
                      <View className="absolute bottom-4 left-4 bg-red-500 px-3 py-1.5 rounded-full">
                        <ThemedText className="text-white font-bold text-xs">
                          -{Math.round((1 - tour.price / tour.originalPrice) * 100)}%
                        </ThemedText>
                      </View>
                    )}
                  </View>

                  <View className="p-4">
                    <ThemedText className="text-xl font-bold text-gray-900 mb-2">
                      {tour.title}
                    </ThemedText>
                    <View className="flex-row items-center mb-3">
                      <IconSymbol name="map-pin" size={16} color="#6B7280" />
                      <ThemedText className="text-gray-600 ml-2">
                        {tour.location}
                      </ThemedText>
                    </View>
                    <View className="flex-row items-center mb-3">
                      <IconSymbol name="calendar" size={16} color="#6B7280" />
                      <ThemedText className="text-gray-600 ml-2">
                        {tour.duration} ngày
                      </ThemedText>
                      <ThemedText className="text-gray-400 mx-2">•</ThemedText>
                      <IconSymbol name="users" size={16} color="#6B7280" />
                      <ThemedText className="text-gray-600 ml-2">
                        Còn {tour.availableSeats} chỗ
                      </ThemedText>
                    </View>
                    <ThemedText
                      className="text-gray-500 text-sm mb-3"
                      numberOfLines={2}
                    >
                      {tour.description}
                    </ThemedText>
                    <View className="flex-row justify-between items-center pt-3 border-t border-gray-200">
                      <View>
                        <ThemedText className="text-blue-600 font-bold text-xl">
                          {tour.price?.toLocaleString("vi-VN")}đ
                        </ThemedText>
                        {tour.originalPrice && (
                          <ThemedText className="text-gray-400 text-sm line-through">
                            {tour.originalPrice.toLocaleString("vi-VN")}đ
                          </ThemedText>
                        )}
                      </View>
                      <TouchableOpacity
                        className="bg-blue-600 px-6 py-3 rounded-full flex-row items-center"
                        onPress={() => handleItemPress(tour._id)}
                      >
                        <ThemedText className="text-white font-bold mr-2">
                          Xem tour
                        </ThemedText>
                        <IconSymbol name="arrow-right" size={18} color="#FFF" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            );
          }}
        />
      )}
    </ThemedView>
  );
}
