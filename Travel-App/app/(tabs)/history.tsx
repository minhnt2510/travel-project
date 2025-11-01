import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";

import { ThemedText } from "@/ui-components/themed-text";
import { ThemedView } from "@/ui-components/themed-view";
import { IconSymbol } from "@/ui-components/ui/icon-symbol";
import { api, type Trip } from "@/services/api";

type FilterKey = "all" | "completed" | "cancelled";

export default function HistoryScreen() {
  const [loading, setLoading] = useState(true);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [filter, setFilter] = useState<FilterKey>("all");
  const { refresh } = useLocalSearchParams<{ refresh?: string }>();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getTrips();
      // History tab chỉ hiển thị completed và cancelled bookings
      const historyTrips = data.filter(
        (t) => t.status === "completed" || t.status === "cancelled"
      );
      setTrips(historyTrips);
    } catch (error: any) {
      console.error("Error loading history:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Reload mỗi lần màn hình focus
  useFocusEffect(
    useCallback(() => {
      load();
      return () => {};
    }, [load])
  );

  // Ép reload khi Checkout replace kèm param refresh
  useEffect(() => {
    if (refresh) load();
  }, [refresh, load]);

  const filteredTrips = useMemo(() => {
    if (filter === "all") return trips;
    return trips.filter((t) => t.status === filter);
  }, [trips, filter]);

  const renderHeader = () => (
    <LinearGradient
      colors={["#667eea", "#764ba2"] as [string, string, ...string[]]}
      className="px-5 pt-2 pb-6 rounded-b-3xl"
    >
      <ThemedText className="text-white text-3xl font-extrabold">
        Lịch sử
      </ThemedText>
      <ThemedText className="text-white/90 mt-1 text-base">
        Các chuyến đã hoàn thành hoặc đã hủy
      </ThemedText>

      {/* Bộ lọc nhanh */}
      <View className="flex-row mt-4">
        <FilterChip
          label="Tất cả"
          active={filter === "all"}
          onPress={() => setFilter("all")}
        />
        <FilterChip
          label="Đã hoàn thành"
          active={filter === "completed"}
          onPress={() => setFilter("completed")}
        />
        <FilterChip
          label="Đã hủy"
          active={filter === "cancelled"}
          onPress={() => setFilter("cancelled")}
        />
      </View>
    </LinearGradient>
  );

  if (loading) {
    return (
      <ThemedView className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
        <ThemedText className="mt-3">Đang tải lịch sử…</ThemedText>
      </ThemedView>
    );
  }

  if (trips.length === 0) {
    return (
      <SafeAreaView className="flex-1">
        {renderHeader()}
        <ThemedView className="flex-1 items-center justify-center px-8">
          <View className="p-8 rounded-3xl bg-white/70 dark:bg-slate-800 shadow-xl">
            <IconSymbol name="archive" size={56} color="#9ca3af" />
            <ThemedText className="mt-4 text-center text-base text-gray-600 dark:text-gray-300">
              Chưa có chuyến đã hoàn thành hoặc đã hủy.
            </ThemedText>
          </View>
        </ThemedView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1">
      {renderHeader()}
      <FlatList
        data={filteredTrips}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
        ItemSeparatorComponent={() => <View className="h-4" />}
        onRefresh={load}
        refreshing={loading}
        renderItem={({ item }) => <TripCard trip={item} />}
      />
    </SafeAreaView>
  );
}

/* ----------------- Components ----------------- */

function TripCard({ trip }: { trip: Trip }) {
  const { badgeBg, badgeText, label } = statusStyle(trip.status);

  return (
    <View className="rounded-3xl overflow-hidden bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 shadow-md">
      {/* Ảnh + badge trạng thái */}
      <View className="relative">
        <Image
          source={{ uri: trip.destinationImage }}
          className="w-full h-44"
          contentFit="cover"
        />
        <View className="absolute inset-0 bg-black/10" />
        <View className="absolute top-3 right-3">
          <View className={`px-3 py-1.5 rounded-full ${badgeBg}`}>
            <ThemedText className={`text-xs font-bold ${badgeText}`}>
              {label}
            </ThemedText>
          </View>
        </View>
      </View>

      {/* Nội dung */}
      <View className="p-4">
        <View className="flex-row items-start justify-between">
          <View className="flex-1 pr-3">
            <ThemedText className="text-lg font-extrabold">
              {trip.destinationName}
            </ThemedText>
            <View className="flex-row items-center mt-2">
              <IconSymbol name="calendar" size={16} color="#6b7280" />
              <ThemedText className="ml-2 text-gray-600 dark:text-gray-300">
                {trip.startDate} → {trip.endDate}
              </ThemedText>
            </View>
            <View className="flex-row items-center mt-1">
              <IconSymbol name="users" size={16} color="#6b7280" />
              <ThemedText className="ml-2 text-gray-600 dark:text-gray-300">
                {trip.travelers} người
              </ThemedText>
            </View>
          </View>

          <View className="items-end">
            <ThemedText className="text-blue-600 dark:text-blue-400 font-extrabold text-xl">
              {trip.totalPrice}
            </ThemedText>
            <ThemedText className="text-xs text-gray-500 mt-0.5">
              tổng cộng
            </ThemedText>
          </View>
        </View>

        {/* Action buttons for completed trips */}
        {trip.status === "completed" && (
          <View className="flex-row mt-4 pt-4 border-t border-gray-200 dark:border-slate-700">
            <TouchableOpacity
              onPress={() => {
                router.push({
                  pathname: "/screens/reviews/ReviewCreate",
                  params: { bookingId: trip.id, tourId: trip.destinationId },
                });
              }}
              className="flex-1 bg-gradient-to-r from-yellow-400 to-orange-500 px-4 py-3 rounded-xl items-center shadow-lg"
              style={{
                shadowColor: "#f59e0b",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
                elevation: 4,
              }}
            >
              <View className="flex-row items-center">
                <IconSymbol name="star" size={18} color="#FFF" />
                <ThemedText className="text-white font-bold ml-2">
                  Đánh giá
                </ThemedText>
              </View>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

function FilterChip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`mr-2 px-3.5 py-2 rounded-full border ${
        active
          ? "bg-blue-600 border-blue-600"
          : "bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700"
      }`}
    >
      <ThemedText
        className={`${
          active ? "text-white" : "text-gray-700 dark:text-gray-200"
        } text-sm font-semibold`}
      >
        {label}
      </ThemedText>
    </TouchableOpacity>
  );
}

function statusStyle(status: Trip["status"]) {
  if (status === "completed") {
    return {
      badgeBg: "bg-blue-100 dark:bg-blue-900/40",
      badgeText: "text-blue-700 dark:text-blue-300",
      label: "Đã hoàn thành",
    };
  }
  if (status === "cancelled") {
    return {
      badgeBg: "bg-red-100 dark:bg-red-900/40",
      badgeText: "text-red-700 dark:text-red-300",
      label: "Đã hủy",
    };
  }
  // fallback
  return {
    badgeBg: "bg-gray-100 dark:bg-slate-700",
    badgeText: "text-gray-700 dark:text-gray-200",
    label: status,
  };
}
