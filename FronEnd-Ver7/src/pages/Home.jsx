import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Home = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/chatapp");
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-center dark:bg-gray-100 transition-colors duration-300 font-['Prompt']">
      {/* Background overlay */}
      <div className="absolute inset-0" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 z-10 mt-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* ข้อความด้านซ้าย */}
          <div className="text-center md:text-left">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6 leading-snug dark:text-black">
              FitChat AI
            </h1>
            <p className="text-lg sm:text-xl text-gray-400 mb-8 max-w-3xl mx-auto md:mx-0 dark:text-black">
              ปรึกษาเรื่องสุขภาพ, การออกกำลังกาย ด้วย AI ที่เข้าใจคุณ
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleClick}
              className="w-[300px] px-4 py-3 bg-black/50 border border-blue-500/40 hover:bg-black/80 rounded-lg text-white font-medium transition duration-200 dark:text-white dark:bg-gray-600 dark:hover:bg-gray-900 dark:border-blue-500 "
            >
              เริ่มต้นใช้งาน
            </motion.button>
          </div>

          {/* โลโก้ด้านขวา */}
          <div className="flex flex-col items-center justify-center">
            <motion.img
              src="/src/assets/Logo4.png"
              alt="AI Chat"
              className="w-[240px] h-[240px] lg:w-[300px] lg:h-[300px]"
              animate={{ y: [0, -20, 0] }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
            />
            <h1 className="text-5xl font-bold text-white drop-shadow-[0_0_15px_rgba(173,216,250,0.7)] text-center dark:text-black dark:drop-shadow-[0_0_15px_rgba(0,0,0,0.7)]">
              FitChat AI
            </h1>
          </div>
        </div>

        {/* ✅ จุดเด่นของระบบ */}
        <div className="mt-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-white dark:text-black">
            {[
              {
                icon: "🏋️",
                title: "แนะนำท่าฝึกตามกล้ามเนื้อ",
                desc: "เลือกกล้ามเนื้อที่ต้องการ แล้วรับคำแนะนำท่าฝึกเฉพาะจุดได้ทันที",
              },
              {
                icon: "📊",
                title: "แสดงข้อมูลท่าฝึกแบบละเอียด",
                desc: "อธิบายวิธีทำท่า, จำนวนเซ็ต, ความปลอดภัย และกล้ามเนื้อที่ใช้",
              },
              {
                icon: "🧩",
                title: "ค้นหาท่าฝึกจากคำถาม",
                desc: "ถามเป็นภาษาคน เช่น “อยากเล่นหลังแต่ไม่อยากใช้ดัมเบล” ก็เข้าใจได้",
              },
            ].map((f, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.03 }}
                className="p-6 bg-black/40 dark:bg-white/30 rounded-xl shadow-md border border-blue-500/20 text-center"
              >
                <div className="text-3xl mb-2">{f.icon}</div>
                <h3 className="text-lg font-bold mb-1">{f.title}</h3>
                <p className="text-sm opacity-80">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
