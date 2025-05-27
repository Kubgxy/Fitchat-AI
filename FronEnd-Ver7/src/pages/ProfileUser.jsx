import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { User, Edit2, Save } from "lucide-react";
import moment from "moment";
import "moment/locale/th";
import { API_BASEURL } from "../../lib/api"; 


const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    age: "",
  });
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(null);
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASEURL}/api/auth/getuser`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUserData(res.data);
      setFormData(res.data);
      setLoading(false);
    } catch (err) {
      Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถโหลดข้อมูลได้", "error");
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setAvatar(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const data = new FormData();
      Object.entries(formData).forEach(([k, v]) => data.append(k, v));
      if (avatar) data.append("avatar", avatar);

      await axios.patch(`${API_BASEURL}/api/auth/editdata`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      Swal.fire("สำเร็จ", "บันทึกข้อมูลเรียบร้อย", "success");
      setIsEditing(false);
      fetchUserData();
    } catch (err) {
      Swal.fire("ผิดพลาด", "ไม่สามารถบันทึกข้อมูลได้", "error");
    }
  };

  const handlePasswordChange = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${API_BASEURL}/api/auth/change-password`,
        passwordData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      Swal.fire("เปลี่ยนรหัสผ่านสำเร็จ", "", "success");
      setPasswordData({ current_password: "", new_password: "" });
    } catch (err) {
      Swal.fire(
        "เปลี่ยนรหัสผ่านล้มเหลว",
        err.response?.data?.message || "",
        "error"
      );
    }
  };

  if (loading) return <div className="text-center mt-10">กำลังโหลด...</div>;

  return (
    <div className="min-h-screen py-8 dark:bg-gray-100">
      <div className="container mx-auto max-w-5xl  mt-[120px] border border-blue-500/50 rounded-xl">
        <div className="p-6 rounded-xl bg-black/20 dark:bg-white shadow ">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="relative group transition-all duration-300 shadow-xl rounded-full ">
                <div className="w-20 h-20  rounded-full overflow-hidden border-4 border-blue-500 shadow-lg animate-pulse group-hover:ring-4 group-hover:ring-blue-300 transition">
                  {preview ? (
                    <img
                      src={preview}
                      alt="preview"
                      className="w-full h-full object-cover"
                    />
                  ) : userData?.profile_image ? (
                    <img
                      src={`${API_BASEURL}${userData.profile_image}`}
                      alt="avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-8 h-8 text-white dark:text-black m-auto" />
                  )}
                </div>
                {isEditing && (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                    title="เลือกรูป"
                  />
                )}
                {isEditing && (
                  <div className="text-sm text-white/60 text-center mt-2">
                    คลิกเพื่อเปลี่ยนรูป
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white dark:text-black">
                  {userData.first_name} {userData.last_name}
                </h1>
              </div>
            </div>

            <button
              onClick={() => {
                if (isEditing)
                  document.getElementById("profile-form")?.requestSubmit();
                else setIsEditing(true);
              }}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              {isEditing ? <Save size={18} /> : <Edit2 size={18} />}
              <span>{isEditing ? "บันทึก" : "แก้ไข"}</span>
            </button>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            id="profile-form"
            className="dark:text-black p-4"
          >
            <h2 className="mt-6 text-white dark:text-black font-semibold">
              จัดการข้อมูลส่วนตัวของคุณ
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="ID" value={userData.user_id} disabled />
              <Input
                label="อีเมล"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!isEditing}
              />
              <Input
                label="ชื่อ"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                disabled={!isEditing}
              />
              <Input
                label="นามสกุล"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                disabled={!isEditing}
              />
              <Input
                label="เบอร์โทรศัพท์"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                disabled={!isEditing}
              />
              <Input
                label="วันที่สมัคร"
                name="created_at"
                type="text"
                value={moment(formData.created_at).locale("th").format("L")}
                disabled
              />
            </div>

            {/* 🔒 ฟอร์มเปลี่ยนรหัสผ่าน */}
            <div className="mt-10  rounded-lg">
              <h2 className="text-white dark:text-black font-bold mb-4">
                เปลี่ยนรหัสผ่าน
              </h2>
              <input
                type="password"
                placeholder="รหัสผ่านปัจจุบัน"
                value={passwordData.current_password}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    current_password: e.target.value,
                  })
                }
                className="w-full px-4 py-2 mb-4 bg-white/10 text-white border border-blue-500/50 rounded-lg dark:bg-white/10 dark:text-black "
              />
              <input
                type="password"
                placeholder="รหัสผ่านใหม่"
                value={passwordData.new_password}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    new_password: e.target.value,
                  })
                }
                className="w-full px-4 py-2 mb-4 bg-white/10 text-white border border-blue-500/50 rounded-lg dark:bg-white/10 dark:text-black"
              />
              <button
                type="button"
                onClick={handlePasswordChange}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                เปลี่ยนรหัสผ่าน
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// ✅ Reusable Input
const Input = ({ label, ...props }) => (
  <div>
    <label className="block text-white dark:text-black mb-1">{label}</label>
    <input
      {...props}
      className="w-full px-4 py-2 bg-white/10 border border-blue-500/50 text-white rounded-lg dark:bg-white/10 dark:text-black"
    />
  </div>
);

export default Profile;
