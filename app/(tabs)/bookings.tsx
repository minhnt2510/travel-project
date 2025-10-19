import { View, FlatList, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { ThemedView } from "@/ui-components/themed-view";
import { ThemedText } from "@/ui-components/themed-text";
import { IconSymbol } from "@/ui-components/ui/icon-symbol";

interface Booking {
  id: string;
  name: string;
  type: "tour" | "hotel";
  date: string;
  status: "upcoming" | "completed" | "cancelled";
  image: string;
  price: string;
}

const bookings: Booking[] = [
  {
    id: "1",
    name: "Tour Đà Lạt 3N2Đ",
    type: "tour",
    date: "20/10/2025 - 22/10/2025",
    status: "upcoming",
    image: "https://placekitten.com/300/200",
    price: "2,500,000đ",
  },
  {
    id: "2",
    name: "Dalat Palace Heritage",
    type: "hotel",
    date: "15/10/2025 - 17/10/2025",
    status: "completed",
    image: "https://placekitten.com/300/201",
    price: "3,600,000đ",
  },
  {
    id: "3",
    name: "Tour Phú Quốc 4N3Đ",
    type: "tour",
    date: "01/10/2025 - 04/10/2025",
    status: "cancelled",
    image: "https://placekitten.com/300/202",
    price: "5,500,000đ",
  },
];

const getStatusColor = (status: Booking["status"]) => {
  switch (status) {
    case "upcoming":
      return "bg-blue-100 text-blue-600";
    case "completed":
      return "bg-green-100 text-green-600";
    case "cancelled":
      return "bg-red-100 text-red-600";
  }
};

const getStatusText = (status: Booking["status"]) => {
  switch (status) {
    case "upcoming":
      return "Sắp tới";
    case "completed":
      return "Đã hoàn thành";
    case "cancelled":
      return "Đã hủy";
  }
};

export default function BookingsScreen() {
  return (
    <ThemedView className="flex-1">
      <View className="p-4 border-b border-gray-200">
        <ThemedText className="text-2xl font-bold">Đặt chỗ của tôi</ThemedText>
      </View>

      <FlatList
        data={bookings}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <TouchableOpacity className="bg-white rounded-lg shadow-sm mb-4 overflow-hidden">
            <View className="relative">
              <Image
                source={{ uri: item.image }}
                className="w-full h-40"
                contentFit="cover"
              />
              <View className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded">
                <ThemedText className="text-white text-xs">
                  {item.type === "tour" ? "Tour" : "Khách sạn"}
                </ThemedText>
              </View>
            </View>

            <View className="p-4">
              <View className="flex-row justify-between items-start">
                <View className="flex-1">
                  <ThemedText className="text-lg font-semibold mb-1">
                    {item.name}
                  </ThemedText>
                  <View className="flex-row items-center mb-2">
                    <IconSymbol name="calendar" size={16} color="#6B7280" />
                    <ThemedText className="text-gray-600 ml-1">
                      {item.date}
                    </ThemedText>
                  </View>
                </View>
                <View
                  className={`px-3 py-1 rounded-full ${getStatusColor(
                    item.status
                  )}`}
                >
                  <ThemedText className={getStatusColor(item.status)}>
                    {getStatusText(item.status)}
                  </ThemedText>
                </View>
              </View>

              <View className="flex-row justify-between items-center mt-2">
                <ThemedText className="text-blue-600 font-semibold">
                  {item.price}
                </ThemedText>
                <TouchableOpacity
                  className="flex-row items-center"
                  onPress={() => {}}
                >
                  <IconSymbol name="info" size={16} color="#3B82F6" />
                  <ThemedText className="text-blue-600 ml-1">
                    Chi tiết
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
