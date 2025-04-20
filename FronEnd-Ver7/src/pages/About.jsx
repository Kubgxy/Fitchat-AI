import React from "react";
import {
  Heart,
  Brain,
  Activity,
  Users,
  MessageSquare,
  Award,
} from "lucide-react";
import { motion } from "framer-motion";


const About = () => {
  return (
    <div className="min-h-screen pt-[80px]  h-screen overflow-auto dark:bg-gray-100">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center ">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 dark:text-black/80">
            เกี่ยวกับ FitChat AI
          </h1>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto dark:text-black/70">
            ผู้ช่วยอัจฉริยะด้านสุขภาพที่จะช่วยให้คุณดูแลสุขภาพได้อย่างมีประสิทธิภาพ
            ด้วยเทคโนโลยี AI ที่ทันสมัย
          </p>
        </div>
      </div>

      {/* Features */}
      <div className="container mx-auto px-4 ">
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

      {/* Benefits */}
      <div className="container mx-auto px-4 py-16 ">
        <h2 className="text-3xl font-bold text-white text-center mb-12 da dark:text-black/80">
          ประโยชน์ที่คุณจะได้รับ
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 ">
          <div className="flex items-start space-x-4 ">
            <div className="w-10 h-10 bg-white/20 rounded-full  flex items-center justify-center flex-shrink-0 dark:bg-black/20">
              <Heart className="w-5 h-5 text-white dark:text-black/80" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-2 dark:text-black/80">
                สุขภาพที่ดีขึ้น
              </h3>
              <p className="text-gray-200 dark:text-black/50">
                รับคำแนะนำด้านสุขภาพที่เหมาะสมกับคุณ
                เพื่อพัฒนาสุขภาพให้ดีขึ้นอย่างยั่งยืน
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 dark:bg-black/20">
              <Award className="w-5 h-5 text-white dark:text-black/80" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-2 dark:text-black/80">
                เป้าหมายที่เป็นจริง
              </h3>
              <p className="text-gray-200 dark:text-black/50">
                ตั้งและติดตามเป้าหมายสุขภาพของคุณได้อย่างมีประสิทธิภาพ
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="container mx-auto px-4 py-4">
        <h2 className="text-3xl font-bold text-white text-center mb-12 dark:text-black/80">
          ทีมผู้พัฒนา
        </h2>
        <div className="max-w-6xl mx-auto bg-black/20 backdrop-blur-sm rounded-xl p-8 border border-blue-500/40 dark:bg-white/10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* สมาชิกคนที่ 1 */}
            <div className="flex flex-col items-center">
              <div className="w-40 h-40 bg-white/20 rounded-full flex items-center justify-center mb-4 overflow-hidden">
                <img
                  src="/src/assets/Guy.jpg"
                  alt="หาญณรงค์"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2 dark:text-black/80">
                หาญณรงค์ บุญยืน
              </h3>
              <p className="text-gray-200 text-center dark:text-black/70">65057638</p>
            </div>

            {/* สมาชิกคนที่ 2 */}
            <div className="flex flex-col items-center">
              <div className="w-40 h-40 bg-white/20 rounded-full flex items-center justify-center mb-4 overflow-hidden">
                <img
                  src="/src/assets/Oak.jpg"
                  alt="ธนกร"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2 dark:text-black/80">
                ธนกร สิงห์ก้อม
              </h3>
              <p className="text-gray-200 text-center dark:text-black/70">65007905</p>
            </div>

            {/* สมาชิกคนที่ 3 */}
            <div className="flex flex-col items-center">
              <div className="w-40 h-40 bg-white/20 rounded-full flex items-center justify-center mb-4 overflow-hidden">
                <img
                  src="/src/assets/Fourth.jpg"
                  alt="ภัทรพิสิฎ"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2 dark:text-black/80">
                ภัทรพิสิฎ ทองเกิด
              </h3>
              <p className="text-gray-200 text-center dark:text-black/70">65007912</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="container mx-auto px-4 py-4 mb-20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6 dark:text-black/80">ติดต่อเรา</h2>
          <p className="text-gray-200 mb-8 dark:text-black/70">
            หากคุณมีคำถามหรือต้องการความช่วยเหลือ สามารถติดต่อเราได้ที่
          </p>
          <a href="mailto:fitcheck2025@gmail.com" className="text-white font-semibold hover:text-blue-400 dark:text-black/80">fitcheck2025@gmail.com</a>
        </div>
      </div>
    </div>
  );
};

export default About;
