import { api, type Destination } from "@/services/api";
import { ThemedText } from "@/ui-components/themed-text";
import { ThemedView } from "@/ui-components/themed-view";
import { IconSymbol } from "@/ui-components/ui/icon-symbol";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Destination[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Animation
  const fade = useSharedValue(0);
  const bannerY = useSharedValue(30);

  useEffect(() => {
    loadDestinations();
    fade.value = withTiming(1, { duration: 800 });
    bannerY.value = withSpring(0, { damping: 18 });
  }, []);

  const loadDestinations = async () => {
    try {
      setLoading(true);
      const data = await api.getDestinations();
      setDestinations(data);
    } catch {
      Alert.alert("Lỗi", "Không thể tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim().length > 0) {
      setIsSearching(true);
      try {
        const results = await api.searchDestinations(query);
        setSearchResults(results);
      } catch {
        Alert.alert("Lỗi", "Không thể tìm kiếm");
      } finally {
        setIsSearching(false);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleDestinationPress = (destination: Destination) => {
    router.push({
      pathname: "/screens/HotelDetail",
      params: { destinationId: destination.id },
    });
  };

  const handleBookTrip = (destination: Destination) => {
    Alert.alert(
      "Đặt chuyến đi",
      `Bạn có muốn đặt chuyến đi đến ${destination.name}?`,
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Đặt ngay",
          onPress: () => Alert.alert("Thành công", "Đã đặt chuyến đi thành công!"),
        },
      ]
    );
  };

  const fadeStyle = useAnimatedStyle(() => ({ opacity: fade.value }));
  const bannerStyle = useAnimatedStyle(() => ({ transform: [{ translateY: bannerY.value }] }));

  if (loading) {
    return (
      <ThemedView className="flex-1 justify-center items-center bg-slate-900">
        <ActivityIndicator size="large" color="#3b82f6" />
        <ThemedText className="mt-4 text-gray-300 font-semibold">
          Đang tải dữ liệu...
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView className="flex-1 bg-slate-900">
      {/* Gradient Header */}
      <View className="absolute top-0 left-0 right-0 h-56 bg-gradient-to-b from-blue-900 via-blue-800 to-slate-900" />

      <ScrollView showsVerticalScrollIndicator={false}>
        <Animated.View style={[fadeStyle]}>
          {/* === HEADER: DARK MODE === */}
          <View className="px-6 pt-14 pb-6">
            {/* Tiêu đề chào */}
            <View className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/10">
              <View className="flex-row justify-between items-start">
                <View className="flex-1">
                  <ThemedText className="text-white text-lg font-semibold">
                    Xin chào,
                  </ThemedText>
                  <ThemedText className="text-white text-3xl font-extrabold mt-1 leading-tight">
                    Nguyễn Văn A
                  </ThemedText>
                </View>
                <TouchableOpacity className="relative">
                  <View className="bg-white/20 backdrop-blur-sm rounded-full p-3 shadow-lg">
                    <IconSymbol name="bell" size={28} color="#FFF" />
                    <View className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-slate-900" />
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            {/* Search Bar */}
            <View className="mt-5 bg-gray-800 rounded-3xl px-5 py-4 flex-row items-center shadow-2xl border border-gray-700">
              <IconSymbol name="search" size={24} color="#9ca3af" />
              <TextInput
                className="ml-3 flex-1 text-white font-semibold text-base"
                placeholder="Tìm điểm đến, khách sạn..."
                placeholderTextColor="#6b7280"
                value={searchQuery}
                onChangeText={handleSearch}
              />
              {isSearching && <ActivityIndicator size="small" color="#3b82f6" />}
            </View>
          </View>

          {/* === BANNER === */}
          <Animated.View style={[bannerStyle]} className="mx-6 mb-8">
            <View className="bg-gray-800 rounded-3xl p-7 shadow-2xl border border-gray-700">
              <ThemedText className="text-white text-2xl font-extrabold mb-2">
                Khám phá Việt Nam
              </ThemedText>
              <ThemedText className="text-gray-300 text-base mb-5 leading-relaxed">
                Trải nghiệm những điểm đến tuyệt vời nhất với giá tốt nhất
              </ThemedText>
              <TouchableOpacity className="bg-blue-600 rounded-2xl px-7 py-3.5 self-start shadow-lg">
                <ThemedText className="text-white font-bold text-base">
                  Khám phá ngay
                </ThemedText>
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* === KẾT QUẢ TÌM KIẾM === */}
          {searchResults.length > 0 && (
            <View className="px-6 pb-6">
              <ThemedText className="text-xl font-extrabold text-white mb-5">
                Kết quả tìm kiếm ({searchResults.length})
              </ThemedText>
              {searchResults.map((d) => (
                <DestinationCard key={d.id} destination={d} onPress={handleDestinationPress} onBook={handleBookTrip} />
              ))}
            </View>
          )}

          {/* === NỘI DUNG CHÍNH === */}
          {searchResults.length === 0 && (
            <>
              <Section title="Điểm đến phổ biến" link="Xem tất cả">
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-6">
                  {destinations.map((d) => (
                    <PopularCard key={d.id} destination={d} onPress={handleDestinationPress} />
                  ))}
                </ScrollView>
              </Section>

              <Section title="Tour nổi bật" link="Xem tất cả">
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-6 pb-8">
                  {destinations.slice(0, 4).map((d) => (
                    <TourCard key={d.id} destination={d} onPress={handleDestinationPress} />
                  ))}
                </ScrollView>
              </Section>
            </>
          )}
        </Animated.View>
      </ScrollView>
    </ThemedView>
  );
}

// === SECTION ===
const Section = ({ title, link, children }: { title: string; link: string; children: React.ReactNode }) => (
  <View className="mb-7">
    <View className="flex-row justify-between items-center px-6 mb-4">
      <ThemedText className="text-xl font-extrabold text-white">{title}</ThemedText>
      <TouchableOpacity>
        <ThemedText className="text-blue-400 font-semibold text-base">{link}</ThemedText>
      </TouchableOpacity>
    </View>
    {children}
  </View>
);

// === CARD: ĐIỂM ĐẾN NHỎ ===
const PopularCard = ({ destination, onPress }: { destination: Destination; onPress: (d: Destination) => void }) => (
  <TouchableOpacity onPress={() => onPress(destination)} className="mr-5 w-44">
    <Image
      source={{ uri: destination.image }}
      placeholder={{ uri: "https://via.placeholder.com/176x176/1e293b/64748b?text=..." }}
      className="w-44 h-44 rounded-3xl"
      contentFit="cover"
    />
    <ThemedText className="mt-3 font-bold text-white text-base">{destination.name}</ThemedText>
    <ThemedText className="text-gray-400 text-sm">{destination.city}</ThemedText>
    <View className="flex-row items-center mt-1">
      <IconSymbol name="star" size={15} color="#fbbf24" />
      <ThemedText className="ml-1 text-gray-300 font-medium text-sm">{destination.rating}</ThemedText>
    </View>
  </TouchableOpacity>
);

// === CARD: TOUR NỔI BẬT ===
const TourCard = ({ destination, onPress }: { destination: Destination; onPress: (d: Destination) => void }) => (
  <TouchableOpacity onPress={() => onPress(destination)} className="mr-5 w-80">
    <View className="bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-gray-700">
      <Image
        source={{ uri: destination.image }}
        placeholder={{ uri: "https://via.placeholder.com/320x192/1e293b/64748b?text=..." }}
        className="w-80 h-48"
        contentFit="cover"
      />
      <View className="p-5">
        <ThemedText className="text-lg font-extrabold text-white">Tour {destination.name}</ThemedText>
        <View className="flex-row items-center mt-1">
          <IconSymbol name="star" size={16} color="#fbbf24" />
          <ThemedText className="ml-1 text-gray-300 font-medium">
            {destination.rating} ({destination.reviews} đánh giá)
          </ThemedText>
        </View>
        <ThemedText className="text-blue-400 font-extrabold text-xl mt-3">{destination.price}</ThemedText>
      </View>
    </View>
  </TouchableOpacity>
);

// === CARD: KẾT QUẢ TÌM KIẾM ===
const DestinationCard = ({
  destination,
  onPress,
  onBook,
}: {
  destination: Destination;
  onPress: (d: Destination) => void;
  onBook: (d: Destination) => void;
}) => (
  <TouchableOpacity
    onPress={() => onPress(destination)}
    className="mb-6 bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-gray-700"
  >
    <Image
      source={{ uri: destination.image }}
      placeholder={{ uri: "https://via.placeholder.com/320x200/1e293b/64748b?text=..." }}
      className="w-full h-56"
      contentFit="cover"
    />
    <View className="p-6">
      <ThemedText className="text-2xl font-extrabold text-white">{destination.name}</ThemedText>
      <ThemedText className="text-gray-400 mt-1 text-base">
        {destination.city}, {destination.country}
      </ThemedText>
      <View className="flex-row items-center mt-2">
        <IconSymbol name="star" size={17} color="#fbbf24" />
        <ThemedText className="ml-1 text-gray-300 font-medium">
          {destination.rating} ({destination.reviews} đánh giá)
        </ThemedText>
      </View>
      <View className="flex-row justify-between items-center mt-5">
        <ThemedText className="text-blue-400 font-extrabold text-3xl">{destination.price}</ThemedText>
        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation();
            onBook(destination);
          }}
          className="bg-blue-600 px-6 py-3.5 rounded-2xl shadow-lg"
        >
          <ThemedText className="text-white font-bold text-base">Đặt ngay</ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  </TouchableOpacity>
);