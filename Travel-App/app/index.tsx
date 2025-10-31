import { useState, useEffect } from "react";
import { ThemedText } from "@/ui-components/themed-text";
import { ThemedView } from "@/ui-components/themed-view";
import { IconSymbol } from "@/ui-components/ui/icon-symbol";
import { Image } from "expo-image";
import { router } from "expo-router";
import {
  ScrollView,
  TouchableOpacity,
  View,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { IMAGES } from "./Util_Images";
import { api, type Tour } from "@/services/api";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown } from "react-native-reanimated";
import SearchBar from "@/app/components/common/SearchBar";
import SectionHeader from "@/app/components/home/SectionHeader";
import TourCard from "@/app/components/common/TourCard";
import DestinationCard from "@/app/components/common/DestinationCard";
import QuickFilters from "@/app/components/common/QuickFilters";

export default function GuestHomeScreen() {
  const [featuredTours, setFeaturedTours] = useState<Tour[]>([]);
  const [allTours, setAllTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const TOP_DESTINATIONS = [
    { id: "1", name: "Đà Lạt", image: IMAGES.dalat, count: "150+ địa điểm" },
    { id: "2", name: "Phú Quốc", image: IMAGES.phuquoc, count: "120+ địa điểm" },
    { id: "3", name: "Hội An", image: IMAGES.hoian, count: "90+ địa điểm" },
    { id: "4", name: "Hạ Long", image: IMAGES.halong, count: "80+ địa điểm" },
    { id: "5", name: "Sa Pa", image: IMAGES.sapa, count: "60+ địa điểm" },
    { id: "6", name: "Huế", image: IMAGES.hue, count: "70+ địa điểm" },
    { id: "7", name: "Nha Trang", image: IMAGES.nhatrang, count: "100+ địa điểm" },
  ];

  const CATEGORIES = [
    { id: "1", name: "Biển", emoji: "🏖️", count: "200+ tour", color: ['#06b6d4', '#3b82f6'] },
    { id: "2", name: "Núi", emoji: "🏔️", count: "150+ tour", color: ['#10b981', '#059669'] },
    { id: "3", name: "Thành phố", emoji: "🏙️", count: "180+ tour", color: ['#8b5cf6', '#6366f1'] },
    { id: "4", name: "Văn hóa", emoji: "🏛️", count: "120+ tour", color: ['#f59e0b', '#d97706'] },
    { id: "5", name: "Thiên nhiên", emoji: "🌳", count: "160+ tour", color: ['#ec4899', '#db2777'] },
    { id: "6", name: "Ẩm thực", emoji: "🍜", count: "90+ tour", color: ['#f97316', '#ea580c'] },
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [featured, all] = await Promise.all([
        api.getFeaturedTours(),
        api.getTours({ limit: 30 }),
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
    // Prevent fake IDs like "1", "2" from TOP_DESTINATIONS
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
        // Just show search or do nothing
        handleSearch();
      }
      return;
    }
    
    router.push({
      pathname: "/screens/destinations/HotelDetail",
      params: { destinationId: tourId },
    });
  };

  const handleBook = () => {
    // Guest mode: redirect to login when trying to book
    router.push("/(auth)/login");
  };

  const handleLogin = () => {
    router.push("/(auth)/login");
  };

  if (loading) {
    return (
      <ThemedView className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#667eea" />
        <ThemedText className="mt-4 text-gray-600">
          Đang tải dữ liệu...
        </ThemedText>
      </ThemedView>
    );
  }

  // Get hot deals (tours with originalPrice > price)
  const hotDeals = allTours.filter(tour => tour.originalPrice && tour.originalPrice > tour.price).slice(0, 6);
  const trendingTours = allTours.sort((a, b) => b.rating - a.rating).slice(0, 6);
  const recommendedTours = allTours.slice(0, 6);

  return (
    <ThemedView className="flex-1 bg-gray-50">
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Header - Guest mode, NO user icon */}
        <LinearGradient
          colors={['#667eea', '#764ba2', '#f093fb']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="px-4 pt-16 pb-8 rounded-b-3xl"
        >
          <Animated.View 
            entering={FadeInDown.duration(600).delay(100)}
            className="mb-4"
          >
            <View className="flex-row justify-between items-center mb-6">
              <View className="flex-1">
                <ThemedText className="text-white text-3xl font-extrabold mb-2">
                  Khám phá Việt Nam 🌏
                </ThemedText>
                <ThemedText className="text-white/90 text-base font-medium">
                  Hơn 500+ điểm đến tuyệt vời đang chờ bạn
                </ThemedText>
              </View>
              <TouchableOpacity
                onPress={handleLogin}
                activeOpacity={0.8}
                className="ml-4 rounded-full overflow-hidden"
              >
                <LinearGradient
                  colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.2)']}
                  className="px-5 py-2.5 border border-white/30"
                >
                  <ThemedText className="text-white font-bold">Đăng nhập</ThemedText>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(600).delay(200)}>
            <SearchBar
              placeholder="Tìm kiếm tour, điểm đến..."
              onSearch={handleSearch}
              onFocus={handleSearch}
              showFilterButton
            />
          </Animated.View>

          {/* Quick stats */}
          <Animated.View 
            entering={FadeInDown.duration(600).delay(300)}
            className="flex-row justify-around mt-6 pt-6 border-t border-white/20"
          >
            <View className="items-center">
              <ThemedText className="text-white text-2xl font-bold">500+</ThemedText>
              <ThemedText className="text-white/80 text-xs mt-1">Điểm đến</ThemedText>
            </View>
            <View className="items-center">
              <ThemedText className="text-white text-2xl font-bold">10k+</ThemedText>
              <ThemedText className="text-white/80 text-xs mt-1">Khách hàng</ThemedText>
            </View>
            <View className="items-center">
              <ThemedText className="text-white text-2xl font-bold">4.8★</ThemedText>
              <ThemedText className="text-white/80 text-xs mt-1">Đánh giá</ThemedText>
            </View>
          </Animated.View>
        </LinearGradient>

        <QuickFilters />

        {/* Categories */}
        <View className="px-4 py-6">
          <SectionHeader
            title="Danh mục"
            subtitle="Chọn theo sở thích"
            delay={400}
            onViewAll={() => router.push("/screens/tours/AllTours")}
          />
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 16 }}
          >
            {CATEGORIES.map((category, idx) => (
              <Animated.View
                key={category.id}
                entering={FadeInDown.delay(idx * 100).duration(500)}
              >
                <TouchableOpacity
                  activeOpacity={0.9}
                  className="mr-4 overflow-hidden rounded-2xl shadow-lg"
                  onPress={handleSearch}
                >
                  <LinearGradient
                    colors={category.color as [string, string, ...string[]]}
                    className="w-32 h-36 px-4 py-5 items-center justify-center"
                  >
                    <ThemedText className="text-4xl mb-2">{category.emoji}</ThemedText>
                    <ThemedText className="text-white font-extrabold text-base text-center mb-1">
                      {category.name}
                    </ThemedText>
                    <ThemedText className="text-white/90 text-xs text-center">
                      {category.count}
                    </ThemedText>
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </ScrollView>
        </View>

        {/* Top Destinations */}
        <View className="px-4 py-4">
          <SectionHeader
            title="Điểm đến phổ biến"
            subtitle="Khám phá ngay"
            delay={500}
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
                      handleSearch();
                    }
                  }}
                  index={idx}
                />
              );
            })}
          </ScrollView>
        </View>

        {/* Featured Tours */}
        {featuredTours.length > 0 && (
          <View className="px-4 py-4">
            <SectionHeader
              title="Tour nổi bật"
              subtitle="Được yêu thích nhất"
              delay={600}
              onViewAll={() => router.push("/screens/tours/AllTours")}
            />

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {featuredTours.map((tour) => (
                <TourCard
                  key={tour._id}
                  tour={tour}
                  onPress={openDetail}
                  onWishlistPress={handleBook}
                />
              ))}
            </ScrollView>
          </View>
        )}

        {/* Hot Deals */}
        {hotDeals.length > 0 && (
          <View className="px-4 py-4">
            <SectionHeader
              title="Ưu đãi hot 🔥"
              subtitle="Đặt ngay để nhận ưu đãi"
              delay={700}
              onViewAll={() => router.push("/screens/deals/AllDeals")}
            />

            {hotDeals.slice(0, 3).map((tour) => (
              <TourCard
                key={tour._id}
                tour={tour}
                onPress={openDetail}
                onWishlistPress={handleBook}
                variant="horizontal"
              />
            ))}
          </View>
        )}

        {/* Trending Now */}
        {trendingTours.length > 0 && (
          <View className="px-4 py-4">
            <SectionHeader
              title="Đang thịnh hành 📈"
              subtitle="Tour được tìm kiếm nhiều nhất"
              delay={800}
              onViewAll={() => router.push("/screens/tours/AllTours")}
            />

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {trendingTours.slice(0, 5).map((tour) => (
                <TourCard
                  key={tour._id}
                  tour={tour}
                  onPress={openDetail}
                  onWishlistPress={handleBook}
                />
              ))}
            </ScrollView>
          </View>
        )}

        {/* Recommended For You */}
        {recommendedTours.length > 0 && (
          <View className="px-4 py-4">
            <SectionHeader
              title="Gợi ý cho bạn ⭐"
              subtitle="Dựa trên sở thích"
              delay={900}
              onViewAll={() => router.push("/screens/tours/AllTours")}
            />

            {recommendedTours.slice(0, 4).map((tour) => (
              <TourCard
                key={tour._id}
                tour={tour}
                onPress={openDetail}
                onWishlistPress={handleBook}
                variant="horizontal"
              />
            ))}
          </View>
        )}

        {/* CTA Section - Login to book */}
        <View className="px-4 py-8 mb-8">
          <Animated.View
            entering={FadeInDown.delay(1000).duration(500)}
            className="rounded-3xl overflow-hidden shadow-2xl"
          >
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              className="px-6 py-8 items-center"
            >
              <ThemedText className="text-white text-2xl font-extrabold mb-2 text-center">
                Đăng nhập để đặt tour ngay!
              </ThemedText>
              <ThemedText className="text-white/90 text-center mb-6">
                Tạo tài khoản miễn phí và nhận ưu đãi đặc biệt
              </ThemedText>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={handleLogin}
                className="bg-white rounded-2xl px-8 py-4 overflow-hidden shadow-xl"
              >
                <ThemedText className="text-purple-600 font-extrabold text-lg">
                  Đăng nhập / Đăng ký
                </ThemedText>
              </TouchableOpacity>
            </LinearGradient>
          </Animated.View>
        </View>

        <View className="h-24" />
      </ScrollView>
    </ThemedView>
  );
}
