import { View, ScrollView, TouchableOpacity } from "react-native";
import { ThemedView } from "@/ui-components/themed-view";
import { ThemedText } from "@/ui-components/themed-text";
import { IconSymbol } from "@/ui-components/ui/icon-symbol";
import { useUser } from "../_layout";
import { router } from "expo-router";

interface StatCard {
  title: string;
  value: string;
  change: string;
  icon: string;
  color: string;
}

const stats: StatCard[] = [
  {
    title: "Tổng doanh thu",
    value: "125.6M",
    change: "+12.3%",
    icon: "trending-up",
    color: "bg-blue-500",
  },
  {
    title: "Đơn hàng mới",
    value: "54",
    change: "+8.1%",
    icon: "shopping-bag",
    color: "bg-green-500",
  },
  {
    title: "Khách hàng mới",
    value: "189",
    change: "+5.4%",
    icon: "users",
    color: "bg-purple-500",
  },
  {
    title: "Đánh giá mới",
    value: "32",
    change: "+2.5%",
    icon: "star",
    color: "bg-yellow-500",
  },
];

// TODO: Refactor phần header/stats ra component riêng để tái sử dụng cho các tab admin khác
export default function AdminDashboard() {
  const { setUser } = useUser();

  return (
    <ThemedView className="flex-1">
      {/* Header */}
      <View className="p-4 border-b border-gray-200 flex-row items-center justify-between">
        <View>
          <ThemedText className="text-2xl font-bold">
            Quản lý hệ thống
          </ThemedText>
          <ThemedText className="text-gray-600">
            Xem tổng quan hoạt động của hệ thống
          </ThemedText>
        </View>
        <TouchableOpacity
          onPress={() => {
            setUser(null);
            router.replace("/(auth)/login");
          }}
          className="bg-red-100 p-2 rounded-full ml-4"
        >
          <IconSymbol name="log-out" size={20} color="#dc2626" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 p-4">
        {/* Stats Grid */}
        <View className="flex-row flex-wrap justify-between">
          {stats.map((stat, index) => (
            <View
              key={index}
              className="w-[48%] bg-white rounded-lg shadow p-4 mb-4"
            >
              <View
                className={`w-10 h-10 ${stat.color} rounded-lg items-center justify-center mb-2`}
              >
                <IconSymbol name={stat.icon} size={20} color="#FFF" />
              </View>
              <ThemedText className="text-gray-600 text-sm">
                {stat.title}
              </ThemedText>
              <View className="flex-row items-center justify-between mt-1">
                <ThemedText className="text-xl font-bold">
                  {stat.value}
                </ThemedText>
                <ThemedText className="text-green-600 text-sm">
                  {stat.change}
                </ThemedText>
              </View>
            </View>
          ))}
        </View>

        {/* Recent Orders */}
        <View className="bg-white rounded-lg shadow p-4 mb-4">
          <ThemedText className="text-lg font-bold mb-4">
            Đơn hàng gần đây
          </ThemedText>
          {[1, 2, 3].map((order) => (
            <View
              key={order}
              className="flex-row items-center justify-between py-3 border-b border-gray-100"
            >
              <View>
                <ThemedText className="font-semibold">
                  Tour Đà Lạt #{order}
                </ThemedText>
                <ThemedText className="text-gray-600 text-sm">
                  2 người • 3N2Đ
                </ThemedText>
              </View>
              <ThemedText className="text-blue-600 font-semibold">
                5,000,000đ
              </ThemedText>
            </View>
          ))}
        </View>

        {/* Popular Tours */}
        <View className="bg-white rounded-lg shadow p-4">
          <ThemedText className="text-lg font-bold mb-4">
            Tour phổ biến
          </ThemedText>
          {[1, 2, 3].map((tour) => (
            <View
              key={tour}
              className="flex-row items-center justify-between py-3 border-b border-gray-100"
            >
              <View>
                <ThemedText className="font-semibold">
                  {`Tour ${
                    tour === 1 ? "Đà Lạt" : tour === 2 ? "Phú Quốc" : "Hạ Long"
                  }`}
                </ThemedText>
                <ThemedText className="text-gray-600 text-sm">
                  {`${30 - tour * 5} lượt đặt`}
                </ThemedText>
              </View>
              <View className="flex-row items-center">
                <IconSymbol name="star" size={16} color="#FFB800" />
                <ThemedText className="ml-1">
                  {`${5 - (tour - 1) * 0.2}`}
                </ThemedText>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </ThemedView>
  );
}
