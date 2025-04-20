import React, { useState } from "react";
import { HelpCircle, Search, ChevronDown, ChevronUp } from "lucide-react";

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [openFaqs, setOpenFaqs] = useState(new Set([]));

  const toggleFaq = (categoryIndex, questionIndex) => {
    const faqId = `${categoryIndex}-${questionIndex}`;
    setOpenFaqs((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(faqId)) {
        newSet.delete(faqId);
      } else {
        newSet.add(faqId);
      }
      return newSet;
    });
  };

  const faqs = [
    {
      category: "การเริ่มต้นใช้งาน",
      questions: [
        {
          q: "FitChat AI คืออะไร?",
          a: "FitChat AI คือผู้ช่วยอัจฉริยะด้านสุขภาพที่ใช้ AI ในการให้คำแนะนำด้านสุขภาพและการออกกำลังกายที่เหมาะสมกับคุณ",
        },
        {
          q: "จะเริ่มต้นใช้งานได้อย่างไร?",
          a: "1. สมัครสมาชิกด้วยข้อมูลส่วนตัวของคุณ\n2. กรอกข้อมูลสุขภาพและเป้าหมายของคุณ\n3. เริ่มสนทนากับ AI เพื่อรับคำแนะนำ",
        },
        {
          q: "ต้องเสียค่าใช้จ่ายในการใช้งานหรือไม่?",
          a: "FitChat AI มีทั้งแบบฟรีและแบบพรีเมียม โดยแบบฟรีสามารถใช้งานฟีเจอร์พื้นฐานได้ทั้งหมด",
        },
      ],
    },
    {
      category: "การใช้งานทั่วไป",
      questions: [
        {
          q: "AI สามารถให้คำแนะนำอะไรได้บ้าง?",
          a: "AI สามารถให้คำแนะนำเกี่ยวกับ:\n- การออกกำลังกาย\n- โภชนาการ\n- การนอนหลับ\n- การจัดการความเครียด\n- สุขภาพทั่วไป",
        },
        {
          q: "จะแก้ไขข้อมูลส่วนตัวได้อย่างไร?",
          a: "คุณสามารถแก้ไขข้อมูลส่วนตัวได้ที่หน้าโปรไฟล์ โดยคลิกที่ไอคอนแก้ไขและทำการเปลี่ยนแปลงข้อมูลที่ต้องการ",
        },
      ],
    },
    {
      category: "ความปลอดภัยและความเป็นส่วนตัว",
      questions: [
        {
          q: "ข้อมูลของฉันปลอดภัยหรือไม่?",
          a: "เรามีระบบรักษาความปลอดภัยที่เข้มงวดในการปกป้องข้อมูลส่วนบุคคลของคุณ",
        },
        {
          q: "FitChat AI จะนำข้อมูลของฉันไปใช้อย่างไร?",
          a: "เราใช้ข้อมูลของคุณเพื่อให้คำแนะนำที่เหมาะสมเท่านั้น",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen h-screen pt-[80px] overflow-y-auto dark:bg-gray-100">
      {/* หัวข้อและไอคอน */}
      <div className="flex flex-col items-center justify-center pt-10">
        <div className="flex items-center justify-center space-x-2">
          <HelpCircle className="w-16 h-16 text-white dark:text-black/80" />
          <h1 className="text-3xl font-bold text-white dark:text-black/80">คำถามที่พบบ่อย</h1>
        </div>
      </div>

      {/* คำถามและคำตอบ */}
      <div className="max-w-7xl mx-auto  mt-8 px-4 mb-[150px] ">
        {faqs.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-8 ">
            {/* หัวข้อหมวดหมู่ */}
            <h2 className="text-xl font-semibold text-white mb-4 dark:text-black  ">
              {section.category}
            </h2>
            {/* กล่องคำถาม */}
            <div className="space-y-4 bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-blue-500/40 dark:bg-white/10 dark:text-black">
              {section.questions.map((faq, questionIndex) => {
                const faqId = `${sectionIndex}-${questionIndex}`;
                return (
                  <div
                    key={faqId}
                    className="border-b border-white/10 last:border-0 pb-4 dark:border-black/10"
                  >
                    {/* ปุ่มคำถาม */}
                    <button
                      onClick={() => toggleFaq(sectionIndex, questionIndex)}
                      className="w-full bg-transparent flex justify-between items-center text-left py-2 hover:text-blue-300 transition-colors duration-200"
                    >
                      <span className="text-white  font-medium pr-8 dark:text-black/80">
                        {faq.q}
                      </span>
                      <div className="flex-shrink-0">
                        {openFaqs.has(faqId) ? (
                          <ChevronUp className="w-5 h-5 text-white transition-transform duration-200 dark:text-black/80" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-white transition-transform duration-200 dark:text-black/80" />
                        )}
                      </div>
                    </button>

                    {/* คำตอบ */}
                    {openFaqs.has(faqId) && (
                      <div className="overflow-hidden transition-all duration-200 ">
                        <p className="mt-2 bg-white/10 backdrop-blur-sm rounded-lg  py-2 px-4 text-gray-300 text-sm leading-relaxed border border-blue-500/40  dark:bg-white/10  dark:text-black/80 ">
                          {faq.a.split("\n").map((line, index) => (
                            <span key={index} className="block ">
                              {line}
                            </span>
                          ))}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
