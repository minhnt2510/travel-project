import { View, ScrollView, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";

export default function ExploreScreen() {
  const categories = [
    { id: "1", name: "Tours", icon: "map" },
    { id: "2", name: "Khách sạn", icon: "home" },
    { id: "3", name: "Ẩm thực", icon: "coffee" },
    { id: "4", name: "Hoạt động", icon: "activity" },
    { id: "5", name: "Xe", icon: "truck" },
  ];

  const trending = [
    {
      id: "1",
      name: "Đà Lạt - Thành phố mộng mơ",
      image: "https://placekitten.com/400/300",
      description: "Khám phá thành phố ngàn hoa với nhiều điểm đến hấp dẫn",
    },
    {
      id: "2",
      name: "Phú Quốc - Đảo Ngọc",
      image: "https://placekitten.com/400/301",
      description: "Thiên đường biển đảo với bãi cát trắng và nước trong xanh",
    },
  ];

  const experiences = [
    {
      id: "1",
      type: "Khám phá",
      title: "Tour tham quan vườn hoa Đà Lạt",
      rating: 4.8,
      reviews: 128,
      price: "500,000đ",
      image: "https://placekitten.com/300/200",
    },
    {
      id: "2",
      type: "Mạo hiểm",
      title: "Leo núi Langbiang",
      rating: 4.9,
      reviews: 96,
      price: "800,000đ",
      image: "https://placekitten.com/300/201",
    },
  ];

  return (
    <ThemedView className="flex-1">
      <ScrollView>
        {/* Search Header */}
        <View className="p-4 bg-blue-600">
          <TouchableOpacity className="bg-white rounded-full px-4 py-3 flex-row items-center">
            <IconSymbol name="search" size={20} color="#6B7280" />
            <ThemedText className="ml-2 text-gray-500">
              Tìm kiếm trải nghiệm du lịch...
            </ThemedText>
          </TouchableOpacity>
        </View>

        {/* Categories */}
        <View className="p-4">
          <View className="flex-row flex-wrap justify-between">
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                className="w-[18%] items-center mb-4"
              >
                <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center mb-1">
                  <IconSymbol name={category.icon} size={24} color="#3B82F6" />
                </View>
                <ThemedText className="text-center text-sm">
                  {category.name}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Trending */}
        <View className="p-4">
          <ThemedText className="text-xl font-bold mb-4">Xu hướng</ThemedText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {trending.map((item) => (
              <TouchableOpacity key={item.id} className="mr-4 w-72 relative">
                <Image
                  source={{ uri: item.image }}
                  className="w-72 h-40 rounded-lg"
                  contentFit="cover"
                />
                <View className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent rounded-b-lg">
                  <ThemedText className="text-white font-semibold">
                    {item.name}
                  </ThemedText>
                  <ThemedText className="text-white/80 text-sm">
                    {item.description}
                  </ThemedText>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Experiences */}
        <View className="p-4">
          <ThemedText className="text-xl font-bold mb-4">
            Trải nghiệm độc đáo
          </ThemedText>
          {experiences.map((exp) => (
            <TouchableOpacity
              key={exp.id}
              className="mb-4 bg-white rounded-lg shadow overflow-hidden"
            >
              <Image
                source={{ uri: exp.image }}
                className="w-full h-48"
                contentFit="cover"
              />
              <View className="p-4">
                <View className="flex-row items-center mb-2">
                  <View className="bg-blue-100 px-2 py-1 rounded">
                    <ThemedText className="text-blue-600 text-sm">
                      {exp.type}
                    </ThemedText>
                  </View>
                  <View className="flex-row items-center ml-2">
                    <IconSymbol name="star" size={16} color="#FFB800" />
                    <ThemedText className="ml-1 text-gray-600">
                      {exp.rating} ({exp.reviews} đánh giá)
                    </ThemedText>
                  </View>
                </View>
                <ThemedText className="text-lg font-semibold mb-2">
                  {exp.title}
                </ThemedText>
                <View className="flex-row justify-between items-center">
                  <ThemedText className="text-blue-600 font-semibold">
                    {exp.price}
                  </ThemedText>
                  <TouchableOpacity className="bg-blue-600 px-4 py-2 rounded">
                    <ThemedText className="text-white">Đặt ngay</ThemedText>
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
