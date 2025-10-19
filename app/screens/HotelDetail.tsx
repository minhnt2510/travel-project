import { View, ScrollView, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";

export default function HotelDetail() {
  return (
    <ThemedView className="flex-1">
      <ScrollView>
        {/* Image Gallery */}
        <ScrollView horizontal pagingEnabled className="h-72">
          {[1, 2, 3].map((index) => (
            <Image
              key={index}
              source={{ uri: `https://placekitten.com/400/${300 + index}` }}
              className="w-screen h-72"
              contentFit="cover"
            />
          ))}
        </ScrollView>

        {/* Content */}
        <View className="p-4">
          <ThemedText className="text-2xl font-bold">
            Dalat Palace Heritage Hotel
          </ThemedText>
          <View className="flex-row items-center mt-2">
            <IconSymbol name="map-pin" size={16} color="#6B7280" />
            <ThemedText className="ml-1 text-gray-600">
              2 Trần Phú, Đà Lạt
            </ThemedText>
          </View>

          {/* Rating */}
          <View className="flex-row items-center mt-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <IconSymbol key={star} name="star" size={16} color="#FFB800" />
            ))}
            <ThemedText className="ml-2 text-gray-600">
              (245 đánh giá)
            </ThemedText>
          </View>

          {/* Price Info */}
          <View className="mt-4 bg-blue-50 p-4 rounded-lg">
            <ThemedText className="text-xl font-bold text-blue-600">
              1,800,000 VNĐ
            </ThemedText>
            <ThemedText className="text-gray-600">/đêm</ThemedText>
          </View>

          {/* Amenities */}
          <View className="mt-4">
            <ThemedText className="text-xl font-bold mb-2">
              Tiện nghi
            </ThemedText>
            <View className="flex-row flex-wrap">
              {[
                { icon: "wifi", name: "WiFi miễn phí" },
                { icon: "coffee", name: "Nhà hàng" },
                { icon: "swimming-pool", name: "Hồ bơi" },
                { icon: "parking", name: "Bãi đỗ xe" },
              ].map((item, index) => (
                <View key={index} className="w-1/2 flex-row items-center py-2">
                  <IconSymbol name={item.icon} size={16} color="#6B7280" />
                  <ThemedText className="ml-2 text-gray-600">
                    {item.name}
                  </ThemedText>
                </View>
              ))}
            </View>
          </View>

          {/* Description */}
          <View className="mt-4">
            <ThemedText className="text-xl font-bold mb-2">Mô tả</ThemedText>
            <ThemedText className="text-gray-600 leading-6">
              Dalat Palace Heritage Hotel là một trong những khách sạn lâu đời
              và sang trọng nhất tại Đà Lạt. Với kiến trúc Pháp độc đáo và view
              nhìn ra hồ Xuân Hương, khách sạn mang đến trải nghiệm nghỉ dưỡng
              đẳng cấp cho du khách.
            </ThemedText>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View className="p-4 border-t border-gray-200 bg-white">
        <TouchableOpacity
          className="bg-blue-600 py-3 px-6 rounded-lg items-center"
          onPress={() => {}}
        >
          <ThemedText className="text-white font-semibold text-lg">
            Đặt phòng ngay
          </ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}
