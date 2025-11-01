import { useState, useEffect } from "react";
import { ThemedText } from "@/ui-components/themed-text";
import { ThemedView } from "@/ui-components/themed-view";
import { IconSymbol } from "@/ui-components/ui/icon-symbol";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import {
  ScrollView,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
  TextInput,
} from "react-native";
import { api, type Tour } from "@/services/api";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";

const categories = [
  { id: "all", name: "Tất cả", icon: "grid" },
  { id: "adventure", name: "Phiêu lưu", icon: "compass" },
  { id: "culture", name: "Văn hóa", icon: "book" },
  { id: "beach", name: "Biển", icon: "droplet" },
  { id: "mountain", name: "Núi", icon: "trending-up" },
  { id: "city", name: "Thành phố", icon: "map-pin" },
];

export default function AllToursScreen() {
  const params = useLocalSearchParams();
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState(
    (params.search as string) || ""
  );
  const [filterVisible, setFilterVisible] = useState(false);

  useEffect(() => {
    loadTours();
  }, [selectedCategory]);

  const loadTours = async () => {
    try {
      setLoading(true);
      const filters: any = {
        limit: 50,
        offset: 0,
      };

      if (selectedCategory !== "all") {
        filters.category = selectedCategory;
      }

      if (searchQuery.trim()) {
        filters.search = searchQuery;
      }

      const result = await api.getTours(filters);
      setTours(result.tours);
    } catch (error) {
      console.error("Error loading tours:", error);
      Alert.alert("Lỗi", "Không thể tải danh sách tours");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    loadTours();
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
          Đang tải tours...
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView className="flex-1 bg-gray-50">
      {/* Header with Gradient */}
      <LinearGradient
        colors={["#2563eb", "#1d4ed8", "#1e40af"] as [string, string, ...string[]]}
        className="p-4 pt-12"
      >
        <View className="flex-row items-center mb-4">
          <TouchableOpacity onPress={() => router.back()}>
            <View className="w-10 h-10 rounded-full bg-white/20 items-center justify-center backdrop-blur-sm">
              <IconSymbol name="arrow-left" size={24} color="#FFF" />
            </View>
          </TouchableOpacity>
          <ThemedText className="text-white text-2xl font-bold ml-4 flex-1">
            Tất cả tour ({tours.length})
          </ThemedText>
        </View>

        {/* Search Bar */}
        <View 
          className="bg-white rounded-2xl px-4 py-3.5 flex-row items-center shadow-xl"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 12,
            elevation: 8,
          }}
        >
          <IconSymbol name="search" size={20} color="#6B7280" />
          <TextInput
            className="flex-1 ml-3 text-gray-900"
            placeholder="Tìm kiếm tour..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <IconSymbol name="x" size={20} color="#6B7280" />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={handleSearch}
            className="ml-2 bg-blue-600 px-4 py-2.5 rounded-xl shadow-lg"
            style={{
              shadowColor: "#2563eb",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 4,
            }}
          >
            <IconSymbol name="arrow-right" size={18} color="#FFF" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Category Filter */}
      <View className="bg-white p-4 border-b border-gray-100 shadow-sm">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row space-x-3">
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                className={`px-5 py-2.5 rounded-full flex-row items-center ${
                  selectedCategory === cat.id 
                    ? "bg-blue-600 shadow-lg" 
                    : "bg-gray-100 border border-gray-200"
                }`}
                onPress={() => setSelectedCategory(cat.id)}
                style={
                  selectedCategory === cat.id
                    ? {
                        shadowColor: "#2563eb",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.3,
                        shadowRadius: 4,
                        elevation: 4,
                      }
                    : {}
                }
              >
                <IconSymbol
                  name={cat.icon}
                  size={16}
                  color={selectedCategory === cat.id ? "#FFF" : "#6B7280"}
                />
                <ThemedText
                  className={`ml-2 font-bold text-sm ${
                    selectedCategory === cat.id ? "text-white" : "text-gray-700"
                  }`}
                >
                  {cat.name}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Tours List */}
      <ScrollView className="flex-1 bg-gray-50">
        <View className="p-4">
          {tours.length === 0 ? (
            <View className="items-center py-20">
              <IconSymbol name="compass" size={80} color="#D1D5DB" />
              <ThemedText className="text-xl font-semibold text-gray-500 mt-4">
                Không tìm thấy tour
              </ThemedText>
              <ThemedText className="text-gray-400 text-center mt-2">
                Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
              </ThemedText>
            </View>
          ) : (
            tours.map((tour, idx) => (
              <Animated.View
                key={tour._id}
                entering={FadeInDown.delay(idx * 50).duration(500)}
              >
                <TouchableOpacity
                  className="mb-4 bg-white rounded-2xl overflow-hidden shadow-xl"
                  onPress={() => openDetail(tour._id)}
                  style={{
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.15,
                    shadowRadius: 12,
                    elevation: 8,
                  }}
                  activeOpacity={0.9}
                >
                  <View className="relative">
                    <Image
                      source={{
                        uri: tour.imageUrl || "https://via.placeholder.com/400",
                      }}
                      className="w-full h-56"
                      contentFit="cover"
                    />
                    <LinearGradient
                      colors={["transparent", "rgba(0,0,0,0.4)"] as [string, string, ...string[]]}
                      className="absolute bottom-0 left-0 right-0 h-24"
                    />
                    <View className="absolute top-4 left-4">
                      <View 
                        className="bg-white/95 px-3 py-2 rounded-full flex-row items-center shadow-lg backdrop-blur-sm"
                        style={{
                          shadowColor: "#000",
                          shadowOffset: { width: 0, height: 2 },
                          shadowOpacity: 0.2,
                          shadowRadius: 4,
                          elevation: 4,
                        }}
                      >
                        <IconSymbol name="star" size={14} color="#FFB800" />
                        <ThemedText className="text-gray-900 font-bold text-xs ml-1">
                          {tour.rating.toFixed(1)}
                        </ThemedText>
                        <ThemedText className="text-gray-500 text-xs ml-1">
                          ({tour.reviewCount})
                        </ThemedText>
                      </View>
                    </View>
                    <View className="absolute top-4 right-4">
                      <TouchableOpacity
                        onPress={(e) => {
                          e.stopPropagation();
                          addToWishlist(tour._id);
                        }}
                        className="bg-white/95 w-10 h-10 rounded-full items-center justify-center shadow-lg backdrop-blur-sm"
                        style={{
                          shadowColor: "#000",
                          shadowOffset: { width: 0, height: 2 },
                          shadowOpacity: 0.2,
                          shadowRadius: 4,
                          elevation: 4,
                        }}
                      >
                        <IconSymbol name="heart" size={20} color="#EF4444" />
                      </TouchableOpacity>
                    </View>
                    {tour.originalPrice && (
                      <View 
                        className="absolute bottom-4 left-4 bg-red-500 px-3 py-1.5 rounded-full shadow-xl"
                        style={{
                          shadowColor: "#ef4444",
                          shadowOffset: { width: 0, height: 2 },
                          shadowOpacity: 0.4,
                          shadowRadius: 4,
                          elevation: 6,
                        }}
                      >
                        <ThemedText className="text-white font-bold text-sm">
                          -
                          {Math.round(
                            (1 - tour.price / tour.originalPrice) * 100
                          )}
                          % GIẢM
                        </ThemedText>
                      </View>
                    )}
                  </View>
                  <View className="p-4">
                    <View className="flex-row justify-between items-start mb-2">
                      <View className="flex-1">
                        <ThemedText className="text-xl font-bold text-gray-900">
                          {tour.title}
                        </ThemedText>
                        <View className="flex-row items-center mt-1">
                          <IconSymbol
                            name="map-pin"
                            size={14}
                            color="#6B7280"
                          />
                          <ThemedText className="text-gray-600 text-sm ml-1">
                            {tour.location}
                          </ThemedText>
                        </View>
                      </View>
                    </View>

                    <ThemedText
                      className="text-gray-500 text-sm mb-3"
                      numberOfLines={2}
                    >
                      {tour.description}
                    </ThemedText>

                    <View className="flex-row items-center justify-between mb-3">
                      <View className="flex-row items-center space-x-4">
                        <View className="flex-row items-center">
                          <IconSymbol
                            name="calendar"
                            size={14}
                            color="#6B7280"
                          />
                          <ThemedText className="text-gray-600 text-sm ml-1">
                            {tour.duration} ngày
                          </ThemedText>
                        </View>
                        <View className="flex-row items-center">
                          <IconSymbol name="users" size={14} color="#6B7280" />
                          <ThemedText className="text-gray-600 text-sm ml-1">
                            Còn {tour.availableSeats} chỗ
                          </ThemedText>
                        </View>
                      </View>
                    </View>

                    <View className="flex-row items-center justify-between pt-3 border-t border-gray-200">
                      <View>
                        <ThemedText className="text-blue-600 font-bold text-2xl">
                          {tour.price.toLocaleString("vi-VN")}đ
                        </ThemedText>
                        {tour.originalPrice && (
                          <ThemedText className="text-gray-400 text-sm line-through">
                            {tour.originalPrice.toLocaleString("vi-VN")}đ
                          </ThemedText>
                        )}
                      </View>
                      <TouchableOpacity
                        className="bg-blue-600 px-6 py-3 rounded-full flex-row items-center shadow-lg"
                        onPress={() => openDetail(tour._id)}
                        style={{
                          shadowColor: "#2563eb",
                          shadowOffset: { width: 0, height: 2 },
                          shadowOpacity: 0.3,
                          shadowRadius: 4,
                          elevation: 4,
                        }}
                      >
                        <ThemedText className="text-white font-bold mr-2">
                          Xem chi tiết
                        </ThemedText>
                        <IconSymbol name="arrow-right" size={18} color="#FFF" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            ))
          )}
        </View>
        <View className="h-24" />
      </ScrollView>
    </ThemedView>
  );
}
