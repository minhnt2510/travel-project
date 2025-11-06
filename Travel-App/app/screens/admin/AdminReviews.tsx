import { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { ThemedText } from "@/ui-components/themed-text";
import { ThemedView } from "@/ui-components/themed-view";
import { IconSymbol } from "@/ui-components/ui/icon-symbol";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { api, type Review } from "@/services/api";
import Animated, { FadeInDown } from "react-native-reanimated";
import RoleGuard from "@/app/components/common/RoleGuard";

export default function AdminReviewsScreen() {
  return (
    <RoleGuard allowedRoles={["admin"]}>
      <AdminReviewsContent />
    </RoleGuard>
  );
}

function AdminReviewsContent() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const data = await api.getAllReviews();
      setReviews(data);
    } catch (error: any) {
      console.error("Error loading reviews:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadReviews();
  };

  const getTourTitle = (review: Review): string => {
    if (typeof review.tourId === "object" && review.tourId) {
      return review.tourId.title || "Tour";
    }
    return "Tour";
  };

  const getTourImage = (review: Review): string | undefined => {
    if (typeof review.tourId === "object" && review.tourId) {
      return review.tourId.imageUrl;
    }
    return undefined;
  };

  const getUserName = (review: Review): string => {
    if (typeof review.userId === "object" && review.userId) {
      return review.userId.name || "Người dùng";
    }
    return "Người dùng";
  };

  const getUserAvatar = (review: Review): string | undefined => {
    if (typeof review.userId === "object" && review.userId) {
      return review.userId.avatar;
    }
    return undefined;
  };

  const getUserEmail = (review: Review): string => {
    if (typeof review.userId === "object" && review.userId) {
      return review.userId.email || "";
    }
    return "";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <ThemedView className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#2563eb" />
        <ThemedText className="mt-4 text-gray-600">Đang tải đánh giá...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView className="flex-1 bg-gray-50">
      {/* Header */}
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
            Quản lý đánh giá ({reviews.length})
          </ThemedText>
        </View>
      </LinearGradient>

      {/* Reviews List */}
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="p-4">
          {reviews.length === 0 ? (
            <View className="items-center py-20">
              <IconSymbol name="message-square" size={80} color="#d1d5db" />
              <ThemedText className="text-xl font-semibold text-gray-500 mt-4">
                Chưa có đánh giá nào
              </ThemedText>
            </View>
          ) : (
            reviews.map((review, index) => (
              <Animated.View
                key={review._id}
                entering={FadeInDown.delay(index * 50).duration(400)}
              >
                <TouchableOpacity
                  className="bg-white rounded-2xl p-4 mb-4 shadow-lg"
                  style={{
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 8,
                    elevation: 4,
                  }}
                >
                  {/* Tour Info */}
                  <View className="flex-row mb-3">
                    {getTourImage(review) && (
                      <Image
                        source={{ uri: getTourImage(review) }}
                        className="w-20 h-20 rounded-xl"
                        contentFit="cover"
                      />
                    )}
                    <View className="flex-1 ml-3">
                      <ThemedText className="font-bold text-lg text-gray-900" numberOfLines={2}>
                        {getTourTitle(review)}
                      </ThemedText>
                      <View className="flex-row items-center mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <IconSymbol
                            key={star}
                            name="star"
                            size={14}
                            color={star <= review.rating ? "#FFB800" : "#e5e7eb"}
                          />
                        ))}
                        <ThemedText className="ml-2 text-gray-600 text-sm">
                          {review.rating}/5
                        </ThemedText>
                      </View>
                    </View>
                  </View>

                  {/* User Info */}
                  <View className="flex-row items-center mb-3 pb-3 border-b border-gray-200">
                    <Image
                      source={{
                        uri:
                          getUserAvatar(review) ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(getUserName(review))}&background=667eea&color=fff&size=64`,
                      }}
                      className="w-10 h-10 rounded-full"
                      contentFit="cover"
                    />
                    <View className="flex-1 ml-3">
                      <ThemedText className="font-semibold text-gray-900">
                        {getUserName(review)}
                      </ThemedText>
                      {getUserEmail(review) && (
                        <ThemedText className="text-gray-500 text-xs">
                          {getUserEmail(review)}
                        </ThemedText>
                      )}
                    </View>
                    <ThemedText className="text-gray-500 text-xs">
                      {formatDate(review.createdAt)}
                    </ThemedText>
                  </View>

                  {/* Review Comment */}
                  {review.comment && (
                    <ThemedText className="text-gray-700 leading-5 mb-2">
                      {review.comment}
                    </ThemedText>
                  )}

                  {/* Review Images */}
                  {review.images && review.images.length > 0 && (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-2">
                      <View className="flex-row">
                        {review.images.map((img, idx) => (
                          <Image
                            key={idx}
                            source={{ uri: img }}
                            className="w-20 h-20 rounded-lg mr-2"
                            contentFit="cover"
                          />
                        ))}
                      </View>
                    </ScrollView>
                  )}

                  {/* Pros and Cons */}
                  {(review.pros || review.cons) && (
                    <View className="mt-3 pt-3 border-t border-gray-100">
                      {review.pros && review.pros.length > 0 && (
                        <View className="mb-2">
                          <ThemedText className="text-green-600 font-semibold text-sm mb-1">
                            Điểm tốt:
                          </ThemedText>
                          {review.pros.map((pro, idx) => (
                            <ThemedText key={idx} className="text-gray-600 text-sm ml-2">
                              • {pro}
                            </ThemedText>
                          ))}
                        </View>
                      )}
                      {review.cons && review.cons.length > 0 && (
                        <View>
                          <ThemedText className="text-red-600 font-semibold text-sm mb-1">
                            Điểm cần cải thiện:
                          </ThemedText>
                          {review.cons.map((con, idx) => (
                            <ThemedText key={idx} className="text-gray-600 text-sm ml-2">
                              • {con}
                            </ThemedText>
                          ))}
                        </View>
                      )}
                    </View>
                  )}
                </TouchableOpacity>
              </Animated.View>
            ))
          )}
        </View>
        <View className="h-24" />
      </ScrollView>
    </ThemedView>
  );
}

