import { View, TouchableOpacity } from "react-native";
import { ThemedText } from "@/ui-components/themed-text";
import { IconSymbol } from "@/ui-components/ui/icon-symbol";
import Animated, { FadeInDown } from "react-native-reanimated";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  onViewAll?: () => void;
  delay?: number;
}

export default function SectionHeader({
  title,
  subtitle,
  onViewAll,
  delay = 0,
}: SectionHeaderProps) {
  return (
    <Animated.View 
      entering={FadeInDown.delay(delay).duration(500)}
      className="flex-row justify-between items-center mb-4"
    >
      <View className="flex-1">
        <ThemedText className="text-2xl font-extrabold text-gray-900 mb-1">
          {title}
        </ThemedText>
        {subtitle && (
          <ThemedText className="text-gray-600 text-sm font-medium">
            {subtitle}
          </ThemedText>
        )}
      </View>
      {onViewAll && (
        <TouchableOpacity 
          activeOpacity={0.7}
          className="flex-row items-center ml-4" 
          onPress={onViewAll}
        >
          <ThemedText className="text-purple-600 font-bold mr-1">
            Xem tất cả
          </ThemedText>
          <IconSymbol name="chevron-right" size={18} color="#667eea" />
        </TouchableOpacity>
      )}
    </Animated.View>
  );
}

