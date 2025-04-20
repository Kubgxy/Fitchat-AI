import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // ข้อมูลส่วนตัว
    user_id: {
      type: String,
      unique: true,
      required: true,
    },
    first_name: {
      type: String,
      required: true,
      trim: true,
    },
    last_name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function (v) {
          return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
        },
        message: "กรุณากรอกอีเมลให้ถูกต้อง",
      },
    },
    phone_number: {
      type: String,
      default: null,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profile_image: {
      type: String,
      default: "",
    },

    // ข้อมูลการสร้างและอัพเดท
    created_at: {
      type: Date,
      default: Date.now,
    },
    updated_at: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// เพิ่ม index เพื่อการค้นหาที่มีประสิทธิภาพ
userSchema.index({ email: 1, username: 1 });

const User = mongoose.model("User", userSchema);

export default User;
