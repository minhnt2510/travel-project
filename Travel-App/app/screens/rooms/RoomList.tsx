import { useState } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Alert,
} from "react-native";
import { Image as ExpoImage } from "expo-image";
import { useLocalSearchParams, router } from "expo-router";
import { ThemedText } from "@/ui-components/themed-text";
import { ThemedView } from "@/ui-components/themed-view";
import { IconSymbol } from "@/ui-components/ui/icon-symbol";
import { api } from "@/services/api";
import { useUser } from "@/app/_layout";

// Booking time selection modal component
function SelectBookingTimeModal({
  visible,
  onClose,
  onApply,
  initialDate,
  initialCheckIn,
  initialDuration,
}: {
  visible: boolean;
  onClose: () => void;
  onApply: (date: string, checkIn: string, duration: number) => void;
  initialDate?: string;
  initialCheckIn?: string;
  initialDuration?: number;
}) {
  const [bookingType, setBookingType] = useState<"hourly" | "overnight" | "daily">("hourly");
  const [selectedDate, setSelectedDate] = useState<string>(initialDate || new Date().toISOString().split("T")[0]);
  const [selectedCheckIn, setSelectedCheckIn] = useState<string>(initialCheckIn || "02:30");
  const [selectedDuration, setSelectedDuration] = useState<number>(initialDuration || 1);

  // Generate time slots
  const timeSlots = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let min = 0; min < 60; min += 30) {
      const timeStr = `${hour.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")}`;
      timeSlots.push(timeStr);
    }
  }

  // Calculate check-out time
  const calculateCheckOut = () => {
    const [hours, minutes] = selectedCheckIn.split(":").map(Number);
    const totalMinutes = hours * 60 + minutes + selectedDuration * 60;
    const outHours = Math.floor(totalMinutes / 60) % 24;
    const outMinutes = totalMinutes % 60;
    return `${outHours.toString().padStart(2, "0")}:${outMinutes.toString().padStart(2, "0")}`;
  };

  // Format date: "2025-11-01" -> "01/11"
  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}`;
  };

  // Get current month dates
  const getMonthDates = () => {
    const date = new Date(selectedDate);
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const dates = [];
    
    // Fill empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      dates.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      dates.push(new Date(year, month, day));
    }
    
    return dates;
  };

  const handleApply = () => {
    const checkOut = calculateCheckOut();
    onApply(selectedDate, selectedCheckIn, selectedDuration);
    onClose();
  };

  const monthDates = getMonthDates();
  const checkOut = calculateCheckOut();
  const selectedDateObj = new Date(selectedDate);
  const monthNames = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];
  const dayNames = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View className="flex-1 bg-white">
        {/* Header */}
        <View className="p-4 border-b border-gray-200 flex-row items-center justify-between">
          <ThemedText className="text-xl font-bold">Chọn thời gian</ThemedText>
          <TouchableOpacity onPress={onClose}>
            <IconSymbol name="x" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1">
          {/* Booking Type Tabs */}
          <View className="flex-row px-4 pt-4 border-b border-gray-200">
            <TouchableOpacity
              onPress={() => setBookingType("hourly")}
              className="flex-1 items-center pb-3"
              style={{
                borderBottomWidth: bookingType === "hourly" ? 2 : 0,
                borderBottomColor: "#f97316",
              }}
            >
              <ThemedText
                className="text-base font-medium"
                style={{ color: bookingType === "hourly" ? "#f97316" : "#9ca3af" }}
              >
                Theo giờ
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setBookingType("overnight")}
              className="flex-1 items-center pb-3"
              style={{
                borderBottomWidth: bookingType === "overnight" ? 2 : 0,
                borderBottomColor: "#f97316",
              }}
            >
              <ThemedText
                className="text-base font-medium"
                style={{ color: bookingType === "overnight" ? "#f97316" : "#9ca3af" }}
              >
                Qua đêm
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setBookingType("daily")}
              className="flex-1 items-center pb-3"
              style={{
                borderBottomWidth: bookingType === "daily" ? 2 : 0,
                borderBottomColor: "#f97316",
              }}
            >
              <ThemedText
                className="text-base font-medium"
                style={{ color: bookingType === "daily" ? "#f97316" : "#9ca3af" }}
              >
                Theo ngày
              </ThemedText>
            </TouchableOpacity>
          </View>

          {/* Calendar Section */}
          <View className="p-4">
            <View className="flex-row items-center justify-between mb-4">
              <ThemedText className="text-lg font-bold">
                {monthNames[selectedDateObj.getMonth()]}, {selectedDateObj.getFullYear()}
              </ThemedText>
              <View className="flex-row gap-2">
                <TouchableOpacity
                  onPress={() => {
                    const prevMonth = new Date(selectedDateObj);
                    prevMonth.setMonth(prevMonth.getMonth() - 1);
                    setSelectedDate(prevMonth.toISOString().split("T")[0]);
                  }}
                >
                  <IconSymbol name="chevron-left" size={20} color="#000" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    const nextMonth = new Date(selectedDateObj);
                    nextMonth.setMonth(nextMonth.getMonth() + 1);
                    setSelectedDate(nextMonth.toISOString().split("T")[0]);
                  }}
                >
                  <IconSymbol name="chevron-right" size={20} color="#000" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Days of week */}
            <View className="flex-row mb-2">
              {dayNames.map((day) => (
                <View key={day} className="flex-1 items-center">
                  <ThemedText className="text-sm text-gray-600">{day}</ThemedText>
                </View>
              ))}
            </View>

            {/* Calendar grid */}
            <View className="flex-row flex-wrap">
              {monthDates.map((date, index) => {
                if (!date) {
                  return <View key={`empty-${index}`} className="w-[14.28%] aspect-square" />;
                }
                const dateStr = date.toISOString().split("T")[0];
                const day = date.getDate();
                const isSelected = dateStr === selectedDate;
                const isToday = dateStr === new Date().toISOString().split("T")[0];

                return (
                  <TouchableOpacity
                    key={dateStr}
                    onPress={() => setSelectedDate(dateStr)}
                    className="w-[14.28%] aspect-square items-center justify-center"
                  >
                    <View
                      className="w-10 h-10 rounded-full items-center justify-center"
                      style={{
                        backgroundColor: isSelected ? "#fef3f2" : "transparent",
                        borderWidth: isToday && !isSelected ? 1 : 0,
                        borderColor: "#f97316",
                      }}
                    >
                      <ThemedText
                        className="text-sm"
                        style={{
                          color: isSelected ? "#f97316" : isToday ? "#f97316" : "#000",
                          fontWeight: isSelected || isToday ? "bold" : "normal",
                        }}
                      >
                        {day}
                      </ThemedText>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Check-in Time */}
          {bookingType === "hourly" && (
            <View className="px-4 mb-4">
              <ThemedText className="text-base font-semibold mb-3">Giờ nhận phòng</ThemedText>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className="flex-row gap-2">
                  {timeSlots.map((time) => (
                    <TouchableOpacity
                      key={time}
                      onPress={() => setSelectedCheckIn(time)}
                      className="px-4 py-2 rounded-lg border"
                      style={{
                        backgroundColor: selectedCheckIn === time ? "#fef3f2" : "#fff",
                        borderColor: selectedCheckIn === time ? "#f97316" : "#e5e7eb",
                      }}
                    >
                      <ThemedText
                        className="text-sm font-medium"
                        style={{ color: selectedCheckIn === time ? "#f97316" : "#6b7280" }}
                      >
                        {time}
                      </ThemedText>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>
          )}

          {/* Duration (only for hourly) */}
          {bookingType === "hourly" && (
            <View className="px-4 mb-6">
              <ThemedText className="text-base font-semibold mb-3">Số giờ sử dụng</ThemedText>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className="flex-row gap-2">
                  {[1, 2, 3, 4, 5, 6, 8, 12].map((hours) => (
                    <TouchableOpacity
                      key={hours}
                      onPress={() => setSelectedDuration(hours)}
                      className="px-4 py-2 rounded-lg border"
                      style={{
                        backgroundColor: selectedDuration === hours ? "#fef3f2" : "#fff",
                        borderColor: selectedDuration === hours ? "#f97316" : "#e5e7eb",
                      }}
                    >
                      <ThemedText
                        className="text-sm font-medium"
                        style={{ color: selectedDuration === hours ? "#f97316" : "#6b7280" }}
                      >
                        {hours} giờ
                      </ThemedText>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>
          )}

          {/* Summary */}
          <View className="px-4 mb-4">
            <View className="bg-gray-50 rounded-lg p-4">
              <View className="flex-row justify-between mb-2">
                <ThemedText className="text-gray-600">Nhận phòng</ThemedText>
                <ThemedText className="font-semibold">
                  {selectedCheckIn}, {formatDate(selectedDate)}
                </ThemedText>
              </View>
              <View className="flex-row justify-between">
                <ThemedText className="text-gray-600">Trả phòng</ThemedText>
                <ThemedText className="font-semibold">
                  {checkOut}, {formatDate(selectedDate)}
                </ThemedText>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Apply Button */}
        <View className="p-4 border-t border-gray-200 bg-white">
          <TouchableOpacity
            onPress={handleApply}
            className="bg-orange-500 py-4 rounded-lg items-center"
          >
            <ThemedText className="text-white font-bold text-base">Áp dụng</ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

export default function RoomList() {
  const { destinationId, destinationName } = useLocalSearchParams<{
    destinationId: string;
    destinationName: string;
  }>();
  const [isTimeModalVisible, setIsTimeModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [selectedCheckIn, setSelectedCheckIn] = useState<string>("02:30");
  const [selectedDuration, setSelectedDuration] = useState<number>(1);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);

  // Calculate check-out time
  const calculateCheckOut = () => {
    const [hours, minutes] = selectedCheckIn.split(":").map(Number);
    const totalMinutes = hours * 60 + minutes + selectedDuration * 60;
    const outHours = Math.floor(totalMinutes / 60) % 24;
    const outMinutes = totalMinutes % 60;
    return `${outHours.toString().padStart(2, "0")}:${outMinutes.toString().padStart(2, "0")}`;
  };

  // Format date: "2025-11-01" -> "01/11"
  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}`;
  };

  const checkOut = calculateCheckOut();
  const { user } = useUser();
  const [isBooking, setIsBooking] = useState(false);
  const [bookingRoomId, setBookingRoomId] = useState<string | null>(null);

  // Demo room data with beautiful images - Mở rộng với nhiều phòng hơn
  const rooms = [
    {
      id: "1",
      name: "DELUXE ROOM",
      image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800",
      price: 300000,
      features: [
        "1 giường đôi",
        "21m2",
        "Hướng thành phố",
        "Lễ tân 24/24",
        "NETFLIX",
        "FPT Play box",
        "Bộ BDSM",
        "Free Cosplay",
        "Sen Trần",
      ],
    },
    {
      id: "2",
      name: "LOVE CORNER ROOM",
      image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800",
      price: 350000,
      features: [
        "1 giường đôi lớn",
        "25m2",
        "Hướng thành phố",
        "Lễ tân 24/24",
        "NETFLIX",
        "Mini Bar",
        "Bồn tắm nước nóng",
        "Đèn LED màu",
      ],
    },
    {
      id: "3",
      name: "ROMANTIC ROOM",
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800",
      price: 400000,
      features: [
        "1 giường tròn",
        "30m2",
        "Ban công riêng",
        "Lễ tân 24/24",
        "NETFLIX",
        "FPT Play box",
        "Phòng tắm kính",
        "Đèn ngủ lãng mạn",
      ],
    },
    {
      id: "4",
      name: "STANDARD ROOM",
      image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800",
      price: 200000,
      features: [
        "1 giường đơn",
        "15m2",
        "Cửa sổ",
        "WiFi miễn phí",
        "Tivi",
        "Máy lạnh",
      ],
    },
    {
      id: "5",
      name: "PREMIUM SUITE",
      image: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800",
      price: 500000,
      features: [
        "1 giường King Size",
        "40m2",
        "Phòng khách riêng",
        "Lễ tân 24/24",
        "NETFLIX 4K",
        "FPT Play box",
        "Bồn tắm Jacuzzi",
        "Mini Bar đầy đủ",
        "View đẹp nhất",
      ],
    },
    {
      id: "6",
      name: "GAMING ROOM",
      image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800",
      price: 320000,
      features: [
        "1 giường đôi",
        "22m2",
        "PlayStation 5",
        "PC Gaming",
        "NETFLIX",
        "Màn hình 4K",
        "RGB Lighting",
      ],
    },
    {
      id: "7",
      name: "EXECUTIVE ROOM",
      image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800",
      price: 280000,
      features: [
        "1 giường đôi",
        "20m2",
        "Bàn làm việc",
        "WiFi tốc độ cao",
        "Tivi 55 inch",
        "Máy lạnh inverter",
        "Tủ lạnh mini",
      ],
    },
    {
      id: "8",
      name: "FAMILY ROOM",
      image: "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=800",
      price: 450000,
      features: [
        "2 giường đôi",
        "35m2",
        "Phù hợp gia đình",
        "NETFLIX",
        "Khu vui chơi trẻ em",
        "Bếp mini",
        "Tủ lạnh lớn",
      ],
    },
    {
      id: "9",
      name: "PRESIDENTIAL SUITE",
      image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800",
      price: 800000,
      features: [
        "1 giường King Size",
        "60m2",
        "Phòng khách + phòng ngủ",
        "NETFLIX 8K",
        "Bồn tắm Jacuzzi",
        "Mini Bar cao cấp",
        "View panorama",
        "Butler service",
      ],
    },
    {
      id: "10",
      name: "BUSINESS ROOM",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
      price: 250000,
      features: [
        "1 giường đôi",
        "18m2",
        "Bàn làm việc rộng",
        "WiFi business",
        "Máy in",
        "Phòng họp nhỏ",
        "Tivi Smart",
      ],
    },
    {
      id: "11",
      name: "HONEYMOON SUITE",
      image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800",
      price: 600000,
      features: [
        "1 giường tròn lớn",
        "45m2",
        "Phòng tắm sang trọng",
        "NETFLIX",
        "Hoa tươi",
        "Rượu champagne",
        "Bồn tắm view đẹp",
        "Đèn nến lãng mạn",
      ],
    },
    {
      id: "12",
      name: "STUDIO ROOM",
      image: "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800",
      price: 220000,
      features: [
        "1 giường đơn",
        "16m2",
        "Thiết kế hiện đại",
        "Tivi",
        "Máy lạnh",
        "Tủ quần áo",
        "WiFi miễn phí",
      ],
    },
    {
      id: "13",
      name: "OCEAN VIEW ROOM",
      image: "https://images.unsplash.com/photo-1611892440504-42a79284824c?w=800",
      price: 420000,
      features: [
        "1 giường đôi",
        "28m2",
        "View biển",
        "Ban công riêng",
        "NETFLIX",
        "Minibar",
        "Điều hòa",
      ],
    },
    {
      id: "14",
      name: "TRIPLE ROOM",
      image: "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800",
      price: 380000,
      features: [
        "3 giường đơn",
        "32m2",
        "Phù hợp nhóm",
        "NETFLIX",
        "2 TV",
        "Tủ lạnh",
        "Khu vực nghỉ",
      ],
    },
    {
      id: "15",
      name: "COZY ROOM",
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
      price: 180000,
      features: [
        "1 giường đơn",
        "12m2",
        "Thiết kế ấm cúng",
        "Tivi",
        "Máy lạnh",
        "WiFi",
        "Giá rẻ",
      ],
    },
    {
      id: "16",
      name: "VIP LOUNGE",
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800",
      price: 550000,
      features: [
        "1 giường King",
        "38m2",
        "Lounge riêng",
        "NETFLIX 4K",
        "Bar mini đầy đủ",
        "Bồn tắm cao cấp",
        "Dịch vụ VIP",
      ],
    },
    {
      id: "17",
      name: "PENTHOUSE",
      image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800",
      price: 1200000,
      features: [
        "1 giường King",
        "80m2",
        "Tầng thượng",
        "NETFLIX 8K",
        "Sân thượng riêng",
        "Bếp đầy đủ",
        "Phòng gym riêng",
        "Butler 24/7",
      ],
    },
    {
      id: "18",
      name: "ECONOMY ROOM",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800",
      price: 150000,
      features: [
        "1 giường đơn nhỏ",
        "10m2",
        "Tiết kiệm",
        "Tivi",
        "Máy lạnh",
        "WiFi",
        "Phòng tắm chung",
      ],
    },
    {
      id: "19",
      name: "SPA SUITE",
      image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
      price: 480000,
      features: [
        "1 giường đôi",
        "35m2",
        "Phòng spa riêng",
        "Massage table",
        "Bồn tắm thảo dược",
        "NETFLIX",
        "Yoga mat",
      ],
    },
    {
      id: "20",
      name: "PARTY ROOM",
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
      price: 650000,
      features: [
        "1 giường King",
        "50m2",
        "Karaoke",
        "Đèn disco",
        "Bar đầy đủ",
        "NETFLIX",
        "Âm thanh chuyên nghiệp",
        "Sân khấu nhỏ",
      ],
    },
  ];

  const handleBookRoom = async (room: typeof rooms[0]) => {
    if (!user) {
      Alert.alert(
        "Đăng nhập cần thiết",
        "Vui lòng đăng nhập để đặt phòng",
        [
          { text: "Hủy", style: "cancel" },
          {
            text: "Đăng nhập",
            onPress: () => router.push("/(auth)/login"),
          },
        ]
      );
      return;
    }

    if (!destinationId) {
      Alert.alert("Lỗi", "Không tìm thấy thông tin khách sạn");
      return;
    }

    setIsBooking(true);
    setBookingRoomId(room.id);

    try {
      // Calculate total price based on duration
      const totalPrice = room.price * selectedDuration;

      // Create booking
      const tripData = {
        destinationId: destinationId,
        destinationName: destinationName || room.name,
        destinationImage: room.image,
        startDate: selectedDate,
        endDate: selectedDate, // Same day for hourly bookings
        travelers: 1,
        totalPrice: `${totalPrice.toLocaleString("vi-VN")}đ`,
        status: "pending" as const,
      };

      await api.createTrip(tripData);

      Alert.alert(
        "Đặt phòng thành công!",
        `Bạn đã đặt ${room.name} thành công.\nThời gian: ${selectedCheckIn} - ${checkOut}, ${formatDate(selectedDate)}`,
        [
          {
            text: "Xem chuyến đi",
            onPress: () => router.push("/(tabs)/bookings"),
          },
          { text: "Tiếp tục", style: "cancel" },
        ]
      );
    } catch (error: any) {
      console.error("Booking error:", error);
      Alert.alert(
        "Lỗi đặt phòng",
        error.message || "Không thể đặt phòng. Vui lòng thử lại sau."
      );
    } finally {
      setIsBooking(false);
      setBookingRoomId(null);
    }
  };

  return (
    <ThemedView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="p-4 border-b border-gray-200 bg-white flex-row items-center">
        <TouchableOpacity onPress={() => router.back()}>
          <IconSymbol name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <ThemedText className="ml-4 text-xl font-bold">Danh sách phòng</ThemedText>
      </View>

      {/* Booking Time Selection Card */}
      <View className="mx-4 mt-4 bg-orange-50 rounded-xl p-4 border border-orange-200">
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center">
            <IconSymbol name="clock" size={20} color="#f97316" />
            <ThemedText className="ml-2 text-gray-700 font-medium">
              Theo giờ | {selectedDuration} giờ
            </ThemedText>
          </View>
          <TouchableOpacity onPress={() => setIsTimeModalVisible(true)}>
            <ThemedText className="text-orange-600 font-semibold">Thay đổi</ThemedText>
          </TouchableOpacity>
        </View>
        <View className="flex-row items-center">
          <View>
            <ThemedText className="text-gray-600 text-sm">Nhận phòng</ThemedText>
            <ThemedText className="font-semibold">
              {selectedCheckIn}, {formatDate(selectedDate)}
            </ThemedText>
          </View>
          <View className="mx-4">
            <IconSymbol name="arrow-right" size={16} color="#9ca3af" />
          </View>
          <View>
            <ThemedText className="text-gray-600 text-sm">Trả phòng</ThemedText>
            <ThemedText className="font-semibold">
              {checkOut}, {formatDate(selectedDate)}
            </ThemedText>
          </View>
        </View>
      </View>

      {/* Room List */}
      <ScrollView className="flex-1 px-4 mt-4">
        {rooms.map((room) => (
          <View
            key={room.id}
            className="bg-white rounded-2xl shadow-lg mb-4 overflow-hidden"
          >
            {/* Room Image */}
            <View className="relative">
              <ExpoImage
                source={{ uri: room.image }}
                className="w-full h-64"
                contentFit="cover"
              />
              {/* Image count badge if needed */}
              <View className="absolute bottom-4 right-4 bg-black/50 px-3 py-1.5 rounded-full">
                <ThemedText className="text-white text-xs font-semibold">+5 ảnh</ThemedText>
              </View>
            </View>

            {/* Room Info */}
            <View className="p-4">
              <ThemedText className="text-xl font-bold mb-3">{room.name}</ThemedText>

              {/* Features */}
              <View className="mb-4">
                <View className="flex-row flex-wrap">
                  {room.features.map((feature, idx) => (
                    <View
                      key={idx}
                      className="bg-blue-50 px-3 py-1.5 rounded-full mr-2 mb-2 flex-row items-center"
                    >
                      <IconSymbol name="check" size={12} color="#3b82f6" />
                      <ThemedText className="ml-1 text-blue-700 text-xs font-medium">
                        {feature}
                      </ThemedText>
                    </View>
                  ))}
                </View>
              </View>

              {/* Price and Book Button */}
              <View className="flex-row items-center justify-between pt-4 border-t border-gray-200">
                <View>
                  <ThemedText className="text-xs text-gray-500 mb-1">Giá mỗi giờ</ThemedText>
                  <ThemedText className="text-2xl font-bold text-blue-600">
                    {room.price.toLocaleString()}₫
                  </ThemedText>
                  <ThemedText className="text-xs text-gray-500 mt-1">
                    Tổng: {(room.price * selectedDuration).toLocaleString()}₫ ({selectedDuration} giờ)
                  </ThemedText>
                </View>
                <TouchableOpacity
                  onPress={() => handleBookRoom(room)}
                  disabled={isBooking && bookingRoomId === room.id}
                  className="bg-orange-500 px-6 py-3 rounded-lg"
                  style={{
                    opacity: isBooking && bookingRoomId === room.id ? 0.6 : 1,
                  }}
                >
                  {isBooking && bookingRoomId === room.id ? (
                    <View className="flex-row items-center">
                      <ActivityIndicator size="small" color="#fff" />
                      <ThemedText className="text-white font-bold ml-2">Đang xử lý...</ThemedText>
                    </View>
                  ) : (
                    <ThemedText className="text-white font-bold">Đặt phòng</ThemedText>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Time Selection Modal */}
      <SelectBookingTimeModal
        visible={isTimeModalVisible}
        onClose={() => setIsTimeModalVisible(false)}
        onApply={(date, checkIn, duration) => {
          setSelectedDate(date);
          setSelectedCheckIn(checkIn);
          setSelectedDuration(duration);
        }}
        initialDate={selectedDate}
        initialCheckIn={selectedCheckIn}
        initialDuration={selectedDuration}
      />
    </ThemedView>
  );
}

