import { View, ScrollView, TouchableOpacity, TextInput } from "react-native";
import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Image } from "expo-image";

interface ChatMessage {
  id: string;
  sender: "user" | "support";
  message: string;
  time: string;
}

const messages: ChatMessage[] = [
  {
    id: "1",
    sender: "support",
    message: "Xin chào! Tôi có thể giúp gì cho bạn?",
    time: "10:00",
  },
  {
    id: "2",
    sender: "user",
    message: "Tôi cần hỗ trợ về tour Đà Lạt đã đặt",
    time: "10:01",
  },
  {
    id: "3",
    sender: "support",
    message: "Vâng, bạn vui lòng cho biết mã đơn hàng để tôi kiểm tra giúp",
    time: "10:02",
  },
];

export default function Chat() {
  return (
    <ThemedView className="flex-1">
      {/* Header */}
      <View className="p-4 border-b border-gray-200">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => {}}>
            <IconSymbol name="arrow-left" size={24} color="#000" />
          </TouchableOpacity>
          <View className="flex-row items-center ml-4">
            <View className="w-10 h-10 rounded-full bg-blue-100 items-center justify-center">
              <IconSymbol name="headphones" size={20} color="#3B82F6" />
            </View>
            <View className="ml-3">
              <ThemedText className="font-semibold">
                Hỗ trợ khách hàng
              </ThemedText>
              <ThemedText className="text-green-600 text-sm">
                Đang hoạt động
              </ThemedText>
            </View>
          </View>
        </View>
      </View>

      {/* Chat Messages */}
      <ScrollView className="flex-1 p-4">
        {messages.map((message) => (
          <View
            key={message.id}
            className={`mb-4 flex-row ${
              message.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {message.sender === "support" && (
              <View className="w-8 h-8 rounded-full bg-blue-100 items-center justify-center mr-2">
                <IconSymbol name="headphones" size={16} color="#3B82F6" />
              </View>
            )}
            <View
              className={`px-4 py-3 rounded-lg max-w-[80%] ${
                message.sender === "user" ? "bg-blue-600" : "bg-gray-100"
              }`}
            >
              <ThemedText
                className={
                  message.sender === "user" ? "text-white" : "text-gray-800"
                }
              >
                {message.message}
              </ThemedText>
              <ThemedText
                className={`text-xs mt-1 ${
                  message.sender === "user" ? "text-blue-100" : "text-gray-500"
                }`}
              >
                {message.time}
              </ThemedText>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Input Area */}
      <View className="p-4 border-t border-gray-200">
        <View className="flex-row items-center">
          <TouchableOpacity className="mr-2">
            <IconSymbol name="image" size={24} color="#6B7280" />
          </TouchableOpacity>
          <View className="flex-1 bg-gray-100 rounded-full px-4 py-2 flex-row items-center">
            <TextInput
              className="flex-1"
              placeholder="Nhập tin nhắn..."
              multiline
            />
            <TouchableOpacity className="ml-2">
              <IconSymbol name="send" size={20} color="#3B82F6" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ThemedView>
  );
}
