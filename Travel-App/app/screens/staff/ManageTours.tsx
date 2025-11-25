import { useState, useEffect } from "react";
import { ThemedText } from "@/ui-components/themed-text";
import { ThemedView } from "@/ui-components/themed-view";
import { IconSymbol } from "@/ui-components/ui/icon-symbol";
import { Image } from "expo-image";
import { router } from "expo-router";
import {
  ScrollView,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from "react-native";
import { api, type Tour } from "@/services/api";
import { useUser } from "../../_layout";

export default function ManageToursScreen() {
  const { user } = useUser();
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<
    "all" | "pending" | "approved" | "rejected"
  >("all");

  useEffect(() => {
    loadTours();
  }, [filter]);

  const loadTours = async () => {
    try {
      setLoading(true);
      const filters: any = { limit: 100 };

      // Staff/Admin can see all tours with status filter
      if (filter !== "all") {
        filters.status = filter;
      }

      const result = await api.getTours(filters);

      // If staff, only show tours created by them
      if (user?.role === "staff") {
        const myTours = result.tours.filter(
          (t: any) => t.createdBy === user._id
        );
        setTours(myTours);
      } else {
        setTours(result.tours);
      }
    } catch (error) {
      console.error("Error loading tours:", error);
      Alert.alert("Lỗi", "Không thể tải danh sách tours");
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTours();
    setRefreshing(false);
  };

  const handleDelete = async (tourId: string, tourTitle: string) => {
    Alert.alert("Xác nhận xóa", `Bạn có chắc muốn xóa tour "${tourTitle}"?`, [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          try {
            await api.deleteTour(tourId);
            Alert.alert("Thành công", "Đã xóa tour thành công");
            loadTours(); // Reload list
          } catch (error: any) {
            Alert.alert(
              "Lỗi",
              error.message ||
                "Không thể xóa tour. Bạn chỉ có thể xóa tour do mình tạo."
            );
          }
        },
      },
    ]);
  };

  const handleEdit = (tourId: string) => {
    // TODO: Navigate to edit screen
    Alert.alert("Thông báo", "Chức năng chỉnh sửa đang được phát triển");
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: {
        text: "Chờ xác nhận",
        bg: "bg-yellow-100",
        color: "text-yellow-800",
      },
      approved: {
        text: "Đã duyệt",
        bg: "bg-green-100",
        color: "text-green-800",
      },
      rejected: { text: "Từ chối", bg: "bg-red-100", color: "text-red-800" },
    };
    const badge = badges[status as keyof typeof badges] || badges.pending;
    return (
      <View className={`${badge.bg} px-3 py-1 rounded-full`}>
        <ThemedText className={`${badge.color} text-xs font-bold`}>
          {badge.text}
        </ThemedText>
      </View>
    );
  };

  if (loading && !refreshing) {
    return (
      <ThemedView className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#10b981" />
        <ThemedText className="mt-4 text-gray-600">
          Đang tải tours...
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-4 pt-12 pb-4 border-b border-gray-200">
        <View className="flex-row items-center mb-4">
          <TouchableOpacity onPress={() => router.back()}>
            <View className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center">
              <IconSymbol name="arrow-left" size={24} color="#111827" />
            </View>
          </TouchableOpacity>
          <ThemedText className="text-gray-900 text-2xl font-bold ml-4 flex-1">
            Quản lý Tours
          </ThemedText>
          <TouchableOpacity
            onPress={() => router.push("/screens/staff/CreateTour" as any)}
            className="bg-emerald-600 px-4 py-2 rounded-full"
          >
            <View className="flex-row items-center">
              <IconSymbol name="plus" size={18} color="#FFF" />
              <ThemedText className="text-white font-bold ml-1">
                Thêm
              </ThemedText>
            </View>
          </TouchableOpacity>
        </View>

        {/* Filter tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row space-x-3">
            {[
              { id: "all", label: "Tất cả" },
              { id: "pending", label: "Chờ duyệt" },
              { id: "approved", label: "Đã duyệt" },
              { id: "rejected", label: "Từ chối" },
            ].map((tab) => (
              <TouchableOpacity
                key={tab.id}
                onPress={() => setFilter(tab.id as any)}
                className={`px-4 py-2 rounded-full ${
                  filter === tab.id ? "bg-emerald-600" : "bg-gray-100"
                }`}
              >
                <ThemedText
                  className={`font-bold text-sm ${
                    filter === tab.id ? "text-white" : "text-gray-700"
                  }`}
                >
                  {tab.label}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Tours List */}
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="p-4">
          {tours.length === 0 ? (
            <View className="items-center py-20">
              <IconSymbol name="map" size={80} color="#D1D5DB" />
              <ThemedText className="text-xl font-semibold text-gray-500 mt-4">
                Chưa có tour nào
              </ThemedText>
              <ThemedText className="text-gray-400 text-center mt-2 px-8">
                {user?.role === "staff"
                  ? "Bạn chưa tạo tour nào. Nhấn nút Thêm để tạo tour mới."
                  : "Chưa có tour nào trong hệ thống"}
              </ThemedText>
            </View>
          ) : (
            tours.map((tour) => (
              <View
                key={tour._id}
                className="mb-4 bg-white rounded-2xl overflow-hidden shadow-lg"
              >
                <View className="flex-row">
                  <Image
                    source={{
                      uri:
                        tour.imageUrl ||
                        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200&h=200&fit=crop",
                    }}
                    className="w-24 h-24"
                    contentFit="cover"
                  />
                  <View className="flex-1 p-3">
                    <View className="flex-row items-start justify-between mb-2">
                      <View className="flex-1 mr-2">
                        <ThemedText
                          className="text-gray-900 font-bold text-base"
                          numberOfLines={2}
                        >
                          {tour.title}
                        </ThemedText>
                        <View className="flex-row items-center mt-1">
                          <IconSymbol
                            name="map-pin"
                            size={12}
                            color="#6B7280"
                          />
                          <ThemedText
                            className="text-gray-500 text-xs ml-1"
                            numberOfLines={1}
                          >
                            {tour.location}
                          </ThemedText>
                        </View>
                      </View>
                      {getStatusBadge(tour.status || "pending")}
                    </View>

                    <View className="flex-row items-center justify-between">
                      <View className="flex-row items-center space-x-3">
                        <View className="flex-row items-center">
                          <IconSymbol
                            name="calendar"
                            size={12}
                            color="#6B7280"
                          />
                          <ThemedText className="text-gray-600 text-xs ml-1">
                            {tour.duration}d
                          </ThemedText>
                        </View>
                        <View className="flex-row items-center">
                          <IconSymbol name="star" size={12} color="#FFB800" />
                          <ThemedText className="text-gray-600 text-xs ml-1">
                            {tour.rating}
                          </ThemedText>
                        </View>
                      </View>
                      <ThemedText className="text-emerald-600 font-bold text-sm">
                        {tour.price.toLocaleString("vi-VN")}đ
                      </ThemedText>
                    </View>
                  </View>
                </View>

                {/* Action buttons */}
                <View className="flex-row border-t border-gray-100">
                  <TouchableOpacity
                    onPress={() => handleEdit(tour._id)}
                    className="flex-1 py-3 flex-row items-center justify-center border-r border-gray-100"
                  >
                    <IconSymbol name="edit" size={18} color="#3b82f6" />
                    <ThemedText className="text-blue-600 font-bold ml-2">
                      Sửa
                    </ThemedText>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleDelete(tour._id, tour.title)}
                    className="flex-1 py-3 flex-row items-center justify-center"
                  >
                    <IconSymbol name="trash" size={18} color="#ef4444" />
                    <ThemedText className="text-red-600 font-bold ml-2">
                      Xóa
                    </ThemedText>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>
        <View className="h-24" />
      </ScrollView>
    </ThemedView>
  );
}
