import { useState } from "react";
import { ThemedText } from "@/ui-components/themed-text";
import { ThemedView } from "@/ui-components/themed-view";
import { IconSymbol } from "@/ui-components/ui/icon-symbol";
import { router } from "expo-router";
import {
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useUser } from "@/app/_layout";

interface MenuItem {
  icon: string;
  label: string;
  description?: string;
  route: string;
  color: string[];
  badge?: number;
}

export default function MoreScreen() {
  const { user } = useUser();

  const menuSections: { title: string; items: MenuItem[] }[] = [
    {
      title: "Khám phá",
      items: [
        {
          icon: "tag",
          label: "Ưu đãi",
          description: "Tour giảm giá hot",
          route: "/(tabs)/deals",
          color: ['#ef4444', '#f97316'],
        },
        {
          icon: "heart",
          label: "Yêu thích",
          description: "Tour đã lưu",
          route: "/(tabs)/wishlist",
          color: ['#ec4899', '#db2777'],
        },
      ],
    },
    {
      title: "Tài khoản",
      items: [
        {
          icon: "bell",
          label: "Thông báo",
          description: "Tin tức và cập nhật",
          route: "/(tabs)/notifications",
          color: ['#3b82f6', '#2563eb'],
          badge: user ? undefined : undefined, // Có thể thêm số thông báo chưa đọc
        },
        {
          icon: "check-circle",
          label: "Lịch sử",
          description: "Chuyến đi đã hoàn thành",
          route: "/(tabs)/history",
          color: ['#10b981', '#059669'],
        },
        ...(user?.role === "staff" ? [{
          icon: "briefcase",
          label: "Staff Dashboard",
          description: "Quản lý vận hành",
          route: "/screens/StaffDashboard",
          color: ['#10b981', '#059669'],
        }] : []),
        ...(user?.role === "admin" ? [{
          icon: "shield",
          label: "Admin Dashboard",
          description: "Quản lý hệ thống",
          route: "/screens/AdminDashboard",
          color: ['#8b5cf6', '#7c3aed'],
        }] : []),
      ],
    },
    {
      title: "Hỗ trợ",
      items: [
        {
          icon: "sparkles",
          label: "AI Trợ lý",
          description: "Chat với trợ lý du lịch",
          route: "/screens/chat/Chat",
          color: ['#667eea', '#764ba2'],
        },
        {
          icon: "help-circle",
          label: "Trợ giúp",
          description: "Câu hỏi thường gặp",
          route: "/(tabs)/profile",
          color: ['#f59e0b', '#d97706'],
        },
        {
          icon: "info",
          label: "Về chúng tôi",
          description: "Thông tin ứng dụng",
          route: "/(tabs)/profile",
          color: ['#64748b', '#475569'],
        },
      ],
    },
  ];

  const handlePress = (route: string) => {
    router.push(route as any);
  };

  return (
    <ThemedView className="flex-1 bg-gray-50">
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        className="px-4 pt-16 pb-8 rounded-b-3xl"
      >
        <ThemedText className="text-white text-3xl font-extrabold mb-2">
          Thêm tính năng ⚡
        </ThemedText>
        <ThemedText className="text-white/90 text-base font-medium">
          Khám phá tất cả tính năng của app
        </ThemedText>
      </LinearGradient>

      <ScrollView 
        className="flex-1 px-4 pt-6"
        showsVerticalScrollIndicator={false}
      >
        {menuSections.map((section, sectionIdx) => (
          <View key={sectionIdx} className="mb-6">
            <Animated.View
              entering={FadeInDown.delay(sectionIdx * 100).duration(500)}
            >
              <ThemedText className="text-lg font-extrabold text-gray-900 mb-3">
                {section.title}
              </ThemedText>

              {section.items.map((item, itemIdx) => (
                <Animated.View
                  key={itemIdx}
                  entering={FadeInDown.delay((sectionIdx * 100 + itemIdx * 50)).duration(500)}
                >
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => handlePress(item.route)}
                    className="mb-3 overflow-hidden rounded-2xl shadow-lg"
                  >
                    <View className="bg-white p-4 flex-row items-center">
                      <View className="w-14 h-14 rounded-2xl overflow-hidden mr-4">
                        <LinearGradient
                          colors={item.color as [string, string, ...string[]]}
                          className="w-full h-full items-center justify-center"
                        >
                          <IconSymbol name={item.icon} size={26} color="#FFF" />
                        </LinearGradient>
                      </View>
                      
                      <View className="flex-1">
                        <View className="flex-row items-center">
                          <ThemedText className="text-gray-900 font-extrabold text-base mr-2">
                            {item.label}
                          </ThemedText>
                          {item.badge && (
                            <View className="bg-red-500 px-2 py-0.5 rounded-full">
                              <ThemedText className="text-white text-xs font-bold">
                                {item.badge}
                              </ThemedText>
                            </View>
                          )}
                        </View>
                        {item.description && (
                          <ThemedText className="text-gray-600 text-sm mt-0.5">
                            {item.description}
                          </ThemedText>
                        )}
                      </View>

                      <IconSymbol name="chevron-right" size={20} color="#9ca3af" />
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </Animated.View>
          </View>
        ))}

        <View className="h-8" />
      </ScrollView>
    </ThemedView>
  );
}

