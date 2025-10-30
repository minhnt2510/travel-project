import { ThemedText } from "@/ui-components/themed-text";
import { IconSymbol } from "@/ui-components/ui/icon-symbol";
import { TouchableOpacity, View, TextInput } from "react-native";

interface SearchBarProps {
  placeholder?: string;
  onSearch?: () => void;
  onFocus?: () => void;
  showFilterButton?: boolean;
}

export default function SearchBar({
  placeholder = "Tìm kiếm...",
  onSearch,
  onFocus,
  showFilterButton = false,
}: SearchBarProps) {
  return (
    <TouchableOpacity
      className="bg-white rounded-2xl px-4 py-4 flex-row items-center shadow-lg"
      onPress={onFocus}
    >
      <IconSymbol name="search" size={22} color="#2563eb" />
      <View className="flex-1 ml-3">
        <ThemedText className="text-gray-900 font-medium">
          {placeholder}
        </ThemedText>
        <ThemedText className="text-gray-500 text-xs mt-0.5">
          Khám phá hơn 500+ địa điểm
        </ThemedText>
      </View>
      {showFilterButton && (
        <View className="bg-blue-50 px-3 py-2 rounded-xl">
          <IconSymbol name="sliders" size={18} color="#2563eb" />
        </View>
      )}
    </TouchableOpacity>
  );
}

