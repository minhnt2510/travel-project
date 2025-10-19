import { View, FlatList, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { ThemedView } from "@/ui-components/themed-view";
import { ThemedText } from "@/ui-components/themed-text";
import { IconSymbol } from "@/ui-components/ui/icon-symbol";

interface WishlistItem {
  id: string;
  name: string;
  location: string;
  image: string;
  price: string;
  type: "tour" | "hotel";
}

const wishlistItems: WishlistItem[] = [
  {
    id: "1",
    name: "Tour Đà Lạt 3N2Đ",
    location: "Đà Lạt, Lâm Đồng",
    image: "https://placekitten.com/300/200",
    price: "2,500,000đ",
    type: "tour",
  },
  {
    id: "2",
    name: "Dalat Palace Heritage",
    location: "Đà Lạt, Lâm Đồng",
    image: "https://placekitten.com/300/201",
    price: "1,800,000đ/đêm",
    type: "hotel",
  },
  {
    id: "3",
    name: "Tour Phú Quốc 4N3Đ",
    location: "Phú Quốc, Kiên Giang",
    image: "https://placekitten.com/300/202",
    price: "5,500,000đ",
    type: "tour",
  },
];

export default function WishlistScreen() {
  return (
    <ThemedView className="flex-1">
      <View className="p-4 border-b border-gray-200">
        <ThemedText className="text-2xl font-bold">
          Danh sách yêu thích
        </ThemedText>
      </View>

      <FlatList
        data={wishlistItems}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <TouchableOpacity className="bg-white rounded-lg shadow-sm mb-4 overflow-hidden">
            <View className="relative">
              <Image
                source={{ uri: item.image }}
                className="w-full h-48"
                contentFit="cover"
              />
              <TouchableOpacity className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full items-center justify-center">
                <IconSymbol name="heart" size={20} color="#EF4444" />
              </TouchableOpacity>
              <View className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded">
                <ThemedText className="text-white text-xs">
                  {item.type === "tour" ? "Tour" : "Khách sạn"}
                </ThemedText>
              </View>
            </View>

            <View className="p-4">
              <ThemedText className="text-lg font-semibold mb-1">
                {item.name}
              </ThemedText>
              <View className="flex-row items-center mb-2">
                <IconSymbol name="map-pin" size={16} color="#6B7280" />
                <ThemedText className="text-gray-600 ml-1">
                  {item.location}
                </ThemedText>
              </View>
              <View className="flex-row justify-between items-center">
                <ThemedText className="text-blue-600 font-semibold">
                  {item.price}
                </ThemedText>
                <TouchableOpacity className="bg-blue-600 px-4 py-2 rounded">
                  <ThemedText className="text-white">
                    {item.type === "tour" ? "Đặt tour" : "Đặt phòng"}
                  </ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </ThemedView>
  );
}
