import { ThemedText } from "@/ui-components/themed-text";
import { ThemedView } from "@/ui-components/themed-view";
import { IconSymbol } from "@/ui-components/ui/icon-symbol";
import { Image } from "expo-image";
import { router } from "expo-router";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { IMAGES } from "../../Util_Images";

export default function AllToursScreen() {
  const allTours = [
    {
      id: "1",
      destinationId: "1",
      name: "Tour Đà Lạt 3N2Đ",
      image: IMAGES.dalat2n1d,
      price: "2,500,000đ",
      originalPrice: "3,000,000đ",
      rating: 4.8,
      reviews: 128,
      duration: "3 ngày 2 đêm",
      description: "Khám phá thành phố ngàn hoa với khí hậu mát mẻ quanh năm"
    },
    {
      id: "2",
      destinationId: "2",
      name: "Tour Phú Quốc 4N3Đ",
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
      price: "5,500,000đ",
      originalPrice: "6,200,000đ",
      rating: 4.9,
      reviews: 256,
      duration: "4 ngày 3 đêm",
      description: "Trải nghiệm đảo ngọc với những bãi biển tuyệt đẹp"
    },
    {
      id: "3",
      destinationId: "3",
      name: "Tour Hội An 2N1Đ",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800",
      price: "1,800,000đ",
      originalPrice: "2,200,000đ",
      rating: 4.7,
      reviews: 89,
      duration: "2 ngày 1 đêm",
      description: "Khám phá phố cổ cổ kính với kiến trúc độc đáo"
    },
    {
      id: "4",
      destinationId: "4",
      name: "Tour Hạ Long 3N2Đ",
      image: "https://images.unsplash.com/photo-1540979388649-3c0e1210f2ea?w=800",
      price: "3,500,000đ",
      originalPrice: "4,000,000đ",
      rating: 4.6,
      reviews: 156,
      duration: "3 ngày 2 đêm",
      description: "Du thuyền trên vịnh biển với những hòn đảo đá vôi hùng vĩ"
    },
    {
      id: "5",
      destinationId: "5",
      name: "Tour Sapa 3N2Đ",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800",
      price: "2,200,000đ",
      originalPrice: "2,800,000đ",
      rating: 4.5,
      reviews: 98,
      duration: "3 ngày 2 đêm",
      description: "Khám phá thị trấn miền núi với ruộng bậc thang tuyệt đẹp"
    },
    {
      id: "6",
      destinationId: "6",
      name: "Tour Nha Trang 4N3Đ",
      image: "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=800",
      price: "4,200,000đ",
      originalPrice: "4,800,000đ",
      rating: 4.8,
      reviews: 203,
      duration: "4 ngày 3 đêm",
      description: "Thành phố biển với những bãi cát trắng mịn"
    },
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
            Tất cả tour
          </ThemedText>
        </View>
      </View>

      {/* Search Bar */}
      <View className="p-4 bg-gray-50">
        <TouchableOpacity className="bg-white rounded-full px-4 py-3 flex-row items-center">
          <IconSymbol name="search" size={20} color="#6B7280" />
          <ThemedText className="ml-2 text-gray-500">
            Tìm kiếm tour...
          </ThemedText>
        </TouchableOpacity>
      </View>

      {/* Filter Bar */}
      <View className="p-4 bg-white border-b border-gray-200">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row space-x-3">
            <TouchableOpacity className="bg-blue-600 px-4 py-2 rounded-full">
              <ThemedText className="text-white text-sm">Tất cả</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity className="bg-gray-100 px-4 py-2 rounded-full">
              <ThemedText className="text-gray-600 text-sm">Đà Lạt</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity className="bg-gray-100 px-4 py-2 rounded-full">
              <ThemedText className="text-gray-600 text-sm">Phú Quốc</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity className="bg-gray-100 px-4 py-2 rounded-full">
              <ThemedText className="text-gray-600 text-sm">Hội An</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity className="bg-gray-100 px-4 py-2 rounded-full">
              <ThemedText className="text-gray-600 text-sm">Hạ Long</ThemedText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>

      {/* Tours List */}
      <ScrollView className="flex-1">
        <View className="p-4">
          {allTours.map((tour) => (
            <TouchableOpacity
              key={tour.id}
              className="mb-4 bg-white rounded-lg shadow overflow-hidden"
              onPress={() => openDetail(tour.destinationId)}
            >
              <Image
                source={tour.image}
                className="w-full h-48"
                contentFit="cover"
              />
              <View className="p-4">
                <View className="flex-row justify-between items-start mb-2">
                  <View className="flex-1">
                    <ThemedText className="text-lg font-semibold">
                      {tour.name}
                    </ThemedText>
                    <ThemedText className="text-gray-600 text-sm">
                      {tour.duration}
                    </ThemedText>
                  </View>
                  <View className="bg-red-100 px-2 py-1 rounded">
                    <ThemedText className="text-red-600 text-xs">
                      Giảm giá
                    </ThemedText>
                  </View>
                </View>
                
                <ThemedText className="text-gray-500 text-sm mb-2" numberOfLines={2}>
                  {tour.description}
                </ThemedText>
                
                <View className="flex-row items-center mb-2">
                  <IconSymbol name="star" size={16} color="#FFB800" />
                  <ThemedText className="ml-1 text-gray-600 text-sm">
                    {tour.rating} ({tour.reviews} đánh giá)
                  </ThemedText>
                </View>
                
                <View className="flex-row items-center justify-between">
                  <View>
                    <ThemedText className="text-blue-600 font-semibold text-lg">
                      {tour.price}
                    </ThemedText>
                    <ThemedText className="text-gray-400 text-sm line-through">
                      {tour.originalPrice}
                    </ThemedText>
                  </View>
                  <TouchableOpacity className="bg-blue-600 px-4 py-2 rounded-full">
                    <ThemedText className="text-white font-semibold">
                      Đặt ngay
                    </ThemedText>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </ThemedView>
  );
}
