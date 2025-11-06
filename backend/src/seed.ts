import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "./db";
import { Tour } from "./models/Tour";
import { Hotel } from "./models/Hotel";
import { User } from "./models/User";
import bcrypt from "bcryptjs";

const tours = [
  {
    title: "Khám phá Đà Lạt 3 ngày 2 đêm",
    description:
      "Tham quan thành phố ngàn hoa với những điểm đến nổi tiếng như Hồ Xuân Hương, Thung Lũng Tình Yêu, Chùa Linh Phước.",
    location: "Đà Lạt, Lâm Đồng",
    price: 2500000,
    originalPrice: 3000000,
    duration: 3,
    category: "city",
    featured: true,
    imageUrl:
      "https://d3pa5s1toq8zys.cloudfront.net/explore/wp-content/uploads/2023/10/Da-Lat.jpg",
    images: [
      "https://d3pa5s1toq8zys.cloudfront.net/explore/wp-content/uploads/2023/10/Da-Lat.jpg",
    ],
    availableSeats: 15,
    maxSeats: 20,
    rating: 4.8,
    reviewCount: 1250,
    startDate: new Date("2024-02-01"),
    endDate: new Date("2024-12-31"),
    coordinates: {
      latitude: 11.9404,
      longitude: 108.4583,
    },
    itinerary: [
      {
        day: 1,
        activities: [
          "Đón khách tại sân bay",
          "Tham quan Hồ Xuân Hương",
          "Chợ Đà Lạt",
        ],
      },
      {
        day: 2,
        activities: [
          "Thung Lũng Tình Yêu",
          "Chùa Linh Phước",
          "Đồi chè Cầu Đất",
        ],
      },
      {
        day: 3,
        activities: [
          "Vườn Hoa Đà Lạt",
          "Mua sắm đồ lưu niệm",
          "Trả khách về sân bay",
        ],
      },
    ],
  },
  {
    title: "Đảo ngọc Phú Quốc - Resort 5 sao",
    description:
      "Nghỉ dưỡng tại resort 5 sao, tham quan các bãi biển đẹp nhất Phú Quốc như Bãi Sao, Bãi Dài, và tham gia các hoạt động du lịch biển.",
    location: "Phú Quốc, Kiên Giang",
    price: 5500000,
    originalPrice: 7000000,
    duration: 4,
    category: "beach",
    featured: true,
    imageUrl:
      "https://bcp.cdnchinhphu.vn/334894974524682240/2025/6/23/phu-quoc-17506756503251936667562.jpg",
    images: [
      "https://bcp.cdnchinhphu.vn/334894974524682240/2025/6/23/phu-quoc-17506756503251936667562.jpg",
    ],
    availableSeats: 8,
    maxSeats: 15,
    rating: 4.9,
    reviewCount: 2100,
    startDate: new Date("2024-02-01"),
    endDate: new Date("2024-12-31"),
    coordinates: {
      latitude: 10.2899,
      longitude: 103.984,
    },
    itinerary: [
      {
        day: 1,
        activities: [
          "Đón tại sân bay",
          "Check-in resort",
          "Tắm biển tại resort",
        ],
      },
      {
        day: 2,
        activities: ["Bãi Sao", "Bãi Dài", "Hoạt động lặn biển"],
      },
      {
        day: 3,
        activities: ["Thăm Công viên Vinpearl Safari", "Chợ đêm Phú Quốc"],
      },
      {
        day: 4,
        activities: ["Mua sắm", "Check-out và về"],
      },
    ],
  },
  {
    title: "Vịnh Hạ Long - Cruise 2 ngày 1 đêm",
    description:
      "Du thuyền trên vịnh Hạ Long, UNESCO World Heritage Site, tham quan hang động, đảo đá vôi tuyệt đẹp và thưởng thức hải sản tươi ngon.",
    location: "Hạ Long, Quảng Ninh",
    price: 3200000,
    originalPrice: 3800000,
    duration: 2,
    category: "adventure",
    featured: true,
    imageUrl:
      "https://hanoilionboutiquehotel.com/images/tour/2023/09/02/large/cruise-5-star_1693649770.jpeg",
    images: [
      "https://hanoilionboutiquehotel.com/images/tour/2023/09/02/large/cruise-5-star_1693649770.jpeg",
    ],
    availableSeats: 12,
    maxSeats: 20,
    rating: 4.9,
    reviewCount: 3200,
    startDate: new Date("2024-02-01"),
    endDate: new Date("2024-12-31"),
    coordinates: {
      latitude: 20.9101,
      longitude: 107.1839,
    },
    itinerary: [
      {
        day: 1,
        activities: [
          "Đón tại Hà Nội",
          "Lên tàu cruise",
          "Tham quan Hang Sửng Sốt",
          "Tiệc tối trên tàu",
        ],
      },
      {
        day: 2,
        activities: [
          "Tham quan Hang Đầu Gỗ",
          "Nghỉ ngơi và thưởng thức hải sản",
          "Về Hà Nội",
        ],
      },
    ],
  },
  {
    title: "Phố cổ Hội An - Ánh đèn lung linh",
    description:
      "Khám phá phố cổ Hội An với kiến trúc cổ kính, thưởng thức ẩm thực địa phương và ngắm đèn lồng rực rỡ về đêm.",
    location: "Hội An, Quảng Nam",
    price: 1800000,
    originalPrice: 2200000,
    duration: 2,
    category: "culture",
    featured: false,
    imageUrl:
      "https://mia.vn/media/uploads/blog-du-lich/pho-co-hoi-an-11-1722915372.jpg",
    images: [
      "https://mia.vn/media/uploads/blog-du-lich/pho-co-hoi-an-11-1722915372.jpg",
    ],
    availableSeats: 20,
    maxSeats: 25,
    rating: 4.7,
    reviewCount: 1800,
    startDate: new Date("2024-02-01"),
    endDate: new Date("2024-12-31"),
    coordinates: {
      latitude: 15.8801,
      longitude: 108.338,
    },
    itinerary: [
      {
        day: 1,
        activities: [
          "Đón tại Đà Nẵng",
          "Tham quan Chùa Cầu",
          "Các cửa hàng cổ",
          "Đêm đèn lồng",
        ],
      },
      {
        day: 2,
        activities: ["Làng gốm Thanh Hà", "Thưởng thức ẩm thực", "Về Đà Nẵng"],
      },
    ],
  },
  {
    title: "Sa Pa - Mùa vàng ruộng bậc thang",
    description:
      "Hiking qua ruộng bậc thang tuyệt đẹp, khám phá văn hóa các dân tộc thiểu số, đỉnh Fansipan.",
    location: "Sa Pa, Lào Cai",
    price: 4200000,
    originalPrice: 5000000,
    duration: 3,
    category: "mountain",
    featured: false,
    imageUrl: "https://media.loveitopcdn.com/38104/dinh-nui-fansipan.jpg",
    images: ["https://media.loveitopcdn.com/38104/dinh-nui-fansipan.jpg"],
    availableSeats: 10,
    maxSeats: 16,
    rating: 4.8,
    reviewCount: 1450,
    startDate: new Date("2024-02-01"),
    endDate: new Date("2024-12-31"),
    coordinates: {
      latitude: 22.3364,
      longitude: 103.8438,
    },
    itinerary: [
      {
        day: 1,
        activities: [
          "Đón tại Lào Cai",
          "Đi bộ ruộng bậc thang",
          "Làng Cát Cát",
        ],
      },
      {
        day: 2,
        activities: ["Leo Fansipan", "Thăm các làng dân tộc"],
      },
      {
        day: 3,
        activities: ["Chợ Sa Pa", "Về Lào Cai"],
      },
    ],
  },
  {
    title: "Đà Nẵng - Bà Nà Hills - Hội An",
    description:
      "Khám phá thành phố biển Đà Nẵng, tham quan Bà Nà Hills, cầu Vàng và dạo phố cổ Hội An.",
    location: "Đà Nẵng",
    price: 3500000,
    originalPrice: 4200000,
    duration: 3,
    category: "city",
    featured: true,
    imageUrl:
      "https://banahills.sunworld.vn/wp-content/uploads/2024/04/DJI_0004-1-scaled.jpg",
    images: [
      "https://banahills.sunworld.vn/wp-content/uploads/2024/04/DJI_0004-1-scaled.jpg",
    ],
    availableSeats: 18,
    maxSeats: 24,
    rating: 4.8,
    reviewCount: 2300,
    startDate: new Date("2024-02-01"),
    endDate: new Date("2024-12-31"),
    coordinates: { latitude: 16.0471, longitude: 108.2068 },
    itinerary: [
      { day: 1, activities: ["Biển Mỹ Khê", "Cầu Rồng", "Ẩm thực địa phương"] },
      { day: 2, activities: ["Bà Nà Hills", "Cầu Vàng", "Fantasy Park"] },
      { day: 3, activities: ["Ngũ Hành Sơn", "Hội An", "Đèn lồng"] },
    ],
  },
  {
    title: "Nha Trang biển xanh cát trắng",
    description:
      "Tắm biển, lặn ngắm san hô, VinWonders Nha Trang và thưởng thức hải sản",
    location: "Nha Trang",
    price: 2800000,
    originalPrice: 3400000,
    duration: 3,
    category: "beach",
    featured: false,
    imageUrl:
      "https://statics.vinpearl.com/Hinh-anh-Vinpearl-Resort-Nha-Trang_1680082155.jpg",
    images: [
      "https://statics.vinpearl.com/Hinh-anh-Vinpearl-Resort-Nha-Trang_1680082155.jpg",
    ],
    availableSeats: 22,
    maxSeats: 30,
    rating: 4.6,
    reviewCount: 980,
    startDate: new Date("2024-02-01"),
    endDate: new Date("2024-12-31"),
    coordinates: { latitude: 12.2388, longitude: 109.1967 },
    itinerary: [
      { day: 1, activities: ["Biển Trần Phú", "Chợ đêm", "Hải sản"] },
      { day: 2, activities: ["VinWonders", "Cáp treo vượt biển"] },
      { day: 3, activities: ["Lặn biển", "Tháp Bà Ponagar"] },
    ],
  },
  {
    title: "Huế - Di sản cố đô",
    description:
      "Tham quan Đại Nội, chùa Thiên Mụ, lăng tẩm các vua Nguyễn và thưởng thức ca Huế trên sông Hương",
    location: "Huế",
    price: 2100000,
    originalPrice: 2600000,
    duration: 2,
    category: "culture",
    featured: false,
    imageUrl:
      "https://vacationtravel.com.vn/storage/photos/1/kh%C3%A1m%20ph%C3%A1%20vi%E1%BB%87t%20nam/MIEN%20TRUNG/CODOHUE1_800.jpg",
    images: [
      "https://vacationtravel.com.vn/storage/photos/1/kh%C3%A1m%20ph%C3%A1%20vi%E1%BB%87t%20nam/MIEN%20TRUNG/CODOHUE1_800.jpg",
    ],
    availableSeats: 25,
    maxSeats: 30,
    rating: 4.7,
    reviewCount: 760,
    startDate: new Date("2024-02-01"),
    endDate: new Date("2024-12-31"),
    coordinates: { latitude: 16.4637, longitude: 107.5909 },
    itinerary: [
      { day: 1, activities: ["Đại Nội", "Chùa Thiên Mụ", "Ẩm thực Huế"] },
      { day: 2, activities: ["Lăng Minh Mạng", "Ca Huế trên sông Hương"] },
    ],
  },
  {
    title: "Hà Giang - Con đường Hạnh Phúc",
    description:
      "Chinh phục đèo Mã Pì Lèng, cao nguyên đá Đồng Văn, mùa hoa tam giác mạch",
    location: "Hà Giang",
    price: 3900000,
    originalPrice: 4700000,
    duration: 3,
    category: "mountain",
    featured: true,
    imageUrl:
      "https://bcp.cdnchinhphu.vn/Uploaded/buithuhuong/2018_11_09/doi-nui-ha-giang-600x400.jpg",
    images: [
      "https://bcp.cdnchinhphu.vn/Uploaded/buithuhuong/2018_11_09/doi-nui-ha-giang-600x400.jpg",
    ],
    availableSeats: 12,
    maxSeats: 18,
    rating: 4.9,
    reviewCount: 1340,
    startDate: new Date("2024-02-01"),
    endDate: new Date("2024-12-31"),
    coordinates: { latitude: 22.8026, longitude: 104.9784 },
    itinerary: [
      { day: 1, activities: ["Quản Bạ", "Yên Minh"] },
      { day: 2, activities: ["Đồng Văn", "Mã Pì Lèng"] },
      { day: 3, activities: ["Mèo Vạc", "Đặc sản vùng cao"] },
    ],
  },
  {
    title: "Quy Nhơn - Kỳ Co Eo Gió",
    description: "Biển xanh Kỳ Co, Eo Gió, ghềnh Ráng và ẩm thực Bình Định",
    location: "Quy Nhơn",
    price: 2600000,
    originalPrice: 3200000,
    duration: 3,
    category: "beach",
    featured: false,
    imageUrl:
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop",
    ],
    availableSeats: 20,
    maxSeats: 28,
    rating: 4.6,
    reviewCount: 540,
    startDate: new Date("2024-02-01"),
    endDate: new Date("2024-12-31"),
    coordinates: { latitude: 13.782, longitude: 109.219 },
    itinerary: [
      { day: 1, activities: ["Kỳ Co", "Eo Gió"] },
      { day: 2, activities: ["Ghềnh Ráng", "Hải sản"] },
      { day: 3, activities: ["Tháp Đôi", "Mua sắm"] },
    ],
  },
];

