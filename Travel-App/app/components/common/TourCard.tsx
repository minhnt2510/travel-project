import { ThemedText } from "@/ui-components/themed-text";
import { IconSymbol } from "@/ui-components/ui/icon-symbol";
import { Image } from "expo-image";
import { TouchableOpacity, View } from "react-native";
import { Tour } from "@/services/api";

interface TourCardProps {
  tour: Tour;
  onPress: (tourId: string) => void;
  onWishlistPress: (tourId: string) => void;
  variant?: "horizontal" | "vertical";
}

export default function TourCard({
  tour,
  onPress,
  onWishlistPress,
  variant = "vertical",
}: TourCardProps) {
  if (variant === "horizontal") {
    return (
      <TouchableOpacity
        className="mb-4 bg-white rounded-2xl shadow-md overflow-hidden flex-row"
        onPress={() => onPress(tour._id)}
      >
        <Image
          source={{
            uri: tour.imageUrl || "https://via.placeholder.com/200",
          }}
          className="w-32 h-32"
          contentFit="cover"
        />
        <View className="flex-1 p-3 justify-between">
          <View>
            <ThemedText className="font-bold text-gray-900 mb-1" numberOfLines={1}>
              {tour.title}
            </ThemedText>
            <View className="flex-row items-center mb-2">
              <IconSymbol name="location" size={12} color="#6B7280" />
              <ThemedText className="text-gray-600 text-xs ml-1">
                {tour.location}
              </ThemedText>
            </View>
            <View className="flex-row items-center">
              <IconSymbol name="star" size={14} color="#FFB800" />
              <ThemedText className="text-gray-600 text-xs ml-1">
                {tour.rating} ({tour.reviewCount})
              </ThemedText>
            </View>
          </View>
          <View className="flex-row justify-between items-center mt-2">
            <ThemedText className="text-blue-600 font-bold">
              {tour.price.toLocaleString("vi-VN")}đ
            </ThemedText>
            {tour.originalPrice && (
              <View className="bg-red-100 px-2 py-1 rounded">
                <ThemedText className="text-red-600 font-bold text-xs">
                  -{Math.round((1 - tour.price / tour.originalPrice) * 100)}%
                </ThemedText>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      className="mr-4 w-72 bg-white rounded-2xl shadow-lg overflow-hidden"
      onPress={() => onPress(tour._id)}
    >
      <View className="relative">
        <Image
          source={{
            uri: tour.imageUrl || "https://via.placeholder.com/400",
          }}
          className="w-72 h-48"
          contentFit="cover"
        />
        <View className="absolute top-3 left-3">
          <View className="bg-white px-3 py-1.5 rounded-full flex-row items-center">
            <IconSymbol name="star" size={14} color="#FFB800" />
            <ThemedText className="text-gray-900 font-bold text-xs ml-1">
              {tour.rating.toFixed(1)}
            </ThemedText>
          </View>
        </View>
        <View className="absolute top-3 right-3">
          <TouchableOpacity
            onPress={() => onWishlistPress(tour._id)}
            className="bg-white/90 w-9 h-9 rounded-full items-center justify-center"
          >
            <IconSymbol name="heart" size={18} color="#EF4444" />
          </TouchableOpacity>
        </View>
        {tour.originalPrice && (
          <View className="absolute bottom-3 left-3 bg-red-500 px-3 py-1 rounded-full">
            <ThemedText className="text-white font-bold text-xs">
              -{Math.round((1 - tour.price / tour.originalPrice) * 100)}%
            </ThemedText>
          </View>
        )}
      </View>
      <View className="p-4">
        <ThemedText className="text-lg font-bold text-gray-900 mb-1" numberOfLines={1}>
          {tour.title}
        </ThemedText>
        <ThemedText className="text-gray-500 text-sm mb-2" numberOfLines={2}>
          {tour.description}
        </ThemedText>
        <View className="flex-row items-center mb-3">
          <IconSymbol name="location" size={14} color="#6B7280" />
          <ThemedText className="text-gray-600 text-sm ml-1">
            {tour.location}
          </ThemedText>
          <ThemedText className="text-gray-400 mx-2">•</ThemedText>
          <IconSymbol name="calendar" size={14} color="#6B7280" />
          <ThemedText className="text-gray-600 text-sm ml-1">
            {tour.duration} ngày
          </ThemedText>
        </View>
        <View className="flex-row justify-between items-center">
          <View>
            <ThemedText className="text-blue-600 font-bold text-xl">
              {tour.price.toLocaleString("vi-VN")}đ
            </ThemedText>
            {tour.originalPrice && (
              <ThemedText className="text-gray-400 text-xs line-through">
                {tour.originalPrice.toLocaleString("vi-VN")}đ
              </ThemedText>
            )}
          </View>
          <TouchableOpacity
            className="bg-blue-600 px-5 py-2.5 rounded-full"
            onPress={() => onPress(tour._id)}
          >
            <ThemedText className="text-white font-semibold">
              Xem ngay
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

