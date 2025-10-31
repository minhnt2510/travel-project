import { useState, useEffect } from "react";
import { ThemedText } from "@/ui-components/themed-text";
import { ThemedView } from "@/ui-components/themed-view";
import { IconSymbol } from "@/ui-components/ui/icon-symbol";
import { router } from "expo-router";
import {
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  View,
  RefreshControl,
} from "react-native";
import { api, type Tour } from "@/services/api";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown } from "react-native-reanimated";
import TourCard from "@/app/components/common/TourCard";
import SectionHeader from "@/app/components/home/SectionHeader";

export default function ExploreScreen() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [
    { id: "beach", name: "Biển", emoji: "🏖️", color: ['#06b6d4', '#3b82f6'] },
    { id: "mountain", name: "Núi", emoji: "🏔️", color: ['#10b981', '#059669'] },
    { id: "city", name: "Thành phố", emoji: "🏙️", color: ['#8b5cf6', '#6366f1'] },
    { id: "culture", name: "Văn hóa", emoji: "🏛️", color: ['#f59e0b', '#d97706'] },
    { id: "nature", name: "Thiên nhiên", emoji: "🌳", color: ['#ec4899', '#db2777'] },
  ];

  useEffect(() => {
    loadTours();
  }, [selectedCategory]);

  const loadTours = async () => {
    try {
      setLoading(true);
      const filters: any = { limit: 50 };
      if (selectedCategory) {
        filters.category = selectedCategory;
      }
      const result = await api.getTours(filters);
      setTours(result.tours);
    } catch (error) {
      console.error("Error loading tours:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTours();
    setRefreshing(false);
  };

  const openDetail = (tourId: string) => {
    router.push({
      pathname: "/screens/destinations/HotelDetail",
      params: { destinationId: tourId },
    });
  };

  const handleWishlist = (tourId: string) => {
    // TODO: Handle wishlist
  };

  if (loading) {
    return (
      <ThemedView className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#667eea" />
        <ThemedText className="mt-4 text-gray-600">Đang tải...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView className="flex-1 bg-gray-50">
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        className="px-4 pt-16 pb-8 rounded-b-3xl"
      >
        <ThemedText className="text-white text-3xl font-extrabold mb-4">
          Khám phá 🗺️
        </ThemedText>
        <ThemedText className="text-white/90 text-base">
          Tìm kiếm tour theo sở thích của bạn
        </ThemedText>
      </LinearGradient>

      {/* Categories Filter */}
      <View className="px-4 py-4 bg-white">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row">
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setSelectedCategory(null)}
              className={`mr-3 px-5 py-2.5 rounded-full ${
                selectedCategory === null ? "bg-purple-600" : "bg-gray-100"
              }`}
            >
              <ThemedText
                className={`font-bold ${
                  selectedCategory === null ? "text-white" : "text-gray-700"
                }`}
              >
                Tất cả
              </ThemedText>
            </TouchableOpacity>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                activeOpacity={0.8}
                onPress={() => setSelectedCategory(cat.id)}
                className="mr-3 overflow-hidden rounded-full"
              >
                {selectedCategory === cat.id ? (
                  <LinearGradient
                    colors={cat.color}
                    className="px-5 py-2.5"
                  >
                    <ThemedText className="text-white font-bold">
                      {cat.emoji} {cat.name}
                    </ThemedText>
                  </LinearGradient>
                ) : (
                  <View className="px-5 py-2.5 bg-gray-100">
                    <ThemedText className="text-gray-700 font-semibold">
                      {cat.emoji} {cat.name}
                    </ThemedText>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      <ScrollView
        className="flex-1 px-4 pt-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        <SectionHeader
          title={selectedCategory ? `Tour ${categories.find(c => c.id === selectedCategory)?.name}` : "Tất cả tour"}
          subtitle={`${tours.length} tour tìm thấy`}
        />

        {tours.length === 0 ? (
          <View className="items-center justify-center py-20">
            <IconSymbol name="search" size={64} color="#9ca3af" />
            <ThemedText className="text-gray-600 text-lg font-semibold mt-4">
              Không tìm thấy tour nào
            </ThemedText>
            <ThemedText className="text-gray-500 text-sm mt-2">
              Thử chọn danh mục khác nhé!
            </ThemedText>
          </View>
        ) : (
          <View>
            {tours.map((tour, idx) => (
              <Animated.View
                key={tour._id}
                entering={FadeInDown.delay(idx * 50).duration(500)}
              >
                <TourCard
                  tour={tour}
                  onPress={openDetail}
                  onWishlistPress={handleWishlist}
                  variant="horizontal"
                />
              </Animated.View>
            ))}
          </View>
        )}

        <View className="h-24" />
      </ScrollView>
    </ThemedView>
  );
}

