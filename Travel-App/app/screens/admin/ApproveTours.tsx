import { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from "react-native";
import { ThemedView } from "@/ui-components/themed-view";
import { ThemedText } from "@/ui-components/themed-text";
import { IconSymbol } from "@/ui-components/ui/icon-symbol";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import { api, type Tour } from "@/services/api";
import RoleGuard from "@/app/components/common/RoleGuard";

export default function ApproveToursScreen() {
  return (
    <RoleGuard allowedRoles={["admin"]}>
      <ApproveToursContent />
    </RoleGuard>
  );
}

function ApproveToursContent() {
  const [pendingTours, setPendingTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadPendingTours();
  }, []);

  const loadPendingTours = async () => {
    try {
      setLoading(true);
      const tours = await api.getPendingTours();
      setPendingTours(tours);
    } catch (error: any) {
      console.error("Error loading pending tours:", error);
      Alert.alert("Lỗi", error.message || "Không thể tải danh sách tour chờ duyệt");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPendingTours();
  };

  const handleApprove = async (tourId: string) => {
    Alert.alert(
      "Duyệt tour",
      "Bạn có chắc chắn muốn duyệt tour này?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Duyệt",
          onPress: async () => {
            try {
              await api.updateTourStatus(tourId, "approved");
              Alert.alert("Thành công", "Tour đã được duyệt");
              loadPendingTours();
            } catch (error: any) {
              Alert.alert("Lỗi", error.message || "Không thể duyệt tour");
            }
          },
        },
      ]
    );
  };

  const handleReject = async (tourId: string) => {
    Alert.alert(
      "Từ chối tour",
      "Bạn có chắc chắn muốn từ chối tour này?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Từ chối",
          style: "destructive",
          onPress: async () => {
            try {
              await api.updateTourStatus(tourId, "rejected");
              Alert.alert("Thành công", "Tour đã bị từ chối");
              loadPendingTours();
            } catch (error: any) {
              Alert.alert("Lỗi", error.message || "Không thể từ chối tour");
            }
          },
        },
      ]
    );
  };

  if (loading && !refreshing) {
    return (
      <ThemedView className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#8b5cf6" />
        <ThemedText className="mt-4 text-gray-600">Đang tải...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView className="flex-1 bg-gray-50">
      {/* Header */}
      <LinearGradient
        colors={["#8b5cf6", "#7c3aed"]}
        className="px-4 pt-16 pb-8 rounded-b-3xl shadow-xl"
      >
        <View className="flex-row items-center justify-between mb-4">
          <TouchableOpacity onPress={() => router.back()}>
            <IconSymbol name="arrow-left" size={24} color="#FFF" />
          </TouchableOpacity>
          <ThemedText className="text-white text-2xl font-extrabold flex-1 ml-4">
            Duyệt Tours
          </ThemedText>
        </View>
        <View className="bg-white/20 backdrop-blur-md rounded-xl px-4 py-2 mt-2">
          <ThemedText className="text-white text-center font-semibold">
            {pendingTours.length} tour đang chờ duyệt
          </ThemedText>
        </View>
      </LinearGradient>

      <ScrollView
        className="flex-1 px-4 pt-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {pendingTours.length === 0 ? (
          <View className="items-center justify-center py-20">
            <IconSymbol name="check-circle" size={64} color="#10b981" />
            <ThemedText className="text-gray-600 text-lg font-semibold mt-4">
              Không có tour nào chờ duyệt
            </ThemedText>
          </View>
        ) : (
          pendingTours.map((tour) => (
            <View
              key={tour._id}
              className="bg-white rounded-2xl p-4 mb-3 shadow-sm border border-gray-100"
            >
              <View className="flex-row mb-3">
                <Image
                  source={{ uri: tour.imageUrl || tour.images?.[0] || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200&h=200&fit=crop" }}
                  className="w-24 h-24 rounded-xl"
                  contentFit="cover"
                />
                <View className="flex-1 ml-3">
                  <ThemedText className="text-gray-900 font-extrabold text-lg" numberOfLines={2}>
                    {tour.title}
                  </ThemedText>
                  <ThemedText className="text-gray-600 text-sm mt-1">
                    {tour.location}
                  </ThemedText>
                  <ThemedText className="text-purple-600 font-extrabold text-lg mt-2">
                    {tour.price.toLocaleString("vi-VN")}đ
                  </ThemedText>
                </View>
                <View className="bg-yellow-500 px-3 py-1.5 rounded-full h-fit border border-yellow-600">
                  <ThemedText className="text-white font-extrabold text-xs">
                    CHỜ DUYỆT
                  </ThemedText>
                </View>
              </View>

              <ThemedText className="text-gray-700 text-sm mb-4" numberOfLines={3}>
                {tour.description}
              </ThemedText>

              <View className="flex-row gap-2">
                <TouchableOpacity
                  onPress={() => handleReject(tour._id)}
                  className="flex-1 bg-red-50 border-2 border-red-200 px-4 py-3 rounded-xl"
                >
                  <ThemedText className="text-red-700 font-extrabold text-center">
                    ❌ Từ chối
                  </ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleApprove(tour._id)}
                  className="flex-1 bg-green-50 border-2 border-green-200 px-4 py-3 rounded-xl"
                >
                  <ThemedText className="text-green-700 font-extrabold text-center">
                    ✅ Duyệt
                  </ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
        <View className="h-8" />
      </ScrollView>
    </ThemedView>
  );
}

