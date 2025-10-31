import { useState, useEffect } from "react";
import { ThemedText } from "@/ui-components/themed-text";
import { ThemedView } from "@/ui-components/themed-view";
import { Image } from "expo-image";
import { router, useRouter } from "expo-router";
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
import { useUser } from "../_layout";
import { IconSymbol } from "@/ui-components/ui/icon-symbol";

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
  const { user } = useUser();
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
    // Only allow real tour IDs (MongoDB ObjectId format: 24 hex chars)
    if (!tourId || !tourId.match(/^[0-9a-fA-F]{24}$/)) {
      // If it's a destination name, try to find matching tour
      const matchingTour = allTours.find(
        (tour) => tour.location.includes(tourId) || tour.title.includes(tourId)
      );
      if (matchingTour) {
        router.push({
          pathname: "/screens/destinations/HotelDetail",
          params: { destinationId: matchingTour._id },
        });
      } else {
        // Just show search
        router.push("/screens/tours/AllTours");
      }
      return;
    }
    
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

        {/* Quick Booking Options */}
        <View className="px-4 py-4">
          <View className="flex-row flex-wrap justify-between">
            <TouchableOpacity
              className="bg-green-50 border-2 border-green-200 rounded-2xl p-4 mb-4"
              style={{ width: "48%" }}
              onPress={() => {
                // Navigate to nearby hotels/tours
                router.push("/screens/tours/AllTours");
              }}
            >
              <View className="items-center">
                <View className="bg-green-100 rounded-full p-3 mb-3">
                  <IconSymbol name="map-pin" size={32} color="#10b981" />
                </View>
                <ThemedText className="text-green-700 font-bold text-base text-center mb-1">
                  Gần bạn
                </ThemedText>
                <ThemedText className="text-green-600 text-xs text-center">
                  Một bước lên mây
                </ThemedText>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-4 mb-4"
              style={{ width: "48%" }}
              onPress={() => {
                router.push("/screens/tours/AllTours");
              }}
            >
              <View className="items-center">
                <View className="bg-orange-100 rounded-full p-3 mb-3">
                  <IconSymbol name="clock" size={32} color="#f97316" />
                </View>
                <ThemedText className="text-orange-700 font-bold text-base text-center mb-1">
                  Theo giờ
                </ThemedText>
                <ThemedText className="text-orange-600 text-xs text-center">
                  Xịn từng phút giây
                </ThemedText>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-purple-50 border-2 border-purple-200 rounded-2xl p-4 mb-4"
              style={{ width: "48%" }}
              onPress={() => {
                router.push("/screens/tours/AllTours");
              }}
            >
              <View className="items-center">
                <View className="bg-purple-100 rounded-full p-3 mb-3">
                  <IconSymbol name="moon" size={32} color="#a855f7" />
                </View>
                <ThemedText className="text-purple-700 font-bold text-base text-center mb-1">
                  Qua đêm
                </ThemedText>
                <ThemedText className="text-purple-600 text-xs text-center">
                  Ngon giấc như ở nhà
                </ThemedText>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4 mb-4"
              style={{ width: "48%" }}
              onPress={() => {
                router.push("/screens/tours/AllTours");
              }}
            >
              <View className="items-center">
                <View className="bg-blue-100 rounded-full p-3 mb-3">
                  <IconSymbol name="calendar" size={32} color="#3b82f6" />
                </View>
                <ThemedText className="text-blue-700 font-bold text-base text-center mb-1">
                  Theo ngày
                </ThemedText>
                <ThemedText className="text-blue-600 text-xs text-center">
                  Mỗi ngày 1 niềm vui
                </ThemedText>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Top Destinations */}
        <View className="px-4 py-4">
          <SectionHeader
            title="Điểm đến phổ biến"
            subtitle="Khám phá ngay"
            delay={400}
            onViewAll={() =>
              router.push("/screens/destinations/AllDestinations")
            }
          />

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 16 }}
          >
            {TOP_DESTINATIONS.map((destination, idx) => {
              // Try to find a real tour matching this destination name
              const matchingTour = allTours.find(
                (tour) => tour.location.includes(destination.name) || 
                          tour.title.includes(destination.name)
              );
              
              return (
                <DestinationCard
                  key={destination.id}
                  destination={destination}
                  onPress={(id) => {
                    // If we found a matching tour, use its real ID
                    if (matchingTour) {
                      openDetail(matchingTour._id);
                    } else {
                      // Otherwise just search
                      router.push("/screens/tours/AllTours");
                    }
                  }}
                  index={idx}
                />
              );
            })}
          </ScrollView>
        </View>

        {/* Featured Tours */}
        <View className="px-4 py-4">
          <SectionHeader
            title="Tour nổi bật"
            subtitle="Được yêu thích nhất"
            delay={500}
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
              delay={600}
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
