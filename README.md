# 🌍 Travel App - Ứng dụng Du lịch

Ứng dụng du lịch hoàn chỉnh với backend và frontend, hỗ trợ đặt tour, review, wishlist và quản lý booking.

## ✨ Tính năng chính

### 👤 Authentication & User Management
- ✅ Đăng ký tài khoản
- ✅ Đăng nhập/Đăng xuất
- ✅ Quản lý thông tin cá nhân
- ✅ JWT Authentication

### 🗺️ Tour Management
- ✅ Xem danh sách tours
- ✅ Tìm kiếm và lọc tours (category, location, price)
- ✅ Tours nổi bật (featured)
- ✅ Chi tiết tour với itinerary
- ✅ Rating và reviews

### 📅 Booking System
- ✅ Đặt tour
- ✅ Quản lý bookings
- ✅ Hủy booking
- ✅ Thông tin travelers
- ✅ Trạng thái booking (pending, confirmed, cancelled)
- ✅ Trạng thái thanh toán

### ⭐ Reviews & Ratings
- ✅ Xem reviews của tour
- ✅ Viết review (rating, comment, images)
- ✅ Pros & Cons
- ✅ Tự động tính rating trung bình

### ❤️ Wishlist
- ✅ Thêm/Xóa tours khỏi wishlist
- ✅ Xem danh sách wishlist

### 🔔 Notifications
- ✅ Thông báo đặt tour
- ✅ Đánh dấu đã đọc
- ✅ Xóa notifications

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB với Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: Zod
- **Language**: TypeScript

### Frontend
- **Framework**: React Native
- **Navigation**: Expo Router
- **Styling**: NativeWind (Tailwind CSS)
- **Storage**: AsyncStorage
- **Language**: TypeScript
- **Animations**: React Native Reanimated

## 📁 Project Structure

```
travel-app/
├── backend/
│   ├── src/
│   │   ├── models/         # MongoDB schemas
│   │   │   ├── User.ts
│   │   │   ├── Tour.ts
│   │   │   ├── Booking.ts
│   │   │   ├── Review.ts
│   │   │   ├── Wishlist.ts
│   │   │   └── Notification.ts
│   │   ├── routes/         # API routes
│   │   │   ├── auth.ts
│   │   │   ├── user.ts
│   │   │   ├── tour.ts
│   │   │   ├── booking.ts
│   │   │   ├── review.ts
│   │   │   ├── wishlist.ts
│   │   │   └── notification.ts
│   │   ├── middleware/     # Middleware
│   │   │   └── auth.ts
│   │   ├── db.ts           # MongoDB connection
│   │   ├── index.ts        # Express app
│   │   └── seed.ts         # Seed data
│   ├── package.json
│   └── .env               # Environment variables
│
├── Travel-App/            # Frontend React Native
│   ├── app/
│   │   ├── (auth)/       # Auth screens
│   │   ├── (tabs)/       # Tab screens
│   │   ├── components/   # React components
│   │   └── screens/      # Other screens
│   ├── services/
│   │   └── api.ts        # API client
│   └── package.json
│
├── SETUP.md              # Setup guide
├── INSTALL.md            # Installation guide
└── README.md             # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone repository

```bash
git clone <repository-url>
cd travel-app
```

### 2. Setup Backend

```bash
cd backend
npm install

# Tạo file .env
cp .env.example .env
# Hoặc tạo file .env với nội dung:
# MONGODB_URI=mongodb://localhost:27017/travel-app
# JWT_SECRET=your-secret-key
# PORT=4000

# Chạy seed data
npm run seed

# Khởi động backend
npm run dev
```

Backend chạy tại: `http://localhost:4000`

### 3. Setup Frontend

```bash
cd Travel-App
npm install

# Sửa API_URL trong services/api.ts nếu cần
# const API_URL = "http://localhost:4000";

# Khởi động frontend
npm start
```

Chọn `i` (iOS), `a` (Android), hoặc `w` (Web)

### 4. Xem Database

Sử dụng MongoDB Compass:
- Download: https://www.mongodb.com/try/download/compass
- Connect: `mongodb://localhost:27017`
- Database: `travel-app`

## 📡 API Endpoints

### Authentication
```
POST /auth/register     - Đăng ký
POST /auth/login        - Đăng nhập
```

### Tours
```
GET  /tours             - Danh sách tours (có filter)
GET  /tours/featured    - Tours nổi bật
GET  /tours/:id         - Chi tiết tour
POST /tours             - Tạo tour (admin)
PUT  /tours/:id         - Cập nhật tour (admin)
DELETE /tours/:id       - Xóa tour (admin)
```

### User
```
GET /me                 - Thông tin user hiện tại
PUT /me                 - Cập nhật user
```

