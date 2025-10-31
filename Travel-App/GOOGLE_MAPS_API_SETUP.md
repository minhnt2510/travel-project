# Hướng dẫn cấu hình Google Maps API Key

## Bước 1: Tạo API Key (Bạn đang làm đúng ✅)

Trong dialog "Create API key":
1. ✅ **Name**: "API key 2" (hoặc tên bạn muốn)
2. ✅ **Application restrictions**: Chọn **"None"** ✅ (Đúng rồi!)
3. ✅ **API restrictions**: Chọn **"Restrict key"** ✅ (Đúng rồi!)

## Bước 2: Enable Maps APIs trước (QUAN TRỌNG!)

**Nếu không thấy Maps APIs trong dropdown**, bạn cần enable chúng trước:

1. Đóng dialog "Create API key" (click Cancel hoặc X)
2. Vào **APIs & Services** → **Library** (hoặc **Enabled APIs & services**)
3. Tìm và enable các API sau:
   - **Maps Static API** - Gõ "Maps Static" vào search box
   - **Maps JavaScript API** - Gõ "Maps JavaScript"
   - **Geocoding API** - Gõ "Geocoding" (tùy chọn)
   - **Places API** - Gõ "Places API" (tùy chọn)

4. Sau khi enable xong, quay lại **Credentials** → **"+ Create credentials"** → **"API key"**

## Bước 3: Chọn APIs cần thiết

Bây giờ mới click vào dropdown **"Select APIs"** và tìm/check các API sau:

### APIs BẮT BUỘC:
- ✅ **Maps Static API** - Để hiển thị ảnh bản đồ tĩnh (QUAN TRỌNG NHẤT!)
- ✅ **Maps JavaScript API** - Để dùng bản đồ tương tác sau này

### APIs TÙY CHỌN (nếu cần):
- ✅ **Geocoding API** - Chuyển địa chỉ thành tọa độ (lat/lng)
- ✅ **Places API** - Tìm kiếm địa điểm, thông tin địa điểm
- ✅ **Directions API** - Tính toán tuyến đường

**LƯU Ý**: 
- Trong dropdown, gõ "Maps" để tìm nhanh
- Phải check ít nhất **Maps Static API** để bản đồ hiển thị được

## Bước 4: Tạo và Copy Key

1. Click **"Create"**
2. Copy API key mới được tạo
3. Thay thế key cũ trong code

## Bước 5: Cập nhật API Key trong code

Sau khi có key mới, cập nhật ở 3 vị trí:

### 1. File `app/components/common/MapView.tsx` (dòng 124):
```typescript
return `https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=15&size=${mapWidth}x${mapHeight}&markers=color:0xFF0000|size:mid|${latitude},${longitude}&key=YOUR_NEW_API_KEY_HERE`;
```

### 2. File `app.json` - iOS (dòng 13):
```json
"googleMapsApiKey": "YOUR_NEW_API_KEY_HERE"
```

### 3. File `app.json` - Android (dòng 28):
```json
"apiKey": "YOUR_NEW_API_KEY_HERE"
```

## Bước 6: Kiểm tra APIs đã enable chưa

Vào **APIs & Services** → **Enabled APIs & services** và đảm bảo các API sau đã được enable:
- ✅ Maps Static API
- ✅ Maps JavaScript API

Nếu chưa enable, click **"+ Enable APIs and Services"** và enable chúng.

## Lưu ý quan trọng:

⚠️ **API key với Application restriction "None"** sẽ hoạt động với:
- ✅ Expo Go
- ✅ Android apps
- ✅ iOS apps  
- ✅ Web browsers
- ✅ Server-side requests

⏱️ Sau khi tạo/sửa key, đợi **5 phút** để thay đổi có hiệu lực

🔒 **Cho production**: Nên set Application restrictions để bảo mật:
- iOS: Set bundle ID
- Android: Set package name + SHA-1
- Web: Set HTTP referrers