const hotels = [
  {
    name: "Vinpearl Resort & Spa Phú Quốc",
    description:
      "Resort 5 sao bên bờ biển với bãi biển riêng, hồ bơi lớn và spa.",
    city: "Phú Quốc",
    address: "Bãi Dài, Gành Dầu, Phú Quốc",
    pricePerNight: 2400000,
    stars: 5,
    amenities: ["Bãi biển riêng", "Hồ bơi", "Spa", "Nhà hàng", "Gym", "Bar"],
    imageUrl:
      "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/15/ee/ee/62/vinpearl-resort-spa-phu.jpg?w=900&h=-1&s=1",
    images: [
      "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/15/ee/ee/62/vinpearl-resort-spa-phu.jpg?w=900&h=-1&s=1",
    ],
    rating: 4.7,
    reviewCount: 3200,
    featured: true,
    coordinates: { latitude: 10.309, longitude: 103.911 },
  },
  {
    name: "InterContinental Danang Sun Peninsula",
    description: "Khu nghỉ dưỡng 5 sao sang trọng tại bán đảo Sơn Trà",
    city: "Đà Nẵng",
    address: "Bán đảo Sơn Trà, Đà Nẵng",
    pricePerNight: 9500000,
    stars: 5,
    amenities: ["Hồ bơi", "Spa", "Bãi biển", "Nhà hàng", "Bar", "Gym"],
    imageUrl:
      "https://duan-sungroup.com/wp-content/uploads/2022/12/intercontinental-da-nang-sun-peninsula-resort-leading.png",
    images: [
      "https://duan-sungroup.com/wp-content/uploads/2022/12/intercontinental-da-nang-sun-peninsula-resort-leading.png",
    ],
    rating: 4.9,
    reviewCount: 2100,
    featured: true,
    coordinates: { latitude: 16.119, longitude: 108.295 },
  },
  {
    name: "Silk Path Grand Hue Hotel",
    description: "Khách sạn 5 sao giữa lòng cố đô Huế",
    city: "Huế",
    address: "02 Lê Lợi, Huế",
    pricePerNight: 1800000,
    stars: 5,
    amenities: ["Hồ bơi", "Spa", "Nhà hàng", "Gym"],
    imageUrl:
      "https://cf.bstatic.com/xdata/images/hotel/max1024x768/266420077.jpg?k=418cc8b870d26ab46d2da8fdbdd5c6499bcfb8a7409746f18862cd40f274c18f&o=",
    images: [
      "https://cf.bstatic.com/xdata/images/hotel/max1024x768/266420077.jpg?k=418cc8b870d26ab46d2da8fdbdd5c6499bcfb8a7409746f18862cd40f274c18f&o=",
    ],
    rating: 4.6,
    reviewCount: 860,
    featured: false,
    coordinates: { latitude: 16.466, longitude: 107.594 },
  },
  {
    name: "FLC Luxury Resort Quy Nhơn",
    description: "Resort ven biển với bãi biển riêng và sân golf",
    city: "Quy Nhơn",
    address: "Khu đô thị du lịch sinh thái Nhơn Lý",
    pricePerNight: 2200000,
    stars: 5,
    amenities: ["Bãi biển", "Hồ bơi", "Spa", "Nhà hàng", "Golf"],
    imageUrl:
      "https://cf.bstatic.com/xdata/images/hotel/max1024x768/359475229.jpg?k=69127903ce6837bd2a269a76cb00853b0561e5d963721a14aa050b37c6450bae&o=",
    images: [
      "https://cf.bstatic.com/xdata/images/hotel/max1024x768/359475229.jpg?k=69127903ce6837bd2a269a76cb00853b0561e5d963721a14aa050b37c6450bae&o=",
    ],
    rating: 4.5,
    reviewCount: 540,
    featured: false,
    coordinates: { latitude: 13.954, longitude: 109.238 },
  },
  {
    name: "Novotel Nha Trang",
    description: "Khách sạn 4 sao ngay trung tâm Trần Phú, view biển",
    city: "Nha Trang",
    address: "50 Trần Phú, Nha Trang",
    pricePerNight: 1500000,
    stars: 4,
    amenities: ["Hồ bơi", "Spa", "Nhà hàng", "Bar"],
    imageUrl:
      "https://d2e5ushqwiltxm.cloudfront.net/wp-content/uploads/sites/38/2024/10/30093116/Pool_17930-scaled.jpg",
    images: [
      "https://d2e5ushqwiltxm.cloudfront.net/wp-content/uploads/sites/38/2024/10/30093116/Pool_17930-scaled.jpg",
    ],
    rating: 4.4,
    reviewCount: 1200,
    featured: false,
    coordinates: { latitude: 12.238, longitude: 109.196 },
  },
];

