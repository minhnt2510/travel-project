import { ThemedText } from "@/ui-components/themed-text";
import { ThemedView } from "@/ui-components/themed-view";
import { IconSymbol } from "@/ui-components/ui/icon-symbol";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, FlatList, TouchableOpacity, View } from "react-native";
import IMAGES from "../Util_Images";

interface WishlistItem {
  id: string;
  name: string;
  location: string;
  image: string;
  price: string;
  type: "tour" | "hotel";
}

const WISHLIST_STORAGE_KEY = "wishlist_items";

const defaultWishlistItems: WishlistItem[] = [
  {
    id: "1",
    name: "Tour Đà Lạt 3N2Đ",
    location: "Đà Lạt, Lâm Đồng",
    image: IMAGES.dalat,
    price: "2,500,000đ",
    type: "tour",
  },
  {
    id: "2",
    name: "Dalat Palace Heritage",
    location: "Đà Lạt, Lâm Đồng",
    image: IMAGES.dalat,
    price: "1,800,000đ/đêm",
    type: "hotel",
  },
  {
    id: "3",
    name: "Tour Phú Quốc 4N3Đ",
    location: "Phú Quốc, Kiên Giang",
    image: "https://placekitten.com/300/202",
    price: "5,500,000đ",
    type: "tour",
  },
];

export default function WishlistScreen() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Load wishlist from storage on component mount
  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    try {
      const storedItems = await AsyncStorage.getItem(WISHLIST_STORAGE_KEY);
      if (storedItems) {
        setWishlistItems(JSON.parse(storedItems));
      } else {
        // Initialize with default items for demo
        setWishlistItems(defaultWishlistItems);
        await AsyncStorage.setItem(
          WISHLIST_STORAGE_KEY,
          JSON.stringify(defaultWishlistItems)
        );
      }
    } catch (error) {
      console.error("Error loading wishlist:", error);
      setWishlistItems(defaultWishlistItems);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (itemId: string) => {
    Alert.alert(
      "Xóa khỏi danh sách yêu thích",
      "Bạn có chắc chắn muốn xóa item này khỏi danh sách yêu thích?",
      [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Xóa",
          style: "destructive",
          onPress: async () => {
            try {
              const updatedItems = wishlistItems.filter(
                (item) => item.id !== itemId
              );
              setWishlistItems(updatedItems);
              await AsyncStorage.setItem(
                WISHLIST_STORAGE_KEY,
                JSON.stringify(updatedItems)
              );
            } catch (error) {
              console.error("Error removing from wishlist:", error);
            }
          },
        },
      ]
    );
  };

  const handleItemPress = (item: WishlistItem) => {
    if (item.type === "tour") {
      router.push(`/screens/bookings/TripDetail?id=${item.id}`);
    } else {
      router.push(`/screens/destinations/HotelDetail?id=${item.id}`);
    }
  };

  const handleBookingPress = (item: WishlistItem) => {
    if (item.type === "tour") {
      router.push("/screens/cart/Checkout");
    } else {
      router.push("/screens/cart/Checkout");
    }
  };

  const renderEmptyState = () => (
    <View className="flex-1 items-center justify-center p-8">
      <IconSymbol name="heart" size={64} color="#D1D5DB" />
      <ThemedText className="text-xl font-semibold text-gray-500 mt-4 mb-2">
        Danh sách yêu thích trống
      </ThemedText>
      <ThemedText className="text-gray-400 text-center">
        Hãy khám phá và thêm những tour du lịch hoặc khách sạn yêu thích vào đây
      </ThemedText>
      <TouchableOpacity
        className="bg-blue-600 px-6 py-3 rounded-lg mt-6"
        onPress={() => router.push("/")}
      >
        <ThemedText className="text-white font-semibold">
          Khám phá ngay
        </ThemedText>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <ThemedView className="flex-1 items-center justify-center">
        <ThemedText>Đang tải...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView className="flex-1">
      <View className="p-4 border-b border-gray-200">
        <ThemedText className="text-2xl font-bold">
          Danh sách yêu thích ({wishlistItems.length})
        </ThemedText>
      </View>

      {wishlistItems.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={wishlistItems}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              className="bg-white rounded-lg shadow-sm mb-4 overflow-hidden"
              onPress={() => handleItemPress(item)}
            >
              <View className="relative">
                <Image
                  source={{ uri: item.image }}
                  className="w-full h-48"
                  contentFit="cover"
                />
                <TouchableOpacity
                  className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full items-center justify-center"
                  onPress={() => removeFromWishlist(item.id)}
                >
                  <IconSymbol name="heart" size={20} color="#EF4444" />
                </TouchableOpacity>
                <View className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded">
                  <ThemedText className="text-white text-xs">
                    {item.type === "tour" ? "Tour" : "Khách sạn"}
                  </ThemedText>
                </View>
              </View>

              <View className="p-4">
                <ThemedText className="text-lg font-semibold mb-1">
                  {item.name}
                </ThemedText>
                <View className="flex-row items-center mb-2">
                  <IconSymbol name="map-pin" size={16} color="#6B7280" />
                  <ThemedText className="text-gray-600 ml-1">
                    {item.location}
                  </ThemedText>
                </View>
                <View className="flex-row justify-between items-center">
                  <ThemedText className="text-blue-600 font-semibold">
                    {item.price}
                  </ThemedText>
                  <TouchableOpacity
                    className="bg-blue-600 px-4 py-2 rounded"
                    onPress={() => handleBookingPress(item)}
                  >
                    <ThemedText className="text-white">
                      {item.type === "tour" ? "Đặt tour" : "Đặt phòng"}
                    </ThemedText>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </ThemedView>
  );
}
