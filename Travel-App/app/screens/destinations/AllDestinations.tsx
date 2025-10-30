import { ThemedText } from "@/ui-components/themed-text";
import { ThemedView } from "@/ui-components/themed-view";
import { IconSymbol } from "@/ui-components/ui/icon-symbol";
import { Image } from "expo-image";
import { router } from "expo-router";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { IMAGES } from "../../Util_Images";

export default function AllDestinationsScreen() {
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

  const openDetail = (destinationId: string) => {
    router.push({
      pathname: "/screens/destinations/HotelDetail",
      params: { destinationId },
    });
  };

  return (
    <ThemedView className="flex-1">
      {/* Header */}
      <View className="p-4 bg-blue-600">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()}>
            <IconSymbol name="arrow-left" size={24} color="#FFF" />
          </TouchableOpacity>
          <ThemedText className="text-white text-xl font-bold ml-4">
            Tất cả điểm đến
          </ThemedText>
        </View>
      </View>

      {/* Search Bar */}
      <View className="p-4 bg-gray-50">
        <TouchableOpacity className="bg-white rounded-full px-4 py-3 flex-row items-center">
          <IconSymbol name="search" size={20} color="#6B7280" />
          <ThemedText className="ml-2 text-gray-500">
            Tìm kiếm điểm đến...
          </ThemedText>
        </TouchableOpacity>
      </View>

      {/* Destinations Grid */}
      <ScrollView className="flex-1">
        <View className="p-4">
          <View className="flex-row flex-wrap justify-between">
            {allDestinations.map((destination) => (
              <TouchableOpacity
                key={destination.id}
                className="w-[48%] mb-4 bg-white rounded-lg shadow"
                onPress={() => openDetail(destination.id)}
              >
                <Image
                  source={destination.image}
                  className="w-full h-32 rounded-t-lg"
                  contentFit="cover"
                />
                <View className="p-3">
                  <ThemedText className="font-semibold text-lg">
                    {destination.name}
                  </ThemedText>
                  <ThemedText className="text-gray-600 text-sm mt-1">
                    {destination.count}
                  </ThemedText>
                  <ThemedText className="text-gray-500 text-xs mt-2" numberOfLines={2}>
                    {destination.description}
                  </ThemedText>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}
