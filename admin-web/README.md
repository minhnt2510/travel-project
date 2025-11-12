# Travel Admin Dashboard

Web dashboard cho Staff và Admin quản lý hệ thống Travel App.

## Tech Stack

- **Vite** - Build tool
- **React** + **TypeScript** - UI framework
- **React Router** - Routing
- **TanStack Query** - Data fetching
- **Axios** - HTTP client
- **Tailwind CSS** - Styling

## Setup

1. Install dependencies:
```bash
npm install
```

2. Setup environment variables:
Tạo file `.env` (hoặc copy từ `.env.example`):
```
VITE_API_URL=http://localhost:4000
```

Thay đổi `VITE_API_URL` thành địa chỉ backend của bạn.

3. Start development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Cấu trúc

- `/src/pages/staff/` - Các trang dành cho Staff (operations)
- `/src/pages/admin/` - Các trang dành cho Admin (governance)
- `/src/components/` - Shared components
- `/src/lib/api/` - API client functions
- `/src/contexts/` - React contexts (Auth, etc.)

## Đăng nhập

Sử dụng tài khoản staff hoặc admin:
- Staff: `staff@travel.com` / `123123`
- Admin: `admin@travel.com` / `123123`

## Features

### Staff Dashboard
- Xem thống kê vận hành hôm nay
- Quản lý đơn hàng
- Quản lý tours
- Xem đơn hủy
- Tạo tour mới

### Admin Dashboard
- Xem thống kê tổng quan (revenue, orders, tours, users)
- Quản lý users
- Quản lý staff
- Duyệt tours
- Cài đặt hệ thống
- Phân tích dữ liệu

## Notes

- Backend phải chạy và có CORS enabled
- JWT token được lưu trong localStorage
- Protected routes tự động redirect nếu không có quyền

