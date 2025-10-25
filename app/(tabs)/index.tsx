import { useState } from "react";
import { ThemedText } from "@/ui-components/themed-text";
import { ThemedView } from "@/ui-components/themed-view";
import { IconSymbol } from "@/ui-components/ui/icon-symbol";
import { Image } from "expo-image";
import { router } from "expo-router";
import {
  Modal,
  Pressable,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { IMAGES } from "../Util_Images";

export default function HomeScreen() {
  const [menuVisible, setMenuVisible] = useState(false);

  const topDestinations = [
    { id: "1", name: "Đà Lạt", image: IMAGES.dalat, count: "150+ địa điểm" },
    {
      id: "2",
      name: "Phú Quốc",
      image: IMAGES.phuquoc,
      count: "120+ địa điểm",
    },
    { id: "3", name: "Hội An", image: IMAGES.hoian, count: "90+ địa điểm" },
  ];

  const featuredTours = [
    {
      id: "1",
      destinationId: "1",
      name: "Tour Đà Lạt 3N2Đ",
      image: IMAGES.dalat2n1d,
      price: "2,500,000đ",
      rating: 4.8,
      reviews: 128,
    },
    {
      id: "2",
      destinationId: "2",
      name: "Tour Phú Quốc 4N3Đ",
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
      price: "5,500,000đ",
      rating: 4.9,
      reviews: 256,
    },
  ];

  const hotDeals = [
    {
      id: "1",
      destinationId: "1",
      name: "Dalat Palace",
      type: "Khách sạn",
      image:
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
      price: "1,800,000đ",
      discount: "20%",
    },
    {
      id: "2",
      destinationId: "4",
      name: "Tour Hạ Long",
      type: "Tour",
      image:
        "https://images.unsplash.com/photo-1540979388649-3c0e1210f2ea?w=800",
      price: "3,500,000đ",
      discount: "15%",
    },
  ];

  const openDetail = (destinationId: string) => {
    router.push({
      pathname: "/screens/destinations/HotelDetail",
      params: { destinationId },
    });
  };

  return (
    <ThemedView className="flex-1">
      <ScrollView>
        {/* Header: chỉ có ô tìm kiếm (trái) + icon người dùng (phải) */}
        <View className="bg-blue-600 px-4 pt-4 pb-4">
          <View className="flex-row items-center">
            <TouchableOpacity className="flex-1 bg-white rounded-full px-4 py-3 flex-row items-center">
              <IconSymbol name="search" size={20} color="#6B7280" />
              <ThemedText className="ml-2 text-gray-500">
                Tìm kiếm điểm đến, khách sạn...
              </ThemedText>
            </TouchableOpacity>

            {/* Icon người dùng bên phải thanh tìm kiếm */}
            <TouchableOpacity
              onPress={() => setMenuVisible(true)}
              className="ml-3 w-11 h-11 rounded-full items-center justify-center bg-white/20"
              accessibilityLabel="Mở menu người dùng"
            >
              <IconSymbol name="person" size={22} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Top Destinations */}
        <View className="p-4">
          <View className="flex-row justify-between items-center mb-4">
            <ThemedText className="text-xl font-bold">
              Điểm đến phổ biến
            </ThemedText>
            <TouchableOpacity
              onPress={() =>
                router.push("/screens/destinations/AllDestinations")
              }
            >
              <ThemedText className="text-blue-600">Xem tất cả</ThemedText>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {topDestinations.map((d) => (
              <TouchableOpacity
                key={d.id}
                className="mr-4 w-40"
                onPress={() => openDetail(d.id)}
              >
                <Image
                  source={d.image}
                  className="w-40 h-40 rounded-lg"
                  contentFit="cover"
                />
                <ThemedText className="mt-2 font-semibold">{d.name}</ThemedText>
                <ThemedText className="text-gray-600 text-sm">
                  {d.count}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Featured Tours */}
        <View className="p-4">
          <View className="flex-row justify-between items-center mb-4">
            <ThemedText className="text-xl font-bold">Tour nổi bật</ThemedText>
            <TouchableOpacity
              onPress={() => router.push("/screens/tours/AllTours")}
            >
              <ThemedText className="text-blue-600">Xem tất cả</ThemedText>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {featuredTours.map((tour) => (
              <TouchableOpacity
                key={tour.id}
                className="mr-4 w-72 bg-white rounded-lg shadow"
                onPress={() => openDetail(tour.destinationId)}
              >
                <Image
                  source={tour.image}
                  className="w-72 h-48 rounded-t-lg"
                  contentFit="cover"
                />
                <View className="p-3">
                  <ThemedText className="text-lg font-semibold">
                    {tour.name}
                  </ThemedText>
                  <View className="flex-row items-center mt-1">
                    <IconSymbol name="star" size={16} color="#FFB800" />
                    <ThemedText className="ml-1 text-gray-600">
                      {tour.rating} ({tour.reviews} đánh giá)
                    </ThemedText>
                  </View>
                  <ThemedText className="text-blue-600 font-semibold mt-2">
                    {tour.price}
                  </ThemedText>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Hot Deals */}
        <View className="p-4">
          <View className="flex-row justify-between items-center mb-4">
            <ThemedText className="text-xl font-bold">Ưu đãi hot</ThemedText>
            <TouchableOpacity
              onPress={() => router.push("/screens/deals/AllDeals")}
            >
              <ThemedText className="text-blue-600">Xem tất cả</ThemedText>
            </TouchableOpacity>
          </View>

          {hotDeals.map((deal) => (
            <TouchableOpacity
              key={deal.id}
              className="mb-4 bg-white rounded-lg shadow overflow-hidden"
              onPress={() => openDetail(deal.destinationId)}
            >
              <View className="flex-row">
                <Image
                  source={{ uri: deal.image }}
                  className="w-24 h-24"
                  contentFit="cover"
                />
                <View className="flex-1 p-3">
                  <View className="flex-row justify-between items-start">
                    <View>
                      <ThemedText className="font-semibold">
                        {deal.name}
                      </ThemedText>
                      <ThemedText className="text-gray-600 text-sm">
                        {deal.type}
                      </ThemedText>
                    </View>
                    <View className="bg-red-100 px-2 py-1 rounded">
                      <ThemedText className="text-red-600">
                        Giảm {deal.discount}
                      </ThemedText>
                    </View>
                  </View>
                  <ThemedText className="text-blue-600 font-semibold mt-2">
                    {deal.price}
                  </ThemedText>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* MENU NGƯỜI DÙNG (Bottom sheet đơn giản) */}
      <Modal
        transparent
        visible={menuVisible}
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        {/* overlay */}
        <Pressable
          className="flex-1 bg-black/40"
          onPress={() => setMenuVisible(false)}
        >
          <View className="flex-1 justify-end" />
        </Pressable>

        {/* sheet */}
        <View className="bg-white rounded-t-2xl p-4 pb-8">
          <View className="w-12 h-1.5 bg-gray-300 self-center rounded-full mb-3" />
          <MenuItem
            icon="person"
            label="Hồ sơ cá nhân"
            onPress={() => {
              setMenuVisible(false);
              router.push("/(tabs)/profile");
            }}
          />
          <MenuItem
            icon="calendar"
            label="Đơn đặt gần đây"
            onPress={() => {
              setMenuVisible(false);
              router.push("/(tabs)/bookings");
            }}
          />
          <MenuItem
            icon="bell"
            label="Thông báo"
            onPress={() => {
              setMenuVisible(false);
              router.push("/screens/notifications/Notifications");
            }}
          />
          <MenuItem
            icon="arrow.right.square"
            label="Đăng xuất"
            onPress={() => {
              setMenuVisible(false);
              router.push("/(auth)/login");
            }}
          />
        </View>
      </Modal>
    </ThemedView>
  );
}

/** Item dòng trong menu người dùng */
function MenuItem({
  icon,
  label,
  onPress,
}: {
  icon: string;
  label: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity onPress={onPress} className="flex-row items-center py-3">
      <IconSymbol name={icon} size={20} color="#111827" />
      <ThemedText className="ml-3 text-base">{label}</ThemedText>
    </TouchableOpacity>
  );
}
