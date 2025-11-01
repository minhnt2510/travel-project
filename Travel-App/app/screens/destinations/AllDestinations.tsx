import { useState, useEffect } from "react";
import { ThemedText } from "@/ui-components/themed-text";
import { ThemedView } from "@/ui-components/themed-view";
import { IconSymbol } from "@/ui-components/ui/icon-symbol";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { ScrollView, TouchableOpacity, View, ActivityIndicator } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { IMAGES } from "../../Util_Images";
import { api, type Tour } from "@/services/api";

export default function AllDestinationsScreen() {
  const [allTours, setAllTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);

  const allDestinations = [
    { id: '1', name: 'Đà Lạt',   image: IMAGES.dalat,    count: '150+ địa điểm', description: 'Thành phố ngàn hoa với khí hậu mát mẻ quanh năm' },
    { id: '2', name: 'Phú Quốc', image: IMAGES.phuquoc,  count: '120+ địa điểm', description: 'Đảo ngọc với những bãi biển tuyệt đẹp' },
    { id: '3', name: 'Hội An',   image: IMAGES.hoian,    count: '90+ địa điểm',  description: 'Phố cổ cổ kính với kiến trúc độc đáo' },
    { id: '4', name: 'Hạ Long',  image: IMAGES.halong,   count: '80+ địa điểm',  description: 'Vịnh biển với những hòn đảo đá vôi hùng vĩ' },
    { id: '5', name: 'Sa Pa',    image: IMAGES.sapa,     count: '60+ địa điểm',  description: 'Thị trấn miền núi với ruộng bậc thang tuyệt đẹp' },
    { id: '6', name: 'Nha Trang',image: IMAGES.nhatrang, count: '100+ địa điểm', description: 'Thành phố biển với những bãi cát trắng mịn' },
    { id: '7', name: 'Huế',      image: IMAGES.hue,      count: '70+ địa điểm',  description: 'Cố đô với những di tích lịch sử cổ kính' },
    { id: '8', name: 'Đà Nẵng',  image: IMAGES.danang,   count: '85+ địa điểm',  description: 'Thành phố biển hiện đại với nhiều điểm tham quan' },
  ];

  useEffect(() => {
    loadTours();
  }, []);

  const loadTours = async () => {
    try {
      setLoading(true);
      const { tours } = await api.getTours({ limit: 100 });
      setAllTours(tours);
    } catch (error) {
      console.error("Error loading tours:", error);
    } finally {
      setLoading(false);
    }
  };

  const openDetail = (destination: { id: string; name: string }) => {
    // Try to find a real tour matching this destination name
    const matchingTour = allTours.find(
      (tour) =>
        tour.location.includes(destination.name) ||
        tour.title.includes(destination.name) ||
        destination.name.includes(tour.location) ||
        destination.name.includes(tour.title)
    );

    if (matchingTour && matchingTour._id) {
      // Use real tour ID
      router.push({
        pathname: "/screens/destinations/HotelDetail",
        params: { destinationId: matchingTour._id },
      });
    } else {
      // No matching tour found - navigate to search/filter by location
      router.push({
        pathname: "/screens/tours/AllTours",
        params: { search: destination.name },
      });
    }
  };

  return (
    <ThemedView className="flex-1">
      {/* Header with Gradient */}
      <LinearGradient
        colors={["#2563eb", "#1d4ed8", "#1e40af"] as [string, string, ...string[]]}
        className="p-4 pt-12"
      >
        <View className="flex-row items-center mb-4">
          <TouchableOpacity 
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full bg-white/20 items-center justify-center"
          >
            <IconSymbol name="arrow-left" size={24} color="#FFF" />
          </TouchableOpacity>
          <ThemedText className="text-white text-2xl font-bold ml-4 flex-1">
            Tất cả điểm đến
          </ThemedText>
        </View>

        {/* Search Bar */}
        <TouchableOpacity 
          className="bg-white rounded-2xl px-4 py-3.5 flex-row items-center shadow-lg"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          <IconSymbol name="search" size={20} color="#6B7280" />
          <ThemedText className="ml-2 text-gray-500 flex-1">
            Tìm kiếm điểm đến...
          </ThemedText>
        </TouchableOpacity>
      </LinearGradient>

      {/* Destinations Grid */}
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#3B82F6" />
          <ThemedText className="mt-4 text-gray-600">Đang tải...</ThemedText>
        </View>
      ) : (
        <ScrollView className="flex-1 bg-gray-50">
          <View className="p-4">
            <View className="flex-row flex-wrap justify-between">
              {allDestinations.map((destination, index) => (
                <Animated.View
                  key={destination.id}
                  entering={FadeInDown.delay(index * 50).duration(400)}
                  className="w-[48%] mb-4"
                >
                  <TouchableOpacity
                    className="bg-white rounded-2xl overflow-hidden shadow-lg"
                    onPress={() => openDetail(destination)}
                    style={{
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.12,
                      shadowRadius: 12,
                      elevation: 6,
                    }}
                    activeOpacity={0.9}
                  >
                    <View className="relative">
                      <Image
                        source={destination.image}
                        className="w-full h-36"
                        contentFit="cover"
                      />
                      <LinearGradient
                        colors={["transparent", "rgba(0,0,0,0.6)"] as [string, string, ...string[]]}
                        className="absolute bottom-0 left-0 right-0 h-16"
                      />
                    </View>
                    <View className="p-4">
                      <ThemedText className="font-bold text-lg text-gray-900 mb-1">
                        {destination.name}
                      </ThemedText>
                      <View className="flex-row items-center mb-2">
                        <IconSymbol name="map-pin" size={14} color="#3b82f6" />
                        <ThemedText className="text-blue-600 text-sm font-semibold ml-1">
                          {destination.count}
                        </ThemedText>
                      </View>
                      <ThemedText className="text-gray-600 text-xs leading-4" numberOfLines={2}>
                        {destination.description}
                      </ThemedText>
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </View>
          </View>
        </ScrollView>
      )}
    </ThemedView>
  );
}
