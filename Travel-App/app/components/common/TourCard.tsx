import { ThemedText } from "@/ui-components/themed-text";
import { IconSymbol } from "@/ui-components/ui/icon-symbol";
import { Image } from "expo-image";
import { TouchableOpacity, View } from "react-native";
import { Tour } from "@/services/api";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInRight } from "react-native-reanimated";

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
      <Animated.View entering={FadeInRight.duration(500)}>
        <TouchableOpacity
          activeOpacity={0.9}
          className="mb-4 bg-white rounded-3xl shadow-xl overflow-hidden flex-row border border-gray-100"
          onPress={() => onPress(tour._id)}
        >
          <View className="relative">
            <Image
              source={{
                uri: tour.imageUrl || "https://via.placeholder.com/200",
              }}
              className="w-36 h-36"
              contentFit="cover"
            />
            <View className="absolute top-2 left-2">
              <LinearGradient
                colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.9)']}
                className="px-2.5 py-1 rounded-full flex-row items-center"
              >
                <IconSymbol name="star" size={12} color="#fbbf24" />
                <ThemedText className="text-gray-900 font-bold text-xs ml-1">
                  {tour.rating.toFixed(1)}
                </ThemedText>
              </LinearGradient>
            </View>
          </View>
          <View className="flex-1 p-4 justify-between">
            <View>
              <ThemedText className="font-extrabold text-gray-900 mb-1.5 text-base" numberOfLines={1}>
                {tour.title}
              </ThemedText>
              <View className="flex-row items-center mb-2">
                <IconSymbol name="location" size={12} color="#667eea" />
                <ThemedText className="text-gray-600 text-xs ml-1">
                  {tour.location}
                </ThemedText>
              </View>
              <View className="flex-row items-center">
                <IconSymbol name="calendar" size={12} color="#667eea" />
                <ThemedText className="text-gray-600 text-xs ml-1">
                  {tour.duration} ngày
                </ThemedText>
              </View>
            </View>
            <View className="flex-row justify-between items-center mt-2">
              <View>
                <ThemedText className="text-purple-600 font-extrabold text-lg">
                  {tour.price.toLocaleString("vi-VN")}đ
                </ThemedText>
                {tour.originalPrice && (
                  <ThemedText className="text-gray-400 text-xs line-through">
                    {tour.originalPrice.toLocaleString("vi-VN")}đ
                  </ThemedText>
                )}
              </View>
              {tour.originalPrice && (
                <LinearGradient
                  colors={['#ef4444', '#ec4899']}
                  className="px-3 py-1.5 rounded-full"
                >
                  <ThemedText className="text-white font-bold text-xs">
                    -{Math.round((1 - tour.price / tour.originalPrice) * 100)}%
                  </ThemedText>
                </LinearGradient>
              )}
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return (
    <Animated.View entering={FadeInRight.duration(500)}>
      <TouchableOpacity
        activeOpacity={0.9}
        className="mr-4 w-80 bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100"
        onPress={() => onPress(tour._id)}
      >
        <View className="relative">
          <Image
            source={{
              uri: tour.imageUrl || "https://via.placeholder.com/400",
            }}
            className="w-80 h-56"
            contentFit="cover"
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.6)']}
            className="absolute bottom-0 left-0 right-0 h-32"
          />
          <View className="absolute top-4 left-4">
            <LinearGradient
              colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.9)']}
              className="px-3 py-1.5 rounded-full flex-row items-center shadow-lg"
            >
              <IconSymbol name="star" size={14} color="#fbbf24" />
              <ThemedText className="text-gray-900 font-bold text-xs ml-1">
                {tour.rating.toFixed(1)}
              </ThemedText>
              <ThemedText className="text-gray-500 text-xs ml-1">
                ({tour.reviewCount})
              </ThemedText>
            </LinearGradient>
          </View>
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              onWishlistPress(tour._id);
            }}
            className="absolute top-4 right-4 bg-white/90 backdrop-blur-md w-10 h-10 rounded-full items-center justify-center shadow-lg"
          >
            <IconSymbol name="heart" size={20} color="#ef4444" />
          </TouchableOpacity>
          {tour.originalPrice && (
            <View className="absolute bottom-4 left-4">
              <LinearGradient
                colors={['#ef4444', '#f97316']}
                className="px-4 py-2 rounded-full shadow-lg"
              >
                <ThemedText className="text-white font-extrabold text-xs">
                  -{Math.round((1 - tour.price / tour.originalPrice) * 100)}% OFF
                </ThemedText>
              </LinearGradient>
            </View>
          )}
        </View>
        <View className="p-5">
          <ThemedText className="text-xl font-extrabold text-gray-900 mb-2" numberOfLines={1}>
            {tour.title}
          </ThemedText>
          <ThemedText className="text-gray-600 text-sm mb-3 leading-5" numberOfLines={2}>
            {tour.description}
          </ThemedText>
          <View className="flex-row items-center mb-4">
            <View className="bg-purple-50 px-3 py-1.5 rounded-full flex-row items-center mr-2">
              <IconSymbol name="location" size={14} color="#667eea" />
              <ThemedText className="text-purple-700 text-xs ml-1 font-semibold">
                {tour.location}
              </ThemedText>
            </View>
            <View className="bg-blue-50 px-3 py-1.5 rounded-full flex-row items-center">
              <IconSymbol name="calendar" size={14} color="#3b82f6" />
              <ThemedText className="text-blue-700 text-xs ml-1 font-semibold">
                {tour.duration} ngày
              </ThemedText>
            </View>
          </View>
          <View className="flex-row justify-between items-center">
            <View>
              <ThemedText className="text-purple-600 font-extrabold text-2xl">
                {tour.price.toLocaleString("vi-VN")}đ
              </ThemedText>
              {tour.originalPrice && (
                <ThemedText className="text-gray-400 text-xs line-through">
                  {tour.originalPrice.toLocaleString("vi-VN")}đ
                </ThemedText>
              )}
            </View>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => onPress(tour._id)}
            >
              <LinearGradient
                colors={['#667eea', '#764ba2']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="px-6 py-3 rounded-full shadow-lg"
              >
                <ThemedText className="text-white font-bold">
                  Xem ngay
                </ThemedText>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

