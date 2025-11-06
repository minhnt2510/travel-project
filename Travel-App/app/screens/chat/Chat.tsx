import { useState, useRef, useEffect } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { ThemedView } from "@/ui-components/themed-view";
import { ThemedText } from "@/ui-components/themed-text";
import { IconSymbol } from "@/ui-components/ui/icon-symbol";
import { router } from "expo-router";
import { api } from "@/services/api";
import { useUser } from "@/app/_layout";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown } from "react-native-reanimated";

interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  message: string;
  time: Date;
}

export default function Chat() {
  const { user } = useUser();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      sender: "bot",
      message: "Xin chào! Tôi là trợ lý du lịch của bạn. Tôi có thể giúp bạn tìm tour, kiểm tra booking, và trả lời các câu hỏi. Bạn cần hỗ trợ gì?",
      time: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    // Scroll to bottom when new message arrives
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      message: inputText.trim(),
      time: new Date(),
    };

    // Add user message immediately
    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      // Send to chatbot API
      const response = await api.sendChatMessage(userMessage.message);

      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        message: response.response,
        time: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error: any) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        message: "Xin lỗi, có lỗi xảy ra. Vui lòng thử lại sau.",
        time: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!user) {
    return (
      <ThemedView className="flex-1 justify-center items-center bg-gray-50 px-6">
        <IconSymbol name="lock" size={64} color="#9ca3af" />
        <ThemedText className="text-gray-600 text-lg font-semibold mt-4 text-center">
          Vui lòng đăng nhập để sử dụng chatbot
        </ThemedText>
        <TouchableOpacity
          onPress={() => router.push("/(auth)/login")}
          className="mt-6 bg-blue-600 px-6 py-3 rounded-full"
        >
          <ThemedText className="text-white font-semibold">Đăng nhập</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  return (
    <ThemedView className="flex-1 bg-gray-50">
      {/* Header */}
      <LinearGradient
        colors={["#667eea", "#764ba2"]}
        className="px-4 pt-16 pb-6 rounded-b-3xl"
      >
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()}>
            <IconSymbol name="arrow-left" size={24} color="#FFF" />
          </TouchableOpacity>
          <View className="flex-row items-center ml-4 flex-1">
            <View className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md items-center justify-center">
              <IconSymbol name="sparkles" size={24} color="#FFF" />
            </View>
            <View className="ml-3 flex-1">
              <ThemedText className="text-white text-lg font-extrabold">
                AI Trợ lý Du lịch
              </ThemedText>
              <ThemedText className="text-white/90 text-sm">
                Luôn sẵn sàng hỗ trợ
              </ThemedText>
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* Chat Messages */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
        keyboardVerticalOffset={90}
      >
        <ScrollView
          ref={scrollViewRef}
          className="flex-1 px-4 pt-4"
          showsVerticalScrollIndicator={false}
        >
          {messages.map((message, idx) => (
            <Animated.View
              key={message.id}
              entering={FadeInDown.delay(idx * 50).duration(300)}
              className={`mb-4 flex-row ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.sender === "bot" && (
                <View className="w-8 h-8 rounded-full bg-purple-100 items-center justify-center mr-2 self-end">
                  <IconSymbol name="sparkles" size={16} color="#667eea" />
                </View>
              )}
              <View
                className={`px-4 py-3 rounded-2xl max-w-[80%] ${
                  message.sender === "user"
                    ? "bg-blue-600 rounded-tr-sm"
                    : "bg-white rounded-tl-sm shadow-sm"
                }`}
              >
                <ThemedText
                  className={
                    message.sender === "user"
                      ? "text-white text-base"
                      : "text-gray-800 text-base"
                  }
                >
                  {message.message}
                </ThemedText>
                <ThemedText
                  className={`text-xs mt-1 ${
                    message.sender === "user"
                      ? "text-blue-100"
                      : "text-gray-500"
                  }`}
                >
                  {formatTime(message.time)}
                </ThemedText>
              </View>
              {message.sender === "user" && (
                <View className="w-8 h-8 rounded-full bg-blue-100 items-center justify-center ml-2 self-end">
                  <IconSymbol name="user" size={16} color="#3B82F6" />
                </View>
              )}
            </Animated.View>
          ))}

          {isLoading && (
            <View className="mb-4 flex-row items-center">
              <View className="w-8 h-8 rounded-full bg-purple-100 items-center justify-center mr-2">
                <IconSymbol name="sparkles" size={16} color="#667eea" />
              </View>
              <View className="bg-white px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm">
                <ActivityIndicator size="small" color="#667eea" />
              </View>
            </View>
          )}

          <View className="h-4" />
        </ScrollView>

        {/* Input Area */}
        <View className="px-4 pb-4 pt-2 bg-gray-50 border-t border-gray-200">
          <View className="flex-row items-end">
            <View className="flex-1 bg-white rounded-full px-4 py-3 flex-row items-center shadow-sm border border-gray-200">
              <TextInput
                className="flex-1 text-base"
                placeholder="Nhập câu hỏi của bạn..."
                placeholderTextColor="#9ca3af"
                value={inputText}
                onChangeText={setInputText}
                multiline
                maxLength={1000}
                onSubmitEditing={handleSend}
                editable={!isLoading}
              />
              <TouchableOpacity
                onPress={handleSend}
                disabled={!inputText.trim() || isLoading}
                className={`ml-2 p-2 rounded-full ${
                  inputText.trim() && !isLoading
                    ? "bg-blue-600"
                    : "bg-gray-300"
                }`}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <IconSymbol
                    name="arrow-right"
                    size={20}
                    color={inputText.trim() ? "#FFF" : "#9ca3af"}
                  />
                )}
              </TouchableOpacity>
            </View>
          </View>
          <ThemedText className="text-gray-400 text-xs mt-2 text-center">
            Gõ "giúp" để xem các câu hỏi tôi có thể trả lời
          </ThemedText>
        </View>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}
