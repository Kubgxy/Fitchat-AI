import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import { useTheme } from "../components/ThemeContext";

const Login = () => {
  const [rememberMe, setRememberMe] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData
      );

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("user_id", response.data.user.user_id);
      console.log("userId:", response.data.user.userId);

      if (rememberMe) {
        localStorage.setItem("username", formData.username);
        localStorage.setItem("password", formData.password);
      }

      await Swal.fire({
        icon: "success",
        title: "เข้าสู่ระบบสำเร็จ",
        text: "ยินดีต้อนรับเข้าสู่ระบบ!",
        showConfirmButton: false,
        timer: 1500,
        customClass: {
          popup: "rounded-lg",
          title: "text-xl",
          text: "text-gray-600",
        },
      });

      navigate("/home");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: error.response?.data?.message || "ไม่สามารถเข้าสู่ระบบได้",
        confirmButtonColor: "#3b82f6",
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleThemeChange = () => {
    toggleTheme();

    const isDark = theme === "dark"; // ก่อน toggle = dark → จะเปลี่ยนเป็น light

    Swal.fire({
      toast: true,
      position: "bottom-end",
      icon: isDark ? "success" : "info",
      title: isDark ? "Switched to Dark Mode 🌜" : "Switched to Light Mode 🌞",
      background: isDark ? "#f4f4f4" : "#1f2937", // bg-white vs bg-gray-800
      color: isDark ? "#111827" : "#f9fafb", // text-black vs text-white
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
      customClass: {
        popup: "rounded-xl shadow-lg",
        title: "text-sm font-medium",
      },
    });
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row items-center justify-center px-4 py-12 relative dark:bg-gray-100">
      <div className="absolute top-4 right-4 z-50">
        <button
          onClick={handleThemeChange}
          className="relative w-16 h-7 bg-gray-300 dark:bg-gray-700 rounded-full transition-colors duration-300 p-1 flex items-center"
        >
          <div
            className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
              theme === "dark" ? "translate-x-8" : ""
            }`}
          ></div>
          <span className="absolute left-1 text-xs">🌙</span>
          <span className="absolute right-1 text-xs">🌞</span>
        </button>
      </div>

      {/* ส่วน Logo และข้อความ */}
      <div className="lg:mt-[-100px] text-center lg:text-left">
        <div className="flex justify-center lg:justify-start">
          <motion.img
            src="/src/assets/Logo4.png"
            alt="AI Chat"
            className="w-[200px] h-[200px] sm:w-[250px] sm:h-[250px] lg:w-[300px] lg:h-[300px]"
            animate={{ y: [0, -20, 0] }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
        </div>
        <h1
          className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white drop-shadow-[0_0_20px_rgba(173,216,250,0.7)] mt-6 dark:text-gray-900"
          style={{ fontFamily: "'Audiowide', sans-serif" }}
        >
          FitChat AI
        </h1>
        <p className="text-gray-500 text-base sm:text-lg mt-2">
          ผู้ช่วยโค้ชส่วนตัวอัจฉริยะเพื่อสุขภาพที่ดีกว่า
        </p>
      </div>

      {/* กล่อง Login */}
      <div className="lg:w-[650px] sm:w-[500px] w-full bg-transparent mt-12 lg:mt-0 lg:ml-16 p-6 sm:p-8 relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 dark:text-gray-900">
            เข้าสู่ระบบ
          </h1>
          <p className="text-gray-200 dark:text-gray-600">
            เข้าสู่ระบบเพื่อเริ่มใช้งาน
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-200 mb-2 dark:text-gray-600 "
            >
              username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              onChange={handleChange}
              required
              value={formData.username}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-blue-500/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="username"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-200 mb-2 dark:text-gray-600"
            >
              password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              onChange={handleChange}
              required
              value={formData.password}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-blue-500/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="••••••••"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
              />
              <label
                htmlFor="remember"
                className="ml-2 block text-sm text-gray-200 dark:text-gray-600"
              >
                จดจำฉัน
              </label>
            </div>
            <a
              onClick={() => navigate("/forgot-password")}
              className="text-sm text-blue-300 hover:text-blue-400 transition"
            >
              ลืมรหัสผ่าน?
            </a>
          </div>

          <button
            type="submit"
            className="w-full px-4 py-3 bg-black/50 border border-blue-500/40 hover:bg-black/80 rounded-lg text-white font-medium transition duration-200 dark:text-white dark:bg-gray-600 dark:hover:bg-gray-900 dark:border-blue-500 "
          >
            เข้าสู่ระบบ
          </button>
        </form>

        <p className="mt-6 text-center text-gray-200 dark:text-gray-600">
          ยังไม่มีบัญชี?{" "}
          <a
            onClick={() => navigate("/register")}
            className="text-blue-300 hover:text-blue-400 font-medium transition cursor-pointer dark:text-blue-500 dark:hover:text-blue-700"
          >
            สมัครสมาชิก
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
