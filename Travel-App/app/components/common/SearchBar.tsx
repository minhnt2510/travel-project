import { ThemedText } from "@/ui-components/themed-text";
import { IconSymbol } from "@/ui-components/ui/icon-symbol";
import { TouchableOpacity, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

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
      activeOpacity={0.9}
      className="rounded-2xl overflow-hidden shadow-2xl"
      onPress={onFocus}
    >
      <LinearGradient
        colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.9)']}
        className="px-5 py-4 flex-row items-center"
      >
        <LinearGradient
          colors={['#8b5cf6', '#ec4899']}
          className="w-10 h-10 rounded-full items-center justify-center mr-3"
        >
          <IconSymbol name="search" size={20} color="#FFF" />
        </LinearGradient>
        <View className="flex-1">
          <ThemedText className="text-gray-900 font-bold text-base">
            {placeholder}
          </ThemedText>
          <ThemedText className="text-gray-500 text-xs mt-0.5">
            Khám phá hơn 500+ địa điểm
          </ThemedText>
        </View>
        {showFilterButton && (
          <TouchableOpacity
            onPress={onFocus}
            className="ml-2 rounded-xl shadow-lg overflow-hidden"
          >
            <LinearGradient
              colors={['#8b5cf6', '#ec4899']}
              className="px-4 py-2.5"
            >
              <IconSymbol name="sliders" size={18} color="#FFF" />
            </LinearGradient>
          </TouchableOpacity>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}

