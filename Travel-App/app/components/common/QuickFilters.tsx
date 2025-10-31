import { ThemedText } from "@/ui-components/themed-text";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInRight } from "react-native-reanimated";
import { useState } from "react";

const filters = [
  { label: "Nổi bật", emoji: "✨", color: ['#667eea', '#764ba2'] },
  { label: "Hot", emoji: "🔥", color: ['#ef4444', '#f97316'] },
  { label: "Biển", emoji: "🏖️", color: ['#06b6d4', '#3b82f6'] },
  { label: "Núi", emoji: "🏔️", color: ['#10b981', '#059669'] },
  { label: "Thành phố", emoji: "🏙️", color: ['#8b5cf6', '#6366f1'] },
];

export default function QuickFilters() {
  const [selected, setSelected] = useState(0);

  return (
    <View className="px-4 py-4 bg-white">
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="flex-row">
          {filters.map((filter, idx) => {
            const isSelected = selected === idx;
            return (
              <Animated.View
                key={idx}
                entering={FadeInRight.delay(idx * 50).duration(300)}
              >
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setSelected(idx)}
                  className="mr-3 overflow-hidden rounded-full shadow-lg"
                >
                  {isSelected ? (
                    <LinearGradient
                      colors={filter.color}
                      className="px-5 py-2.5 flex-row items-center"
                    >
                      <ThemedText className="mr-2 text-lg">{filter.emoji}</ThemedText>
                      <ThemedText className="text-white font-extrabold text-sm">
                        {filter.label}
                      </ThemedText>
                    </LinearGradient>
                  ) : (
                    <View className="px-5 py-2.5 flex-row items-center bg-gray-100">
                      <ThemedText className="mr-2 text-lg">{filter.emoji}</ThemedText>
                      <ThemedText className="text-gray-700 font-semibold text-sm">
                        {filter.label}
                      </ThemedText>
                    </View>
                  )}
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

