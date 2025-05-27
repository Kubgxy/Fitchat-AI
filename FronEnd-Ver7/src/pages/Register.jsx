import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { Eye, EyeOff } from "lucide-react";
import { useTheme } from "../components/ThemeContext";
import { API_BASEURL } from "../../lib/api"; 

const Register = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    phone_number: "",
    username: "",
    password: "",
    confirm_password: "",
    first_name: "",
    last_name: "",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(null); // true / false / null
  const [showConfirm, setShowConfirm] = useState(false);

  // ฟังก์ชันสำหรับ Input field
  const renderInput = (
    label,
    name,
    type = "text",
    required = false,
    showToggle = false
  ) => {
    const show = name === "password" ? showPassword : showConfirm;
    const toggle = () =>
      name === "password"
        ? setShowPassword(!showPassword)
        : setShowConfirm(!showConfirm);

    const handleChange = (e) => {
      const { value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));

      if (name === "password") {
        setPasswordStrength(getPasswordStrength(value));
        if (formData.confirm_password) {
          setPasswordMatch(value === formData.confirm_password);
        }
      }

      if (name === "confirm_password") {
        setPasswordMatch(value === formData.password);
      }
    };

    return (
      <div className="mb-4 relative">
        <label className="block mb-1 text-white dark:text-gray-900">
          {label} {required && "*"}
        </label>
        <input
          type={show && showToggle ? "text" : type}
          name={name}
          value={formData[name]}
          onChange={handleChange}
          required={required}
          className="w-full px-4 py-2 rounded-lg bg-white/10 text-white border border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10 dark:bg-gray-300 dark:text-gray-600"
        />
        {showToggle && (
          <span
            className="absolute right-3 top-9 cursor-pointer text-gray-300 hover:text-blue-400 dark:text-gray-600 dark:hover:text-blue-400"
            onClick={toggle}
          >
            {show ? <EyeOff size={20} /> : <Eye size={20} />}
          </span>
        )}

        {/* ความแข็งแรงของรหัสผ่าน */}
        {name === "password" && passwordStrength && (
          <p className={`text-xs mt-1 ${getStrengthColor(passwordStrength)}`}>
            ความแข็งแรงของรหัสผ่าน: {passwordStrength}
          </p>
        )}

        {/* ตรวจสอบการตรงกันของรหัสผ่าน */}
        {name === "confirm_password" && passwordMatch !== null && (
          <p
            className={`text-xs mt-1 ${
              passwordMatch ? "text-green-400" : "text-red-400"
            }`}
          >
            {passwordMatch ? "รหัสผ่านตรงกันแล้ว ✅" : "รหัสผ่านไม่ตรงกัน ❌"}
          </p>
        )}
      </div>
    );
  };

  const validateStep1 = () => {
    const { email, username, password, confirm_password } = formData;

    if (!email || !username || !password || !confirm_password) {
      Swal.fire({
        icon: "warning",
        title: "กรอกข้อมูลไม่ครบ",
        text: "กรุณากรอกข้อมูลให้ครบก่อนดำเนินการต่อ",
      });
      return false;
    }

    if (password !== confirm_password) {
      Swal.fire({
        icon: "warning",
        title: "รหัสผ่านไม่ตรงกัน",
        text: "กรุณากรอกรหัสผ่านให้ตรงกันทั้งสองช่อง",
      });
      return false;
    }

    return true;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfileImage(file);

    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreviewUrl(imageUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    for (let key in formData) {
      data.append(key, formData[key]);
    }
    if (profileImage) {
      data.append("avatar", profileImage);
    }

    try {
      await axios.post(`${API_BASEURL}/api/auth/register`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Swal.fire({
        icon: "success",
        title: "ลงทะเบียนสำเร็จ",
        text: "ยินดีต้อนรับ",
        timer: 1500,
        showConfirmButton: false,
      });

      navigate("/login");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: error.response?.data?.message || "ไม่สามารถลงทะเบียนได้",
      });
    }
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
  const getPasswordStrength = (password) => {
    if (password.length < 6) return "อ่อนมาก";
    if (!/\d/.test(password)) return "ปานกลาง";
    if (!/[A-Z]/.test(password)) return "ค่อนข้างดี";
    if (!/[!@#$%^&*]/.test(password)) return "ดีมาก";
  };

  const getStrengthColor = (strength) => {
    switch (strength) {
      case "อ่อนมาก":
        return "text-red-400";
      case "ปานกลาง":
        return "text-yellow-400";
      case "ค่อนข้างดี":
        return "text-blue-400";
      case "ดีมาก":
        return "text-green-400";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center  text-white px-4 py-10 dark:bg-gray-100">
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
      <h1 className="text-3xl font-bold mb-8 dark:text-gray-800">
        สมัครสมาชิก FitChat AI
      </h1>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg  p-8 rounded-lg "
      >
        {step === 1 && (
          <>
            {renderInput("Email", "email", "email", true)}
            {renderInput("Phone Number", "phone_number")}
            {renderInput("Username", "username", "text", true)}
            {renderInput("Password", "password", "password", true, true)}
            {renderInput(
              "Confirm Password",
              "confirm_password",
              "password",
              true,
              true
            )}

            <button
              type="button"
              onClick={() =>
                validateStep1()
                  ? setStep(2)
                  : Swal.fire({
                      icon: "warning",
                      title: "กรอกข้อมูลไม่ครบ",
                      text: "กรุณากรอกข้อมูลให้ครบก่อนดำเนินการต่อ",
                    })
              }
              className="w-full px-4 py-3 bg-black/50 border border-blue-500/40 hover:bg-black/80 rounded-lg text-white font-medium transition duration-200 dark:text-white dark:bg-gray-600 dark:hover:bg-gray-900 dark:border-blue-500 "
            >
              ถัดไป
            </button>
            <p className="mt-6 text-center text-gray-200 dark:text-gray-600">
              มีบัญชีแล้ว?{" "}
              <a
                onClick={() => navigate("/login")}
                className="text-blue-300 hover:text-blue-400 font-medium transition cursor-pointer dark:text-blue-500 dark:hover:text-blue-700"
              >
                เข้าสู่ระบบ
              </a>
            </p>
          </>
        )}

        {step === 2 && (
          <>
            <div className="flex justify-center mb-6">
              <label
                htmlFor="profile-upload"
                className="cursor-pointer relative"
              >
                <div className="w-[320px] h-[320px] rounded-full bg-white/10 border-2 border-gray-300 flex items-center justify-center overflow-hidden hover:opacity-80 transition dark:border-gray-600">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <span className="text-sm text-gray-300 dark:text-gray-400">
                      อัปโหลดรูป
                    </span>
                  )}
                </div>
                <input
                  type="file"
                  id="profile-upload"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>

            {renderInput("First Name", "first_name", "text", true)}
            {renderInput("Last Name", "last_name", "text", true)}

            <div className="flex gap-2 mt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full px-4 py-3 bg-gray-300/50 border border-blue-500/40 hover:bg-gray-400 rounded-lg text-white font-medium transition duration-200 dark:text-white dark:bg-gray-300 dark:hover:bg-gray-900 dark:border-blue-500 "
              >
                ย้อนกลับ
              </button>
              <button
                type="submit"
                className="w-full px-4 py-3 bg-black/50 border border-blue-500/40 hover:bg-black/80 rounded-lg text-white font-medium transition duration-200 dark:text-white dark:bg-gray-600 dark:hover:bg-gray-900 dark:border-blue-500 "
              >
                สมัครสมาชิก
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default Register;
