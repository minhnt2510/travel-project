import { View, ScrollView, TouchableOpacity, TextInput } from "react-native";
import { ThemedView } from "@/ui-components/themed-view";
import { ThemedText } from "@/ui-components/themed-text";
import { IconSymbol } from "@/ui-components/ui/icon-symbol";
import { useState } from "react";

interface Activity {
  id: string;
  time: string;
  title: string;
  description: string;
}

export default function ItineraryEditor() {
  const [activities, setActivities] = useState<Activity[]>([
    {
      id: "1",
      time: "09:00",
      title: "Thăm quan Dinh Bảo Đại",
      description: "Tham quan cung điện mùa hè của vua Bảo Đại",
    },
    {
      id: "2",
      time: "11:30",
      title: "Ăn trưa tại nhà hàng",
      description: "Thưởng thức đặc sản Đà Lạt",
    },
    {
      id: "3",
      time: "14:00",
      title: "Vườn hoa thành phố",
      description: "Khám phá các loài hoa đặc trưng của Đà Lạt",
    },
  ]);

  return (
    <ThemedView className="flex-1">
      {/* Header */}
      <View className="p-4 border-b border-gray-200">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={() => {}}>
            <IconSymbol name="arrow-left" size={24} color="#000" />
          </TouchableOpacity>
          <ThemedText className="text-xl font-bold">
            Chỉnh sửa lịch trình
          </ThemedText>
          <TouchableOpacity onPress={() => {}}>
            <ThemedText className="text-blue-600">Lưu</ThemedText>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 p-4">
        {/* Day Selection */}
        <View className="flex-row mb-6">
          {[1, 2, 3].map((day) => (
            <TouchableOpacity
              key={day}
              className="mr-4 px-4 py-2 bg-blue-100 rounded-full"
            >
              <ThemedText className="text-blue-600">Ngày {day}</ThemedText>
            </TouchableOpacity>
          ))}
        </View>

        {/* Activities Timeline */}
        <View className="space-y-6">
          {activities.map((activity, index) => (
            <View key={activity.id} className="flex-row">
              {/* Time Column */}
              <View className="w-20">
                <ThemedText className="font-semibold">
                  {activity.time}
                </ThemedText>
              </View>

              {/* Activity Details */}
              <View className="flex-1 bg-white p-4 rounded-lg shadow">
                <TextInput
                  className="font-semibold text-base mb-2"
                  value={activity.title}
                  onChangeText={(text) => {
                    const newActivities = [...activities];
                    newActivities[index] = { ...activity, title: text };
                    setActivities(newActivities);
                  }}
                />
                <TextInput
                  className="text-gray-600"
                  value={activity.description}
                  multiline
                  onChangeText={(text) => {
                    const newActivities = [...activities];
                    newActivities[index] = { ...activity, description: text };
                    setActivities(newActivities);
                  }}
                />
              </View>
            </View>
          ))}
        </View>

        {/* Add Activity Button */}
        <TouchableOpacity
          className="mt-6 flex-row items-center justify-center p-4 border border-blue-600 border-dashed rounded-lg"
          onPress={() => {
            setActivities([
              ...activities,
              {
                id: Date.now().toString(),
                time: "00:00",
                title: "Hoạt động mới",
                description: "Thêm mô tả",
              },
            ]);
          }}
        >
          <IconSymbol name="plus" size={20} color="#2563EB" />
          <ThemedText className="ml-2 text-blue-600">Thêm hoạt động</ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </ThemedView>
  );
}
