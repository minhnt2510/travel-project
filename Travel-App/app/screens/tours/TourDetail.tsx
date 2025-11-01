import { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import { Image as ExpoImage } from "expo-image";
import { useLocalSearchParams, router } from "expo-router";
import { ThemedText } from "@/ui-components/themed-text";
import { ThemedView } from "@/ui-components/themed-view";
import { IconSymbol } from "@/ui-components/ui/icon-symbol";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useUser } from "@/app/_layout";
import { api, type Tour } from "@/services/api";
import CustomMapView from "@/app/components/common/MapView";
import { useColorScheme } from "react-native";
import BookingFlow from "@/app/screens/bookings/BookingFlow";

// Mock data structure - sẽ thay bằng API thật sau
interface TimeSlot {
  id: string;
  time: string; // "09:00" hoặc "2025-11-01T09:00"
  availableSeats: number;
  price: number; // Giá động theo slot
  isWeekend?: boolean;
}

interface PickupPoint {
  id: string;
  name: string;
  address: string;
  coordinates: { latitude: number; longitude: number };
  pickupTime?: string;
}

interface AddOn {
  id: string;
  name: string;
  description: string;
  price: number;
  type: "meal" | "transport" | "insurance" | "equipment";
  icon: string;
}

interface TourWithDetails extends Tour {
  timeSlots?: TimeSlot[];
  pickupPoints?: PickupPoint[];
  addOns?: AddOn[];
  hasGuide?: boolean;
  hasPickup?: boolean;
  cancellationPolicy?: string;
}

