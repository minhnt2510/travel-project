import { useState, useEffect } from "react";
import { View, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from "react-native";
import { ThemedView } from "@/ui-components/themed-view";
import { ThemedText } from "@/ui-components/themed-text";
import { IconSymbol } from "@/ui-components/ui/icon-symbol";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { api, type Booking, type Tour } from "@/services/api";
import Animated, { FadeInDown } from "react-native-reanimated";

export default function ReviewCreate() {
  const { bookingId, tourId } = useLocalSearchParams<{ bookingId: string; tourId: string }>();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [tour, setTour] = useState<Tour | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoadingData(true);
      if (bookingId) {
        // Try to get booking detail from API
        try {
          const bookingData = await api.getBookingById(bookingId);
          setBooking(bookingData);
          const tourIdFromBooking = typeof bookingData.tourId === "object" 
            ? bookingData.tourId._id 
            : bookingData.tourId;
          if (tourIdFromBooking) {
            const tourData = await api.getTourById(tourIdFromBooking);
            setTour(tourData);
          }
        } catch (apiError: any) {
          // If Forbidden, try to get from bookings list (fallback)
          if (apiError.message?.includes("Forbidden") || apiError.message?.includes("403")) {
            try {
              const bookings = await api.getBookings();
              const matchingBooking = bookings.find((b) => b._id === bookingId);
              
              if (matchingBooking) {
                // Fallback successful - use it silently
                setBooking(matchingBooking);
                const tourIdFromBooking = typeof matchingBooking.tourId === "object" 
                  ? matchingBooking.tourId._id 
                  : matchingBooking.tourId;
                if (tourIdFromBooking) {
                  const tourData = await api.getTourById(tourIdFromBooking);
                  setTour(tourData);
                }
                return;
              }
            } catch (fallbackError) {
              // Only log if fallback also fails
              // Silent error - will show alert below
            }
          }
          // If not Forbidden or fallback failed, throw original error
          throw apiError;
        }
      } else if (tourId) {
        const tourData = await api.getTourById(tourId);
        setTour(tourData);
      }
    } catch (error: any) {
      // Only show error if it's not a Forbidden that was handled by fallback
      if (!error.message?.includes("Forbidden") && !error.message?.includes("403")) {
        Alert.alert("Lỗi", "Không thể tải thông tin tour");
        router.back();
      }
    } finally {
      setLoadingData(false);
    }
  };

  const handleSubmit = async () => {
    if (!tour) {
      Alert.alert("Lỗi", "Không tìm thấy thông tin tour");
      return;
    }

    if (!comment.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập đánh giá");
      return;
    }

    setLoading(true);
    try {
      await api.createReview({
        tourId: tour._id,
        bookingId: bookingId || undefined,
        rating,
        comment: comment.trim(),
      });

      Alert.alert(
        "Thành công",
        "Cảm ơn bạn đã đánh giá!",
        [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error: any) {
      console.error("Error creating review:", error);
      Alert.alert(
        "Lỗi",
        error.message || "Không thể gửi đánh giá. Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <ThemedView className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#2563eb" />
        <ThemedText className="mt-4 text-gray-600">Đang tải...</ThemedText>
      </ThemedView>
    );
  }

  if (!tour) {
    return (
      <ThemedView className="flex-1 justify-center items-center bg-gray-50">
        <ThemedText className="text-gray-600">Không tìm thấy tour</ThemedText>
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-4 bg-blue-600 px-6 py-3 rounded-xl"
        >
          <ThemedText className="text-white font-semibold">Quay lại</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  const tourTitle = tour.title;
  const tourImage = tour.imageUrl || tour.images?.[0];
  const travelDate = booking?.travelDate || "N/A";

  return (
    <ThemedView className="flex-1 bg-gray-50">
      {/* Header with Gradient */}
      <LinearGradient
        colors={["#667eea", "#764ba2"] as [string, string, ...string[]]}
        className="p-4 pt-12"
      >
        <View className="flex-row items-center mb-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full bg-white/20 items-center justify-center"
          >
            <IconSymbol name="arrow-left" size={24} color="#FFF" />
          </TouchableOpacity>
          <ThemedText className="text-white text-2xl font-bold ml-4 flex-1">
            Viết đánh giá
          </ThemedText>
        </View>
      </LinearGradient>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-4">
          {/* Tour Info Card */}
          <Animated.View
            entering={FadeInDown.delay(100).duration(400)}
            className="bg-white rounded-2xl p-4 mb-6 shadow-lg"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            {tourImage && (
              <Image
                source={{ uri: tourImage }}
                className="w-full h-40 rounded-xl mb-4"
                contentFit="cover"
              />
            )}
            <ThemedText className="font-bold text-xl text-gray-900 mb-2">
              {tourTitle}
            </ThemedText>
            <View className="flex-row items-center">
              <IconSymbol name="calendar" size={16} color="#6b7280" />
              <ThemedText className="ml-2 text-gray-600 text-sm">
                {travelDate}
              </ThemedText>
            </View>
          </Animated.View>

          {/* Rating Section */}
          <Animated.View
            entering={FadeInDown.delay(200).duration(400)}
            className="bg-white rounded-2xl p-6 mb-4 shadow-lg"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <ThemedText className="font-bold text-lg mb-4 text-gray-900">
              Đánh giá sao
            </ThemedText>
            <View className="flex-row justify-center mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  onPress={() => setRating(star)}
                  className="mx-2"
                  activeOpacity={0.7}
                >
                  <IconSymbol
                    name={star <= rating ? "star" : "star"}
                    size={48}
                    color={star <= rating ? "#FFB800" : "#e5e7eb"}
                  />
                </TouchableOpacity>
              ))}
            </View>
            <ThemedText className="text-center text-lg font-semibold text-gray-700">
              {rating === 5
                ? "Xuất sắc ⭐⭐⭐⭐⭐"
                : rating === 4
                ? "Rất tốt ⭐⭐⭐⭐"
                : rating === 3
                ? "Tốt ⭐⭐⭐"
                : rating === 2
                ? "Trung bình ⭐⭐"
                : "Kém ⭐"}
            </ThemedText>
          </Animated.View>

          {/* Review Text */}
          <Animated.View
            entering={FadeInDown.delay(300).duration(400)}
            className="bg-white rounded-2xl p-6 mb-4 shadow-lg"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <ThemedText className="font-bold text-lg mb-4 text-gray-900">
              Chi tiết đánh giá *
            </ThemedText>
            <TextInput
              className="bg-gray-50 p-4 rounded-xl min-h-[150px] text-base border border-gray-200"
              multiline
              placeholder="Chia sẻ trải nghiệm của bạn về tour này..."
              placeholderTextColor="#9ca3af"
              value={comment}
              onChangeText={setComment}
              textAlignVertical="top"
            />
            <ThemedText className="text-gray-500 text-xs mt-2 text-right">
              {comment.length}/500
            </ThemedText>
          </Animated.View>
        </View>
      </ScrollView>

      {/* Submit Button */}
      <View className="p-4 border-t border-gray-200 bg-white">
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={loading || !comment.trim()}
          className="rounded-2xl overflow-hidden shadow-lg"
          style={{
            opacity: loading || !comment.trim() ? 0.6 : 1,
            shadowColor: "#667eea",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 6,
          }}
        >
          <LinearGradient
            colors={["#667eea", "#764ba2"] as [string, string, ...string[]]}
            className="py-4 items-center"
          >
            {loading ? (
              <View className="flex-row items-center">
                <ActivityIndicator size="small" color="#FFF" />
                <ThemedText className="text-white font-bold text-lg ml-2">
                  Đang gửi...
                </ThemedText>
              </View>
            ) : (
              <ThemedText className="text-white font-bold text-lg">
                Gửi đánh giá
              </ThemedText>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}