async function seed() {
  try {
    await connectDB();

    // Clear existing data
    await Tour.deleteMany({});
    console.log("Cleared existing tours");

    // Create tours
    await Tour.insertMany(tours);
    console.log(`Created ${tours.length} tours`);

    // Hotels
    await Hotel.deleteMany({});
    console.log("Cleared existing hotels");
    await Hotel.insertMany(hotels);
    console.log(`Created ${hotels.length} hotels`);

    // Create sample users with different roles
    const passwordHash = await bcrypt.hash("123123", 10);
    
    // Create client user
    await User.findOneAndUpdate(
      { email: "client@travel.com" },
      {
        email: "client@travel.com",
        name: "Client User",
        passwordHash,
        role: "client",
      },
      { upsert: true, new: true }
    );
    
    // Create staff user
    await User.findOneAndUpdate(
      { email: "staff@travel.com" },
      {
        email: "staff@travel.com",
        name: "Staff User",
        passwordHash,
        role: "staff",
      },
      { upsert: true, new: true }
    );
    
    // Create admin user
    await User.findOneAndUpdate(
      { email: "admin@travel.com" },
      {
        email: "admin@travel.com",
        name: "Admin User",
        passwordHash,
        role: "admin",
      },
      { upsert: true, new: true }
    );
    
    console.log("✅ Seeding completed!");
    console.log("📧 Test accounts:");
    console.log("   - client@travel.com / 123123 (Client)");
    console.log("   - staff@travel.com / 123123 (Staff)");
    console.log("   - admin@travel.com / 123123 (Admin)");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seed();