export default function TourDetail() {
  const { destinationId } = useLocalSearchParams<{ destinationId: string }>();
  const [tour, setTour] = useState<TourWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [selectedPickupPoint, setSelectedPickupPoint] = useState<PickupPoint | null>(null);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const { user } = useUser();
  const isDark = useColorScheme() === "dark";

  // Mock data - sẽ được thay bằng API
  const mockSlots: TimeSlot[] = [
    { id: "1", time: "08:00", availableSeats: 15, price: 500000, isWeekend: false },
    { id: "2", time: "09:00", availableSeats: 20, price: 550000, isWeekend: false },
    { id: "3", time: "14:00", availableSeats: 10, price: 600000, isWeekend: false },
    { id: "4", time: "09:00", availableSeats: 12, price: 700000, isWeekend: true }, // Weekend
  ];

  const mockPickupPoints: PickupPoint[] = [
    {
      id: "1",
      name: "Trung tâm thành phố",
      address: "123 Nguyễn Huệ, Quận 1, TP.HCM",
      coordinates: { latitude: 10.7769, longitude: 106.7009 },
      pickupTime: "08:00",
    },
    {
      id: "2",
      name: "Sân bay Tân Sơn Nhất",
      address: "Sân bay Tân Sơn Nhất, TP.HCM",
      coordinates: { latitude: 10.8188, longitude: 106.6519 },
      pickupTime: "07:30",
    },
  ];

  const mockAddOns: AddOn[] = [
    {
      id: "1",
      name: "Bữa trưa",
      description: "Bữa trưa buffet tại nhà hàng",
      price: 150000,
      type: "meal",
      icon: "coffee",
    },
    {
      id: "2",
      name: "Xe đưa đón",
      description: "Xe đưa đón từ khách sạn",
      price: 200000,
      type: "transport",
      icon: "truck",
    },
    {
      id: "3",
      name: "Bảo hiểm du lịch",
      description: "Bảo hiểm an toàn cho chuyến đi",
      price: 50000,
      type: "insurance",
      icon: "shield",
    },
    {
      id: "4",
      name: "Thiết bị chụp ảnh",
      description: "Máy ảnh và gậy selfie",
      price: 100000,
      type: "equipment",
      icon: "camera",
    },
  ];

  useEffect(() => {
    if (destinationId) {
      loadTour();
    }
  }, [destinationId]);

  const loadTour = async () => {
    try {
      setLoading(true);
      
      // Validate MongoDB ObjectId format (24 hex characters)
      if (!destinationId || !destinationId.match(/^[0-9a-fA-F]{24}$/)) {
        Alert.alert("Lỗi", "ID tour không hợp lệ");
        router.back();
        return;
      }
      
      const data = await api.getTourById(destinationId!);
      if (data) {
        // Merge với mock data
        setTour({
          ...data,
          timeSlots: mockSlots,
          pickupPoints: mockPickupPoints,
          addOns: mockAddOns,
          hasGuide: true,
          hasPickup: true,
          cancellationPolicy: "Hủy miễn phí trước 24h",
        });
        // Select first slot by default
        if (mockSlots.length > 0) {
          setSelectedSlot(mockSlots[0]);
        }
        if (mockPickupPoints.length > 0) {
          setSelectedPickupPoint(mockPickupPoints[0]);
        }
      }
    } catch (error: any) {
      Alert.alert("Lỗi", "Không thể tải thông tin tour");
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalPrice = () => {
    if (!selectedSlot) return 0;
    let total = selectedSlot.price;
    selectedAddOns.forEach((addOnId) => {
      const addOn = mockAddOns.find((a) => a.id === addOnId);
      if (addOn) total += addOn.price;
    });
    return total;
  };

  const handleBookNow = () => {
    if (!user) {
      Alert.alert("Cần đăng nhập", "Vui lòng đăng nhập để đặt tour", [
        { text: "Hủy", style: "cancel" },
        { text: "Đăng nhập", onPress: () => router.push("/(auth)/login") },
      ]);
      return;
    }

    if (!selectedSlot) {
      Alert.alert("Lỗi", "Vui lòng chọn thời gian khởi hành");
      return;
    }

    setShowBookingModal(true);
  };

  const toggleAddOn = (addOnId: string) => {
    setSelectedAddOns((prev) =>
      prev.includes(addOnId)
        ? prev.filter((id) => id !== addOnId)
        : [...prev, addOnId]
    );
  };

  if (loading || !tour) {
    return (
      <ThemedView className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#3b82f6" />
        <ThemedText className="mt-4 text-gray-600">Đang tải...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <SafeAreaView className={`flex-1 ${isDark ? "bg-slate-900" : "bg-gray-50"}`}>
      <ThemedView className="flex-1">
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
          {/* Header Image */}
          <View className="relative">
            <ExpoImage
              source={{ uri: tour.imageUrl || "https://via.placeholder.com/800" }}
              className="w-full h-80"
              contentFit="cover"
            />
            <View className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent" />

            <View className="absolute top-12 left-4 right-4 flex-row justify-between items-center z-10">
              <TouchableOpacity
                onPress={() => router.back()}
                className="bg-black/50 backdrop-blur-md rounded-full p-3.5"
              >
                <IconSymbol name="arrow-left" size={22} color="#FFF" />
              </TouchableOpacity>
              <View className="flex-row gap-2">
                <TouchableOpacity className="bg-black/50 backdrop-blur-md rounded-full p-3.5">
                  <IconSymbol name="share-2" size={22} color="#FFF" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={async () => {
                    if (!user) {
                      Alert.alert("Cần đăng nhập", "Vui lòng đăng nhập");
                      return;
                    }
                    try {
                      await api.addToWishlist(tour._id);
                      Alert.alert("Thành công", "Đã thêm vào yêu thích");
                    } catch (error) {
                      Alert.alert("Lỗi", "Không thể thêm yêu thích");
                    }
                  }}
                  className="bg-black/50 backdrop-blur-md rounded-full p-3.5"
                >
                  <IconSymbol name="heart" size={22} color="#FFF" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Tour Info Card */}
          <View className={`-mt-8 ${isDark ? "bg-slate-800" : "bg-white"} rounded-t-3xl px-6 pt-6 pb-4`}>
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-1">
                <ThemedText className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                  {tour.title}
                </ThemedText>
                <View className="flex-row items-center mt-2">
                  <IconSymbol name="map-pin" size={16} color={isDark ? "#94a3b8" : "#6b7280"} />
                  <ThemedText className={`ml-1 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                    {tour.location}
                  </ThemedText>
                </View>
              </View>
            </View>

            {/* Rating & Duration */}
            <View className="flex-row items-center gap-4 mb-4">
              <View className="flex-row items-center">
                <IconSymbol name="star" size={18} color="#fbbf24" />
                <ThemedText className={`ml-1 font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                  {tour.rating.toFixed(1)}
                </ThemedText>
                <ThemedText className={`ml-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                  ({tour.reviewCount} đánh giá)
                </ThemedText>
              </View>
              <View className="flex-row items-center">
                <IconSymbol name="clock" size={18} color={isDark ? "#94a3b8" : "#6b7280"} />
                <ThemedText className={`ml-1 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                  {tour.duration} giờ
                </ThemedText>
              </View>
              {tour.hasGuide && (
                <View className="flex-row items-center bg-green-100 px-2 py-1 rounded">
                  <IconSymbol name="user-check" size={14} color="#059669" />
                  <ThemedText className="ml-1 text-green-700 text-xs font-medium">
                    Có HDV
                  </ThemedText>
                </View>
              )}
            </View>

            {/* Price Display */}
            <View className="mb-4">
              <View className="flex-row items-baseline">
                <ThemedText className={`text-3xl font-extrabold ${isDark ? "text-blue-400" : "text-blue-600"}`}>
                  {selectedSlot ? selectedSlot.price.toLocaleString() : tour.price.toLocaleString()}₫
                </ThemedText>
                <ThemedText className={`ml-2 text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                  /người
                </ThemedText>
              </View>
              {tour.originalPrice && tour.originalPrice > (selectedSlot?.price || tour.price) && (
                <ThemedText className="text-gray-400 text-sm line-through mt-1">
                  {tour.originalPrice.toLocaleString()}₫
                </ThemedText>
              )}
            </View>
          </View>

          {/* Time Slots */}
          {tour.timeSlots && tour.timeSlots.length > 0 && (
            <View className={`px-6 py-4 ${isDark ? "bg-slate-800" : "bg-white"} mt-2`}>
              <ThemedText className={`text-lg font-bold mb-3 ${isDark ? "text-white" : "text-gray-900"}`}>
                Chọn thời gian khởi hành
              </ThemedText>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className="flex-row gap-3">
                  {tour.timeSlots.map((slot) => (
                    <TouchableOpacity
                      key={slot.id}
                      onPress={() => setSelectedSlot(slot)}
                      className={`px-4 py-3 rounded-xl border-2 ${
                        selectedSlot?.id === slot.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 bg-gray-50"
                      }`}
                      style={{
                        backgroundColor: selectedSlot?.id === slot.id
                          ? (isDark ? "#1e3a8a" : "#eff6ff")
                          : (isDark ? "#1e293b" : "#f9fafb"),
                        borderColor: selectedSlot?.id === slot.id ? "#3b82f6" : (isDark ? "#475569" : "#e5e7eb"),
                      }}
                    >
                      <ThemedText
                        className={`font-bold text-center ${
                          selectedSlot?.id === slot.id
                            ? "text-blue-700"
                            : isDark ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {slot.time}
                      </ThemedText>
                      {slot.isWeekend && (
                        <ThemedText className="text-xs text-orange-600 text-center mt-1">
                          Cuối tuần
                        </ThemedText>
                      )}
                      <ThemedText
                        className={`text-sm font-semibold text-center mt-1 ${
                          selectedSlot?.id === slot.id
                            ? "text-blue-700"
                            : isDark ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {slot.price.toLocaleString()}₫
                      </ThemedText>
                      <ThemedText
                        className={`text-xs text-center mt-1 ${
                          isDark ? "text-gray-500" : "text-gray-400"
                        }`}
                      >
                        Còn {slot.availableSeats} chỗ
                      </ThemedText>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>
          )}

          {/* Description */}
          <View className={`px-6 py-4 ${isDark ? "bg-slate-800" : "bg-white"} mt-2`}>
            <ThemedText className={`text-lg font-bold mb-3 ${isDark ? "text-white" : "text-gray-900"}`}>
              Mô tả
            </ThemedText>
            <ThemedText className={`${isDark ? "text-gray-300" : "text-gray-600"} leading-6`}>
              {tour.description}
            </ThemedText>
          </View>

          {/* Pickup Points with Map */}
          {tour.pickupPoints && tour.pickupPoints.length > 0 && (
            <View className={`px-6 py-4 ${isDark ? "bg-slate-800" : "bg-white"} mt-2`}>
              <ThemedText className={`text-lg font-bold mb-3 ${isDark ? "text-white" : "text-gray-900"}`}>
                Điểm đón
              </ThemedText>
              <View className="mb-4">
                {tour.pickupPoints.map((point) => (
                  <TouchableOpacity
                    key={point.id}
                    onPress={() => setSelectedPickupPoint(point)}
                    className={`mb-3 p-3 rounded-xl border-2 ${
                      selectedPickupPoint?.id === point.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 bg-gray-50"
                    }`}
                    style={{
                      backgroundColor: selectedPickupPoint?.id === point.id
                        ? (isDark ? "#1e3a8a" : "#eff6ff")
                        : (isDark ? "#1e293b" : "#f9fafb"),
                      borderColor: selectedPickupPoint?.id === point.id ? "#3b82f6" : (isDark ? "#475569" : "#e5e7eb"),
                    }}
                  >
                    <View className="flex-row items-center justify-between">
                      <View className="flex-1">
                        <ThemedText
                          className={`font-bold ${
                            selectedPickupPoint?.id === point.id
                              ? "text-blue-700"
                              : isDark ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {point.name}
                        </ThemedText>
                        <ThemedText
                          className={`text-sm mt-1 ${
                            isDark ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          {point.address}
                        </ThemedText>
                        {point.pickupTime && (
                          <View className="flex-row items-center mt-2">
                            <IconSymbol name="clock" size={14} color={isDark ? "#94a3b8" : "#6b7280"} />
                            <ThemedText
                              className={`ml-1 text-xs ${
                                isDark ? "text-gray-400" : "text-gray-600"
                              }`}
                            >
                              Đón lúc {point.pickupTime}
                            </ThemedText>
                          </View>
                        )}
                      </View>
                      {selectedPickupPoint?.id === point.id && (
                        <IconSymbol name="check-circle" size={24} color="#3b82f6" />
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Map View */}
              {selectedPickupPoint && (
                <View className="mt-4">
                  <CustomMapView
                    latitude={selectedPickupPoint.coordinates.latitude}
                    longitude={selectedPickupPoint.coordinates.longitude}
                    height={200}
                    isDark={isDark}
                  />
                </View>
              )}
            </View>
          )}

          {/* Add-ons */}
          {tour.addOns && tour.addOns.length > 0 && (
            <View className={`px-6 py-4 ${isDark ? "bg-slate-800" : "bg-white"} mt-2`}>
              <ThemedText className={`text-lg font-bold mb-3 ${isDark ? "text-white" : "text-gray-900"}`}>
                Dịch vụ bổ sung
              </ThemedText>
              <View className="gap-3">
                {tour.addOns.map((addOn) => (
                  <TouchableOpacity
                    key={addOn.id}
                    onPress={() => toggleAddOn(addOn.id)}
                    className={`p-4 rounded-xl border-2 ${
                      selectedAddOns.includes(addOn.id)
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 bg-gray-50"
                    }`}
                    style={{
                      backgroundColor: selectedAddOns.includes(addOn.id)
                        ? (isDark ? "#1e3a8a" : "#eff6ff")
                        : (isDark ? "#1e293b" : "#f9fafb"),
                      borderColor: selectedAddOns.includes(addOn.id) ? "#3b82f6" : (isDark ? "#475569" : "#e5e7eb"),
                    }}
                  >
                    <View className="flex-row items-center justify-between">
                      <View className="flex-row items-center flex-1">
                        <IconSymbol
                          name={addOn.icon as any}
                          size={24}
                          color={selectedAddOns.includes(addOn.id) ? "#3b82f6" : (isDark ? "#94a3b8" : "#6b7280")}
                        />
                        <View className="ml-3 flex-1">
                          <ThemedText
                            className={`font-bold ${
                              selectedAddOns.includes(addOn.id)
                                ? "text-blue-700"
                                : isDark ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {addOn.name}
                          </ThemedText>
                          <ThemedText
                            className={`text-sm mt-1 ${
                              isDark ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            {addOn.description}
                          </ThemedText>
                        </View>
                      </View>
                      <View className="items-end">
                        <ThemedText
                          className={`font-bold ${
                            selectedAddOns.includes(addOn.id)
                              ? "text-blue-700"
                              : isDark ? "text-white" : "text-gray-900"
                          }`}
                        >
                          +{addOn.price.toLocaleString()}₫
                        </ThemedText>
                        {selectedAddOns.includes(addOn.id) && (
                          <IconSymbol name="check-circle" size={20} color="#3b82f6" />
                        )}
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Cancellation Policy */}
          {tour.cancellationPolicy && (
            <View className={`px-6 py-4 ${isDark ? "bg-slate-800" : "bg-white"} mt-2`}>
              <View className="flex-row items-center">
                <IconSymbol name="info" size={20} color={isDark ? "#94a3b8" : "#6b7280"} />
                <ThemedText className={`ml-2 font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                  Chính sách hủy
                </ThemedText>
              </View>
              <ThemedText className={`mt-2 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                {tour.cancellationPolicy}
              </ThemedText>
            </View>
          )}

          {/* Reviews Section - placeholder */}
          <View className={`px-6 py-4 ${isDark ? "bg-slate-800" : "bg-white"} mt-2`}>
            <ThemedText className={`text-lg font-bold mb-3 ${isDark ? "text-white" : "text-gray-900"}`}>
              Đánh giá ({tour.reviewCount})
            </ThemedText>
            <ThemedText className={`${isDark ? "text-gray-400" : "text-gray-500"}`}>
              Xem tất cả đánh giá →
            </ThemedText>
          </View>
        </ScrollView>

        {/* Bottom Booking Bar */}
        <View
          className={`absolute bottom-0 left-0 right-0 p-6 ${
            isDark ? "bg-slate-900" : "bg-white"
          } border-t ${isDark ? "border-slate-700" : "border-gray-200"}`}
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <ThemedText className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                Tổng cộng
              </ThemedText>
              <ThemedText className={`text-2xl font-extrabold ${isDark ? "text-blue-400" : "text-blue-600"}`}>
                {calculateTotalPrice().toLocaleString()}₫
              </ThemedText>
              {selectedAddOns.length > 0 && (
                <ThemedText className={`text-xs mt-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                  Bao gồm {selectedAddOns.length} dịch vụ bổ sung
                </ThemedText>
              )}
            </View>
            <TouchableOpacity
              onPress={handleBookNow}
              disabled={!selectedSlot}
              className="bg-orange-500 px-8 py-4 rounded-2xl ml-4"
              style={{ opacity: selectedSlot ? 1 : 0.6 }}
            >
              <ThemedText className="text-white font-bold text-lg">Đặt ngay</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </ThemedView>

      {/* Booking Modal */}
      <Modal
        visible={showBookingModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowBookingModal(false)}
      >
        <BookingFlow
          tourId={tour._id}
          tourTitle={tour.title}
          selectedSlot={selectedSlot!}
          selectedPickupPoint={selectedPickupPoint || undefined}
          selectedAddOns={selectedAddOns}
          basePrice={selectedSlot?.price || tour.price}
          addOnsTotal={selectedAddOns.reduce(
            (sum, id) => sum + (mockAddOns.find((a) => a.id === id)?.price || 0),
            0
          )}
          onClose={() => setShowBookingModal(false)}
        />
      </Modal>
    </SafeAreaView>
  );
}

