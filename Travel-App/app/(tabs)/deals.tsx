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

export default function DealsScreen() {
  const [deals, setDeals] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDeals();
  }, []);

  const loadDeals = async () => {
    try {
      setLoading(true);
      const result = await api.getTours({ limit: 50 });
      // Filter tours with discounts
      const toursWithDiscount = result.tours.filter(
        (tour) => tour.originalPrice && tour.originalPrice > tour.price
      );
      // Sort by discount percentage
      toursWithDiscount.sort((a, b) => {
        const discountA = a.originalPrice && a.price ? (a.originalPrice - a.price) / a.originalPrice : 0;
        const discountB = b.originalPrice && b.price ? (b.originalPrice - b.price) / b.originalPrice : 0;
        return discountB - discountA;
      });
      setDeals(toursWithDiscount);
    } catch (error) {
      console.error("Error loading deals:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDeals();
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
        colors={['#ef4444', '#f97316', '#fbbf24']}
        className="px-4 pt-16 pb-8 rounded-b-3xl"
      >
        <ThemedText className="text-white text-3xl font-extrabold mb-2">
          Ưu đãi hot 🔥
        </ThemedText>
        <ThemedText className="text-white/90 text-base font-medium">
          {deals.length} tour đang có ưu đãi đặc biệt
        </ThemedText>
      </LinearGradient>

      <ScrollView
        className="flex-1 px-4 pt-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {deals.length === 0 ? (
          <View className="items-center justify-center py-20">
            <IconSymbol name="tag" size={64} color="#9ca3af" />
            <ThemedText className="text-gray-600 text-lg font-semibold mt-4">
              Hiện chưa có ưu đãi nào
            </ThemedText>
            <ThemedText className="text-gray-500 text-sm mt-2">
              Hãy quay lại sau nhé!
            </ThemedText>
          </View>
        ) : (
          <View>
            {deals.map((tour, idx) => {
              const discount = tour.originalPrice && tour.price
                ? Math.round(((tour.originalPrice - tour.price) / tour.originalPrice) * 100)
                : 0;
              
              return (
                <Animated.View
                  key={tour._id}
                  entering={FadeInDown.delay(idx * 50).duration(500)}
                  className="mb-4"
                >
                  <View className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100">
                    {/* Discount Badge */}
                    <View className="absolute top-4 right-4 z-10">
                      <LinearGradient
                        colors={['#ef4444', '#dc2626']}
                        className="px-4 py-2 rounded-full shadow-lg"
                      >
                        <ThemedText className="text-white font-extrabold text-sm">
                          -{discount}%
                        </ThemedText>
                      </LinearGradient>
                    </View>

                    <TourCard
                      tour={tour}
                      onPress={openDetail}
                      onWishlistPress={handleWishlist}
                      variant="horizontal"
                    />
                  </View>
                </Animated.View>
              );
            })}
          </View>
        )}

        <View className="h-24" />
      </ScrollView>
    </ThemedView>
  );
}

