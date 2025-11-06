import "dotenv/config";
import { connectDB } from "./db";
import { User } from "./models/User";

async function migrateRoles() {
  try {
    await connectDB();
    console.log("🔄 Starting role migration...");

    // Find all users with role "admin" (old admin role) - convert to "staff"
    const oldAdmins = await User.find({ role: "admin" });
    console.log(`Found ${oldAdmins.length} users with old "admin" role`);

    // Update them to "staff" (except admin@travel.com which should be admin)
    if (oldAdmins.length > 0) {
      const result = await User.updateMany(
        { role: "admin", email: { $ne: "admin@travel.com" } },
        { $set: { role: "staff" } }
      );
      console.log(`✅ Updated ${result.modifiedCount} users from "admin" to "staff"`);
    }

    // Find all users with role "user" (old user role) - convert to "client"
    const oldUsers = await User.find({ role: "user" });
    console.log(`Found ${oldUsers.length} users with old "user" role`);

    // Update them to "client"
    if (oldUsers.length > 0) {
      const result = await User.updateMany(
        { role: "user" },
        { $set: { role: "client" } }
      );
      console.log(`✅ Updated ${result.modifiedCount} users from "user" to "client"`);
    }

    // Check if admin@travel.com exists, if not create it
    const adminExists = await User.findOne({ email: "admin@travel.com" });
    if (!adminExists) {
      const bcrypt = require("bcryptjs");
      const adminPasswordHash = await bcrypt.hash("password123", 10);
      await User.create({
        email: "admin@travel.com",
        name: "Admin User",
        passwordHash: adminPasswordHash,
        role: "admin",
      });
      console.log("✅ Created admin@travel.com with role 'admin'");
    } else {
      // Ensure admin@travel.com has admin role
      if (adminExists.role !== "admin") {
        await User.findByIdAndUpdate(adminExists._id, { role: "admin" });
        console.log("✅ Updated admin@travel.com to have 'admin' role");
      } else {
        console.log("✅ admin@travel.com already has 'admin' role");
      }
    }

    // Summary
    const counts = await User.aggregate([
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 },
        },
      },
    ]);

    console.log("\n📊 Role distribution:");
    counts.forEach((item) => {
      console.log(`   ${item._id || "null"}: ${item.count}`);
    });

    console.log("\n✅ Migration completed!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

migrateRoles();

