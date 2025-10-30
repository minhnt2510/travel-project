import { ThemedText } from "@/ui-components/themed-text";
import { IconSymbol } from "@/ui-components/ui/icon-symbol";
import { TouchableOpacity, View } from "react-native";

interface MenuItemProps {
  icon: string;
  label: string;
  onPress: () => void;
  textColor?: string;
}

export default function MenuItem({
  icon,
  label,
  onPress,
  textColor = "text-gray-900",
}: MenuItemProps) {
  return (
    <TouchableOpacity onPress={onPress} className="flex-row items-center py-4">
      <View className="w-10 h-10 rounded-xl bg-gray-100 items-center justify-center mr-4">
        <IconSymbol name={icon} size={20} color="#374151" />
      </View>
      <ThemedText className={`flex-1 text-base font-medium ${textColor}`}>
        {label}
      </ThemedText>
      <IconSymbol name="chevron-right" size={20} color="#9CA3AF" />
    </TouchableOpacity>
  );
}

