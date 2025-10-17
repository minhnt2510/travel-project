import { View, Text } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

export default function HomeScreen() {
  return (
    <ThemedView className="flex-1 items-center justify-center bg-white">
      <ThemedText className="text-2xl font-bold text-blue-600">
        Trang chủ Travel App
      </ThemedText>
      <Text className="text-gray-600 mt-2">
        Đây là giao diện Home mới, đã xoá phần demo
      </Text>
    </ThemedView>
  );
}
