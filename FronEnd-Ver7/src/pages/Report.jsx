import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Send, AlertCircle, MessageSquareWarning } from "lucide-react";
import Swal from "sweetalert2";
import { API_BASEURL } from "../lib/api";

const Report = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    category: "",
    title: "",
    description: "",
    email: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ตรวจสอบข้อมูล
    if (
      !formData.category ||
      !formData.title ||
      !formData.description ||
      !formData.email
    ) {
      Swal.fire({
        icon: "warning",
        title: "กรุณากรอกข้อมูลให้ครบถ้วน",
        text: "โปรดกรอกข้อมูลในทุกช่องที่มีเครื่องหมาย *",
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_BASEURL}/api/data/create`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Swal.fire({
        icon: "success",
        title: "สำเร็จ!",
        text: "บันทึกรายงานปัญหาเรียบร้อยแล้ว",
        showConfirmButton: false,
        timer: 1500,
      });

      navigate("/my-reports"); // หรือไปหน้าที่ต้องการ
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: error.response?.data?.message || "ไม่สามารถบันทึกข้อมูลได้",
      });
    }
  };

  return (
    <div className="min-h-screen pt-[80px] mx-auto py-8 dark:bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto mt-20 bg-black/20 backdrop-blur-sm border border-blue-500/40 rounded-xl shadow-xl p-8 dark:bg-white/10">
          {/* Header */}
          <div className="flex items-center justify-center   space-x-3 mb-8">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-8 h-8 text-white dark:text-black/70" />
              <h1 className=" text-2xl font-bold text-white dark:text-black/80">
                รายงานปัญหา
              </h1>
            </div>
          </div>
          <div className="flex justify-end">
            <div className=" bg-white/10 backdrop-blur-sm border border-blue-500/40 rounded-xl shadow-xl p-2 pl-3 pr-3 space-x-2 hover:bg-gray-700/50  dark:bg-white/10 dar dark:hover:bg-gray-700/50">
              <button
                className="flex items-center space-x-2 text-white dark:text-black/80"
                onClick={() => navigate("/my-reports")}
              >
                <MessageSquareWarning className="w-5 h-5 mr-3" />
                รายงานของฉัน
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* ประเภทปัญหา */}
            <div>
              <label className="block text-white mb-2 dark:text-black/80">
                ประเภทปัญหา *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white/10 border border-blue-500/40 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-white/10 dark:text-black/80"
                required
              >
                <option value="" className="text-gray-600 ">
                  เลือกประเภทปัญหา
                </option>
                <option value="technical" className="text-gray-600">
                  ปัญหาทางเทคนิค
                </option>
                <option value="account" className="text-gray-600">
                  ปัญหาเกี่ยวกับบัญชี
                </option>
                <option value="suggestion" className="text-gray-600">
                  ข้อเสนอแนะ
                </option>
                <option value="other" className="text-gray-600">
                  อื่นๆ
                </option>
              </select>
            </div>

            {/* หัวข้อ */}
            <div>
              <label className="block text-white mb-2 dark:text-black/80">
                หัวข้อ *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="ระบุหัวข้อปัญหา"
                className="w-full px-4 py-2 bg-white/10 border border-blue-500/40 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-white/10 dark:text-black/80"
                required
              />
            </div>

            {/* อีเมล */}
            <div>
              <label className="block text-white mb-2 dark:text-black/80">
                อีเมลติดต่อกลับ *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@email.com"
                className="w-full px-4 py-2 bg-white/10 border border-blue-500/40 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-white/10 dark:text-black/80"
                required
              />
            </div>

            {/* รายละเอียด */}
            <div>
              <label className="block text-white mb-2 dark:text-black/80">
                รายละเอียด *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="อธิบายรายละเอียดของปัญหา"
                rows="5"
                className="w-full px-4 py-2 bg-white/10 border border-blue-500/40 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-white/10 dark:text-black/80"
                required
              />
            </div>

            {/* ปุ่มส่ง */}
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition duration-200"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className="flex-1 flex items-center justify-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition duration-200"
              >
                <Send className="w-5 h-5" />
                <span>ส่งรายงาน</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Report;
