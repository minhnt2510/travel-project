import { ThemedText } from "@/ui-components/themed-text";
import { ThemedView } from "@/ui-components/themed-view";
import { IconSymbol } from "@/ui-components/ui/icon-symbol";
import { router } from "expo-router";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { useWishlist } from "@/hooks/useWishlist";
import TourCard from "@/app/components/common/TourCard";

export default function WishlistScreen() {
  const { items, loading, refreshing, onRefresh, removeFromWishlist } =
    useWishlist();

  const handleItemPress = (tourId: string) => {
    router.push({
      pathname: "/screens/destinations/HotelDetail",
      params: { destinationId: tourId },
    });
  };

  const handleRemove = (tourId: string) => {
    Alert.alert(
      "Xóa khỏi danh sách yêu thích",
      "Bạn có chắc chắn muốn xóa tour này?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: () => removeFromWishlist(tourId),
        },
      ]
    );
  };

  const renderEmptyState = () => (
    <View className="flex-1 items-center justify-center p-8">
      <LinearGradient
        colors={['#fce7f3', '#fbcfe8']}
        className="w-32 h-32 rounded-full items-center justify-center shadow-lg"
      >
        <IconSymbol name="heart" size={64} color="#ec4899" />
      </LinearGradient>
      <ThemedText className="text-2xl font-extrabold text-gray-900 mt-6 mb-2">
        Danh sách yêu thích trống
      </ThemedText>
      <ThemedText className="text-gray-600 text-center mb-8 text-base">
        Hãy khám phá và thêm những tour du lịch yêu thích vào đây nhé!
      </ThemedText>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => router.push("/")}
        className="rounded-full overflow-hidden shadow-xl"
      >
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          className="px-8 py-4 flex-row items-center"
        >
          <ThemedText className="text-white font-extrabold text-lg mr-2">
            Khám phá ngay
          </ThemedText>
          <IconSymbol name="arrow-right" size={20} color="#FFF" />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <ThemedView className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#2563eb" />
        <ThemedText className="mt-4 text-gray-600">Đang tải...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView className="flex-1 bg-gray-50">
      <LinearGradient
        colors={['#ec4899', '#ef4444', '#f97316']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="p-6 pt-12 rounded-b-3xl"
      >
        <ThemedText className="text-3xl font-extrabold text-white mb-2">
          Danh sách yêu thích ❤️
        </ThemedText>
        <ThemedText className="text-white/90 font-medium">
          {items.length} tour đã lưu
        </ThemedText>
      </LinearGradient>

      {items.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ padding: 16 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({ item, index }) => {
            const tour = typeof item.tourId === "object" ? item.tourId : null;
            if (!tour) return null;

            return (
              <Animated.View
                entering={FadeInDown.delay(index * 100).duration(500)}
              >
                <TourCard
                  tour={tour}
                  onPress={handleItemPress}
                  onWishlistPress={handleRemove}
                />
              </Animated.View>
            );
          }}
        />
      )}
    </ThemedView>
  );
}
