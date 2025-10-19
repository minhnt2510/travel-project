import {
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  FlatList,
} from "react-native";
import { Image } from "expo-image";
import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";

const popularDestinations = [
  {
    id: "1",
    name: "Đà Lạt",
    image: "https://placekitten.com/300/200",
    count: "150 địa điểm",
  },
  {
    id: "2",
    name: "Phú Quốc",
    image: "https://placekitten.com/300/201",
    count: "120 địa điểm",
  },
  {
    id: "3",
    name: "Hội An",
    image: "https://placekitten.com/300/202",
    count: "90 địa điểm",
  },
];

const topHotels = [
  {
    id: "1",
    name: "Dalat Palace",
    image: "https://placekitten.com/200/200",
    price: "1,800,000đ",
  },
  {
    id: "2",
    name: "Vinpearl Resort",
    image: "https://placekitten.com/200/201",
    price: "2,500,000đ",
  },
  {
    id: "3",
    name: "Hoi An Resort",
    image: "https://placekitten.com/200/202",
    price: "1,600,000đ",
  },
];

export default function Search() {
  return (
    <ThemedView className="flex-1">
      {/* Search Header */}
      <View className="bg-white p-4 shadow-sm">
        <View className="flex-row items-center space-x-4">
          <View className="flex-1 flex-row items-center bg-gray-100 px-4 py-2 rounded-lg">
            <IconSymbol name="search" size={20} color="#6B7280" />
            <TextInput
              className="flex-1 ml-2"
              placeholder="Tìm kiếm điểm đến, khách sạn..."
            />
          </View>
          <TouchableOpacity onPress={() => {}}>
            <IconSymbol name="sliders" size={24} color="#4B5563" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1">
        {/* Popular Destinations */}
        <View className="mt-6 px-4">
          <View className="flex-row justify-between items-center mb-4">
            <ThemedText className="text-xl font-bold">
              Điểm đến phổ biến
            </ThemedText>
            <TouchableOpacity>
              <ThemedText className="text-blue-600">Xem tất cả</ThemedText>
            </TouchableOpacity>
          </View>
          <FlatList
            data={popularDestinations}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity className="mr-4 w-40">
                <Image
                  source={{ uri: item.image }}
                  className="w-40 h-40 rounded-lg"
                  contentFit="cover"
                />
                <ThemedText className="mt-2 font-semibold">
                  {item.name}
                </ThemedText>
                <ThemedText className="text-gray-500">{item.count}</ThemedText>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id}
          />
        </View>

        {/* Top Hotels */}
        <View className="mt-6 px-4">
          <View className="flex-row justify-between items-center mb-4">
            <ThemedText className="text-xl font-bold">
              Khách sạn hàng đầu
            </ThemedText>
            <TouchableOpacity>
              <ThemedText className="text-blue-600">Xem tất cả</ThemedText>
            </TouchableOpacity>
          </View>
          <FlatList
            data={topHotels}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity className="mr-4 w-64 bg-white rounded-lg shadow">
                <Image
                  source={{ uri: item.image }}
                  className="w-64 h-40 rounded-t-lg"
                  contentFit="cover"
                />
                <View className="p-3">
                  <ThemedText className="font-semibold">{item.name}</ThemedText>
                  <ThemedText className="text-blue-600">
                    {item.price}/đêm
                  </ThemedText>
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id}
          />
        </View>
      </ScrollView>
    </ThemedView>
  );
}
