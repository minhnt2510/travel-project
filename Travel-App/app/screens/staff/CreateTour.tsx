import { useState } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import { ThemedView } from "@/ui-components/themed-view";
import { ThemedText } from "@/ui-components/themed-text";
import { IconSymbol } from "@/ui-components/ui/icon-symbol";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { api } from "@/services/api";
import RoleGuard from "@/app/components/common/RoleGuard";
import { useUser } from "@/app/_layout";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { Image } from "expo-image";

export default function CreateTourScreen() {
  return (
    <RoleGuard allowedRoles={["staff", "admin"]}>
      <CreateTourContent />
    </RoleGuard>
  );
}

function CreateTourContent() {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    price: "",
    originalPrice: "",
    duration: "1",
    category: "adventure",
    imageUrl: "",
    availableSeats: "20",
    maxSeats: "20",
  });

  const categories = [
    { id: "adventure", name: "Phiêu lưu" },
    { id: "culture", name: "Văn hóa" },
    { id: "beach", name: "Biển" },
    { id: "mountain", name: "Núi" },
    { id: "city", name: "Thành phố" },
  ];

  const convertImageToBase64 = async (uri: string): Promise<string> => {
    try {
      if (Platform.OS !== "web" && uri.startsWith("file://")) {
        try {
          const base64 = await FileSystem.readAsStringAsync(uri, {
            encoding: "base64" as any,
          });
          let mimeType = "image/jpeg";
          if (uri.includes(".png")) {
            mimeType = "image/png";
          } else if (uri.includes(".gif")) {
            mimeType = "image/gif";
          }
          return `data:${mimeType};base64,${base64}`;
        } catch (fileSystemError: any) {
          // Fall through to fetch method
        }
      }
      
      const response = await fetch(uri);
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status}`);
      }
      
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          if (!base64String) {
            reject(new Error("Failed to convert image to base64"));
            return;
          }
          resolve(base64String);
        };
        reader.onerror = (error) => {
          reject(new Error("Failed to read image file"));
        };
        reader.readAsDataURL(blob);
      });
    } catch (error: any) {
      throw new Error(`Không thể xử lý ảnh: ${error.message || "Lỗi không xác định"}`);
    }
  };

  const handlePickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Cần quyền", "Cần quyền truy cập thư viện ảnh");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.5,
      });

      if (!result.canceled && result.assets[0]) {
        setImageUri(result.assets[0].uri);
        setFormData({ ...formData, imageUrl: "" }); // Clear URL if image is picked
      }
    } catch (error: any) {
      Alert.alert("Lỗi", "Không thể chọn ảnh");
    }
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.description || !formData.location || !formData.price) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    if (!imageUri && !formData.imageUrl) {
      Alert.alert("Lỗi", "Vui lòng chọn ảnh hoặc nhập URL ảnh");
      return;
    }

    try {
      setLoading(true);
      let finalImageUrl = formData.imageUrl;

      // If user picked an image, convert to base64
      if (imageUri) {
        setUploadingImage(true);
        try {
          const base64 = await convertImageToBase64(imageUri);
          
          if (base64.length > 5000000) {
            Alert.alert(
              "Cảnh báo",
              "Ảnh quá lớn. Vui lòng chọn ảnh nhỏ hơn hoặc chất lượng thấp hơn."
            );
            setUploadingImage(false);
            setLoading(false);
            return;
          }
          
          finalImageUrl = base64;
        } catch (error: any) {
          Alert.alert("Lỗi xử lý ảnh", error.message || "Không thể xử lý ảnh");
          setUploadingImage(false);
          setLoading(false);
          return;
        } finally {
          setUploadingImage(false);
        }
      }

      const tourData = {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        price: parseInt(formData.price),
        originalPrice: formData.originalPrice ? parseInt(formData.originalPrice) : undefined,
        duration: parseInt(formData.duration),
        category: formData.category,
        imageUrl: finalImageUrl || undefined,
        availableSeats: parseInt(formData.availableSeats),
        maxSeats: parseInt(formData.maxSeats),
        startDate: new Date(),
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
      };

      await api.createTour(tourData);
      
      Alert.alert(
        user?.role === "admin" ? "Thành công" : "Đã gửi duyệt",
        user?.role === "admin" 
          ? "Tour đã được tạo thành công!"
          : "Tour đã được gửi để admin duyệt. Bạn sẽ được thông báo khi tour được duyệt.",
        [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert("Lỗi", error.message || "Không thể tạo tour");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView className="flex-1 bg-gray-50">
      {/* Header */}
      <LinearGradient
        colors={user?.role === "admin" ? ["#8b5cf6", "#7c3aed"] : ["#10b981", "#059669"]}
        className="px-4 pt-16 pb-8 rounded-b-3xl shadow-xl"
      >
        <View className="flex-row items-center justify-between mb-4">
          <TouchableOpacity onPress={() => router.back()}>
            <IconSymbol name="arrow-left" size={24} color="#FFF" />
          </TouchableOpacity>
          <ThemedText className="text-white text-2xl font-extrabold flex-1 ml-4">
            {user?.role === "admin" ? "Tạo Tour" : "Thêm Tour Mới"}
          </ThemedText>
        </View>
        {user?.role === "staff" && (
          <ThemedText className="text-white/90 text-sm ml-4">
            Tour sẽ ở trạng thái "Chờ duyệt" cho đến khi admin phê duyệt
          </ThemedText>
        )}
      </LinearGradient>

      <ScrollView className="flex-1 px-4 pt-6" showsVerticalScrollIndicator={false}>
        {/* Title */}
        <View className="mb-4">
          <ThemedText className="text-gray-900 font-extrabold mb-2">
            Tên tour <ThemedText className="text-red-500">*</ThemedText>
          </ThemedText>
          <TextInput
            className="bg-white rounded-xl p-4 border border-gray-200"
            placeholder="Ví dụ: Khám phá Đà Lạt 3 ngày 2 đêm"
            value={formData.title}
            onChangeText={(text) => setFormData({ ...formData, title: text })}
          />
        </View>

        {/* Description */}
        <View className="mb-4">
          <ThemedText className="text-gray-900 font-extrabold mb-2">
            Mô tả <ThemedText className="text-red-500">*</ThemedText>
          </ThemedText>
          <TextInput
            className="bg-white rounded-xl p-4 border border-gray-200"
            placeholder="Mô tả chi tiết về tour..."
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            value={formData.description}
            onChangeText={(text) => setFormData({ ...formData, description: text })}
          />
        </View>

        {/* Location */}
        <View className="mb-4">
          <ThemedText className="text-gray-900 font-extrabold mb-2">
            Địa điểm <ThemedText className="text-red-500">*</ThemedText>
          </ThemedText>
          <TextInput
            className="bg-white rounded-xl p-4 border border-gray-200"
            placeholder="Ví dụ: Đà Lạt, Lâm Đồng"
            value={formData.location}
            onChangeText={(text) => setFormData({ ...formData, location: text })}
          />
        </View>

        {/* Price & Duration */}
        <View className="flex-row gap-3 mb-4">
          <View className="flex-1">
            <ThemedText className="text-gray-900 font-extrabold mb-2">
              Giá (VNĐ) <ThemedText className="text-red-500">*</ThemedText>
            </ThemedText>
            <TextInput
              className="bg-white rounded-xl p-4 border border-gray-200"
              placeholder="2500000"
              keyboardType="numeric"
              value={formData.price}
              onChangeText={(text) => setFormData({ ...formData, price: text })}
            />
          </View>
          <View className="flex-1">
            <ThemedText className="text-gray-900 font-extrabold mb-2">
              Giá gốc (VNĐ)
            </ThemedText>
            <TextInput
              className="bg-white rounded-xl p-4 border border-gray-200"
              placeholder="3000000"
              keyboardType="numeric"
              value={formData.originalPrice}
              onChangeText={(text) => setFormData({ ...formData, originalPrice: text })}
            />
          </View>
        </View>

        <View className="flex-row gap-3 mb-4">
          <View className="flex-1">
            <ThemedText className="text-gray-900 font-extrabold mb-2">Số ngày</ThemedText>
            <TextInput
              className="bg-white rounded-xl p-4 border border-gray-200"
              placeholder="3"
              keyboardType="numeric"
              value={formData.duration}
              onChangeText={(text) => setFormData({ ...formData, duration: text })}
            />
          </View>
          <View className="flex-1">
            <ThemedText className="text-gray-900 font-extrabold mb-2">Danh mục</ThemedText>
            <View className="bg-white rounded-xl border border-gray-200 p-4">
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {categories.map((cat) => (
                  <TouchableOpacity
                    key={cat.id}
                    onPress={() => setFormData({ ...formData, category: cat.id })}
                    className={`px-4 py-2 rounded-full mr-2 ${
                      formData.category === cat.id ? "bg-green-500" : "bg-gray-100"
                    }`}
                  >
                    <ThemedText
                      className={`font-semibold ${
                        formData.category === cat.id ? "text-white" : "text-gray-700"
                      }`}
                    >
                      {cat.name}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </View>

        {/* Seats */}
        <View className="flex-row gap-3 mb-4">
          <View className="flex-1">
            <ThemedText className="text-gray-900 font-extrabold mb-2">Số chỗ trống</ThemedText>
            <TextInput
              className="bg-white rounded-xl p-4 border border-gray-200"
              placeholder="20"
              keyboardType="numeric"
              value={formData.availableSeats}
              onChangeText={(text) => setFormData({ ...formData, availableSeats: text })}
            />
          </View>
          <View className="flex-1">
            <ThemedText className="text-gray-900 font-extrabold mb-2">Tổng số chỗ</ThemedText>
            <TextInput
              className="bg-white rounded-xl p-4 border border-gray-200"
              placeholder="20"
              keyboardType="numeric"
              value={formData.maxSeats}
              onChangeText={(text) => setFormData({ ...formData, maxSeats: text })}
            />
          </View>
        </View>

        {/* Image Selection */}
        <View className="mb-6">
          <ThemedText className="text-gray-900 font-extrabold mb-2">
            Ảnh tour <ThemedText className="text-red-500">*</ThemedText>
          </ThemedText>
          
          {/* Image Preview */}
          {imageUri && (
            <View className="mb-3 relative">
              <Image
                source={{ uri: imageUri }}
                className="w-full h-48 rounded-xl"
                contentFit="cover"
              />
              <TouchableOpacity
                onPress={() => setImageUri(null)}
                className="absolute top-2 right-2 bg-red-500 rounded-full p-2"
              >
                <IconSymbol name="x" size={20} color="#FFF" />
              </TouchableOpacity>
            </View>
          )}

          {/* Pick Image Button */}
          <TouchableOpacity
            onPress={handlePickImage}
            className="bg-green-50 border-2 border-green-200 rounded-xl p-4 mb-3 flex-row items-center justify-center"
          >
            <IconSymbol name="image" size={24} color="#10b981" />
            <ThemedText className="text-green-700 font-extrabold ml-2">
              Chọn ảnh từ máy
            </ThemedText>
          </TouchableOpacity>

          {/* Or Divider */}
          <View className="flex-row items-center my-3">
            <View className="flex-1 h-px bg-gray-300" />
            <ThemedText className="mx-3 text-gray-500 text-sm">hoặc</ThemedText>
            <View className="flex-1 h-px bg-gray-300" />
          </View>

          {/* URL Input */}
          <TextInput
            className="bg-white rounded-xl p-4 border border-gray-200"
            placeholder="Nhập URL ảnh (tùy chọn)"
            value={formData.imageUrl}
            onChangeText={(text) => {
              setFormData({ ...formData, imageUrl: text });
              if (text) setImageUri(null); // Clear picked image if URL is entered
            }}
            editable={!imageUri}
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={loading || uploadingImage}
          className={`rounded-2xl p-4 mb-6 ${
            user?.role === "admin" ? "bg-purple-600" : "bg-green-600"
          }`}
          style={{ opacity: (loading || uploadingImage) ? 0.6 : 1 }}
        >
          {(loading || uploadingImage) ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <ThemedText className="text-white font-extrabold text-center text-lg">
              {user?.role === "admin" ? "Tạo Tour" : "Gửi Duyệt"}
            </ThemedText>
          )}
        </TouchableOpacity>

        <View className="h-8" />
      </ScrollView>
    </ThemedView>
  );
}

