import React from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { useTheme } from "./ThemeContext";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  if (location.pathname === "/login") {
    return null;
  }
  if (location.pathname === "/register") {
    return null;
  }
  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "ยืนยันการออกจากระบบ",
      text: "คุณต้องการออกจากระบบใช่หรือไม่?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
    });

    if (result.isConfirmed) {
      // ลบ token และข้อมูลผู้ใช้ออกจาก localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("username");
      localStorage.removeItem("password");

      navigate("/login");
    }
  };

  const handleThemeChange = () => {
    toggleTheme();
  
    const isDark = theme === 'dark'; // ก่อน toggle = dark → จะเปลี่ยนเป็น light
  
    Swal.fire({
      toast: true,
      position: 'bottom-end',
      icon: isDark ? 'success' : 'info',
      title: isDark ? 'Switched to Dark Mode 🌜' : 'Switched to Light Mode 🌞',
      background: isDark ? '#f4f4f4' : '#1f2937', // bg-white vs bg-gray-800
      color: isDark ? '#111827' : '#f9fafb', // text-black vs text-white
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
      customClass: {
        popup: 'rounded-xl shadow-lg',
        title: 'text-sm font-medium',
      },
    });
  };
  

  const navigation = [
    { name: "หน้าหลัก", href: "/home" },
    { name: "ประวัติการแชท", href: "/chat-history" },
    { name: "เกี่ยวกับ", href: "/about" },
    { name: "ศูนย์ช่วยเหลือ", href: "/faq" },
    { name: "ตั้งค่า", href: "/profile" },
    { name: "รายงานปัญหา", href: "/report" },
    { name: "ออกจากระบบ", onClick: handleLogout },
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className="w-full bg-white/10 backdrop-blur-md text-white px-6 py-3 flex items-center justify-between shadow-md">
        <Link to="/home" className="flex items-center gap-2">
          <img
            src="/Logo4.png"
            alt="FITCHAT Logo"
            className="h-[55px] w-auto hover:opacity-80 transition-opacity"
          />
          <h1 className="text-white dark:text-black text-3xl font-bold drop-shadow-[0_0_5px_rgba(173,216,250,0.7)]">
            FitChat AI
          </h1>
        </Link>
        <div className="flex space-x-4">
          <button
            onClick={handleThemeChange}
            className="relative w-16 h-7 mt-1 bg-gray-300 dark:bg-gray-700 rounded-full transition-colors duration-300 p-1 flex items-center"
          >
            <div
              className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                theme === "dark" ? "translate-x-8" : ""
              }`}
            ></div>
            <span className="absolute left-1 text-xs">🌙</span>
            <span className="absolute right-2 text-xs">🌞</span>
          </button>

          <div className="hidden text-white sm:flex sm:space-x-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={item.onClick}
                className="hover:bg-gray-900/70 dark:hover:bg-gray-800/20 text-white dark:text-black rounded-md px-3 py-2 text-sm font-medium transition-all duration-200"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
