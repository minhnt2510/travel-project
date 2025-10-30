import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "./db";
import { Tour } from "./models/Tour";
import { User } from "./models/User";
import bcrypt from "bcryptjs";

const tours = [
  {
    title: "Khám phá Đà Lạt 3 ngày 2 đêm",
    description: "Tham quan thành phố ngàn hoa với những điểm đến nổi tiếng như Hồ Xuân Hương, Thung Lũng Tình Yêu, Chùa Linh Phước.",
    location: "Đà Lạt, Lâm Đồng",
    price: 2500000,
    originalPrice: 3000000,
    duration: 3,
    category: "city",
    featured: true,
    imageUrl: "https://d3pa5s1toq8zys.cloudfront.net/explore/wp-content/uploads/2023/10/Da-Lat.jpg",
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
    description: "Nghỉ dưỡng tại resort 5 sao, tham quan các bãi biển đẹp nhất Phú Quốc như Bãi Sao, Bãi Dài, và tham gia các hoạt động du lịch biển.",
    location: "Phú Quốc, Kiên Giang",
    price: 5500000,
    originalPrice: 7000000,
    duration: 4,
    category: "beach",
    featured: true,
    imageUrl: "https://bcp.cdnchinhphu.vn/334894974524682240/2025/6/23/phu-quoc-17506756503251936667562.jpg",
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
        activities: [
          "Bãi Sao",
          "Bãi Dài",
          "Hoạt động lặn biển",
        ],
      },
      {
        day: 3,
        activities: [
          "Thăm Công viên Vinpearl Safari",
          "Chợ đêm Phú Quốc",
        ],
      },
      {
        day: 4,
        activities: [
          "Mua sắm",
          "Check-out và về",
        ],
      },
    ],
  },
  {
    title: "Vịnh Hạ Long - Cruise 2 ngày 1 đêm",
    description: "Du thuyền trên vịnh Hạ Long, UNESCO World Heritage Site, tham quan hang động, đảo đá vôi tuyệt đẹp và thưởng thức hải sản tươi ngon.",
    location: "Hạ Long, Quảng Ninh",
    price: 3200000,
    originalPrice: 3800000,
    duration: 2,
    category: "adventure",
    featured: true,
    imageUrl: "https://hanoilionboutiquehotel.com/images/tour/2023/09/02/large/cruise-5-star_1693649770.jpeg",
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
    description: "Khám phá phố cổ Hội An với kiến trúc cổ kính, thưởng thức ẩm thực địa phương và ngắm đèn lồng rực rỡ về đêm.",
    location: "Hội An, Quảng Nam",
    price: 1800000,
    originalPrice: 2200000,
    duration: 2,
    category: "culture",
    featured: false,
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSubIRulzd54wWhkW5arL9YQnSoC2Xo0IgLXw&s",
    images: [
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSubIRulzd54wWhkW5arL9YQnSoC2Xo0IgLXw&s",
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
        activities: [
          "Làng gốm Thanh Hà",
          "Thưởng thức ẩm thực",
          "Về Đà Nẵng",
        ],
      },
    ],
  },
  {
    title: "Sa Pa - Mùa vàng ruộng bậc thang",
    description: "Hiking qua ruộng bậc thang tuyệt đẹp, khám phá văn hóa các dân tộc thiểu số, đỉnh Fansipan.",
    location: "Sa Pa, Lào Cai",
    price: 4200000,
    originalPrice: 5000000,
    duration: 3,
    category: "mountain",
    featured: false,
    imageUrl: "https://static.sggp.org.vn/images/2024/06/28/17/sapa.jpg",
    images: [
      "https://static.sggp.org.vn/images/2024/06/28/17/sapa.jpg",
    ],
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
        activities: [
          "Leo Fansipan",
          "Thăm các làng dân tộc",
        ],
      },
      {
        day: 3,
        activities: [
          "Chợ Sa Pa",
          "Về Lào Cai",
        ],
      },
    ],
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

    // Create admin user
    const adminPasswordHash = await bcrypt.hash("admin123", 10);
    const adminUser = await User.findOneAndUpdate(
      { email: "admin@travel.com" },
      {
        email: "admin@travel.com",
        name: "Admin Travel",
        passwordHash: adminPasswordHash,
        role: "admin",
      },
      { upsert: true, new: true }
    );
    console.log("Created admin user:", adminUser.email);

    console.log("✅ Seeding completed!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seed();

