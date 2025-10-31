import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { User } from "../models/User";

const router = Router();

const registerSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  password: z.string().min(6),
});

router.post("/register", async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error.flatten());

  const { email, name, password } = parsed.data;
  if (await User.findOne({ email }))
    return res.status(409).json({ message: "Email đã tồn tại" });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ email, name, passwordHash });
  res.status(201).json({ id: user._id, email: user.email, name: user.name });
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

router.post("/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error.flatten());

  const { email, password } = parsed.data;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ message: "Sai email hoặc mật khẩu" });
  }

  const accessToken = jwt.sign(
    { sub: user._id, email: user.email, role: user.role || "user" },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  );

  res.json({
    success: true,
    accessToken,
    user: { 
      _id: user._id, 
      id: user._id,
      email: user.email, 
      name: user.name,
      role: user.role || "user",
      avatar: user.avatar,
      phone: user.phone,
    },
  });
});

export default router;
