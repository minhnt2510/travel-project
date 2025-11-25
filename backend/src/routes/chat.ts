import { Router } from "express";
import { z } from "zod";
import { requireAuth, type AuthRequest } from "../middleware/auth";
import { Tour } from "../models/Tour";
import { Booking } from "../models/Booking";
import { getGeminiResponse } from "../services/gemini";

const router = Router();

const chatMessageSchema = z.object({
  message: z.string().min(1).max(1000),
});

// Simple rule-based chatbot (can be upgraded to AI later)
const getChatbotResponse = async (
  message: string,
  userId?: string
): Promise<string> => {
  const lowerMessage = message.toLowerCase().trim();

  // Greetings
  if (
    lowerMessage.includes("xin chào") ||
    lowerMessage.includes("hello") ||
    lowerMessage.includes("hi") ||
    lowerMessage.includes("chào")
  ) {
    return "Xin chào! Tôi là trợ lý du lịch của bạn. Tôi có thể giúp bạn:\n\n• Tìm kiếm tour theo địa điểm, giá, loại hình\n• Xem thông tin tour\n• Kiểm tra trạng thái booking\n• Hướng dẫn đặt tour\n• Trả lời câu hỏi về chính sách\n\nBạn cần hỗ trợ gì?";
  }

  // Help
  if (
    lowerMessage.includes("giúp") ||
    lowerMessage.includes("help") ||
    lowerMessage.includes("hỗ trợ")
  ) {
    return 'Tôi có thể giúp bạn:\n\n📋 **Tìm tour:**\n- "Tìm tour ở Đà Lạt"\n- "Tour giá dưới 2 triệu"\n- "Tour biển"\n\n📅 **Booking:**\n- "Kiểm tra booking của tôi"\n- "Cách đặt tour"\n- "Hủy booking"\n\n❓ **Câu hỏi:**\n- "Chính sách hủy tour"\n- "Phương thức thanh toán"\n\nBạn muốn hỏi gì?';
  }

  // Search tours by location
  if (
    lowerMessage.includes("tìm tour") ||
    lowerMessage.includes("tour ở") ||
    lowerMessage.includes("đi")
  ) {
    const locations = [
      "đà lạt",
      "sapa",
      "phú quốc",
      "hạ long",
      "nha trang",
      "huế",
      "hội an",
      "đà nẵng",
    ];
    const foundLocation = locations.find((loc) => lowerMessage.includes(loc));

    if (foundLocation) {
      return `Tôi đang tìm các tour ở ${foundLocation.toUpperCase()} cho bạn. Vui lòng vào màn hình "Khám phá" để xem danh sách tour hoặc tìm kiếm theo địa điểm.`;
    }
    return 'Bạn muốn tìm tour ở đâu? Tôi có thể giúp tìm tour ở:\n• Đà Lạt\n• Sapa\n• Phú Quốc\n• Hạ Long\n• Nha Trang\n• Huế\n• Hội An\n• Đà Nẵng\n\nHoặc bạn có thể vào màn hình "Khám phá" để xem tất cả tour.';
  }

  // Search tours by price
  if (
    lowerMessage.includes("giá") ||
    lowerMessage.includes("giá dưới") ||
    lowerMessage.includes("rẻ")
  ) {
    return 'Bạn có thể tìm tour theo giá trong màn hình "Khám phá" bằng cách sử dụng bộ lọc giá. Hoặc bạn có thể xem các tour "Ưu đãi" để tìm tour giảm giá.';
  }

  // Booking status
  if (
    lowerMessage.includes("booking") ||
    lowerMessage.includes("đặt tour") ||
    lowerMessage.includes("đơn hàng")
  ) {
    if (lowerMessage.includes("kiểm tra") || lowerMessage.includes("xem")) {
      return 'Để xem booking của bạn, vui lòng vào tab "Chuyến đi" để xem các booking đang chờ xác nhận, hoặc tab "Lịch sử" để xem các booking đã hoàn thành.';
    }
    if (lowerMessage.includes("hủy") || lowerMessage.includes("cancel")) {
      return 'Để hủy booking:\n1. Vào tab "Chuyến đi"\n2. Chọn booking cần hủy\n3. Nhấn nút "Hủy đặt tour"\n\nLưu ý: Bạn chỉ có thể hủy booking ở trạng thái "pending" hoặc "confirmed".';
    }
    return 'Bạn muốn:\n• Xem booking: Vào tab "Chuyến đi"\n• Đặt tour: Chọn tour và nhấn "Đặt tour"\n• Hủy booking: Vào chi tiết booking và nhấn "Hủy"';
  }

  // How to book
  if (
    lowerMessage.includes("cách đặt") ||
    lowerMessage.includes("làm sao đặt") ||
    lowerMessage.includes("hướng dẫn đặt")
  ) {
    return '**Hướng dẫn đặt tour:**\n\n1️⃣ Tìm tour bạn muốn đặt\n2️⃣ Nhấn vào tour để xem chi tiết\n3️⃣ Chọn ngày đi và số lượng người\n4️⃣ Điền thông tin liên hệ và người đi\n5️⃣ Chọn phương thức thanh toán\n6️⃣ Xác nhận đặt tour\n\nSau khi đặt thành công, bạn sẽ nhận được thông báo và có thể xem booking trong tab "Chuyến đi".';
  }

  // Cancellation policy
  if (
    lowerMessage.includes("hủy") ||
    lowerMessage.includes("cancel") ||
    lowerMessage.includes("chính sách")
  ) {
    if (
      lowerMessage.includes("chính sách") ||
      lowerMessage.includes("policy")
    ) {
      return '**Chính sách hủy tour:**\n\n• Hủy trước 7 ngày: Hoàn tiền 100%\n• Hủy trước 3-7 ngày: Hoàn tiền 50%\n• Hủy dưới 3 ngày: Không hoàn tiền\n\nĐể hủy booking, vào tab "Chuyến đi" và chọn booking cần hủy.';
    }
  }

  // Payment methods
  if (
    lowerMessage.includes("thanh toán") ||
    lowerMessage.includes("payment") ||
    lowerMessage.includes("trả tiền")
  ) {
    return "**Phương thức thanh toán:**\n\n💳 Thẻ tín dụng/ghi nợ\n📱 Ví điện tử (MoMo, ZaloPay)\n🏦 Chuyển khoản ngân hàng\n💵 Thanh toán khi đến nơi (một số tour)\n\nBạn có thể chọn phương thức thanh toán khi đặt tour.";
  }

  // Tour categories
  if (
    lowerMessage.includes("loại") ||
    lowerMessage.includes("category") ||
    lowerMessage.includes("kiểu")
  ) {
    return 'Chúng tôi có các loại tour:\n\n🏔️ **Adventure** - Du lịch mạo hiểm\n🏛️ **Culture** - Văn hóa, lịch sử\n🏖️ **Beach** - Biển đảo\n⛰️ **Mountain** - Núi rừng\n🏙️ **City** - Thành phố\n\nBạn có thể lọc tour theo loại trong màn hình "Khám phá".';
  }

  // Default response
  return 'Xin lỗi, tôi chưa hiểu câu hỏi của bạn. Bạn có thể:\n\n• Hỏi về tour: "Tìm tour ở Đà Lạt"\n• Kiểm tra booking: "Xem booking của tôi"\n• Hướng dẫn: "Cách đặt tour"\n• Chính sách: "Chính sách hủy tour"\n\nHoặc gõ "giúp" để xem danh sách các câu hỏi tôi có thể trả lời.';
};

