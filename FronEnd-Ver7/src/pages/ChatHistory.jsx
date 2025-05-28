import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import Swal from "sweetalert2";

const API_BASE = "https://5c18-35-229-174-85.ngrok-free.app";
const token = localStorage.getItem("token");
const headers = {
  Authorization: `Bearer ${token}`,
  "ngrok-skip-browser-warning": "true",
};

const ChatHistory = () => {
  const [groupedChats, setGroupedChats] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const groupChatsByDate = (chats) => {
    const now = new Date();
    const oneDay = 24 * 60 * 60 * 1000;
    const sevenDays = 7 * oneDay;
    const thirtyDays = 30 * oneDay;

    const calculateDaysAgo = (dateString) => {
      if (!dateString) return "-";
      const updatedDate = new Date(dateString);
      const now = new Date();
      const diffMs = now - updatedDate;
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      return diffDays;
    };

    const groups = {
      "24 ชั่วโมงที่ผ่านมา": {
        color: "text-blue-400",
        bg: "bg-blue-900/50 border border-blue-500/40 hover:bg-black/80 dark:bg-white dark:hover:bg-gray-200 ",
        chats: [],
      },
      สัปดาห์ที่ผ่านมา: {
        color: "text-yellow-400",
        bg: "bg-yellow-700/50 border border-blue-500/40 hover:bg-yellow-900/80 dark:bg-yellow-500/20 dark:hover:bg-yellow-500",
        chats: [],
      },
      "1 เดือนที่ผ่านมา": {
        color: "text-red-400",
        bg: "bg-red-900/20 border border-blue-500/40 hover:bg-red-900/80 dark:bg-red-900/20 dark:hover:bg-red-500",
        chats: [],
      },
      เก่ากว่านั้น: {
        color: "text-gray-400",
        bg: "bg-gray-800 border border-blue-500/40 hover:bg-black/80 dark:bg-gray-700/70 dark:hover:bg-gray-400",
        chats: [],
      },
    };

    chats.forEach((chat) => {
      const updated = new Date(
        typeof chat.updated_at === "string"
          ? chat.updated_at
          : chat.updated_at._seconds * 1000
      );
      const diff = now - updated;

      if (diff <= oneDay) {
        groups["24 ชั่วโมงที่ผ่านมา"].chats.push(chat);
      } else if (diff <= sevenDays) {
        groups["สัปดาห์ที่ผ่านมา"].chats.push(chat);
      } else if (diff <= thirtyDays) {
        groups["1 เดือนที่ผ่านมา"].chats.push(chat);
      } else {
        groups["เก่ากว่านั้น"].chats.push(chat);
      }
    });

    Object.keys(groups).forEach((key) => {
      groups[key].chats.sort((a, b) => {
        const timeA = new Date(
          typeof a.updated_at === "string"
            ? a.updated_at
            : a.updated_at._seconds * 1000
        );
        const timeB = new Date(
          typeof b.updated_at === "string"
            ? b.updated_at
            : b.updated_at._seconds * 1000
        );
        return timeB - timeA;
      });
    });

    return groups;
  };

  const fetchChats = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/get-my-chats`, { headers });
      const grouped = groupChatsByDate(res.data);
      setGroupedChats(grouped);
    } catch (error) {
      console.error("❌ ดึงแชทไม่สำเร็จ:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteChat = async (id) => {
    const result = await Swal.fire({
      title: "คุณแน่ใจหรือไม่?",
      text: "คุณต้องการลบแชทนี้ใช่หรือไม่?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${API_BASE}/delete-chat/${id}`, { headers });
        fetchChats();
        Swal.fire("ลบแล้ว!", "แชทถูกลบเรียบร้อย", "success");
      } catch (error) {
        Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถลบแชทได้", "error");
      }
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  return (
    <div className="h-screen pt-[120px]  overflow-y-auto dark:bg-gray-100">
      <div className="p-6 mb-[100px]  min-h-screen w-[1200px] mx-auto">
        {Object.values(groupedChats).some(
          (group) => group.chats.length > 0
        ) && (
          <div className="mb-6 flex items-center justify-center">
            <input
              type="text"
              placeholder="ค้นหาชื่อแชท..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full max-w-md px-4 py-2 text-white rounded-lg border border-blue-500/40 text-black dark:bg-white/80 dark:text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        {loading ? (
          <div className="text-center text-gray-400 mt-[150px] animate-fade-in">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-xl font-medium text-gray-600">
              กำลังโหลดประวัติการสนทนา...
            </p>
          </div>
        ) : Object.values(groupedChats).every(
            (group) => group.chats.length === 0
          ) ? (
          <div className="text-center text-gray-400 mt-[80px] animate-fade-in">
            <img
              src="/Logo4.png"
              alt="ไม่มีประวัติการแชท"
              className="mx-auto w-[300px] h-[300px] mb-4 opacity-70"
            />
            <p className="text-5xl font-semibold mb-4">
              ยังไม่มีประวัติการสนทนา
            </p>
            <p className="text-2xl text-gray-500 mt-1 mb-4">
              เริ่มพูดคุยกับ FitChat AI เพื่อให้เราแนะนำท่าออกกำลังกายให้คุณ
            </p>
            <button
              onClick={() => navigate("/ChatApp")}
              className="animate-pulse-bounce px-6 py-3 mt-4 text-xl bg-black/50 border border-blue-500/40 hover:bg-black/80 rounded-lg text-white font-medium transition duration-200 dark:text-white dark:bg-gray-600 dark:hover:bg-gray-900 dark:border-blue-500 "
            >
              เริ่มแชทแรกเลย
            </button>
          </div>
        ) : (
          Object.entries(groupedChats).map(([section, data]) =>
            data.chats.length > 0 ? (
              <div key={section} className="mb-8">
                <h2 className="text-2xl font-bold mb-4 dark:text-black/80">
                  🕘 ประวัติแชท
                </h2>
                <h3 className={`text-xl font-semibold mb-2 ${data.color}`}>
                  {section}
                </h3>
                <div className="space-y-4">
                  {data.chats
                    .filter((chat) =>
                      chat.title
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())
                    )
                    .map((chat) => {
                      const updated = new Date(
                        typeof chat.updated_at === "string"
                          ? chat.updated_at
                          : chat.updated_at._seconds * 1000
                      );
                      const updatedText = updated.toLocaleString("th-TH", {
                        timeZone: "Asia/Bangkok",
                      });

                      return (
                        <div
                          key={chat.chat_id}
                          className={`p-4 rounded-lg shadow ${data.bg} border border-blue-500/20 hover:bg-opacity-80 cursor-pointer`}
                          onClick={() =>
                            navigate(`/ChatApp?chat_id=${chat.chat_id}`)
                          }
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1 text-white">
                              <div
                                className="font-bold text-lg dark:text-black/70 dark:hover:text-black"
                                title={chat.title}
                              >
                                {chat.title?.length > 35
                                  ? chat.title.slice(0, 35) + "..."
                                  : chat.title}
                              </div>

                              <div className="text-sm text-gray-300 dark:text-gray-700 dark:hover:text-black">
                                ใช้งานล่าสุด: {updatedText}
                                {section === "24 ชั่วโมงที่ผ่านมา" ? (
                                  <span className="text-green-500 ml-2">
                                    {(() => {
                                      const diffMs = new Date() - updated;
                                      const diffMin = diffMs / 60000;
                                      if (diffMin >= 60) {
                                        return `${Math.ceil(
                                          diffMin / 60
                                        )} ชั่วโมงที่แล้ว`;
                                      } else {
                                        return `${Math.floor(
                                          diffMin
                                        )} นาทีที่แล้ว`;
                                      }
                                    })()}
                                  </span>
                                ) : (
                                  <span className="text-gray-400 ml-2 dark:text-gray-600">
                                    {(() => {
                                      const diffMs = new Date() - updated;
                                      const diffDays = Math.floor(
                                        diffMs / (1000 * 60 * 60 * 24)
                                      );
                                      return `${diffDays} วันที่แล้ว`;
                                    })()}
                                  </span>
                                )}
                              </div>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteChat(chat.chat_id);
                              }}
                              className="text-red-500 hover:text-red-400"
                            >
                              <Trash2 size={20} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            ) : null
          )
        )}
      </div>
    </div>
  );
};

export default ChatHistory;
