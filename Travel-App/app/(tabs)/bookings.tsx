// app/(tabs)/bookings.tsx
import { api, type Destination, type Trip } from "@/services/api";
import { ThemedText } from "@/ui-components/themed-text";
import { ThemedView } from "@/ui-components/themed-view";
import { IconSymbol } from "@/ui-components/ui/icon-symbol";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { router } from "expo-router";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import TripCard from "../components/trips/TripCard";
import DestinationPicker from "../components/destinations/DestinationPicker";
import InputField from "../components/common/InputField";
import { useUser } from "../_layout";

export default function BookingsScreen() {
  const { user } = useUser();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingDestinations, setLoadingDestinations] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
  const [isAddingTrip, setIsAddingTrip] = useState(false);
  const [selectedDestination, setSelectedDestination] =
    useState<Destination | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [travelers, setTravelers] = useState("");
  const isDark = useColorScheme() === "dark";

  // Calculate stats
  const stats = {
    total: trips.length,
    pending: trips.filter((t) => t.status === "pending").length,
    confirmed: trips.filter((t) => t.status === "confirmed").length,
    inProgress: trips.filter((t) => t.status === "in_progress").length,
    completed: trips.filter((t) => t.status === "completed").length,
  };

  // Animation
  const fade = useSharedValue(0);
  const fabScale = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => ({ opacity: fade.value }));
  const fabStyle = useAnimatedStyle(() => ({
    transform: [{ scale: fabScale.value }],
  }));

  useFocusEffect(
    useCallback(() => {
      loadTrips();
      if (destinations.length === 0) loadDestinations();
    }, [destinations.length])
  );

  useEffect(() => {
    fade.value = withTiming(1, { duration: 600 });
    fabScale.value = withSpring(1, { damping: 18 });
  }, [trips]);

  const loadTrips = async () => {
    try {
      setLoading(true);
      const data = await api.getTrips();
      // Filter out cancelled and completed bookings - only show active bookings in "My Trips"
      // Cancelled and completed bookings should only appear in "History" tab
      const activeTrips = data.filter(
        (trip) => trip.status !== "cancelled" && trip.status !== "completed"
      );
      setTrips(activeTrips);
    } catch (error: any) {
      console.error("Error loading trips:", error);
      Alert.alert(
        "Lỗi",
        error.message || "Không thể tải danh sách chuyến đi. Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

  const loadDestinations = async () => {
    try {
      setLoadingDestinations(true);
      const data = await api.getDestinations();
      setDestinations(data);
      if (data.length > 0) setSelectedDestination(data[0]);
    } catch {
      Alert.alert("Lỗi", "Không thể tải điểm đến");
    } finally {
      setLoadingDestinations(false);
    }
  };

  const openAddModal = () => {
    setEditingTrip(null);
    setStartDate("");
    setEndDate("");
    setTravelers("");
    setIsAddingTrip(true);
    setIsModalVisible(true);
  };

  const openEditModal = (trip: Trip) => {
    setEditingTrip(trip);
    setStartDate(trip.startDate);
    setEndDate(trip.endDate);
    setTravelers(String(trip.travelers));
    const dest = destinations.find((d) => d.name === trip.destinationName);
    setSelectedDestination(dest || null);
    setIsAddingTrip(false);
    setIsModalVisible(true);
  };

  const handleDeleteTrip = (tripId: string) => {
    Alert.alert("Xóa", "Xóa chuyến đi này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          try {
            await api.deleteTrip(tripId);
            await loadTrips();
            Alert.alert("Thành công", "Đã hủy chuyến đi!");
          } catch (error: any) {
            console.error("Error deleting trip:", error);
            // Check if already cancelled
            if (
              error.message?.includes("already cancelled") ||
              error.message?.includes("Booking already cancelled")
            ) {
              await loadTrips(); // Refresh list
              Alert.alert("Thông báo", "Chuyến đi này đã được hủy trước đó");
            } else {
              Alert.alert("Lỗi", error.message || "Không thể hủy chuyến đi");
            }
          }
        },
      },
    ]);
  };

  const handleSaveTrip = async () => {
    if (!selectedDestination || !startDate || !endDate || !travelers) {
      Alert.alert("Lỗi", "Vui lòng chọn điểm đến và điền đầy đủ thông tin");
      return;
    }

    try {
      if (isAddingTrip) {
        await api.createTrip({
          destinationId: selectedDestination.id,
          destinationName: selectedDestination.name,
          destinationImage: selectedDestination.image,
          startDate,
          endDate,
          travelers: parseInt(travelers),
          totalPrice: selectedDestination.price,
          status: "pending",
        });
        Alert.alert("Thành công", "Đã thêm chuyến đi!");
      } else if (editingTrip) {
        await api.updateTrip(editingTrip.id, {
          startDate,
          endDate,
          travelers: parseInt(travelers),
        });
        Alert.alert("Thành công", "Đã cập nhật!");
      }
      setIsModalVisible(false);
      await loadTrips();
    } catch {
      Alert.alert("Lỗi", "Không thể lưu");
    }
  };

  const getStatusStyle = (status: string) => {
    const base = "px-3 py-1.5 rounded-full text-xs font-bold";
    if (status === "confirmed")
      return `${base} ${
        isDark ? "bg-green-900 text-green-300" : "bg-green-100 text-green-700"
      }`;
    if (status === "pending")
      return `${base} ${
        isDark
          ? "bg-yellow-900 text-yellow-300"
          : "bg-yellow-100 text-yellow-700"
      }`;
    if (status === "in_progress")
      return `${base} ${
        isDark
          ? "bg-purple-900 text-purple-300"
          : "bg-purple-100 text-purple-700"
      }`;
    if (status === "completed")
      return `${base} ${
        isDark ? "bg-blue-900 text-blue-300" : "bg-blue-100 text-blue-700"
      }`;
    if (status === "cancelled")
      return `${base} ${
        isDark ? "bg-red-900 text-red-300" : "bg-red-100 text-red-700"
      }`;
    return `${base} ${
      isDark ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"
    }`;
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Đã xác nhận";
      case "pending":
        return "Chờ xác nhận";
      case "in_progress":
        return "Đang phục vụ";
      case "completed":
        return "Hoàn thành";
      case "cancelled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <ThemedView
        className={`flex-1 justify-center items-center ${
          isDark ? "bg-slate-900" : "bg-gray-50"
        }`}
      >
        <ActivityIndicator size="large" color="#3b82f6" />
        <ThemedText
          className={`mt-4 ${
            isDark ? "text-gray-300" : "text-gray-600"
          } font-medium`}
        >
          Đang tải...
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView className={`flex-1 ${isDark ? "bg-slate-900" : "bg-gray-50"}`}>
      {/* Header with Gradient */}
      <LinearGradient
        colors={
          isDark
            ? (["#1e293b", "#0f172a"] as [string, string, ...string[]])
            : (["#3b82f6", "#2563eb"] as [string, string, ...string[]])
        }
        className="pt-16 pb-6 px-6 rounded-b-3xl"
      >
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-1">
            <ThemedText className="text-3xl font-extrabold text-white mb-1">
              Chuyến đi của tôi
            </ThemedText>
            <ThemedText className="text-white/90 text-sm font-medium">
              {user?.name ? `Xin chào, ${user.name}` : "Quản lý chuyến đi"}
            </ThemedText>
          </View>
          <View className="bg-white/20 backdrop-blur-md rounded-full px-4 py-2 border border-white/30">
            <ThemedText className="text-white font-bold text-lg">
              {stats.total}
            </ThemedText>
          </View>
        </View>

        {/* Stats Cards */}
        {trips.length > 0 && (
          <View className="flex-row gap-3 mt-4">
            <View className="flex-1 bg-white/15 backdrop-blur-md rounded-2xl p-3 border border-white/20">
              <ThemedText className="text-white/80 text-xs font-medium mb-1">
                Tổng cộng
              </ThemedText>
              <ThemedText className="text-white font-extrabold text-xl">
                {stats.total}
              </ThemedText>
            </View>
            <View className="flex-1 bg-white/15 backdrop-blur-md rounded-2xl p-3 border border-white/20">
              <ThemedText className="text-white/80 text-xs font-medium mb-1">
                Chờ xác nhận
              </ThemedText>
              <ThemedText className="text-yellow-300 font-extrabold text-xl">
                {stats.pending}
              </ThemedText>
            </View>
            <View className="flex-1 bg-white/15 backdrop-blur-md rounded-2xl p-3 border border-white/20">
              <ThemedText className="text-white/80 text-xs font-medium mb-1">
                Đã xác nhận
              </ThemedText>
              <ThemedText className="text-green-300 font-extrabold text-xl">
                {stats.confirmed}
              </ThemedText>
            </View>
          </View>
        )}
      </LinearGradient>

      {/* Content */}
      <Animated.View style={[animatedStyle]} className="flex-1">
        {trips.length === 0 ? (
          <View className="flex-1 justify-center items-center px-8 -mt-8">
            <LinearGradient
              colors={
                isDark
                  ? (["#1e293b", "#0f172a"] as [string, string, ...string[]])
                  : (["#eff6ff", "#e0e7ff"] as [string, string, ...string[]])
              }
              className="p-10 rounded-3xl items-center shadow-2xl border"
              style={{
                borderColor: isDark ? "#334155" : "#c7d2fe",
                borderWidth: 2,
              }}
            >
              <View className="bg-white/90 rounded-full p-6 mb-6 shadow-lg">
                <IconSymbol name="calendar" size={56} color="#3b82f6" />
              </View>
              <ThemedText
                className={`text-2xl font-extrabold mb-3 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Chưa có chuyến đi
              </ThemedText>
              <ThemedText
                className={`text-base mt-2 text-center max-w-xs ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Khám phá và đặt tour để bắt đầu hành trình của bạn
              </ThemedText>
              <TouchableOpacity
                onPress={() => router.push("/(tabs)")}
                className="mt-6 bg-blue-600 px-8 py-4 rounded-2xl shadow-lg"
              >
                <ThemedText className="text-white font-bold text-base">
                  Khám phá tour
                </ThemedText>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        ) : (
          <ScrollView
            className="flex-1 px-4 pt-6 pb-24"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
          >
            {trips.map((trip, index) => (
              <TripCard
                key={trip.id}
                trip={trip}
                isDark={isDark}
                getStatusStyle={getStatusStyle}
                getStatusText={getStatusText}
                onPress={() =>
                  router.push({
                    pathname: "/screens/bookings/BookingDetail",
                    params: { bookingId: trip.id },
                  })
                }
                onDelete={() => handleDeleteTrip(trip.id)}
              />
            ))}
          </ScrollView>
        )}

        {/* FAB removed - trips should only show booked trips, not manual additions */}
      </Animated.View>

      {/* Modal thêm/sửa */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <ThemedView
          className={`flex-1 ${isDark ? "bg-slate-900" : "bg-gray-50"}`}
        >
          <View
            className={`p-4 border-b ${
              isDark ? "border-slate-700" : "border-gray-200"
            }`}
          >
            <View className="flex-row justify-between items-center">
              <ThemedText
                className={`text-xl font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {isAddingTrip ? "Thêm chuyến đi" : "Chỉnh sửa"}
              </ThemedText>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <IconSymbol
                  name="x"
                  size={28}
                  color={isDark ? "#9ca3af" : "#6b7280"}
                />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView className="flex-1 p-6">
            {/* Chọn điểm đến */}
            <ThemedText
              className={`text-base font-semibold mb-3 ${
                isDark ? "text-gray-200" : "text-gray-800"
              }`}
            >
              Chọn điểm đến
            </ThemedText>
            <DestinationPicker
              destinations={destinations}
              selectedId={selectedDestination?.id}
              onSelect={setSelectedDestination}
              loading={loadingDestinations}
              isDark={isDark}
            />

            {/* Form */}
            <InputField
              label="Ngày bắt đầu"
              placeholder="YYYY-MM-DD"
              value={startDate}
              onChange={setStartDate}
              isDark={isDark}
            />
            <InputField
              label="Ngày kết thúc"
              placeholder="YYYY-MM-DD"
              value={endDate}
              onChange={setEndDate}
              isDark={isDark}
            />
            <InputField
              label="Số người"
              placeholder="Nhập số người"
              value={travelers}
              onChange={setTravelers}
              keyboardType="numeric"
              isDark={isDark}
            />
          </ScrollView>

          <View
            className={`p-4 border-t ${
              isDark ? "border-slate-700" : "border-gray-200"
            }`}
          >
            <TouchableOpacity
              onPress={handleSaveTrip}
              className="bg-blue-600 py-4 rounded-2xl items-center shadow-lg"
            >
              <ThemedText className="text-white font-bold text-lg">
                {isAddingTrip ? "Thêm chuyến đi" : "Cập nhật"}
              </ThemedText>
            </TouchableOpacity>
          </View>
        </ThemedView>
      </Modal>
    </ThemedView>
  );
}