/**
 * @swagger
 * /chat:
 *   post:
 *     summary: Gửi tin nhắn đến chatbot
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *             properties:
 *               message:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 1000
 *     responses:
 *       200:
 *         description: Chatbot response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 response:
 *                   type: string
 */
router.post("/chat", requireAuth, async (req: AuthRequest, res) => {
  try {
    const parsed = chatMessageSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid message" });
    }

    const { message } = parsed.data;
    const lowerMessage = message.toLowerCase().trim();

    // Build context from database based on user query
    let context = "";

    // If asking about tours/prices/locations, fetch relevant data
    if (
      lowerMessage.includes("tour") ||
      lowerMessage.includes("giá") ||
      lowerMessage.includes("đi") ||
      lowerMessage.includes("tìm")
    ) {
      // Extract location from message
      const locations = [
        "đà lạt",
        "sapa",
        "phú quốc",
        "hạ long",
        "nha trang",
        "huế",
        "hội an",
        "đà nẵng",
        "hà giang",
        "quy nhơn",
      ];
      const foundLocation = locations.find((loc) => lowerMessage.includes(loc));

      // Query tours based on location or get popular tours
      let query: any = {};
      if (foundLocation) {
        query.location = new RegExp(foundLocation, "i");
      }

      const tours = await Tour.find(query)
        .select(
          "title location price duration category rating reviewCount availableSeats"
        )
        .sort({ rating: -1, reviewCount: -1 })
        .limit(5)
        .lean();

      if (tours.length > 0) {
        context += "**Các tour có sẵn:**\n\n";
        tours.forEach((tour) => {
          context += `- **${tour.title}**\n`;
          context += `  Địa điểm: ${tour.location}\n`;
          context += `  Giá: ${tour.price.toLocaleString("vi-VN")}₫\n`;
          context += `  Thời gian: ${tour.duration} ngày\n`;
          context += `  Loại: ${tour.category}\n`;
          context += `  Đánh giá: ${tour.rating}/5 (${tour.reviewCount} đánh giá)\n`;
          context += `  Còn ${tour.availableSeats} chỗ\n\n`;
        });
      }
    }

    // If asking about bookings
    if (
      lowerMessage.includes("booking") ||
      lowerMessage.includes("đặt tour") ||
      lowerMessage.includes("chuyến đi")
    ) {
      const userBookings = await Booking.find({ userId: req.userId })
        .populate("tourId", "title location startDate")
        .select("status totalPrice numberOfPeople bookingDate")
        .sort({ bookingDate: -1 })
        .limit(3)
        .lean();

      if (userBookings.length > 0) {
        context += "\n**Booking của bạn:**\n\n";
        userBookings.forEach((booking: any) => {
          context += `- Tour: ${booking.tourId?.title || "N/A"}\n`;
          context += `  Trạng thái: ${booking.status}\n`;
          context += `  Số người: ${booking.numberOfPeople}\n`;
          context += `  Tổng tiền: ${booking.totalPrice.toLocaleString(
            "vi-VN"
          )}₫\n`;
          context += `  Ngày đặt: ${new Date(
            booking.bookingDate
          ).toLocaleDateString("vi-VN")}\n\n`;
        });
      } else {
        context += "\n**Bạn chưa có booking nào.**\n";
      }
    }

    // Try Gemini AI first with context, fallback to rule-based if not available
    let response: string;
    const geminiResponse = await getGeminiResponse(
      message,
      req.userId,
      context
    );

    if (geminiResponse) {
      response = geminiResponse;
    } else {
      // Fallback to rule-based chatbot
      response = await getChatbotResponse(message, req.userId);
    }

    res.json({ response });
  } catch (error: any) {
    console.error("Chat error:", error);
    res.status(500).json({ message: "Error processing chat message" });
  }
});

export default router;
