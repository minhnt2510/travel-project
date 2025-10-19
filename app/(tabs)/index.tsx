import { View, ScrollView, TouchableOpacity } from "react-native";
import { Image, type ImageSource } from "expo-image";
import { ThemedView } from "@/ui-components/themed-view";
import { ThemedText } from "@/ui-components/themed-text";
import { IconSymbol } from "@/ui-components/ui/icon-symbol";
import { IMAGES } from "../Util_Images";

export default function HomeScreen() {
  const topDestinations = [
    {
      id: "1",
      name: "Đà Lạt",
      image: IMAGES.dalat,
      count: "150+ địa điểm",
    },
    {
      id: "2",
      name: "Phú Quốc",
      image: IMAGES.phuquoc,
      count: "120+ địa điểm",
    },
    {
      id: "3",
      name: "Hội An",
      image: IMAGES.hoian,
      count: "90+ địa điểm",
    },
  ];

  const featuredTours = [
    {
      id: "1",
      name: "Tour Đà Lạt 3N2Đ",
      image: IMAGES.dalat2n1d,
      price: "2,500,000đ",
      rating: 4.8,
      reviews: 128,
    },
    {
      id: "2",
      name: "Tour Phú Quốc 4N3Đ",
      image: "https://placekitten.com/400/301",
      price: "5,500,000đ",
      rating: 4.9,
      reviews: 256,
    },
  ];

  const hotDeals = [
    {
      id: "1",
      name: "Dalat Palace",
      type: "Khách sạn",
      image: "https://placekitten.com/300/203",
      price: "1,800,000đ",
      discount: "20%",
    },
    {
      id: "2",
      name: "Tour Hạ Long",
      type: "Tour",
      image: "https://placekitten.com/300/204",
      price: "3,500,000đ",
      discount: "15%",
    },
  ];

  return (
    <ThemedView className="flex-1">
      <ScrollView>
        {/* Header */}
        <View className="p-4 bg-blue-600">
          <View className="flex-row items-center justify-between">
            <View>
              <ThemedText className="text-white text-lg">Xin chào, </ThemedText>
              <ThemedText className="text-white text-2xl font-bold">
                Nguyễn Văn A
              </ThemedText>
            </View>
            <TouchableOpacity>
              <View className="relative">
                <IconSymbol name="bell" size={24} color="#FFF" />
                <View className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
              </View>
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <TouchableOpacity className="mt-4 bg-white rounded-full px-4 py-3 flex-row items-center">
            <IconSymbol name="search" size={20} color="#6B7280" />
            <ThemedText className="ml-2 text-gray-500">
              Tìm kiếm điểm đến, khách sạn...
            </ThemedText>
          </TouchableOpacity>
        </View>

        {/* Top Destinations */}
        <View className="p-4">
          <View className="flex-row justify-between items-center mb-4">
            <ThemedText className="text-xl font-bold">
              Điểm đến phổ biến
            </ThemedText>
            <TouchableOpacity>
              <ThemedText className="text-blue-600">Xem tất cả</ThemedText>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {topDestinations.map((destination) => (
              <TouchableOpacity key={destination.id} className="mr-4 w-40">
                <Image
                  source={destination.image}
                  className="w-40 h-40 rounded-lg"
                  contentFit="cover"
                />
                <ThemedText className="mt-2 font-semibold">
                  {destination.name}
                </ThemedText>
                <ThemedText className="text-gray-600 text-sm">
                  {destination.count}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Featured Tours */}
        <View className="p-4">
          <View className="flex-row justify-between items-center mb-4">
            <ThemedText className="text-xl font-bold">Tour nổi bật</ThemedText>
            <TouchableOpacity>
              <ThemedText className="text-blue-600">Xem tất cả</ThemedText>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {featuredTours.map((tour) => (
              <TouchableOpacity
                key={tour.id}
                className="mr-4 w-72 bg-white rounded-lg shadow"
              >
                <Image
                  source={tour.image}
                  className="w-72 h-48 rounded-t-lg"
                  contentFit="cover"
                />
                <View className="p-3">
                  <ThemedText className="text-lg font-semibold">
                    {tour.name}
                  </ThemedText>
                  <View className="flex-row items-center mt-1">
                    <IconSymbol name="star" size={16} color="#FFB800" />
                    <ThemedText className="ml-1 text-gray-600">
                      {tour.rating} ({tour.reviews} đánh giá)
                    </ThemedText>
                  </View>
                  <ThemedText className="text-blue-600 font-semibold mt-2">
                    {tour.price}
                  </ThemedText>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Hot Deals */}
        <View className="p-4">
          <View className="flex-row justify-between items-center mb-4">
            <ThemedText className="text-xl font-bold">Ưu đãi hot</ThemedText>
            <TouchableOpacity>
              <ThemedText className="text-blue-600">Xem tất cả</ThemedText>
            </TouchableOpacity>
          </View>

          {hotDeals.map((deal) => (
            <TouchableOpacity
              key={deal.id}
              className="mb-4 bg-white rounded-lg shadow overflow-hidden"
            >
              <View className="flex-row">
                <Image
                  source={{ uri: deal.image }}
                  className="w-24 h-24"
                  contentFit="cover"
                />
                <View className="flex-1 p-3">
                  <View className="flex-row justify-between items-start">
                    <View>
                      <ThemedText className="font-semibold">
                        {deal.name}
                      </ThemedText>
                      <ThemedText className="text-gray-600 text-sm">
                        {deal.type}
                      </ThemedText>
                    </View>
                    <View className="bg-red-100 px-2 py-1 rounded">
                      <ThemedText className="text-red-600">
                        Giảm {deal.discount}
                      </ThemedText>
                    </View>
                  </View>
                  <ThemedText className="text-blue-600 font-semibold mt-2">
                    {deal.price}
                  </ThemedText>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </ThemedView>
  );
}
