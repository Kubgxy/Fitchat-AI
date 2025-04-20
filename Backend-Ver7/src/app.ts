import express, { Request, Response } from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import mongoose from "mongoose";
import multer from "multer";
import path from "path";
import { useSwagger } from "../middleware/swagger";
import auth from "./api/auth/route";
import data from "./api/data/route";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const corsOptions = {
  origin: "*", // อนุญาตทุก Origin
  methods: ["GET", "POST", "PATCH", "DELETE", "PUT"], // กำหนด HTTP Methods ที่อนุญาต
  allowedHeaders: ["Content-Type", "Authorization"], // Headers ที่อนุญาต
};
app.use(cors(corsOptions));
app.use("/uploads", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // อนุญาตทุก Origin
  res.header("Access-Control-Allow-Methods", "GET, OPTIONS"); // Methods ที่อนุญาต
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use(helmet());
useSwagger(app);

// กำหนดที่เก็บไฟล์อัปโหลด
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads"); // โฟลเดอร์ที่จะเก็บไฟล์อัปโหลด
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

// ให้บริการไฟล์ static และตั้งค่า CORS เฉพาะ static files
app.use(express.static("public")); // ให้บริการไฟล์จากโฟลเดอร์ public ใน root directory

// เชื่อมต่อ MongoDB
mongoose
  .connect(process.env.MONGODB_URI as string)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1); // หยุดเซิร์ฟเวอร์ถ้าเชื่อมต่อไม่ได้
  });

//กำหนด path
app.use("/", auth);
app.use("/api/auth", auth);
app.use("/api/data", data);

// สร้าง API สำหรับอัปโหลดไฟล์
app.post(
  "/api/upload",
  upload.single("attachment"),
  (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(400).json({
        code: "ERROR-02-0001",
        status: "Error",
        data: {
          msg: "No file uploaded",
        },
      });
    }

    // สร้าง URL สำหรับไฟล์ที่อัปโหลด
    const fileUrl = `/uploads/${req.file.filename}`;

    res.status(200).json({
      code: "SUCCESS-02-0001",
      status: "Success",
      data: {
        filename: req.file.filename,
        path: fileUrl, // URL ของไฟล์ที่อัปโหลด
        msg: "File uploaded successfully",
      },
    });
  }
);
// เริ่มต้นเซิร์ฟเวอร์
const port = process.env.PORT || 5000; // กำหนดค่าเริ่มต้นให้ PORT เป็น 5000
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
