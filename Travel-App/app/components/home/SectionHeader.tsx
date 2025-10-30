import { View, TouchableOpacity } from "react-native";
import { ThemedText } from "@/ui-components/themed-text";
import { IconSymbol } from "@/ui-components/ui/icon-symbol";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  onViewAll?: () => void;
}

export default function SectionHeader({
  title,
  subtitle,
  onViewAll,
}: SectionHeaderProps) {
  return (
    <View className="flex-row justify-between items-center mb-4">
      <View>
        <ThemedText className="text-xl font-bold text-gray-900">
          {title}
        </ThemedText>
        {subtitle && (
          <ThemedText className="text-gray-500 text-sm">{subtitle}</ThemedText>
        )}
      </View>
      {onViewAll && (
        <TouchableOpacity className="flex-row items-center" onPress={onViewAll}>
          <ThemedText className="text-blue-600 font-semibold mr-2">
            Xem tất cả
          </ThemedText>
          <IconSymbol name="chevron-right" size={20} color="#2563eb" />
        </TouchableOpacity>
      )}
    </View>
  );
}

