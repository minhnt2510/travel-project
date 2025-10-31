// app/components/trips/TripCard.tsx
import { View, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
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
  onEdit: () => void;
  onDelete: () => void;
  onPay?: () => void;
  showPayButton?: boolean;  
};

export default function TripCard({
  trip,
  isDark,
  getStatusStyle,
  getStatusText,
  onEdit,
  onDelete,
  onPay,
  showPayButton = trip.status === "pending",
}: Props) {
  return (
    <View
      className={`mb-6 ${
        isDark ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"
      } rounded-3xl shadow-xl overflow-hidden border`}
    >
      {/* Ảnh địa điểm */}
      <Image
        source={{ uri: trip.destinationImage }}
        className="w-full h-52"
        contentFit="cover"
      />

      <View className="p-5">
        {/* Header: tên + trạng thái */}
        <View className="flex-row justify-between items-center mb-3">
          <ThemedText
            className={`text-xl font-bold ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            {trip.destinationName}
          </ThemedText>

          <View
            className={`px-2.5 py-1 rounded-full ${getStatusStyle(
              trip.status
            )}`}
          >
            <ThemedText className="text-[11px] font-bold">
              {getStatusText(trip.status)}
            </ThemedText>
          </View>
        </View>

        {/* Info lines */}
        <View className="space-y-2.5 mb-4">
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
              {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
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

        {/* Footer: giá nhỏ + nhóm nút có wrap */}
        <View className="flex-row items-center justify-between">
          <ThemedText
            className={`text-base font-semibold ${
              isDark ? "text-blue-300" : "text-blue-600"
            }`}
          >
            {trip.totalPrice}
          </ThemedText>

          {/* Nhóm nút: cho phép xuống dòng nếu chật */}
          <View className="flex-row flex-wrap items-center">
            {showPayButton && onPay && (
              <TouchableOpacity
                onPress={onPay}
                className="px-3.5 py-2 rounded-full bg-blue-600 flex-row items-center mr-2 mb-2"
                hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
              >
                <IconSymbol name="credit-card" size={16} color="#FFF" />
                <ThemedText className="text-white font-semibold ml-2 text-sm">
                  Thanh toán
                </ThemedText>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={onEdit}
              className={`w-10 h-10 rounded-full ${
                isDark ? "bg-slate-700" : "bg-blue-100"
              } flex items-center justify-center mr-2 mb-2`}
              hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
            >
              <IconSymbol
                name="edit"
                size={18}
                color={isDark ? "#60a5fa" : "#2563eb"}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onDelete}
              className={`w-10 h-10 rounded-full ${
                isDark ? "bg-slate-700" : "bg-red-100"
              } flex items-center justify-center mb-2`}
              hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
            >
              <IconSymbol
                name="trash"
                size={18}
                color={isDark ? "#f87171" : "#dc2626"}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
