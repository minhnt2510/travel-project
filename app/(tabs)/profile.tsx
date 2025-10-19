import { View, TouchableOpacity, ScrollView } from "react-native";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { ThemedView } from "@/ui-components/themed-view";
import { ThemedText } from "@/ui-components/themed-text";
import { IconSymbol } from "@/ui-components/ui/icon-symbol";

export default function ProfileScreen() {
  const userStats = [
    { label: "Chuyến đi", value: "12" },
    { label: "Đánh giá", value: "28" },
    { label: "Điểm thưởng", value: "2,450" },
  ];

  const menuItems: { icon: string; label: string; href: string }[] = [
    { icon: "user", label: "Thông tin cá nhân", href: "/screens/ReviewCreate" },
    { icon: "heart", label: "Danh sách yêu thích", href: "/(tabs)/wishlist" },
    {
      icon: "credit-card",
      label: "Phương thức thanh toán",
      href: "/screens/Checkout",
    },
    { icon: "settings", label: "Cài đặt", href: "/screens/Search" },
    {
      icon: "help-circle",
      label: "Trợ giúp & Hỗ trợ",
      href: "/screens/Search",
    },
    { icon: "info", label: "Về chúng tôi", href: "/screens/Search" },
  ];

  return (
    <ThemedView className="flex-1">
      <ScrollView>
        {/* Header hồ sơ */}
        <View className="bg-blue-600 p-6">
          <View className="items-center">
            <Image
              source={{ uri: "https://placekitten.com/200/200" }}
              className="w-24 h-24 rounded-full"
            />
            <ThemedText className="text-white text-xl font-bold mt-4">
              Nguyễn Văn A
            </ThemedText>
            <ThemedText className="text-blue-100">
              nguyenvana@example.com
            </ThemedText>
          </View>

          {/* Thống kê */}
          <View className="flex-row justify-between mt-6 bg-white/10 rounded-lg p-4">
            {userStats.map((stat, idx) => (
              <View key={idx} className="items-center">
                <ThemedText className="text-white text-lg font-bold">
                  {stat.value}
                </ThemedText>
                <ThemedText className="text-blue-100">{stat.label}</ThemedText>
              </View>
            ))}
          </View>
        </View>

        {/* Menu */}
        <View className="p-4">
          {menuItems.map((item, idx) => (
            <Link key={idx} href={item.href as any} asChild>
              <TouchableOpacity className="flex-row items-center py-4 border-b border-gray-100">
                <IconSymbol name={item.icon} size={24} color="#4B5563" />
                <ThemedText className="flex-1 ml-4">{item.label}</ThemedText>
                <IconSymbol name="chevron-right" size={24} color="#9CA3AF" />
              </TouchableOpacity>
            </Link>
          ))}
        </View>

        {/* Đăng xuất */}
        <View className="p-4">
          <TouchableOpacity
            className="flex-row items-center justify-center py-3 bg-red-600 rounded-lg"
            onPress={() => {}}
          >
            <IconSymbol name="log-out" size={20} color="#FFF" />
            <ThemedText className="text-white ml-2">Đăng xuất</ThemedText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ThemedView>
  );
}
