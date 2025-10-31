import { ThemedText } from "@/ui-components/themed-text";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInRight } from "react-native-reanimated";
import { useState } from "react";

// Chủ đề gợi ý theo yêu cầu
const filters = [
  { label: "Tất cả", emoji: "✨", color: ['#667eea', '#764ba2'], category: "all" },
  { label: "Góc tình yêu", emoji: "💕", color: ['#ec4899', '#f472b6'], category: "love_corner" },
  { label: "Phòng phim", emoji: "🎬", color: ['#db2777', '#ec4899'], category: "movie_room" },
  { label: "Lãng mạn", emoji: "🌹", color: ['#f43f5e', '#e11d48'], category: "romantic" },
  { label: "< 300k", emoji: "💰", color: ['#10b981', '#059669'], category: "budget" },
  { label: "Theo giờ", emoji: "⏰", color: ['#8b5cf6', '#7c3aed'], category: "hourly" },
  { label: "Theo ngày", emoji: "📅", color: ['#3b82f6', '#2563eb'], category: "daily" },
  { label: "Qua đêm", emoji: "🌙", color: ['#6366f1', '#4f46e5'], category: "overnight" },
  { label: "Team building", emoji: "👥", color: ['#f59e0b', '#d97706'], category: "team_building" },
  { label: "Ẩm thực", emoji: "🍜", color: ['#ef4444', '#dc2626'], category: "food" },
  { label: "Văn hóa", emoji: "🏛️", color: ['#8b5cf6', '#7c3aed'], category: "culture" },
  { label: "Thiên nhiên", emoji: "🌲", color: ['#10b981', '#059669'], category: "nature" },
  { label: "Biển", emoji: "🏖️", color: ['#06b6d4', '#3b82f6'], category: "beach" },
  { label: "Núi", emoji: "🏔️", color: ['#14b8a6', '#0d9488'], category: "mountain" },
];

interface QuickFiltersProps {
  onFilterChange?: (category: string) => void;
}

export default function QuickFilters({ onFilterChange }: QuickFiltersProps) {
  const [selected, setSelected] = useState(0);

  const handleSelect = (idx: number, category: string) => {
    setSelected(idx);
    onFilterChange?.(category);
  };

  return (
    <View className="px-4 py-4 bg-white border-b border-gray-100">
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="flex-row">
          {filters.map((filter, idx) => {
            const isSelected = selected === idx;
            return (
              <Animated.View
                key={idx}
                entering={FadeInRight.delay(idx * 30).duration(300)}
              >
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => handleSelect(idx, filter.category)}
                  className="mr-3 overflow-hidden rounded-full shadow-lg"
                >
                  {isSelected ? (
                    <LinearGradient
                      colors={filter.color as [string, string, ...string[]]}
                      className="px-5 py-2.5 flex-row items-center"
                    >
                      <ThemedText className="mr-2 text-lg">{filter.emoji}</ThemedText>
                      <ThemedText className="text-white font-extrabold text-sm">
                        {filter.label}
                      </ThemedText>
                    </LinearGradient>
                  ) : (
                    <View className="px-5 py-2.5 flex-row items-center bg-gray-100 border border-gray-200">
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

