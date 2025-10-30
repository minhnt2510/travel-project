import { ThemedText } from "@/ui-components/themed-text";
import { ScrollView, TouchableOpacity, View } from "react-native";

const filters = [
  { label: "Nổi bật", emoji: "✨" },
  { label: "Hot", emoji: "🔥" },
  { label: "Biển", emoji: "🏖️" },
  { label: "Núi", emoji: "🏔️" },
  { label: "Thành phố", emoji: "🏙️" },
];

export default function QuickFilters() {
  return (
    <View className="px-4 py-3 bg-white">
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="flex-row space-x-3">
          {filters.map((filter, idx) => (
            <TouchableOpacity
              key={idx}
              className="bg-blue-50 px-4 py-2 rounded-full flex-row items-center"
            >
              <ThemedText className="mr-2">{filter.emoji}</ThemedText>
              <ThemedText className="text-blue-700 font-semibold text-sm">
                {filter.label}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

