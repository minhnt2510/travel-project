import { View, TouchableOpacity } from "react-native";
import { ThemedView } from "@/ui-components/themed-view";
import { ThemedText } from "@/ui-components/themed-text";
import { IconSymbol } from "@/ui-components/ui/icon-symbol";

interface PaymentResultProps {
  status: "success" | "failure";
  orderNumber: string;
  amount: number;
}

export default function PaymentResult({
  status = "success",
  orderNumber = "DH123456789",
  amount = 4350000,
}: PaymentResultProps) {
  return (
    <ThemedView className="flex-1">
      <View className="flex-1 items-center justify-center p-4">
        {/* Status Icon */}
        <View
          className={`w-20 h-20 rounded-full items-center justify-center mb-6 ${
            status === "success" ? "bg-green-100" : "bg-red-100"
          }`}
        >
          <IconSymbol
            name={status === "success" ? "check-circle" : "x-circle"}
            size={40}
            color={status === "success" ? "#10B981" : "#EF4444"}
          />
        </View>

        {/* Status Message */}
        <ThemedText className="text-2xl font-bold mb-2">
          {status === "success"
            ? "Thanh toán thành công!"
            : "Thanh toán thất bại!"}
        </ThemedText>
        <ThemedText className="text-gray-600 mb-6 text-center">
          {status === "success"
            ? "Cảm ơn bạn đã đặt dịch vụ. Chúng tôi sẽ xử lý đơn hàng của bạn ngay lập tức."
            : "Đã xảy ra lỗi trong quá trình thanh toán. Vui lòng thử lại sau."}
        </ThemedText>

        {/* Order Details */}
        <View className="w-full bg-white p-6 rounded-lg shadow mb-6">
          <View className="flex-row justify-between mb-4">
            <ThemedText className="text-gray-600">Mã đơn hàng:</ThemedText>
            <ThemedText className="font-semibold">{orderNumber}</ThemedText>
          </View>
          <View className="flex-row justify-between">
            <ThemedText className="text-gray-600">Số tiền:</ThemedText>
            <ThemedText className="font-semibold text-blue-600">
              {amount.toLocaleString()}đ
            </ThemedText>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="w-full space-y-4">
          {status === "success" ? (
            <>
              <TouchableOpacity
                className="bg-blue-600 py-3 px-6 rounded-lg items-center"
                onPress={() => {}}
              >
                <ThemedText className="text-white font-semibold">
                  Xem chi tiết đơn hàng
                </ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                className="py-3 px-6 rounded-lg items-center"
                onPress={() => {}}
              >
                <ThemedText className="text-blue-600">
                  Trở về trang chủ
                </ThemedText>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                className="bg-blue-600 py-3 px-6 rounded-lg items-center"
                onPress={() => {}}
              >
                <ThemedText className="text-white font-semibold">
                  Thử lại
                </ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                className="py-3 px-6 rounded-lg items-center"
                onPress={() => {}}
              >
                <ThemedText className="text-blue-600">
                  Liên hệ hỗ trợ
                </ThemedText>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </ThemedView>
  );
}
