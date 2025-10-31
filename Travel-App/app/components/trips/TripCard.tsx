// app/components/trips/TripCard.tsx
import { View, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { IconSymbol } from "@/ui-components/ui/icon-symbol";
import { ThemedText } from "@/ui-components/themed-text";
import type { Trip } from "@/services/api";

// Helper function to format date: "2025-10-31" -> "31/10/2025"
const formatDate = (dateString: string): string => {
  if (!dateString) return "";
  // Remove time part if exists: "2025-10-31T00:00:000z" -> "2025-10-31"
  const dateOnly = dateString.split('T')[0];
  const [year, month, day] = dateOnly.split('-');
  return `${day}/${month}/${year}`;
};

type Props = {
  trip: Trip;
  isDark: boolean;
  getStatusStyle: (s: string) => string;
  getStatusText: (s: string) => string;
  onPress?: () => void; // Nhấn vào card để xem detail
  onDelete: () => void;
  onPay?: () => void;
  showPayButton?: boolean;  
};

export default function TripCard({
  trip,
  isDark,
  getStatusStyle,
  getStatusText,
  onPress,
  onDelete,
  onPay,
  showPayButton = trip.status === "pending",
}: Props) {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      className="mb-4"
    >
      <View
        className={`${
          isDark ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"
        } rounded-3xl shadow-2xl overflow-hidden border`}
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          elevation: 8,
        }}
      >
        {/* Ảnh địa điểm với gradient overlay */}
        <View className="relative">
          <Image
            source={{ uri: trip.destinationImage }}
            className="w-full h-56"
            contentFit="cover"
          />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.3)"]}
            className="absolute bottom-0 left-0 right-0 h-32"
          />
          
          {/* Status badge on image */}
          <View className="absolute top-4 right-4">
            <View
              className={`px-3 py-1.5 rounded-full shadow-lg ${getStatusStyle(trip.status)}`}
            >
              <ThemedText className="text-[11px] font-bold">
                {getStatusText(trip.status)}
              </ThemedText>
            </View>
          </View>
        </View>

        <View className="p-5">
        {/* Header: tên */}
        <View className="mb-4">
          <ThemedText
            className={`text-2xl font-extrabold ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            {trip.destinationName}
          </ThemedText>
        </View>

        {/* Info lines với cards */}
        <View className="flex-row flex-wrap gap-2 mb-4">
          <View
            className={`flex-row items-center px-3 py-2 rounded-xl ${
              isDark ? "bg-slate-700/50" : "bg-blue-50"
            }`}
          >
            <IconSymbol
              name="calendar"
              size={16}
              color={isDark ? "#94a3b8" : "#3b82f6"}
            />
            <ThemedText
              className={`ml-2 text-sm font-semibold ${
                isDark ? "text-gray-300" : "text-blue-700"
              }`}
            >
              {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
            </ThemedText>
          </View>

          <View
            className={`flex-row items-center px-3 py-2 rounded-xl ${
              isDark ? "bg-slate-700/50" : "bg-purple-50"
            }`}
          >
            <IconSymbol
              name="users"
              size={16}
              color={isDark ? "#94a3b8" : "#9333ea"}
            />
            <ThemedText
              className={`ml-2 text-sm font-semibold ${
                isDark ? "text-gray-300" : "text-purple-700"
              }`}
            >
              {trip.travelers} người
            </ThemedText>
          </View>
        </View>

        {/* Footer: giá và actions */}
        <View
          className={`pt-4 border-t ${
            isDark ? "border-slate-700" : "border-gray-200"
          }`}
        >
          <View className="flex-row items-center justify-between mb-3">
            <View>
              <ThemedText
                className={`text-xs mb-1 ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Tổng tiền
              </ThemedText>
              <ThemedText
                className={`text-2xl font-extrabold ${
                  isDark ? "text-blue-400" : "text-blue-600"
                }`}
              >
                {trip.totalPrice}
              </ThemedText>
            </View>

            {/* Nhóm nút: thanh toán và xóa */}
            <View className="flex-row items-center gap-2">
              {showPayButton && onPay && (
                <TouchableOpacity
                  onPress={(e) => {
                    e.stopPropagation();
                    onPay();
                  }}
                  className="px-4 py-2.5 rounded-xl bg-blue-600 flex-row items-center shadow-lg"
                  style={{
                    shadowColor: "#3b82f6",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.3,
                    shadowRadius: 4,
                    elevation: 4,
                  }}
                  hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                >
                  <IconSymbol name="credit-card" size={16} color="#FFF" />
                  <ThemedText className="text-white font-bold ml-2 text-sm">
                    Thanh toán
                  </ThemedText>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                onPress={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className={`w-11 h-11 rounded-xl ${
                  isDark ? "bg-slate-700" : "bg-red-50"
                } flex items-center justify-center`}
                style={{
                  shadowColor: "#ef4444",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.2,
                  shadowRadius: 4,
                  elevation: 3,
                }}
                hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
              >
                <IconSymbol
                  name="trash-2"
                  size={18}
                  color={isDark ? "#f87171" : "#dc2626"}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
