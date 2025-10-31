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
import TripCard from "../components/trips/TripCard";
import DestinationPicker from "../components/destinations/DestinationPicker";
import InputField from "../components/common/InputField";

export default function BookingsScreen() {
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
      // Filter out cancelled bookings - only show active bookings in "My Trips"
      // Cancelled bookings should only appear in "History" tabr
      const activeTrips = data.filter((trip) => trip.status !== "cancelled");
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
      {/* Header */}
      <View className={`p-6 ${isDark ? "bg-slate-800" : "bg-blue-600"}`}>
        <ThemedText className="text-2xl font-extrabold text-white">
          Chuyến đi của tôi
        </ThemedText>
      </View>

      {/* Content */}
      <Animated.View style={[animatedStyle]} className="flex-1">
        {trips.length === 0 ? (
          <View className="flex-1 justify-center items-center px-8">
            <View
              className={`p-8 rounded-3xl ${
                isDark ? "bg-slate-800" : "bg-white"
              } shadow-xl`}
            >
              <IconSymbol
                name="calendar"
                size={64}
                color={isDark ? "#64748b" : "#9ca3af"}
              />
              <ThemedText
                className={`text-lg font-semibold mt-4 text-center ${
                  isDark ? "text-gray-200" : "text-gray-700"
                }`}
              >
                Bạn chưa có chuyến đi nào
              </ThemedText>
              <ThemedText
                className={`text-sm mt-2 text-center ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Nhấn nút để thêm chuyến đi đầu tiên
              </ThemedText>
            </View>
          </View>
        ) : (
          <ScrollView
            className="flex-1 px-4 pt-4 pb-24"
            showsVerticalScrollIndicator={false}
          >
            {trips.map((trip) => (
              <TripCard
                key={trip.id}
                trip={trip}
                isDark={isDark}
                getStatusStyle={getStatusStyle}
                getStatusText={getStatusText}
                onEdit={() => openEditModal(trip)}
                onDelete={() => handleDeleteTrip(trip.id)}
                onPay={() =>
                  router.push({
                    pathname: "/screens/cart/Checkout",
                    params: { tripId: trip.id },
                  })
                }
                showPayButton={trip.status === "pending"}
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
