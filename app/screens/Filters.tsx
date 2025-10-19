import { View, TouchableOpacity, ScrollView, Switch } from "react-native";
import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useState } from "react";

type FilterKeys = "hasPool" | "hasFreeWifi" | "hasParking" | "hasRestaurant";
type Filters = Record<FilterKeys, boolean>;

const amenitiesLabels: Record<FilterKeys, string> = {
  hasPool: "Hồ bơi",
  hasFreeWifi: "WiFi miễn phí",
  hasParking: "Bãi đỗ xe",
  hasRestaurant: "Nhà hàng",
};

export default function Filters() {
  const [filters, setFilters] = useState<Filters>({
    hasPool: false,
    hasFreeWifi: false,
    hasParking: false,
    hasRestaurant: false,
  });

  const [priceRange, setPriceRange] = useState([500000, 5000000]); // VND

  return (
    <ThemedView className="flex-1">
      <View className="flex-row items-center p-4 border-b border-gray-200">
        <TouchableOpacity onPress={() => {}}>
          <IconSymbol name="x" size={24} color="#000" />
        </TouchableOpacity>
        <ThemedText className="flex-1 text-center text-xl font-bold">
          Bộ lọc tìm kiếm
        </ThemedText>
        <TouchableOpacity>
          <ThemedText className="text-blue-600">Đặt lại</ThemedText>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 p-4">
        {/* Price Range */}
        <View className="mb-6">
          <ThemedText className="text-lg font-bold mb-4">Khoảng giá</ThemedText>
          <View className="space-y-4">
            <View className="flex-row justify-between items-center">
              <ThemedText>500,000đ</ThemedText>
              <ThemedText>5,000,000đ</ThemedText>
            </View>
            {/* Price Range Slider would go here */}
          </View>
        </View>

        {/* Amenities */}
        <View className="mb-6">
          <ThemedText className="text-lg font-bold mb-4">Tiện nghi</ThemedText>
          {(Object.entries(amenitiesLabels) as [FilterKeys, string][]).map(
            ([key, label]) => (
              <View
                key={key}
                className="flex-row justify-between items-center py-3 border-b border-gray-100"
              >
                <ThemedText>{label}</ThemedText>
                <Switch
                  value={filters[key]}
                  onValueChange={(value) =>
                    setFilters((prev) => ({ ...prev, [key]: value }))
                  }
                />
              </View>
            )
          )}
        </View>

        {/* Star Rating */}
        <View className="mb-6">
          <ThemedText className="text-lg font-bold mb-4">
            Xếp hạng sao
          </ThemedText>
          <View className="flex-row justify-between">
            {[5, 4, 3, 2, 1].map((rating) => (
              <TouchableOpacity
                key={rating}
                className="items-center justify-center w-16 h-16 rounded-lg border border-gray-200"
              >
                <ThemedText className="font-semibold">{rating}</ThemedText>
                <IconSymbol name="star" size={16} color="#FFB800" />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Apply Button */}
      <View className="p-4 border-t border-gray-200">
        <TouchableOpacity
          className="bg-blue-600 py-3 rounded-lg items-center"
          onPress={() => {}}
        >
          <ThemedText className="text-white font-semibold text-lg">
            Áp dụng
          </ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}
