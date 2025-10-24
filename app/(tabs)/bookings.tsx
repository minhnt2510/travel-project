import { api, type Destination, type Trip } from "@/services/api";
import { ThemedText } from "@/ui-components/themed-text";
import { ThemedView } from "@/ui-components/themed-view";
import { IconSymbol } from "@/ui-components/ui/icon-symbol";
import { useFocusEffect } from "@react-navigation/native";
import { Image } from "expo-image";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  ScrollView,
  TextInput,
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

  // Animation
  const fade = useSharedValue(0);
  const fabScale = useSharedValue(0);

  const isDark = useColorScheme() === "dark";

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
      setTrips(data);
    } catch {
      Alert.alert("Lõi", "Không thể tải danh sách chuyến đi");
    } finally {
      setLoading(false);
    }
  };

  const loadDestinations = async () => {
    try {
      setLoadingDestinations(true);
      const data = await api.getDestinations();
      setDestinations(data);
      // Mặc định chọn điểm đầu tiên
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
    setTravelers(trip.travelers.toString());
    // Tìm destination tương ứng
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
            Alert.alert("Thành công", "Đã xóa!");
          } catch {
            Alert.alert("Lỗi", "Không thể xóa");
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
        const newTrip = {
          destinationId: selectedDestination.id,
          destinationName: selectedDestination.name,
          destinationImage: selectedDestination.image,
          startDate,
          endDate,
          travelers: parseInt(travelers),
          totalPrice: selectedDestination.price,
          status: "pending" as const,
        };
        await api.createTrip(newTrip);
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

  const animatedStyle = useAnimatedStyle(() => ({ opacity: fade.value }));
  const fabStyle = useAnimatedStyle(() => ({
    transform: [{ scale: fabScale.value }],
  }));

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
                onEdit={() => openEditModal(trip)}
                onDelete={() => handleDeleteTrip(trip.id)}
                getStatusStyle={getStatusStyle}
                getStatusText={getStatusText}
              />
            ))}
          </ScrollView>
        )}

        {/* FAB: NÚT THÊM */}
        <Animated.View style={[fabStyle]} className="absolute bottom-8 right-6">
          <TouchableOpacity
            onPress={openAddModal}
            className="w-16 h-16 rounded-full bg-blue-600 shadow-2xl flex items-center justify-center"
          >
            <IconSymbol name="plus" size={28} color="#FFF" />
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>

      {/* === MODAL THÊM/SỬA – CÓ CHỌN ĐIỂM ĐẾN === */}
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
            {/* === CHỌN ĐIỂM ĐẾN === */}
            <View className="mb-6">
              <ThemedText
                className={`text-base font-semibold mb-3 ${
                  isDark ? "text-gray-200" : "text-gray-800"
                }`}
              >
                Chọn điểm đến
              </ThemedText>

              {loadingDestinations ? (
                <View className="flex-row items-center justify-center py-8">
                  <ActivityIndicator size="small" color="#3b82f6" />
                </View>
              ) : (
                <FlatList
                  data={destinations}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => setSelectedDestination(item)}
                      className={`mr-4 w-36 rounded-2xl overflow-hidden border-2 ${
                        selectedDestination?.id === item.id
                          ? "border-blue-500"
                          : isDark
                          ? "border-slate-600"
                          : "border-gray-300"
                      }`}
                    >
                      <Image
                        source={{ uri: item.image }}
                        className="w-full h-28"
                        contentFit="cover"
                      />
                      <View
                        className={`p-3 ${
                          isDark ? "bg-slate-800" : "bg-white"
                        }`}
                      >
                        <ThemedText
                          className={`text-sm font-bold text-center ${
                            isDark ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {item.name}
                        </ThemedText>
                        <ThemedText
                          className={`text-xs text-center mt-1 ${
                            isDark ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          {item.price}
                        </ThemedText>
                      </View>
                    </TouchableOpacity>
                  )}
                />
              )}
            </View>

            {/* === FORM === */}
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

// === CARD CHUYẾN ĐI ===
const TripCard = ({
  trip,
  isDark,
  onEdit,
  onDelete,
  getStatusStyle,
  getStatusText,
}: {
  trip: Trip;
  isDark: boolean;
  onEdit: () => void;
  onDelete: () => void;
  getStatusStyle: (s: string) => string;
  getStatusText: (s: string) => string;
}) => (
  <View
    className={`mb-6 ${
      isDark ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"
    } rounded-3xl shadow-2xl overflow-hidden border`}
  >
    <Image
      source={{ uri: trip.destinationImage }}
      className="w-full h-56"
      contentFit="cover"
    />
    <View className="p-5">
      <View className="flex-row justify-between items-center mb-3">
        <ThemedText
          className={`text-2xl font-extrabold ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          {trip.destinationName}
        </ThemedText>
        <View className={getStatusStyle(trip.status)}>
          <ThemedText className="text-xs font-bold">
            {getStatusText(trip.status)}
          </ThemedText>
        </View>
      </View>

      <View className="space-y-3 mb-4">
        <View className="flex-row items-center">
          <IconSymbol
            name="calendar"
            size={18}
            color={isDark ? "#94a3b8" : "#6b7280"}
          />
          <ThemedText
            className={`ml-2 ${
              isDark ? "text-gray-300" : "text-gray-600"
            } font-medium`}
          >
            {trip.startDate} - {trip.endDate}
          </ThemedText>
        </View>
        <View className="flex-row items-center">
          <IconSymbol
            name="users"
            size={18}
            color={isDark ? "#94a3b8" : "#6b7280"}
          />
          <ThemedText
            className={`ml-2 ${
              isDark ? "text-gray-300" : "text-gray-600"
            } font-medium`}
          >
            {trip.travelers} người
          </ThemedText>
        </View>
      </View>

      <View className="flex-row justify-between items-center">
        <ThemedText
          className={`text-3xl font-extrabold ${
            isDark ? "text-blue-400" : "text-blue-600"
          }`}
        >
          {trip.totalPrice}
        </ThemedText>
        <View className="flex-row space-x-3">
          <TouchableOpacity
            onPress={onEdit}
            className={`w-12 h-12 rounded-full ${
              isDark ? "bg-slate-700" : "bg-blue-100"
            } flex items-center justify-center`}
          >
            <IconSymbol
              name="edit"
              size={20}
              color={isDark ? "#60a5fa" : "#2563eb"}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onDelete}
            className={`w-12 h-12 rounded-full ${
              isDark ? "bg-slate-700" : "bg-red-100"
            } flex items-center justify-center`}
          >
            <IconSymbol
              name="trash"
              size={20}
              color={isDark ? "#f87171" : "#dc2626"}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </View>
);

// === INPUT FIELD ===
const InputField = ({
  label,
  placeholder,
  value,
  onChange,
  keyboardType,
  isDark,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (t: string) => void;
  keyboardType?: "default" | "numeric";
  isDark: boolean;
}) => (
  <View className="mb-5">
    <ThemedText
      className={`text-base font-semibold mb-2 ${
        isDark ? "text-gray-200" : "text-gray-800"
      }`}
    >
      {label}
    </ThemedText>
    <TextInput
      className={`border rounded-2xl px-4 py-3.5 text-base ${
        isDark
          ? "bg-slate-800 border-slate-600 text-white placeholder-gray-400"
          : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
      }`}
      placeholder={placeholder}
      value={value}
      onChangeText={onChange}
      keyboardType={keyboardType}
    />
  </View>
);
