import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini AI
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenerativeAI(apiKey);
};

// System prompt for travel assistant
const SYSTEM_PROMPT = `Bạn là trợ lý du lịch thông minh của một ứng dụng đặt tour du lịch. Nhiệm vụ của bạn là:

1. **Tư vấn tour**: Giúp người dùng tìm tour phù hợp theo địa điểm, ngân sách, sở thích
2. **Hướng dẫn đặt tour**: Giải thích cách đặt tour, thanh toán, hủy booking
3. **Trả lời câu hỏi**: Về chính sách, phương thức thanh toán, loại tour
4. **Hỗ trợ booking**: Kiểm tra trạng thái booking, hướng dẫn hủy tour

**Thông tin về ứng dụng:**
- Có các loại tour: Adventure (mạo hiểm), Culture (văn hóa), Beach (biển), Mountain (núi), City (thành phố)
- Phương thức thanh toán: Thẻ tín dụng, ví điện tử (MoMo, ZaloPay), chuyển khoản ngân hàng
- Chính sách hủy: Hủy trước 7 ngày hoàn 100%, 3-7 ngày hoàn 50%, dưới 3 ngày không hoàn tiền
- User có thể xem booking trong tab "Chuyến đi", lịch sử trong tab "Lịch sử"
- User có thể tìm tour trong màn hình "Khám phá" với các bộ lọc

**Cách trả lời:**
- Trả lời bằng tiếng Việt, thân thiện và nhiệt tình
- Ngắn gọn, dễ hiểu
- Nếu không chắc chắn, hướng dẫn user vào các màn hình trong app để xem chi tiết
- Không tạo thông tin giả, chỉ dựa trên thông tin đã cung cấp

Hãy trả lời câu hỏi của người dùng một cách hữu ích và chuyên nghiệp.`;

export const getGeminiResponse = async (
  userMessage: string,
  userId?: string
): Promise<string | null> => {
  try {
    const genAI = getGeminiClient();
    if (!genAI) {
      return null; // No API key, fallback to rule-based
    }

    // Try different models in order of preference
    const modelsToTry = [
      "gemini-1.5-flash-latest",
      "gemini-1.5-pro-latest", 
      "gemini-pro",
      "gemini-1.0-pro"
    ];

    let lastError: any = null;
    
    for (const modelName of modelsToTry) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const prompt = `${SYSTEM_PROMPT}\n\nNgười dùng hỏi: ${userMessage}\n\nHãy trả lời:`;
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return text.trim();
      } catch (error: any) {
        lastError = error;
        // Try next model
        continue;
      }
    }

    // If all models failed, log the error
    console.error("Gemini API error - all models failed:", lastError?.message);
    return null; // Fallback to rule-based on error
  } catch (error: any) {
    console.error("Gemini API error:", error.message);
    return null; // Fallback to rule-based on error
  }
};

