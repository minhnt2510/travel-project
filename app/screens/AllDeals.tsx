import { ThemedText } from "@/ui-components/themed-text";
import { ThemedView } from "@/ui-components/themed-view";
import { IconSymbol } from "@/ui-components/ui/icon-symbol";
import { Image } from "expo-image";
import { router } from "expo-router";
import { ScrollView, TouchableOpacity, View } from "react-native";

export default function AllDealsScreen() {
  const allDeals = [
    {
      id: "1",
      destinationId: "1",
      name: "Dalat Palace",
      type: "Khách sạn",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
      price: "1,800,000đ",
      originalPrice: "2,250,000đ",
      discount: "20%",
      rating: 4.7,
      reviews: 89,
      description: "Khách sạn 5 sao với view đẹp ra thành phố Đà Lạt"
    },
    {
      id: "2",
      destinationId: "4",
      name: "Tour Hạ Long",
      type: "Tour",
      image: "https://images.unsplash.com/photo-1540979388649-3c0e1210f2ea?w=800",
      price: "3,500,000đ",
      originalPrice: "4,100,000đ",
      discount: "15%",
      rating: 4.6,
      reviews: 156,
      description: "Du thuyền sang trọng trên vịnh Hạ Long"
    },
    {
      id: "3",
      destinationId: "2",
      name: "JW Marriott Phú Quốc",
      type: "Khách sạn",
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
      price: "4,200,000đ",
      originalPrice: "5,600,000đ",
      discount: "25%",
      rating: 4.9,
      reviews: 203,
      description: "Resort 5 sao với bãi biển riêng tuyệt đẹp"
    },
    {
      id: "4",
      destinationId: "3",
      name: "Tour Hội An Heritage",
      type: "Tour",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800",
      price: "1,500,000đ",
      originalPrice: "1,900,000đ",
      discount: "21%",
      rating: 4.8,
      reviews: 124,
      description: "Khám phá phố cổ Hội An với hướng dẫn viên chuyên nghiệp"
    },
    {
      id: "5",
      destinationId: "6",
      name: "Vinpearl Nha Trang",
      type: "Khách sạn",
      image: "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=800",
      price: "2,800,000đ",
      originalPrice: "3,500,000đ",
      discount: "20%",
      rating: 4.5,
      reviews: 178,
      description: "Resort đảo với nhiều tiện ích giải trí"
    },
    {
      id: "6",
      destinationId: "5",
      name: "Tour Sapa Trekking",
      type: "Tour",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800",
      price: "1,900,000đ",
      originalPrice: "2,400,000đ",
      discount: "21%",
      rating: 4.7,
      reviews: 95,
      description: "Trekking khám phá ruộng bậc thang và văn hóa dân tộc"
    },
    {
      id: "7",
      destinationId: "7",
      name: "Hotel Saigon Morin",
      type: "Khách sạn",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800",
      price: "1,200,000đ",
      originalPrice: "1,600,000đ",
      discount: "25%",
      rating: 4.4,
      reviews: 67,
      description: "Khách sạn cổ kính tại trung tâm thành phố Huế"
    },
    {
      id: "8",
      destinationId: "8",
      name: "Tour Đà Nẵng City",
      type: "Tour",
      image: "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=800",
      price: "2,100,000đ",
      originalPrice: "2,800,000đ",
      discount: "25%",
      rating: 4.6,
      reviews: 142,
      description: "Khám phá thành phố Đà Nẵng hiện đại và năng động"
    },
  ];

  const openDetail = (destinationId: string) => {
    router.push({
      pathname: "/screens/HotelDetail",
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
            Ưu đãi hot
          </ThemedText>
        </View>
      </View>

      {/* Search Bar */}
      <View className="p-4 bg-gray-50">
        <TouchableOpacity className="bg-white rounded-full px-4 py-3 flex-row items-center">
          <IconSymbol name="search" size={20} color="#6B7280" />
          <ThemedText className="ml-2 text-gray-500">
            Tìm kiếm ưu đãi...
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
              <ThemedText className="text-gray-600 text-sm">Khách sạn</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity className="bg-gray-100 px-4 py-2 rounded-full">
              <ThemedText className="text-gray-600 text-sm">Tour</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity className="bg-gray-100 px-4 py-2 rounded-full">
              <ThemedText className="text-gray-600 text-sm">Giảm 20%+</ThemedText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>

      {/* Deals List */}
      <ScrollView className="flex-1">
        <View className="p-4">
          {allDeals.map((deal) => (
            <TouchableOpacity
              key={deal.id}
              className="mb-4 bg-white rounded-lg shadow overflow-hidden"
              onPress={() => openDetail(deal.destinationId)}
            >
              <View className="flex-row">
                <Image
                  source={{ uri: deal.image }}
                  className="w-32 h-32"
                  contentFit="cover"
                />
                <View className="flex-1 p-4">
                  <View className="flex-row justify-between items-start mb-2">
                    <View className="flex-1">
                      <ThemedText className="font-semibold text-lg">
                        {deal.name}
                      </ThemedText>
                      <ThemedText className="text-gray-600 text-sm">
                        {deal.type}
                      </ThemedText>
                    </View>
                    <View className="bg-red-100 px-2 py-1 rounded">
                      <ThemedText className="text-red-600 text-xs font-semibold">
                        Giảm {deal.discount}
                      </ThemedText>
                    </View>
                  </View>
                  
                  <ThemedText className="text-gray-500 text-sm mb-2" numberOfLines={2}>
                    {deal.description}
                  </ThemedText>
                  
                  <View className="flex-row items-center mb-2">
                    <IconSymbol name="star" size={14} color="#FFB800" />
                    <ThemedText className="ml-1 text-gray-600 text-xs">
                      {deal.rating} ({deal.reviews} đánh giá)
                    </ThemedText>
                  </View>
                  
                  <View className="flex-row items-center justify-between">
                    <View>
                      <ThemedText className="text-blue-600 font-semibold text-lg">
                        {deal.price}
                      </ThemedText>
                      <ThemedText className="text-gray-400 text-sm line-through">
                        {deal.originalPrice}
                      </ThemedText>
                    </View>
                    <TouchableOpacity className="bg-red-500 px-3 py-2 rounded-full">
                      <ThemedText className="text-white font-semibold text-sm">
                        Đặt ngay
                      </ThemedText>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </ThemedView>
  );
}
