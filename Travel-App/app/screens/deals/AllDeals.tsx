import { useState, useEffect } from "react";
import { ThemedText } from "@/ui-components/themed-text";
import { ThemedView } from "@/ui-components/themed-view";
import { IconSymbol } from "@/ui-components/ui/icon-symbol";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import {
  ScrollView,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
} from "react-native";
import Animated, { FadeInRight } from "react-native-reanimated";
import { api, type Tour, type Hotel } from "@/services/api";
import { hotelsApi } from "@/services/api/hotels";

interface Deal {
  id: string;
  name: string;
  type: "Tour" | "Khách sạn";
  image: string;
  price: string;
  originalPrice: string;
  discount: string;
  rating: number;
  reviews: number;
  description: string;
  tourId?: string;
  hotelId?: string;
}

export default function AllDealsScreen() {
  const [allDeals, setAllDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  // Fallback image khi image không load được - sử dụng một placeholder đẹp hơn
  const FALLBACK_IMAGE =
    "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&h=300&fit=crop";

  // Static data - không sử dụng nữa, chỉ để reference
  // Giờ dữ liệu được load từ API (tours từ seed.ts)
  const allDeals_static_UNUSED = [
    // 🔹 Dữ liệu Tour từ seed.ts
    {
      id: "tour1",
      name: "Khám phá Đà Lạt 3 ngày 2 đêm",
      type: "Tour",
      image:
        "https://d3pa5s1toq8zys.cloudfront.net/explore/wp-content/uploads/2023/10/Da-Lat.jpg",
      price: "2,500,000đ",
      originalPrice: "3,000,000đ",
      discount: "17%",
      rating: 4.8,
      reviews: 1250,
      description:
        "Tham quan Hồ Xuân Hương, Thung Lũng Tình Yêu, Chùa Linh Phước.",
    },
    {
      id: "tour2",
      name: "Đảo ngọc Phú Quốc - Resort 5 sao",
      type: "Tour",
      image:
        "https://bcp.cdnchinhphu.vn/334894974524682240/2025/6/23/phu-quoc-17506756503251936667562.jpg",
      price: "5,500,000đ",
      originalPrice: "7,000,000đ",
      discount: "21%",
      rating: 4.9,
      reviews: 2100,
      description:
        "Nghỉ dưỡng tại resort 5 sao, tham quan Bãi Sao, Bãi Dài và các hoạt động biển.",
    },
    {
      id: "tour3",
      name: "Vịnh Hạ Long - Cruise 2 ngày 1 đêm",
      type: "Tour",
      image:
        "https://hanoilionboutiquehotel.com/images/tour/2023/09/02/large/cruise-5-star_1693649770.jpeg",
      price: "3,200,000đ",
      originalPrice: "3,800,000đ",
      discount: "16%",
      rating: 4.9,
      reviews: 3200,
      description:
        "Du thuyền trên vịnh Hạ Long, tham quan hang động và thưởng thức hải sản.",
    },
    {
      id: "tour4",
      name: "Phố cổ Hội An - Ánh đèn lung linh",
      type: "Tour",
      image:
        "https://mia.vn/media/uploads/blog-du-lich/pho-co-hoi-an-11-1722915372.jpg",
      price: "1,800,000đ",
      originalPrice: "2,200,000đ",
      discount: "18%",
      rating: 4.7,
      reviews: 1800,
      description:
        "Khám phá phố cổ Hội An, thưởng thức ẩm thực và ngắm đèn lồng về đêm.",
    },
    {
      id: "tour5",
      name: "Sa Pa - Mùa vàng ruộng bậc thang",
      type: "Tour",
      image: "https://media.loveitopcdn.com/38104/dinh-nui-fansipan.jpg",
      price: "4,200,000đ",
      originalPrice: "5,000,000đ",
      discount: "16%",
      rating: 4.8,
      reviews: 1450,
      description: "Khám phá Fansipan, ruộng bậc thang và văn hóa dân tộc.",
    },
    {
      id: "tour6",
      name: "Đà Nẵng - Bà Nà Hills - Hội An",
      type: "Tour",
      image:
        "https://banahills.sunworld.vn/wp-content/uploads/2024/04/DJI_0004-1-scaled.jpg",
      price: "3,500,000đ",
      originalPrice: "4,200,000đ",
      discount: "17%",
      rating: 4.8,
      reviews: 2300,
      description:
        "Khám phá thành phố biển, Bà Nà Hills và cầu Vàng nổi tiếng.",
    },
    {
      id: "tour7",
      name: "Nha Trang biển xanh cát trắng",
      type: "Tour",
      image:
        "https://statics.vinpearl.com/Hinh-anh-Vinpearl-Resort-Nha-Trang_1680082155.jpg",
      price: "2,800,000đ",
      originalPrice: "3,400,000đ",
      discount: "18%",
      rating: 4.6,
      reviews: 980,
      description: "Lặn san hô, VinWonders Nha Trang, hải sản tươi ngon.",
    },
    {
      id: "tour8",
      name: "Huế - Di sản cố đô",
      type: "Tour",
      image:
        "https://vacationtravel.com.vn/storage/photos/1/kh%C3%A1m%20ph%C3%A1%20vi%E1%BB%87t%20nam/MIEN%20TRUNG/CODOHUE1_800.jpg",
      price: "2,100,000đ",
      originalPrice: "2,600,000đ",
      discount: "19%",
      rating: 4.7,
      reviews: 760,
      description: "Tham quan Đại Nội, chùa Thiên Mụ, ca Huế trên sông Hương.",
    },

    // 🔹 Dữ liệu Hotel từ seed.ts
    {
      id: "hotel1",
      name: "Vinpearl Resort & Spa Phú Quốc",
      type: "Khách sạn",
      image:
        "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/15/ee/ee/62/vinpearl-resort-spa-phu.jpg?w=900&h=-1&s=1",
      price: "2,400,000đ",
      originalPrice: "2,880,000đ",
      discount: "20%",
      rating: 4.7,
      reviews: 3200,
      description:
        "Resort 5 sao bên bờ biển với bãi biển riêng và spa cao cấp.",
    },
    {
      id: "hotel2",
      name: "InterContinental Danang Sun Peninsula",
      type: "Khách sạn",
      image:
        "https://duan-sungroup.com/wp-content/uploads/2022/12/intercontinental-da-nang-sun-peninsula-resort-leading.png",
      price: "9,500,000đ",
      originalPrice: "11,400,000đ",
      discount: "17%",
      rating: 4.9,
      reviews: 2100,
      description:
        "Khu nghỉ dưỡng 5 sao sang trọng tại bán đảo Sơn Trà với view biển tuyệt đẹp.",
    },
    {
      id: "hotel3",
      name: "Silk Path Grand Hue Hotel",
      type: "Khách sạn",
      image:
        "https://cf.bstatic.com/xdata/images/hotel/max1024x768/266420077.jpg?k=418cc8b870d26ab46d2da8fdbdd5c6499bcfb8a7409746f18862cd40f274c18f&o=",
      price: "1,800,000đ",
      originalPrice: "2,160,000đ",
      discount: "17%",
      rating: 4.6,
      reviews: 860,
      description:
        "Khách sạn 5 sao giữa lòng cố đô Huế, tiện nghi và sang trọng.",
    },
    {
      id: "hotel4",
      name: "FLC Luxury Resort Quy Nhơn",
      type: "Khách sạn",
      image:
        "https://cf.bstatic.com/xdata/images/hotel/max1024x768/359475229.jpg?k=69127903ce6837bd2a269a76cb00853b0561e5d963721a14aa050b37c6450bae&o=",
      price: "2,200,000đ",
      originalPrice: "2,640,000đ",
      discount: "17%",
      rating: 4.5,
      reviews: 540,
      description: "Resort ven biển với bãi biển riêng, spa và sân golf.",
    },
    {
      id: "hotel5",
      name: "Novotel Nha Trang",
      type: "Khách sạn",
      image:
        "https://d2e5ushqwiltxm.cloudfront.net/wp-content/uploads/sites/38/2024/10/30093116/Pool_17930-scaled.jpg",
      price: "1,500,000đ",
      originalPrice: "1,800,000đ",
      discount: "17%",
      rating: 4.4,
      reviews: 1200,
      description:
        "Khách sạn 4 sao trung tâm Trần Phú, view biển đẹp và tiện nghi.",
    },
  ];

  useEffect(() => {
    loadDeals();
  }, []);

  const loadDeals = async () => {
    try {
      setLoading(true);
      const deals: Deal[] = [];

      // Fetch tours có originalPrice (có discount)
      const { tours } = await api.getTours({ limit: 50 }); // Reduced from 100 to 50 for faster loading
      tours.forEach((tour: Tour) => {
        if (tour.originalPrice && tour.originalPrice > tour.price) {
          const discountPercent = Math.round(
            ((tour.originalPrice - tour.price) / tour.originalPrice) * 100
          );

          // Get image URL - try multiple sources
          let imageUrl = FALLBACK_IMAGE;
          if (tour.imageUrl) {
            imageUrl = tour.imageUrl;
          } else if (tour.images && tour.images.length > 0) {
            imageUrl = tour.images[0];
          }

          // Log if image is missing for debugging
          if (!tour.imageUrl && (!tour.images || tour.images.length === 0)) {
            console.warn(`Tour "${tour.title}" (${tour._id}) missing image`);
          }

          deals.push({
            id: tour._id,
            name: tour.title,
            type: "Tour",
            image: imageUrl,
            price: tour.price.toLocaleString("vi-VN") + "đ",
            originalPrice: tour.originalPrice.toLocaleString("vi-VN") + "đ",
            discount: `${discountPercent}%`,
            rating: tour.rating,
            reviews: tour.reviewCount,
            description: tour.description,
            tourId: tour._id,
          });
        }
      });

      // Fetch hotels có discount (tạm thời chưa có originalPrice trong Hotel model, sẽ skip)
      // Có thể thêm logic sau khi Hotel model có originalPrice

      // Sort by discount percent (descending)
      deals.sort((a, b) => {
        const aDiscount = parseInt(a.discount.replace("%", ""));
        const bDiscount = parseInt(b.discount.replace("%", ""));
        return bDiscount - aDiscount;
      });

      setAllDeals(deals);
    } catch (error) {
      console.error("Error loading deals:", error);
      Alert.alert("Lỗi", "Không thể tải danh sách ưu đãi");
    } finally {
      setLoading(false);
    }
  };

  const filteredDeals = allDeals.filter((deal) => {
    if (selectedFilter === "all") return true;
    if (selectedFilter === "tour") return deal.type === "Tour";
    if (selectedFilter === "hotel") return deal.type === "Khách sạn";
    if (selectedFilter === "20+") {
      const discount = parseInt(deal.discount.replace("%", ""));
      return discount >= 20;
    }
    return true;
  });

  const openDetail = (deal: Deal) => {
    // Chỉ navigate nếu có tourId/hotelId hợp lệ (MongoDB ObjectId)
    if (deal.tourId && deal.tourId.match(/^[0-9a-fA-F]{24}$/)) {
      router.push({
        pathname: "/screens/destinations/HotelDetail",
        params: { destinationId: deal.tourId },
      });
    } else {
      Alert.alert("Thông báo", "Không thể xem chi tiết ưu đãi này");
    }
  };

  return (
    <ThemedView className="flex-1">
      {/* Header with Gradient */}
      <LinearGradient
        colors={
          ["#ef4444", "#dc2626", "#b91c1c"] as [string, string, ...string[]]
        }
        className="p-4 pt-12"
      >
        <View className="flex-row items-center mb-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full bg-white/20 items-center justify-center"
          >
            <IconSymbol name="arrow-left" size={24} color="#FFF" />
          </TouchableOpacity>
          <ThemedText className="text-white text-2xl font-bold ml-4 flex-1">
            Ưu đãi hot 🔥
          </ThemedText>
        </View>

        {/* Search Bar */}
        <TouchableOpacity
          className="bg-white rounded-2xl px-4 py-3.5 flex-row items-center shadow-lg"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          <IconSymbol name="search" size={20} color="#6B7280" />
          <ThemedText className="ml-2 text-gray-500 flex-1">
            Tìm kiếm ưu đãi...
          </ThemedText>
        </TouchableOpacity>
      </LinearGradient>

      {/* Filter Bar */}
      <View className="p-4 bg-white border-b border-gray-100 shadow-sm">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row space-x-3">
            <TouchableOpacity
              onPress={() => setSelectedFilter("all")}
              className={`px-5 py-2.5 rounded-full ${
                selectedFilter === "all"
                  ? "bg-red-500 shadow-lg"
                  : "bg-gray-100 border border-gray-200"
              }`}
              style={
                selectedFilter === "all"
                  ? {
                      shadowColor: "#ef4444",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.3,
                      shadowRadius: 4,
                      elevation: 4,
                    }
                  : {}
              }
            >
              <ThemedText
                className={`text-sm font-semibold ${
                  selectedFilter === "all" ? "text-white" : "text-gray-700"
                }`}
              >
                Tất cả
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setSelectedFilter("hotel")}
              className={`px-5 py-2.5 rounded-full ${
                selectedFilter === "hotel"
                  ? "bg-red-500 shadow-lg"
                  : "bg-gray-100 border border-gray-200"
              }`}
              style={
                selectedFilter === "hotel"
                  ? {
                      shadowColor: "#ef4444",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.3,
                      shadowRadius: 4,
                      elevation: 4,
                    }
                  : {}
              }
            >
              <ThemedText
                className={`text-sm font-semibold ${
                  selectedFilter === "hotel" ? "text-white" : "text-gray-700"
                }`}
              >
                Khách sạn
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setSelectedFilter("tour")}
              className={`px-5 py-2.5 rounded-full ${
                selectedFilter === "tour"
                  ? "bg-red-500 shadow-lg"
                  : "bg-gray-100 border border-gray-200"
              }`}
              style={
                selectedFilter === "tour"
                  ? {
                      shadowColor: "#ef4444",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.3,
                      shadowRadius: 4,
                      elevation: 4,
                    }
                  : {}
              }
            >
              <ThemedText
                className={`text-sm font-semibold ${
                  selectedFilter === "tour" ? "text-white" : "text-gray-700"
                }`}
              >
                Tour
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setSelectedFilter("20+")}
              className={`px-5 py-2.5 rounded-full ${
                selectedFilter === "20+"
                  ? "bg-red-500 shadow-lg"
                  : "bg-gray-100 border border-gray-200"
              }`}
              style={
                selectedFilter === "20+"
                  ? {
                      shadowColor: "#ef4444",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.3,
                      shadowRadius: 4,
                      elevation: 4,
                    }
                  : {}
              }
            >
              <ThemedText
                className={`text-sm font-semibold ${
                  selectedFilter === "20+" ? "text-white" : "text-gray-700"
                }`}
              >
                Giảm 20%+
              </ThemedText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>

      {/* Deals List */}
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#3B82F6" />
          <ThemedText className="mt-4 text-gray-600">
            Đang tải ưu đãi...
          </ThemedText>
        </View>
      ) : (
        <ScrollView className="flex-1 bg-gray-50">
          <View className="p-4">
            {filteredDeals.length === 0 ? (
              <View className="items-center py-12">
                <IconSymbol name="tag" size={64} color="#d1d5db" />
                <ThemedText className="text-gray-500 mt-4 text-center">
                  Không có ưu đãi nào
                </ThemedText>
              </View>
            ) : (
              filteredDeals.map((deal, index) => (
                <Animated.View
                  key={deal.id}
                  entering={FadeInRight.delay(index * 50).duration(400)}
                >
                  <TouchableOpacity
                    className="mb-4 bg-white rounded-2xl overflow-hidden shadow-xl"
                    onPress={() => openDetail(deal)}
                    style={{
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.15,
                      shadowRadius: 12,
                      elevation: 8,
                    }}
                    activeOpacity={0.9}
                  >
                    <View className="flex-row">
                      <View className="w-36 h-36 bg-gray-200 overflow-hidden relative">
                        <Image
                          source={{
                            uri: deal.image || FALLBACK_IMAGE,
                          }}
                          className="w-full h-full"
                          contentFit="cover"
                          cachePolicy="memory-disk"
                          transition={200}
                          onError={(error) => {
                            console.error(
                              `Failed to load image for "${deal.name}":`,
                              deal.image
                            );
                            console.error("Error:", error);
                          }}
                        />
                        <LinearGradient
                          colors={
                            ["transparent", "rgba(0,0,0,0.3)"] as [
                              string,
                              string,
                              ...string[]
                            ]
                          }
                          className="absolute bottom-0 left-0 right-0 h-20"
                        />
                        <View className="absolute top-2 left-2 bg-red-500 px-2.5 py-1 rounded-lg shadow-lg">
                          <ThemedText className="text-white text-xs font-bold">
                            Giảm {deal.discount}
                          </ThemedText>
                        </View>
                      </View>
                      <View className="flex-1 p-4 justify-between">
                        <View>
                          <View className="flex-row justify-between items-start mb-2">
                            <View className="flex-1 mr-2">
                              <ThemedText
                                className="font-bold text-lg text-gray-900 mb-1"
                                numberOfLines={2}
                              >
                                {deal.name}
                              </ThemedText>
                              <ThemedText className="text-gray-500 text-xs">
                                {deal.type}
                              </ThemedText>
                            </View>
                          </View>

                          <ThemedText
                            className="text-gray-600 text-xs mb-2 leading-4"
                            numberOfLines={2}
                          >
                            {deal.description}
                          </ThemedText>

                          <View className="flex-row items-center mb-2">
                            <View className="bg-yellow-50 px-2 py-0.5 rounded flex-row items-center">
                              <IconSymbol
                                name="star"
                                size={12}
                                color="#FFB800"
                              />
                              <ThemedText className="ml-1 text-gray-700 text-xs font-semibold">
                                {deal.rating}
                              </ThemedText>
                              <ThemedText className="text-gray-500 text-xs ml-1">
                                ({deal.reviews})
                              </ThemedText>
                            </View>
                          </View>
                        </View>

                        <View className="flex-row items-center justify-between pt-2 border-t border-gray-100">
                          <View>
                            <ThemedText className="text-red-500 font-bold text-lg">
                              {deal.price}
                            </ThemedText>
                            <ThemedText className="text-gray-400 text-xs line-through">
                              {deal.originalPrice}
                            </ThemedText>
                          </View>
                          <TouchableOpacity
                            className="bg-red-500 px-4 py-2 rounded-xl shadow-lg"
                            style={{
                              shadowColor: "#ef4444",
                              shadowOffset: { width: 0, height: 2 },
                              shadowOpacity: 0.3,
                              shadowRadius: 4,
                              elevation: 4,
                            }}
                            onPress={(e) => {
                              e.stopPropagation();
                              openDetail(deal);
                            }}
                          >
                            <ThemedText className="text-white font-bold text-xs">
                              Đặt ngay
                            </ThemedText>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              ))
            )}
          </View>
        </ScrollView>
      )}
    </ThemedView>
  );
}
