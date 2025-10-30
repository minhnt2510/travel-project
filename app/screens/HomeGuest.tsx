import {
  View,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { ThemedText } from "@/ui-components/themed-text";
import { ThemedView } from "@/ui-components/themed-view";
import SectionHeader from "../components/home/SectionHeader";
import HeroHeader from "../components/home/HeroHeader";
import QuickFilters from "../components/common/QuickFilters";
import TourCard from "../components/common/TourCard";
import DestinationCard from "../components/common/DestinationCard";
import { IMAGES } from "../Util_Images";
import { useState } from "react";
import { router } from "expo-router";

const TOP_DESTINATIONS = [
  { id: "1", name: "Đà Lạt", image: IMAGES.dalat, count: "150+ địa điểm" },
  { id: "2", name: "Phú Quốc", image: IMAGES.phuquoc, count: "120+ địa điểm" },
  { id: "3", name: "Hội An", image: IMAGES.hoian, count: "90+ địa điểm" },
  { id: "4", name: "Hạ Long", image: IMAGES.halong, count: "80+ địa điểm" },
  { id: "5", name: "Sa Pa", image: IMAGES.sapa, count: "60+ địa điểm" },
];
// Thêm nhiều tour demo cho đa dạng trang Guest
const demoTours = [
  {
    _id: "101",
    title: "Tour Đà Lạt 3N2Đ",
    location: "Đà Lạt, Lâm Đồng",
    price: 2500000,
    originalPrice: 2800000,
    imageUrl: IMAGES.dalat,
    rating: 4.7,
    reviewCount: 41,
    duration: 3,
    maxSeats: 20,
    availableSeats: 10,
    featured: true,
    category: "adventure",
    description:
      "Tham quan thành phố ngàn hoa Đà Lạt, nghỉ dưỡng tại khách sạn 4*...",
    startDate: "2025-11-14",
    endDate: "2025-11-17",
  },
  {
    _id: "102",
    title: "Tour Phú Quốc 4N3Đ Luxury",
    location: "Phú Quốc, Kiên Giang",
    price: 3700000,
    originalPrice: 3900000,
    imageUrl: IMAGES.phuquoc,
    rating: 5.0,
    reviewCount: 20,
    duration: 4,
    maxSeats: 25,
    availableSeats: 15,
    featured: true,
    category: "beach",
    description: "Tận hưởng biển xanh cát trắng Phú Quốc, combo Vinwonder...",
    startDate: "2025-12-04",
    endDate: "2025-12-08",
  },
  {
    _id: "103",
    title: "Khám phá Hội An cổ kính",
    location: "Hội An, Quảng Nam",
    price: 1900000,
    originalPrice: 2100000,
    imageUrl: IMAGES.hoian,
    rating: 4.5,
    reviewCount: 15,
    duration: 3,
    maxSeats: 20,
    availableSeats: 8,
    featured: false,
    category: "culture",
    description:
      "Dạo phố cổ, ngắm đèn lồng, tham gia lớp nấu ăn trải nghiệm văn hoá.",
    startDate: "2025-10-22",
    endDate: "2025-10-25",
  },
  // ... thêm các tour mẫu nếu muốn
];

export default function HomeGuest() {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  };

  return (
    <ThemedView className="flex-1 bg-gray-50">
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Banner + login/register */}
        <HeroHeader
          onMenuPress={() => {}}
          onSearchPress={() => router.push("/screens/tours/AllTours")}
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
            {TOP_DESTINATIONS.map((destination) => (
              <DestinationCard
                key={destination.id}
                destination={destination}
                onPress={() =>
                  router.push({
                    pathname: "/screens/destinations/HotelDetail",
                    params: { destinationId: destination.id },
                  })
                }
              />
            ))}
          </ScrollView>
        </View>
        {/* Featured Tours */}
        <View className="px-4 py-4">
          <SectionHeader
            title="Tour nổi bật"
            subtitle="Dành cho khách mới"
            onViewAll={() => router.push("/screens/tours/AllTours")}
          />
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {demoTours.map((tour) => (
              <TourCard
                key={tour._id}
                tour={tour}
                onPress={() =>
                  router.push({
                    pathname: "/screens/destinations/HotelDetail",
                    params: { destinationId: tour._id },
                  })
                }
                // Chặn wishlist cho guest:
                onWishlistPress={() => router.push("/(auth)/login")}
              />
            ))}
          </ScrollView>
        </View>
        <View className="items-center my-8">
          <ThemedText className="text-gray-500 text-center mt-6">
            Đăng nhập để đặt tour, giữ chỗ, và nhận ưu đãi dành riêng cho thành
            viên!
          </ThemedText>
          <View className="flex-row mt-5 space-x-3">
            <TouchableOpacity
              className="bg-blue-600 rounded-xl px-8 py-3"
              onPress={() => router.push("/(auth)/login")}
            >
              <ThemedText className="text-white font-bold text-lg">
                Đăng nhập
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              className="border border-blue-600 rounded-xl px-8 py-3"
              onPress={() => router.push("/(auth)/register")}
            >
              <ThemedText className="text-blue-600 font-bold text-lg">
                Đăng ký
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}
