import "dotenv/config";
import { connectDB } from "./db";
import { User } from "./models/User";
import bcrypt from "bcryptjs";

/**
 * Script để reset password cho user cụ thể
 * Usage: npx ts-node src/reset-password.ts <email> <newPassword>
 * Example: npx ts-node src/reset-password.ts minh123@gmail.com 123123
 */
async function resetPassword() {
  try {
    await connectDB();
    
    const email = process.argv[2];
    const newPassword = process.argv[3] || "123123";
    
    if (!email) {
      console.error("❌ Vui lòng cung cấp email!");
      console.log("Usage: npx ts-node src/reset-password.ts <email> [password]");
      process.exit(1);
    }
    
    const passwordHash = await bcrypt.hash(newPassword, 10);
    
    const user = await User.findOneAndUpdate(
      { email },
      { passwordHash },
      { new: true }
    );
    
    if (!user) {
      console.error(`❌ Không tìm thấy user với email: ${email}`);
      process.exit(1);
    }
    
    console.log(`✅ Đã reset password cho ${email}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Password mới: ${newPassword}`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Reset password failed:", error);
    process.exit(1);
  }
}

resetPassword();

