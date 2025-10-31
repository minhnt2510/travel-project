import { useState } from "react";
import {
  View,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import { ThemedText } from "@/ui-components/themed-text";
import { IconSymbol } from "@/ui-components/ui/icon-symbol";

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: FilterState) => void;
  initialFilters?: FilterState;
}

export interface FilterState {
  priceRange: { min: number; max: number };
  duration: string[]; // ["2-4h", "half-day", "1-day", "2-3-days"]
  location: { radius: number; currentLocation: boolean };
  rating: number;
  hasGuide: boolean | null;
  hasPickup: boolean | null;
}

const DURATION_OPTIONS = [
  { label: "2-4 giờ", value: "2-4h" },
  { label: "Nửa ngày", value: "half-day" },
  { label: "1 ngày", value: "1-day" },
  { label: "2-3 ngày", value: "2-3-days" },
  { label: "4+ ngày", value: "4+days" },
];

const PRICE_RANGES = [
  { label: "Dưới 200k", min: 0, max: 200000 },
  { label: "200k - 500k", min: 200000, max: 500000 },
  { label: "500k - 1M", min: 500000, max: 1000000 },
  { label: "Trên 1M", min: 1000000, max: 999999999 },
];

export default function FilterModal({
  visible,
  onClose,
  onApply,
  initialFilters,
}: FilterModalProps) {
  const [filters, setFilters] = useState<FilterState>(
    initialFilters || {
      priceRange: { min: 0, max: 999999999 },
      duration: [],
      location: { radius: 10, currentLocation: true },
      rating: 0,
      hasGuide: null,
      hasPickup: null,
    }
  );

  const [priceMin, setPriceMin] = useState(
    filters.priceRange.min.toString()
  );
  const [priceMax, setPriceMax] = useState(
    filters.priceRange.max === 999999999 ? "" : filters.priceRange.max.toString()
  );

  const toggleDuration = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      duration: prev.duration.includes(value)
        ? prev.duration.filter((d) => d !== value)
        : [...prev.duration, value],
    }));
  };

  const handleApply = () => {
    const finalFilters: FilterState = {
      ...filters,
      priceRange: {
        min: priceMin ? parseInt(priceMin) || 0 : 0,
        max: priceMax ? parseInt(priceMax) || 999999999 : 999999999,
      },
    };
    onApply(finalFilters);
    onClose();
  };

  const resetFilters = () => {
    const defaultFilters: FilterState = {
      priceRange: { min: 0, max: 999999999 },
      duration: [],
      location: { radius: 10, currentLocation: true },
      rating: 0,
      hasGuide: null,
      hasPickup: null,
    };
    setFilters(defaultFilters);
    setPriceMin("0");
    setPriceMax("");
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-white">
        {/* Header */}
        <View className="p-4 border-b border-gray-200 flex-row items-center justify-between bg-white">
          <TouchableOpacity onPress={onClose}>
            <IconSymbol name="x" size={24} color="#000" />
          </TouchableOpacity>
          <ThemedText className="text-xl font-bold">Bộ lọc</ThemedText>
          <TouchableOpacity onPress={resetFilters}>
            <ThemedText className="text-blue-600 font-semibold">Đặt lại</ThemedText>
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 p-4">
          {/* Giá */}
          <View className="mb-6">
            <ThemedText className="text-lg font-bold mb-3">Khoảng giá</ThemedText>
            <View className="flex-row flex-wrap gap-2 mb-4">
              {PRICE_RANGES.map((range) => (
                <TouchableOpacity
                  key={range.label}
                  onPress={() => {
                    setPriceMin(range.min.toString());
                    setPriceMax(range.max === 999999999 ? "" : range.max.toString());
                  }}
                  className={`px-4 py-2 rounded-lg border ${
                    priceMin === range.min.toString()
                      ? "bg-blue-50 border-blue-500"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <ThemedText
                    className={`text-sm font-medium ${
                      priceMin === range.min.toString()
                        ? "text-blue-700"
                        : "text-gray-700"
                    }`}
                  >
                    {range.label}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
            <View className="flex-row items-center gap-2">
              <TextInput
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 bg-gray-50"
                placeholder="Từ (VNĐ)"
                keyboardType="numeric"
                value={priceMin}
                onChangeText={setPriceMin}
              />
              <ThemedText className="text-gray-500">-</ThemedText>
              <TextInput
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 bg-gray-50"
                placeholder="Đến (VNĐ)"
                keyboardType="numeric"
                value={priceMax}
                onChangeText={setPriceMax}
              />
            </View>
          </View>

          {/* Thời lượng */}
          <View className="mb-6">
            <ThemedText className="text-lg font-bold mb-3">Thời lượng</ThemedText>
            <View className="flex-row flex-wrap gap-2">
              {DURATION_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => toggleDuration(option.value)}
                  className={`px-4 py-2 rounded-lg border ${
                    filters.duration.includes(option.value)
                      ? "bg-blue-50 border-blue-500"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <ThemedText
                    className={`text-sm font-medium ${
                      filters.duration.includes(option.value)
                        ? "text-blue-700"
                        : "text-gray-700"
                    }`}
                  >
                    {option.label}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Vị trí */}
          <View className="mb-6">
            <ThemedText className="text-lg font-bold mb-3">Khoảng cách</ThemedText>
            <View className="flex-row items-center gap-4 mb-3">
              <TouchableOpacity
                onPress={() =>
                  setFilters((prev) => ({
                    ...prev,
                    location: { ...prev.location, currentLocation: true },
                  }))
                }
                className={`flex-1 px-4 py-3 rounded-lg border ${
                  filters.location.currentLocation
                    ? "bg-blue-50 border-blue-500"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <ThemedText
                  className={`text-center font-medium ${
                    filters.location.currentLocation
                      ? "text-blue-700"
                      : "text-gray-700"
                  }`}
                >
                  Gần tôi
                </ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  setFilters((prev) => ({
                    ...prev,
                    location: { ...prev.location, currentLocation: false },
                  }))
                }
                className={`flex-1 px-4 py-3 rounded-lg border ${
                  !filters.location.currentLocation
                    ? "bg-blue-50 border-blue-500"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <ThemedText
                  className={`text-center font-medium ${
                    !filters.location.currentLocation
                      ? "text-blue-700"
                      : "text-gray-700"
                  }`}
                >
                  Tất cả
                </ThemedText>
              </TouchableOpacity>
            </View>
            <View className="flex-row items-center gap-2">
              <ThemedText className="text-gray-600">Bán kính:</ThemedText>
              <TextInput
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 bg-gray-50"
                placeholder="10"
                keyboardType="numeric"
                value={filters.location.radius.toString()}
                onChangeText={(text) =>
                  setFilters((prev) => ({
                    ...prev,
                    location: {
                      ...prev.location,
                      radius: parseInt(text) || 10,
                    },
                  }))
                }
              />
              <ThemedText className="text-gray-600">km</ThemedText>
            </View>
          </View>

          {/* Rating */}
          <View className="mb-6">
            <ThemedText className="text-lg font-bold mb-3">Đánh giá tối thiểu</ThemedText>
            <View className="flex-row gap-2">
              {[4, 4.5, 5].map((rating) => (
                <TouchableOpacity
                  key={rating}
                  onPress={() =>
                    setFilters((prev) => ({
                      ...prev,
                      rating: prev.rating === rating ? 0 : rating,
                    }))
                  }
                  className={`px-4 py-2 rounded-lg border ${
                    filters.rating === rating
                      ? "bg-blue-50 border-blue-500"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <ThemedText
                    className={`text-sm font-medium ${
                      filters.rating === rating
                        ? "text-blue-700"
                        : "text-gray-700"
                    }`}
                  >
                    {rating}+ ⭐
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Hướng dẫn viên */}
          <View className="mb-6">
            <ThemedText className="text-lg font-bold mb-3">Có hướng dẫn viên</ThemedText>
            <View className="flex-row gap-2">
              {[
                { label: "Tất cả", value: null },
                { label: "Có", value: true },
                { label: "Không", value: false },
              ].map((option) => (
                <TouchableOpacity
                  key={String(option.value)}
                  onPress={() =>
                    setFilters((prev) => ({
                      ...prev,
                      hasGuide: option.value,
                    }))
                  }
                  className={`flex-1 px-4 py-3 rounded-lg border ${
                    filters.hasGuide === option.value
                      ? "bg-blue-50 border-blue-500"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <ThemedText
                    className={`text-center font-medium ${
                      filters.hasGuide === option.value
                        ? "text-blue-700"
                        : "text-gray-700"
                    }`}
                  >
                    {option.label}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Đưa đón */}
          <View className="mb-6">
            <ThemedText className="text-lg font-bold mb-3">Có đưa đón</ThemedText>
            <View className="flex-row gap-2">
              {[
                { label: "Tất cả", value: null },
                { label: "Có", value: true },
                { label: "Không", value: false },
              ].map((option) => (
                <TouchableOpacity
                  key={String(option.value)}
                  onPress={() =>
                    setFilters((prev) => ({
                      ...prev,
                      hasPickup: option.value,
                    }))
                  }
                  className={`flex-1 px-4 py-3 rounded-lg border ${
                    filters.hasPickup === option.value
                      ? "bg-blue-50 border-blue-500"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <ThemedText
                    className={`text-center font-medium ${
                      filters.hasPickup === option.value
                        ? "text-blue-700"
                        : "text-gray-700"
                    }`}
                  >
                    {option.label}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Footer */}
        <View className="p-4 border-t border-gray-200 bg-white">
          <TouchableOpacity
            onPress={handleApply}
            className="bg-blue-600 py-4 rounded-lg items-center"
          >
            <ThemedText className="text-white font-bold text-lg">
              Áp dụng bộ lọc
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