### Bookings
```
GET  /bookings          - Danh sách bookings của user
POST /bookings          - Tạo booking
GET  /bookings/:id      - Chi tiết booking
PUT  /bookings/:id/cancel - Hủy booking
```

### Reviews
```
GET    /tours/:tourId/reviews - Reviews của tour
POST   /reviews               - Tạo review
PUT    /reviews/:id           - Cập nhật review
DELETE /reviews/:id           - Xóa review
```

### Wishlist
```
GET    /wishlist          - Danh sách wishlist
POST   /wishlist/:tourId  - Thêm vào wishlist
DELETE /wishlist/:tourId  - Xóa khỏi wishlist
```

### Notifications
```
GET    /notifications      - Danh sách notifications
PUT    /notifications/:id/read - Đánh dấu đã đọc
PUT    /notifications/read-all - Đánh dấu tất cả
DELETE /notifications/:id      - Xóa notification
```

## 🔐 Authentication

Tất cả API (trừ auth) yêu cầu header:
```
Authorization: Bearer <access_token>
```

Token được lưu trong AsyncStorage và tự động thêm vào mọi request.

## 📊 Database Schema

### User
```typescript
{
  name: string
  email: string (unique)
  passwordHash: string
  phone?: string
  avatar?: string
  role: 'user' | 'admin'
}
```

### Tour
```typescript
{
  title: string
  description: string
  location: string
  price: number
  originalPrice?: number
  duration: number (days)
  category: 'adventure' | 'culture' | 'beach' | 'mountain' | 'city'
  featured: boolean
  rating: number
  reviewCount: number
  availableSeats: number
  maxSeats: number
  startDate: Date
  endDate: Date
  imageUrl?: string
  images?: string[]
  itinerary?: [{ day: number, activities: string[] }]
  coordinates?: { latitude: number, longitude: number }
}
```

### Booking
```typescript
{
  tourId: ObjectId (ref: Tour)
  userId: ObjectId (ref: User)
  quantity: number
  totalPrice: number
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  paymentStatus: 'pending' | 'paid' | 'refunded'
  travelDate: Date
  travelers: [{ name: string, age: number, idCard?: string }]
  contactInfo: { phone: string, email: string }
  specialRequests?: string
}
```

### Review
```typescript
{
  tourId: ObjectId (ref: Tour)
  userId: ObjectId (ref: User)
  rating: number (1-5)
  comment?: string
  images?: string[]
  pros?: string[]
  cons?: string[]
  helpful: number
}
```

### Wishlist
```typescript
{
  userId: ObjectId (ref: User)
  tourId: ObjectId (ref: Tour)
}
```

### Notification
```typescript
{
  userId: ObjectId (ref: User)
  type: 'booking' | 'payment' | 'tour' | 'review' | 'general'
  title: string
  message: string
  read: boolean
  link?: string
}
```

## 🎨 Screens

### Auth
- Login
- Register
- OTP Verification (placeholder)

### Main Tabs
- Home - Featured tours
- Bookings - My bookings
- History - Booking history
- Wishlist - Saved tours
- Profile - User profile

### Other Screens
- All Tours - Browse all tours
- Tour Detail - Tour details with reviews
- Booking Detail - Booking information
- Create Booking - Book a tour
- Reviews - View/create reviews
- Notifications - View notifications
- Filters - Search and filter tours

## 📝 Seed Data

Chạy `npm run seed` trong thư mục backend để tạo:
- 5 tours mẫu (Đà Lạt, Phú Quốc, Hạ Long, Hội An, Sa Pa)
- 1 admin user:
  - Email: `admin@travel.com`
  - Password: `admin123`

## 🧪 Testing

### Test API với curl

```bash
# Login
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@travel.com","password":"admin123"}'

# Get tours
curl http://localhost:4000/tours

# Get featured tours
curl http://localhost:4000/tours/featured
```

### Test với MongoDB Compass

1. Connect to database
2. Browse collections
3. Xem documents
4. Test queries

## 🔧 Environment Variables

### Backend (.env)
```env
MONGODB_URI=mongodb://localhost:27017/travel-app
JWT_SECRET=your-secret-key-here
PORT=4000
```

### Frontend
Cấu hình trong `services/api.ts`:
```typescript
const API_URL = "http://localhost:4000";
```

## 📚 Documentation

- `SETUP.md` - Chi tiết setup và cấu hình
- `INSTALL.md` - Hướng dẫn cài đặt từng bước
- `README.md` - Tổng quan project (bạn đang xem)

## 🤝 Contributing

1. Fork project
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

MIT License

## 👨‍💻 Author

Travel App Development Team

## 🙏 Acknowledgments

- MongoDB Atlas cho hosting database miễn phí
- Expo cho React Native framework
- Tailwind CSS cho styling
- Express community

---

**Made with ❤️ for travelers**

