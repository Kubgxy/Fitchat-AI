import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../../models/User";
import multer from "multer";
import path from "path";
import { verifyToken } from "../../middleware/auth";

const auth = express.Router();
const SECRET_KEY = process.env.SECRET_KEY || "fitchat";

// ✅ กำหนดที่เก็บไฟล์ + ตั้งชื่อไฟล์
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // โฟลเดอร์ปลายทาง
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const upload = multer({ storage }); // ✅ ตัวแปรนี้แหละที่ใช้กับ upload.single()

// ฟังก์ชันสำหรับสร้าง user_id ที่ไม่ซ้ำ
const generateUniqueUserId = async (): Promise<string> => {
  let userId: string;
  let isUnique = false;

  while (!isUnique) {
    userId = Math.floor(1000 + Math.random() * 9000).toString(); // สุ่มเลข 4 หลัก
    const existingUser = await User.findOne({ user_id: userId });
    if (!existingUser) {
      isUnique = true;
    }
  }

  return userId!;
};

// Register API
auth.post("/register", upload.single("avatar"), async (req: Request, res: Response) => {
  const {
    first_name,
    last_name,
    email,
    phone_number,
    username,
    password,
    confirm_password,
  } = req.body;

  try {
    // ตรวจสอบข้อมูลที่จำเป็น
    if (
      !username ||
      !password ||
      !email ||
      !first_name ||
      !last_name ||
      !confirm_password
    ) {
      return res.status(400).json({
        message: "กรุณากรอกข้อมูลให้ครบถ้วน",
        missingFields: {
          username: !username,
          email: !email,
          first_name: !first_name,
          last_name: !last_name,
          password: !password,
          confirm_password: !confirm_password,
        },
      });
    }

    // ตรวจสอบเบอร์โทรศัพท์
    if (phone_number && !/^[0-9]{10}$/.test(phone_number)) {
      return res.status(400).json({ message: "เบอร์โทรศัพท์ต้องเป็นตัวเลข 10 หลัก" });
    }

    // ตรวจสอบรหัสผ่าน
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message: "รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร และประกอบด้วยตัวอักษรและตัวเลข",
      });
    }

    // ตรวจสอบความซ้ำของ username, email, phone
    const existingUser = await User.findOne({
      $or: [{ username }, { email }, { phone_number }],
    });

    if (existingUser) {
      let message = "";
      if (existingUser.username === username) message = "ชื่อผู้ใช้นี้ถูกใช้งานแล้ว";
      else if (existingUser.email === email) message = "อีเมลนี้ถูกใช้งานแล้ว";
      else if (existingUser.phone_number === phone_number)
        message = "เบอร์โทรศัพท์นี้ถูกใช้งานแล้ว";

      return res.status(400).json({ message });
    }

    // ✅ สร้าง user_id อัตโนมัติแบบไม่ซ้ำ
    const user_id = await generateUniqueUserId();

    // สร้างผู้ใช้ใหม่
    const avatar = req.file ? `/uploads/${req.file.filename}` : undefined;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      user_id,
      first_name,
      last_name,
      email,
      phone_number,
      username,
      password: hashedPassword,
      confirm_password,
      profile_image: avatar,
    });

    await newUser.save();

    const token = jwt.sign({ userId: newUser._id }, SECRET_KEY, { expiresIn: "1h" });

    res.status(201).json({
      message: "ลงทะเบียนสำเร็จ",
      token,
      user: {
        id: newUser._id,
        user_id: newUser.user_id,
        username: newUser.username,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        email: newUser.email,
        profile_image: newUser.profile_image,
      },
    });
  } catch (error: unknown) {
    console.error("Error in registration:", error);
    let errorMessage = "เกิดข้อผิดพลาดในระบบ";

    if (error instanceof Error && (error as any).code === 11000) {
      errorMessage = "ข้อมูลซ้ำซ้อน";
    }

    res.status(500).json({
      message: errorMessage,
      error:
        process.env.NODE_ENV === "development"
          ? error instanceof Error
            ? error.message
            : String(error)
          : undefined,
    });
  }
});


//API Login
auth.post("/login", async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    // ตรวจสอบว่ามีข้อมูลครบไหม
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Please provide username and password" });
    }

    // ค้นหา user จาก username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // ตรวจสอบ password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // สร้าง token

    const payload = {
      userId: user.user_id,
      id: user._id,
      username: user.username,
      email: user.email,
    };
    
    const SECRET_KEY = "fitchat";
    
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });
    console.log("TOKEN = ", token)
    // ส่งข้อมูลกลับ
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        userId: user.user_id,
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Logout API
auth.post("/logout", (req: Request, res: Response) => {
  // ในกรณีที่ใช้ LocalStorage → เราแค่ตอบกลับเฉย ๆ ว่า Logout สำเร็จ

  res.status(200).json({
    message: "Logout successful",
  });
});


// ตัวอย่าง Express
auth.get("/getuser", verifyToken, async (req: Request, res: Response) => {
  try {
    const { userId } = req.user; // ✅ ดึงจาก req.user ได้แน่นอน
    console.log("🪪 userId ที่ได้จาก token:", userId);

    const user = await User.findOne({ user_id: userId });
    if (!user) {
      return res.status(404).json({ message: "ไม่พบผู้ใช้" });
    }

    res.json(user);
  } catch (error) {
    console.error("❌ เกิดข้อผิดพลาดใน getuser:", error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในฝั่งเซิร์ฟเวอร์" });
  }
});



auth.patch("/editdata", verifyToken, upload.single("avatar"), async (req: Request, res: Response) => {
  try {
    const {
      first_name,
      last_name,
      email,
      phone_number,
      age,
    } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "ไม่พบข้อมูลผู้ใช้" });
    }

    if (first_name) user.first_name = first_name;
    if (last_name) user.last_name = last_name;
    if (email) user.email = email;
    if (phone_number) user.phone_number = phone_number;

    // ✅ ถ้ามีการอัปโหลด avatar ใหม่
    if (req.file) {
      user.profile_image = `/uploads/${req.file.filename}`;
    }

    await user.save();
    res.json({ message: "อัปเดตข้อมูลสำเร็จ" });
  } catch (error) {
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการอัพเดทข้อมูล" });
  }
});

// PATCH /change-password
auth.patch("/change-password", verifyToken, async (req: Request, res: Response) => {
  const { current_password, new_password } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "ไม่พบผู้ใช้" });

    const match = await bcrypt.compare(current_password, user.password);
    if (!match) return res.status(400).json({ message: "รหัสผ่านเดิมไม่ถูกต้อง" });

    user.password = await bcrypt.hash(new_password, 10);
    await user.save();
    res.json({ message: "เปลี่ยนรหัสผ่านเรียบร้อย" });
  } catch (err) {
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน" });
  }
});



export default auth;
