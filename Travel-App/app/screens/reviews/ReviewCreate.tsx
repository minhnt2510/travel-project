import { View, TextInput, TouchableOpacity } from "react-native";
import { ThemedView } from "@/ui-components/themed-view";
import { ThemedText } from "@/ui-components/themed-text";
import { IconSymbol } from "@/ui-components/ui/icon-symbol";
import { useState } from "react";

export default function ReviewCreate() {
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");

  return (
    <ThemedView className="flex-1">
      {/* Header */}
      <View className="p-4 border-b border-gray-200">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => {}}>
            <IconSymbol name="arrow-left" size={24} color="#000" />
          </TouchableOpacity>
          <ThemedText className="ml-4 text-xl font-bold">
            Viết đánh giá
          </ThemedText>
        </View>
      </View>

      <View className="flex-1 p-4">
        {/* Service Info */}
        <View className="bg-white p-4 rounded-lg shadow mb-6">
          <ThemedText className="font-bold text-lg">
            Tour Đà Lạt 3N2Đ
          </ThemedText>
          <ThemedText className="text-gray-600">
            20/10/2025 - 22/10/2025
          </ThemedText>
        </View>

        {/* Rating */}
        <View className="mb-6">
          <ThemedText className="font-bold text-lg mb-4">Đánh giá</ThemedText>
          <View className="flex-row justify-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => setRating(star)}>
                <IconSymbol
                  name={star <= rating ? "star" : "star-outline"}
                  size={32}
                  color="#FFB800"
                />
              </TouchableOpacity>
            ))}
          </View>
          <ThemedText className="text-center mt-2 text-gray-600">
            {rating === 5
              ? "Xuất sắc"
              : rating === 4
              ? "Rất tốt"
              : rating === 3
              ? "Tốt"
              : rating === 2
              ? "Trung bình"
              : "Kém"}
          </ThemedText>
        </View>

        {/* Review Text */}
        <View className="mb-6">
          <ThemedText className="font-bold text-lg mb-4">
            Chi tiết đánh giá
          </ThemedText>
          <TextInput
            className="bg-white p-4 rounded-lg min-h-[150px] text-base border border-gray-200"
            multiline
            placeholder="Chia sẻ trải nghiệm của bạn..."
            value={review}
            onChangeText={setReview}
            textAlignVertical="top"
          />
        </View>

        {/* Photo Upload */}
        <View className="mb-6">
          <ThemedText className="font-bold text-lg mb-4">
            Thêm hình ảnh
          </ThemedText>
          <TouchableOpacity
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 items-center"
            onPress={() => {}}
          >
            <IconSymbol name="camera" size={32} color="#6B7280" />
            <ThemedText className="text-gray-600 mt-2">
              Tải lên hình ảnh
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>

      {/* Submit Button */}
      <View className="p-4 border-t border-gray-200">
        <TouchableOpacity
          className="bg-blue-600 py-3 rounded-lg items-center"
          onPress={() => {}}
        >
          <ThemedText className="text-white font-semibold text-lg">
            Gửi đánh giá
          </ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}
