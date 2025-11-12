import nodemailer from "nodemailer";

const smtpService = process.env.SMTP_SERVICE;
const smtpHost = process.env.SMTP_HOST;
const smtpPort = Number(process.env.SMTP_PORT || 587);
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
const smtpFrom =
  process.env.SMTP_FROM ||
  (smtpUser ? `"Travel App" <${smtpUser}>` : "Travel App <no-reply@travel-app.local>");

const hasServiceCredentials = Boolean(smtpService && smtpUser && smtpPass);
const hasHostCredentials = Boolean(smtpHost && smtpUser && smtpPass);
const emailEnabled = hasServiceCredentials || hasHostCredentials;

const transporter = emailEnabled
  ? nodemailer.createTransport(
      hasServiceCredentials
        ? {
            service: smtpService,
            auth: {
              user: smtpUser,
              pass: smtpPass,
            },
          }
        : {
            host: smtpHost,
            port: smtpPort,
            secure: smtpPort === 465 || process.env.SMTP_SECURE === "true",
            auth: {
              user: smtpUser,
              pass: smtpPass,
            },
          }
    )
  : null;

if (!emailEnabled) {
  console.warn(
    "[email] SMTP is not fully configured. Set SMTP_SERVICE (e.g. gmail) with SMTP_USER/SMTP_PASS, " +
      "or SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASS to enable booking confirmation emails."
  );
}

interface BookingSummary {
  id: string;
  totalPrice?: number;
  quantity?: number;
  travelDate?: string | Date;
  contactName?: string;
  paymentStatus?: string;
  specialRequests?: string;
}

interface TourSummary {
  title: string;
  destination?: string;
  duration?: number;
  price?: number;
}

const formatCurrency = (value?: number) => {
  if (typeof value !== "number") return "Đang cập nhật";
  return `${value.toLocaleString("vi-VN")}₫`;
};

const formatDate = (value?: string | Date) => {
  if (!value) return "Đang cập nhật";
  const date = value instanceof Date ? value : new Date(value);
  return date.toLocaleDateString("vi-VN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export async function sendBookingConfirmationEmail(options: {
  to: string;
  booking: BookingSummary;
  tour: TourSummary;
  appUrl?: string;
}) {
  if (!emailEnabled || !transporter) {
    console.warn(
      "[email] Booking confirmation email skipped because SMTP credentials are not configured."
    );
    return false;
  }

  const { to, booking, tour, appUrl } = options;
  const recipientName = booking.contactName || "Quý khách";

  const html = `
    <div style="font-family: Arial, Helvetica, sans-serif; line-height: 1.6; color: #1f2937;">
      <h2 style="color: #4f46e5;">Xin chào ${recipientName},</h2>
      <p>Cảm ơn bạn đã đặt tour <strong>${tour.title}</strong> trên Travel App.</p>

      <div style="margin-top: 20px; padding: 16px; border-radius: 12px; background: #f9fafb; border: 1px solid #e5e7eb;">
        <h3 style="margin-bottom: 12px; color: #111827;">Thông tin tour</h3>
        <ul style="margin: 0; padding-left: 20px;">
          <li><strong>Điểm đến:</strong> ${tour.destination || "Đang cập nhật"}</li>
          <li><strong>Thời gian khởi hành:</strong> ${formatDate(booking.travelDate)}</li>
          <li><strong>Số lượng khách:</strong> ${booking.quantity ?? "Đang cập nhật"}</li>
          <li><strong>Tổng số tiền:</strong> ${formatCurrency(booking.totalPrice)}</li>
          <li><strong>Trạng thái thanh toán:</strong> ${
            booking.paymentStatus ? booking.paymentStatus : "Đang xử lý"
          }</li>
        </ul>
      </div>

      ${
        booking.specialRequests
          ? `
        <div style="margin-top: 16px; padding: 16px; background: #eef2ff; border-radius: 12px; border: 1px solid #c7d2fe;">
          <strong>Ghi chú của bạn:</strong>
          <p style="margin-top: 8px;">${booking.specialRequests}</p>
        </div>
      `
          : ""
      }

      <p style="margin-top: 20px;">
        Mã đặt tour của bạn là <strong>${booking.id}</strong>. Vui lòng lưu lại thông tin này để tiện tra cứu.
      </p>

      ${
        appUrl
          ? `<p>Bạn có thể theo dõi lịch trình và cập nhật tại: <a href="${appUrl}" style="color:#4f46e5;">${appUrl}</a></p>`
          : ""
      }

      <p style="margin-top: 24px;">Nếu bạn cần hỗ trợ, vui lòng liên hệ đội ngũ chăm sóc khách hàng của Travel App.</p>

      <p style="margin-top: 24px;">
        Trân trọng,<br/>
        <strong>Đội ngũ Travel App</strong>
      </p>
    </div>
  `;

  const text = `
Xin chào ${recipientName},

Cảm ơn bạn đã đặt tour ${tour.title} trên Travel App.

- Điểm đến: ${tour.destination || "Đang cập nhật"}
- Thời gian khởi hành: ${formatDate(booking.travelDate)}
- Số lượng khách: ${booking.quantity ?? "Đang cập nhật"}
- Tổng số tiền: ${formatCurrency(booking.totalPrice)}
- Trạng thái thanh toán: ${booking.paymentStatus ? booking.paymentStatus : "Đang xử lý"}

${booking.specialRequests ? `Ghi chú: ${booking.specialRequests}\n` : ""}Mã đặt tour: ${
    booking.id
  }

Nếu cần hỗ trợ, hãy liên hệ đội ngũ chăm sóc khách hàng của Travel App.

Trân trọng,
Travel App
`;

  try {
    await transporter.sendMail({
      from: smtpFrom,
      to,
      subject: `Xác nhận đặt tour: ${tour.title}`,
      html,
      text,
    });
    return true;
  } catch (error) {
    console.error("[email] Failed to send booking confirmation email:", error);
    throw error;
  }
}

export const emailService = {
  sendBookingConfirmationEmail,
  isEnabled: () => emailEnabled,
};

