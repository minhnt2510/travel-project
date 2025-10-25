// app/components/destinations/DestinationPicker.tsx
import {
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  View,
} from "react-native";
import { Image } from "expo-image";
import { ThemedText } from "@/ui-components/themed-text";
import type { Destination } from "@/services/api";

type Props = {
  destinations: Destination[];
  selectedId?: string;
  onSelect: (d: Destination) => void;
  loading?: boolean;
  isDark: boolean;
};

export default function DestinationPicker({
  destinations,
  selectedId,
  onSelect,
  loading,
  isDark,
}: Props) {
  if (loading) {
    return (
      <View className="flex-row items-center justify-center py-8">
        <ActivityIndicator size="small" color="#3b82f6" />
      </View>
    );
  }

  return (
    <FlatList
      data={destinations}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => onSelect(item)}
          className={`mr-4 w-36 rounded-2xl overflow-hidden border-2 ${
            selectedId === item.id
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
          <View className={`${isDark ? "bg-slate-800" : "bg-white"} p-3`}>
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
  );
}
