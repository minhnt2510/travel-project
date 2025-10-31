import { ThemedText } from "@/ui-components/themed-text";
import { ThemedView } from "@/ui-components/themed-view";
import { IconSymbol } from "@/ui-components/ui/icon-symbol";
import { Image } from "expo-image";
import { router } from "expo-router";
import { ScrollView, TouchableOpacity, View } from "react-native";

export default function AllDealsScreen() {
  const allDeals = [
  // 🔹 Dữ liệu Tour từ seed.ts
  {
    id: "tour1",
    name: "Khám phá Đà Lạt 3 ngày 2 đêm",
    type: "Tour",
    image: "https://d3pa5s1toq8zys.cloudfront.net/explore/wp-content/uploads/2023/10/Da-Lat.jpg",
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
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSubIRulzd54wWhkW5arL9YQnSoC2Xo0IgLXw&s",
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
    image: "https://static.sggp.org.vn/images/2024/06/28/17/sapa.jpg",
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
    description: "Khám phá thành phố biển, Bà Nà Hills và cầu Vàng nổi tiếng.",
  },
  {
    id: "tour7",
    name: "Nha Trang biển xanh cát trắng",
    type: "Tour",
    image:
      "https://cdn3.ivivu.com/2023/07/Six-Senses-Ninh-V%C3%A2n-Bay-Nha-Trang-ivivu-10.jpg",
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
    description: "Resort 5 sao bên bờ biển với bãi biển riêng và spa cao cấp.",
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
    description: "Khách sạn 5 sao giữa lòng cố đô Huế, tiện nghi và sang trọng.",
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
    description: "Khách sạn 4 sao trung tâm Trần Phú, view biển đẹp và tiện nghi.",
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
      {/* Header */}
      <View className="p-4 bg-blue-600">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()}>
            <IconSymbol name="arrow-left" size={24} color="#FFF" />
          </TouchableOpacity>
          <ThemedText className="text-white text-xl font-bold ml-4">
            Ưu đãi hot
          </ThemedText>
        </View>
      </View>

      {/* Search Bar */}
      <View className="p-4 bg-gray-50">
        <TouchableOpacity className="bg-white rounded-full px-4 py-3 flex-row items-center">
          <IconSymbol name="search" size={20} color="#6B7280" />
          <ThemedText className="ml-2 text-gray-500">
            Tìm kiếm ưu đãi...
          </ThemedText>
        </TouchableOpacity>
      </View>

      {/* Filter Bar */}
      <View className="p-4 bg-white border-b border-gray-200">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row space-x-3">
            <TouchableOpacity className="bg-blue-600 px-4 py-2 rounded-full">
              <ThemedText className="text-white text-sm">Tất cả</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity className="bg-gray-100 px-4 py-2 rounded-full">
              <ThemedText className="text-gray-600 text-sm">Khách sạn</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity className="bg-gray-100 px-4 py-2 rounded-full">
              <ThemedText className="text-gray-600 text-sm">Tour</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity className="bg-gray-100 px-4 py-2 rounded-full">
              <ThemedText className="text-gray-600 text-sm">Giảm 20%+</ThemedText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>

      {/* Deals List */}
      <ScrollView className="flex-1">
        <View className="p-4">
          {allDeals.map((deal) => (
            <TouchableOpacity
              key={deal.id}
              className="mb-4 bg-white rounded-lg shadow overflow-hidden"
              onPress={() => openDetail(deal.id)}
            >
              <View className="flex-row">
                <Image
                  source={{ uri: deal.image }}
                  className="w-32 h-32"
                  contentFit="cover"
                />
                <View className="flex-1 p-4">
                  <View className="flex-row justify-between items-start mb-2">
                    <View className="flex-1">
                      <ThemedText className="font-semibold text-lg">
                        {deal.name}
                      </ThemedText>
                      <ThemedText className="text-gray-600 text-sm">
                        {deal.type}
                      </ThemedText>
                    </View>
                    <View className="bg-red-100 px-2 py-1 rounded">
                      <ThemedText className="text-red-600 text-xs font-semibold">
                        Giảm {deal.discount}
                      </ThemedText>
                    </View>
                  </View>
                  
                  <ThemedText className="text-gray-500 text-sm mb-2" numberOfLines={2}>
                    {deal.description}
                  </ThemedText>
                  
                  <View className="flex-row items-center mb-2">
                    <IconSymbol name="star" size={14} color="#FFB800" />
                    <ThemedText className="ml-1 text-gray-600 text-xs">
                      {deal.rating} ({deal.reviews} đánh giá)
                    </ThemedText>
                  </View>
                  
                  <View className="flex-row items-center justify-between">
                    <View>
                      <ThemedText className="text-blue-600 font-semibold text-lg">
                        {deal.price}
                      </ThemedText>
                      <ThemedText className="text-gray-400 text-sm line-through">
                        {deal.originalPrice}
                      </ThemedText>
                    </View>
                    <TouchableOpacity className="bg-red-500 px-3 py-2 rounded-full">
                      <ThemedText className="text-white font-semibold text-sm">
                        Đặt ngay
                      </ThemedText>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </ThemedView>
  );
}
