import { View, ScrollView, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { ThemedView } from "@/ui-components/themed-view";
import { ThemedText } from "@/ui-components/themed-text";
import { IconSymbol } from "@/ui-components/ui/icon-symbol";

export default function TripDetail() {
  return (
    <ThemedView className="flex-1">
      <ScrollView>
        {/* Header Image */}
        <View className="relative h-72">
          <Image
            source={{ uri: "https://placekitten.com/400/300" }}
            className="w-full h-full"
            contentFit="cover"
          />
          <TouchableOpacity
            className="absolute top-12 left-4 bg-white/80 p-2 rounded-full"
            onPress={() => {}}
          >
            <IconSymbol name="arrow-left" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View className="p-4">
          <ThemedText className="text-2xl font-bold">
            Tour Đà Lạt 3 Ngày 2 Đêm
          </ThemedText>
          <View className="flex-row items-center mt-2">
            <IconSymbol name="map-pin" size={16} color="#6B7280" />
            <ThemedText className="ml-1 text-gray-600">
              Đà Lạt, Lâm Đồng
            </ThemedText>
          </View>

          {/* Price Info */}
          <View className="mt-4 bg-blue-50 p-4 rounded-lg">
            <ThemedText className="text-xl font-bold text-blue-600">
              2,500,000 VNĐ
            </ThemedText>
            <ThemedText className="text-gray-600">/người</ThemedText>
          </View>

          {/* Trip Details */}
          <View className="mt-4">
            <ThemedText className="text-xl font-bold mb-2">
              Chi tiết chuyến đi
            </ThemedText>
            <View className="space-y-3">
              <View className="flex-row items-center">
                <IconSymbol name="clock" size={16} color="#6B7280" />
                <ThemedText className="ml-2">3 ngày 2 đêm</ThemedText>
              </View>
              <View className="flex-row items-center">
                <IconSymbol name="users" size={16} color="#6B7280" />
                <ThemedText className="ml-2">Tối đa 20 người</ThemedText>
              </View>
              <View className="flex-row items-center">
                <IconSymbol name="calendar" size={16} color="#6B7280" />
                <ThemedText className="ml-2">Khởi hành: 25/10/2025</ThemedText>
              </View>
            </View>
          </View>

          {/* Description */}
          <View className="mt-4">
            <ThemedText className="text-xl font-bold mb-2">Mô tả</ThemedText>
            <ThemedText className="text-gray-600 leading-6">
              Khám phá Đà Lạt với tour 3 ngày 2 đêm đầy hấp dẫn. Tham quan các
              địa điểm nổi tiếng như Thung lũng Tình yêu, Đồi Robin, Ga Đà Lạt
              và thưởng thức ẩm thực địa phương.
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
            Đặt ngay
          </ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}
