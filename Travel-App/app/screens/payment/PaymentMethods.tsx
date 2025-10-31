import { useEffect, useState } from "react";
import {
  ScrollView,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { ThemedText } from "@/ui-components/themed-text";
import { ThemedView } from "@/ui-components/themed-view";
import { IconSymbol } from "@/ui-components/ui/icon-symbol";
import { useUser } from "@/app/_layout";
import { api } from "@/services/api";

interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  description: string;
  isDefault?: boolean;
}

const availablePaymentMethods: PaymentMethod[] = [
  {
    id: "momo",
    name: "Ví MoMo",
    icon: "smartphone",
    description: "Thanh toán nhanh chóng và an toàn",
  },
  {
    id: "bank",
    name: "Chuyển khoản ngân hàng",
    icon: "credit-card",
    description: "Chuyển khoản qua ngân hàng",
  },
  {
    id: "cash",
    name: "Tiền mặt",
    icon: "dollar-sign",
    description: "Thanh toán khi nhận dịch vụ",
  },
];

export default function PaymentMethodsScreen() {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [savedMethods, setSavedMethods] = useState<string[]>([]);
  const [defaultMethod, setDefaultMethod] = useState<string>("");

  useEffect(() => {
    loadSavedMethods();
  }, []);

  const loadSavedMethods = async () => {
    try {
      setLoading(true);
      // Load saved payment methods from AsyncStorage or API
      // For now, we'll use AsyncStorage
      const saved = await AsyncStorage.getItem("user_payment_methods");
      const defaultMethodId = await AsyncStorage.getItem("default_payment_method");
      
      if (saved) {
        setSavedMethods(JSON.parse(saved));
      }
      if (defaultMethodId) {
        setDefaultMethod(defaultMethodId);
      }
    } catch (error) {
      console.error("Error loading payment methods:", error);
    } finally {
      setLoading(false);
    }
  };

  const togglePaymentMethod = async (methodId: string) => {
    try {
      let updated = [...savedMethods];
      
      if (updated.includes(methodId)) {
        updated = updated.filter((id) => id !== methodId);
        if (defaultMethod === methodId) {
          setDefaultMethod("");
          await AsyncStorage.removeItem("default_payment_method");
        }
      } else {
        updated.push(methodId);
      }

      setSavedMethods(updated);
      await AsyncStorage.setItem("user_payment_methods", JSON.stringify(updated));
      
      Alert.alert(
        "Thành công",
        updated.includes(methodId) 
          ? "Đã thêm phương thức thanh toán" 
          : "Đã xóa phương thức thanh toán"
      );
    } catch (error) {
      Alert.alert("Lỗi", "Không thể cập nhật phương thức thanh toán");
    }
  };

  const setDefault = async (methodId: string) => {
    try {
      setDefaultMethod(methodId);
      await AsyncStorage.setItem("default_payment_method", methodId);
      Alert.alert("Thành công", "Đã đặt làm phương thức mặc định");
    } catch (error) {
      Alert.alert("Lỗi", "Không thể đặt phương thức mặc định");
    }
  };

  if (loading) {
    return (
      <ThemedView className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#2563eb" />
        <ThemedText className="mt-4 text-gray-600">
          Đang tải phương thức thanh toán...
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="p-4 border-b border-gray-200 bg-white">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()}>
            <IconSymbol name="arrow-left" size={24} color="#000" />
          </TouchableOpacity>
          <ThemedText className="ml-4 text-xl font-bold">
            Phương thức thanh toán
          </ThemedText>
        </View>
      </View>

      <ScrollView className="flex-1 p-4">
        <ThemedText className="text-gray-600 mb-4">
          Chọn và quản lý các phương thức thanh toán của bạn
        </ThemedText>

        {availablePaymentMethods.map((method) => {
          const isSaved = savedMethods.includes(method.id);
          const isDefault = defaultMethod === method.id;

          return (
            <View
              key={method.id}
              className="bg-white rounded-2xl p-4 mb-4 shadow-sm border border-gray-200"
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center flex-1">
                  <View className="w-12 h-12 rounded-xl bg-blue-50 items-center justify-center mr-3">
                    <IconSymbol name={method.icon} size={24} color="#2563eb" />
                  </View>
                  <View className="flex-1">
                    <View className="flex-row items-center">
                      <ThemedText className="font-semibold text-gray-900">
                        {method.name}
                      </ThemedText>
                      {isDefault && (
                        <View className="ml-2 bg-green-100 px-2 py-1 rounded-full">
                          <ThemedText className="text-green-700 text-xs font-bold">
                            Mặc định
                          </ThemedText>
                        </View>
                      )}
                    </View>
                    <ThemedText className="text-gray-500 text-sm mt-1">
                      {method.description}
                    </ThemedText>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => togglePaymentMethod(method.id)}
                  className={`w-10 h-10 rounded-full items-center justify-center ${
                    isSaved ? "bg-blue-100" : "bg-gray-100"
                  }`}
                >
                  <IconSymbol
                    name={isSaved ? "check-circle" : "plus"}
                    size={20}
                    color={isSaved ? "#2563eb" : "#6b7280"}
                  />
                </TouchableOpacity>
              </View>

              {isSaved && !isDefault && (
                <TouchableOpacity
                  onPress={() => setDefault(method.id)}
                  className="mt-3 pt-3 border-t border-gray-100"
                >
                  <ThemedText className="text-blue-600 text-sm font-medium text-center">
                    Đặt làm mặc định
                  </ThemedText>
                </TouchableOpacity>
              )}
            </View>
          );
        })}
      </ScrollView>
    </ThemedView>
  );
}

