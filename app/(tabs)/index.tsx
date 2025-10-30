import { useState, useEffect } from "react";
import { ThemedText } from "@/ui-components/themed-text";
import { ThemedView } from "@/ui-components/themed-view";
import { Image } from "expo-image";
import { router } from "expo-router";
import {
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  View,
  RefreshControl,
} from "react-native";
import { IMAGES } from "../Util_Images";
import { api, type Tour } from "@/services/api";
import Animated, { FadeInDown } from "react-native-reanimated";

// Components
import HeroHeader from "@/app/components/home/HeroHeader";
import SectionHeader from "@/app/components/home/SectionHeader";
import TourCard from "@/app/components/common/TourCard";
import DestinationCard from "@/app/components/common/DestinationCard";
import QuickFilters from "@/app/components/common/QuickFilters";
import UserMenu from "@/app/components/common/UserMenu";

const TOP_DESTINATIONS = [
  { id: "1", name: "Đà Lạt", image: IMAGES.dalat, count: "150+ địa điểm" },
  { id: "2", name: "Phú Quốc", image: IMAGES.phuquoc, count: "120+ địa điểm" },
  { id: "3", name: "Hội An", image: IMAGES.hoian, count: "90+ địa điểm" },
  { id: "4", name: "Hạ Long", image: IMAGES.halong, count: "80+ địa điểm" },
  { id: "5", name: "Sa Pa", image: IMAGES.sapa, count: "60+ địa điểm" },
];

export default function HomeScreen() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [featuredTours, setFeaturedTours] = useState<Tour[]>([]);
  const [allTours, setAllTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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
    router.push("/screens/tours/AllTours");
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
    } catch (error) {
      // Silent fail
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
        <HeroHeader
          onSearchPress={handleSearch}
          onMenuPress={() => setMenuVisible(true)}
        />

        <QuickFilters />

        {/* Top Destinations */}
        <View className="px-4 py-4">
          <SectionHeader
            title="Điểm đến phổ biến"
            subtitle="Khám phá ngay"
            onViewAll={() =>
              router.push("/screens/destinations/AllDestinations")
            }
          />

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {TOP_DESTINATIONS.map((destination, idx) => (
              <Animated.View
                key={destination.id}
                entering={FadeInDown.delay(idx * 100).duration(500)}
              >
                <DestinationCard
                  destination={destination}
                  onPress={openDetail}
                />
              </Animated.View>
            ))}
          </ScrollView>
        </View>

        {/* Featured Tours */}
        <View className="px-4 py-4">
          <SectionHeader
            title="Tour nổi bật"
            subtitle="Được yêu thích nhất"
            onViewAll={() => router.push("/screens/tours/AllTours")}
          />

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {featuredTours.map((tour) => (
              <TourCard
                key={tour._id}
                tour={tour}
                onPress={openDetail}
                onWishlistPress={addToWishlist}
              />
            ))}
          </ScrollView>

          {featuredTours.length === 0 && (
            <View className="items-center py-12">
              <Image source={IMAGES.dalat} className="w-24 h-24" />
              <ThemedText className="text-gray-500 text-center mt-4">
                Chưa có tour nổi bật
              </ThemedText>
            </View>
          )}
        </View>

        {/* Hot Deals */}
        {allTours.length > 0 && (
          <View className="px-4 py-4">
            <SectionHeader
              title="Ưu đãi hot 🔥"
              subtitle="Đặt ngay để nhận ưu đãi"
              onViewAll={() => router.push("/screens/deals/AllDeals")}
            />

            {allTours.slice(0, 3).map((tour) => (
              <TourCard
                key={tour._id}
                tour={tour}
                onPress={openDetail}
                onWishlistPress={addToWishlist}
                variant="horizontal"
              />
            ))}
          </View>
        )}

        <View className="h-24" />
      </ScrollView>

      <UserMenu visible={menuVisible} onClose={() => setMenuVisible(false)} />
    </ThemedView>
  );
}
