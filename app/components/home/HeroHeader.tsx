import { View, TouchableOpacity } from "react-native";
import { ThemedText } from "@/ui-components/themed-text";
import { IconSymbol } from "@/ui-components/ui/icon-symbol";
import SearchBar from "../common/SearchBar";

interface HeroHeaderProps {
  onSearchPress: () => void;
  onMenuPress: () => void;
}

export default function HeroHeader({
  onSearchPress,
  onMenuPress,
}: HeroHeaderProps) {
  return (
    <View className="bg-gradient-to-br from-blue-600 to-indigo-700 px-4 pt-12 pb-8">
      <View className="flex-row items-center mb-4">
        <View className="flex-1">
          <ThemedText className="text-white text-2xl font-bold">
            Chào mừng! 👋
          </ThemedText>
          <ThemedText className="text-blue-100 text-sm mt-1">
            Khám phá những điểm đến tuyệt vời
          </ThemedText>
        </View>
        <TouchableOpacity
          onPress={onMenuPress}
          className="w-12 h-12 rounded-full items-center justify-center bg-white/20"
        >
          <IconSymbol name="user" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      <SearchBar
        placeholder="Tìm kiếm tour, điểm đến..."
        onSearch={onSearchPress}
        onFocus={onSearchPress}
        showFilterButton
      />
    </View>
  );
}

