import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import {
  Copy,
  Send,
  Trash2,
  MessageSquare,
  CopyPlus,
  History,
  FilePenLine,
  User,
  Menu,
  Search,
} from "lucide-react";
import Swal from "sweetalert2";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { API_BASEURL } from "../../lib/api";

const API_BASE = "https://7ef2-35-236-173-189.ngrok-free.app";

const ChatApp = () => {
  const messagesEndRef = useRef(null);
  const [chats, setChats] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [searchParams] = useSearchParams();
  const chatId = searchParams.get("chat_id");
  const [userData, setUserData] = useState(null);
  const [chatTitle, setChatTitle] = useState("");
  const [chatCreatedAt, setChatCreatedAt] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [showToggleButton, setShowToggleButton] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const navigate = useNavigate();
  const [hasStartedChat, setHasStartedChat] = useState(false);

  const token = localStorage.getItem("token");
  const headers = {
    Authorization: `Bearer ${token}`,
    "ngrok-skip-browser-warning": "true",
  };

  const filteredChats = chats.filter((chat) =>
    chat.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupChatsByTime = (chats) => {
    const now = new Date();
    const oneDay = 24 * 60 * 60 * 1000;
    const sevenDays = 7 * oneDay;
    const thirtyDays = 30 * oneDay;

    const groups = {
      วันนี้: [],
      สัปดาห์นี้: [],
      เดือนนี้: [],
      เก่ากว่านั้น: [],
    };

    chats.forEach((chat) => {
      const updatedAt = new Date(
        typeof chat.updated_at === "string"
          ? chat.updated_at
          : chat.updated_at._seconds * 1000
      );
      const diff = now - updatedAt;

      if (diff <= oneDay) {
        groups["วันนี้"].push(chat);
      } else if (diff <= sevenDays) {
        groups["สัปดาห์นี้"].push(chat);
      } else if (diff <= thirtyDays) {
        groups["เดือนนี้"].push(chat);
      } else {
        groups["เก่ากว่านั้น"].push(chat);
      }
    });

    // เรียงใหม่ -> เก่า
    Object.values(groups).forEach((list) =>
      list.sort((a, b) => {
        const t1 = new Date(
          typeof a.updated_at === "string"
            ? a.updated_at
            : a.updated_at._seconds * 1000
        );
        const t2 = new Date(
          typeof b.updated_at === "string"
            ? b.updated_at
            : b.updated_at._seconds * 1000
        );
        return t2 - t1;
      })
    );

    return groups;
  };

  const renameChat = async (chat_id, oldTitle) => {
    // ✅ Scroll กลับขึ้นบนก่อนเปิด modal
    window.scrollTo({ top: 0, behavior: "smooth" });

    const result = await Swal.fire({
      title: "เปลี่ยนชื่อแชท",
      input: "text",
      inputLabel: "ชื่อใหม่",
      inputValue: oldTitle,
      showCancelButton: true,
      confirmButtonText: "บันทึก",
      cancelButtonText: "ยกเลิก",
    });

    if (result.isConfirmed && result.value.trim()) {
      try {
        await axios.patch(
          `${API_BASE}/rename-chat/${chat_id}`,
          {
            title: result.value.trim(),
          },
          { headers }
        );
        fetchChats();
        Swal.fire("สำเร็จ!", "ชื่อแชทถูกเปลี่ยนแล้ว", "success");
        window.location.reload();
      } catch (err) {
        Swal.fire("ผิดพลาด", "ไม่สามารถเปลี่ยนชื่อได้", "error");
      }
    }
  };

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token"); // ✅ ดึง token มาใช้ตรงนี้
      const response = await axios.get(`${API_BASEURL}/api/auth/getuser`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserData(response.data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถดึงข้อมูลผู้ใช้ได้",
        confirmButtonText: "ตกลง",
      }).then(() => {
        navigate("/login");
      });
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // ✅ ดึงแชททั้งหมดของ user
  const fetchChats = async () => {
    try {
      const res = await axios.get(`${API_BASE}/get-my-chats`, { headers });
      setChats(res.data);
    } catch (error) {
      console.error("❌ ดึงแชทไม่สำเร็จ:", error);
      setChats([]);
    }
  };

  // ✅ ดึงแชทจาก chat_id
  const fetchChatById = async () => {
    try {
      const res = await axios.get(`${API_BASE}/get-chat/${chatId}`, {
        headers,
      });
      setMessages(res.data.messages || []);
      setChatTitle(res.data.title || "ชื่อแชท");
      setChatCreatedAt(res.data.created_at || null);
    } catch (err) {
      console.error("❌ โหลดแชทไม่สำเร็จ", err);
      setMessages([]);
    }
  };

  useEffect(() => {
    if (chatId && chatId !== selectedChatId) {
      setSelectedChatId(chatId);
      fetchChatById();
    }
  }, [chatId]);

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    if (!isSidebarOpen) {
      // รอ 300ms (เท่ากับ transition duration)
      const timer = setTimeout(() => setShowToggleButton(true), 500);
      return () => clearTimeout(timer);
    } else {
      setShowToggleButton(false);
    }
  }, [isSidebarOpen]);

  const createChat = async () => {
    try {
      const res = await axios.post(
        `${API_BASE}/create-chat`,
        { title: "แชทใหม่", messages: [] },
        { headers }
      );
      setSelectedChatId(res.data.chat_id);
      setMessages([{ role: "assistant", content: res.data.message }]);
      fetchChats();
    } catch (err) {
      console.error("❌ สร้างแชทไม่สำเร็จ", err);
    }
  };

  const deleteChat = async (id) => {
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
        if (selectedChatId === id) {
          setSelectedChatId(null);
          setMessages([]);
        }
        fetchChats();
        Swal.fire("ลบสำเร็จ!", "แชทนี้ถูกลบเรียบร้อยแล้ว", "success");
        window.location.reload();
      } catch (error) {
        Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถลบแชทได้", "error");
      }
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    setHasStartedChat(true);

    const userMsg = { role: "user", content: newMessage };
    setMessages((prev) => [...prev, userMsg]);
    setNewMessage("");
    setIsTyping(true);

    try {
      let chatId = selectedChatId;

      // ✅ ถ้ายังไม่มีแชท ให้สร้างแชทใหม่ก่อนส่งข้อความ
      if (!chatId) {
        const res = await axios.post(
          `${API_BASE}/create-chat`,
          { title: "แชทใหม่", messages: [] },
          { headers }
        );

        chatId = res.data.chat_id;
        setSelectedChatId(chatId);
        navigate(`?chat_id=${chatId}`);
        setMessages((prev) => [
          { role: "assistant", content: res.data.message },
          ...prev,
        ]);
        fetchChats();
      }

      // ✅ จากนั้นส่งข้อความตามปกติ
      const res = await axios.post(
        `${API_BASE}/ask/${chatId}`,
        {
          question: userMsg.content,
        },
        { headers }
      );

      const aiMsg = { role: "assistant", content: res.data.response };
      setMessages((prev) => [...(prev || []), aiMsg]);
    } catch (error) {
      console.error("❌ ส่งข้อความไม่สำเร็จ:", error);
    } finally {
      setIsTyping(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    AOS.init({ duration: 600, once: true });
  }, []);

  useEffect(() => {
    scrollToBottom();
    AOS.refresh();
  }, [messages, hasStartedChat]);

  return (
    <div className="flex h-screen dark:bg-gray-100">
      {showToggleButton && (
        <button
          className="fixed mt-[96px] left-4 z-50 p-2 bg-gray-800 rounded-md hover:bg-gray-700 dark:bg-gray-600 dark:hover:bg-gray-700"
          onClick={toggleSidebar}
          title="เปิดเมนู"
        >
          <Menu className="text-white" />
        </button>
      )}
      {/* Sidebar */}
      <div
        className={`flex flex-col w-1/5 h-[full]  mt-[80px] p-4 border-r border-blue-500/40 bg-black/20  dark:bg-white/10 shadow-lg transition-transform duration-300 z-40 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          <div className="flex items-center justify-between mb-4">
            {/* ปุ่มปิด Sidebar */}
            <button
              className="p-2 text-white hover:bg-gray-700 rounded-md dark:text-black/80 dark:hover:text-white"
              onClick={toggleSidebar}
              title="ปิดเมนู"
            >
              <Menu />
            </button>

            {/* ปุ่มค้นหา + แชทใหม่ */}
            <div className="flex gap-2">
              {!showSearch ? (
                <button
                  className="p-2 rounded-md hover:bg-gray-700 "
                  title="ค้นหาแชท"
                  onClick={() => setShowSearch(true)}
                >
                  <Search className="text-white dark:text-black/80 dark:hover:text-white" />
                </button>
              ) : (
                <input
                  type="text"
                  autoFocus
                  placeholder="ค้นหาแชท..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onBlur={() => {
                    // ถ้าไม่มีข้อความ ให้ซ่อน input กลับไปเป็นปุ่ม
                    if (!searchTerm) setShowSearch(false);
                  }}
                  className="w-full px-3 py-2 text-sm rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring focus:ring-blue-400"
                />
              )}

              <button
                className="p-2 rounded-md hover:bg-gray-700 "
                onClick={createChat}
                title="แชทใหม่"
              >
                <CopyPlus className="text-white dark:text-black/80 dark:hover:text-white" />
              </button>
            </div>
          </div>

          <h2 className="flex items-center border-t rounded-t-xl border-blue-500/40 gap-2 text-xl  mb-2 mt-2 pt-4 text-white dark:text-black/80">
            <History /> ประวัติการสนทนา
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto pr-1 mt-2 mb-2">
          {Object.entries(groupChatsByTime(filteredChats)).map(
            ([section, group]) =>
              group.length > 0 ? (
                <div key={section}>
                  <h3 className="text-white text-[14px] font-bold mb-1 mt-2 pl-1 dark:text-black/50">
                    {section}
                  </h3>
                  {group.map((chat) => (
                    <div
                      key={chat.chat_id}
                      className={`bg-gray-800/5 px-2 py-1 mb-4 rounded-md cursor-pointer hover:bg-blue-500/40 dark:bg-gray-200/10 dark:hover:bg-gray-200/50  ${
                        selectedChatId === chat.chat_id
                          ? "bg-blue-500/20 border-l-4 border-blue-900 dark:bg-gray-300/30"
                          : "bg-gray-100"
                      }`}
                      onClick={() => {
                        navigate(`?chat_id=${chat.chat_id}`);
                        // ✅ ไม่ต้อง setSelectedChatId และไม่ต้อง fetchChat ตรงนี้
                      }}
                    >
                      <div className="flex justify-between items-center text-white/80 dark:text-black/80 ">
                        <span
                          className="truncate"
                          onDoubleClick={(e) => {
                            e.stopPropagation();
                            renameChat(chat.chat_id, chat.title);
                          }}
                          title="ดับเบิ้ลคลิกเพื่อเปลี่ยนชื่อ"
                        >
                          {chat.title}
                        </span>
                        <div className="flex justify-between items-center text-white/70">
                          <span className="truncate max-w-[140px]"></span>
                          <div className="flex gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                renameChat(chat.chat_id, chat.title);
                              }}
                              className="text-gray-700 hover:text-blue-500"
                              title="เปลี่ยนชื่อ"
                            >
                              <FilePenLine size={18} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteChat(chat.chat_id);
                              }}
                              className="text-gray-700 text-sm hover:text-red-500"
                              title="ลบแชท"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null
          )}
        </div>
        {userData && (
          <div className="border-t border-blue-500/40 rounded-t-xl pt-3 text-sm text-white dark:text-black/70">
            <div className="flex items-center gap-4">
              {/* รูปโปรไฟล์ */}
              <div className="w-12 h-12 bg-white/20 rounded-full overflow-hidden dark:bg-black/30 flex-shrink-0">
                <img
                  src={
                    userData?.profile_image
                      ? `${API_BASEURL}${userData.profile_image}`
                      : "/userProfile.png"
                  }
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* ข้อมูลผู้ใช้ (ชื่อ + อีเมล) */}
              <div className="flex flex-col ">
                <div className="flex items-center gap-2 ">
                  <span className=" text-[17px] pt-1">
                    {userData.first_name || "DEK"}{" "}
                    {userData.last_name || "COMCSI SPU"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-1xl text-gray-500 dark:text-black/70">
                  {userData.email || "dekspu65@spumail.net"}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Chat Window */}
      <div
        className={`flex-1 flex flex-col h-[calc(100vh-100px)] mt-[100px] m-6 p-6 rounded-3xl  dark:bg-white/10 transition-all duration-300 ${
          isSidebarOpen
            ? "sm:ml-8"
            : "sm:ml-[-250px] sm:mr-[130px] ml-[250px] mr-0"
        }`}
      >
        {!hasStartedChat && messages.length === 0 ? (
          // 🔵 ยังไม่เริ่มแชท → แสดง Welcome UI
          <div className="flex flex-col items-center justify-center h-full  text-center text-white">
            <h1
              className="text-3xl font-bold mb-4 dark:text-black/70"
              data-aos="fade-down"
              data-aos-delay="200"
            >
              วันนี้คุณอยากให้เราช่วยอะไร
            </h1>
            <div
              className="w-[900px] max-w-3xl flex items-center"
              data-aos="fade-right"
              data-aos-delay="200"
            >
              <input
                type="text"
                className="flex-1 text-black bg-gray-100 p-2 mr-2 border border-blue-9 rounded-xl shadow dark:bg-white/10 dark:text-black dark:border-gray-500"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="พิมพ์ข้อความ..."
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <button
                disabled={isTyping}
                className={`bg-blue-500 text-white px-4 py-2 rounded-xl shadow ${
                  isTyping ? "opacity-50 cursor-not-allowed" : ""
                }`}
                data-aos="fade-left"
                data-aos-delay="300"
                onClick={sendMessage}
              >
                <Send />
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* ✅ ส่วน Header ของแชท */}
            <div
              className="flex justify-between items-center border-b border-blue-500/50 rounded-b-xl px-4 pb-2 mb-4"
              data-aos="fade-up"
            >
              <div className="text-white text-xl mb-4" data-aos="fade-up">
                <h2 className="text-white text-xl  dark:text-black/70">
                  {(chatTitle?.length > 35
                    ? chatTitle.slice(0, 35) + "..."
                    : chatTitle) || "ชื่อแชท"}
                </h2>
                <p className="text-gray-400 text-sm dark:text-black/50">
                  สร้างเมื่อ:{" "}
                  {chatCreatedAt
                    ? new Date(chatCreatedAt).toLocaleString("th-TH")
                    : "-"}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => renameChat(selectedChatId, chatTitle)}
                  className="text-sm text-gray-400 hover:text-blue-500"
                >
                  <FilePenLine size={30} />
                </button>
                <button
                  onClick={() => deleteChat(selectedChatId)}
                  className="text-sm text-gray-400 hover:text-red-500"
                >
                  <Trash2 size={30} />
                </button>
              </div>
            </div>

            {/* ✅ ข้อความแชท */}
            <div
              className="flex-1 overflow-y-auto space-y-4 p-4"
              data-aos="zoom-in-up"
            >
              {Array.isArray(messages) &&
                messages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`w-full flex ${
                      m.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {m.role !== "user" && (
                      <img
                        src="/Logo4.png"
                        alt="AI"
                        className="w-10 h-10 mr-2 rounded-full border border-blue-500/40"
                      />
                    )}
                    <div
                      className={`whitespace-pre-wrap break-words max-w-[60%] p-5 rounded-2xl text-black ${
                        m.role === "user"
                          ? "bg-blue-100 blackdrop-blur-lg text-black dark:text-black dark:bg-gray-900/10"
                          : "bg-gray-600/20 text-white dark:text-black/70 dark:bg-gray-200/50 "
                      }`}
                    >
                      <div className="text-[18px] mb-1">
                        <strong>{m.role === "user"}</strong>
                        <ReactMarkdown
                          components={{
                            a: ({ node, ...props }) => (
                              <a
                                {...props}
                                className="text-blue-600 underline"
                                target="_blank"
                                rel="noopener noreferrer"
                              />
                            ),
                            p: ({ node, ...props }) => (
                              <p {...props} className="whitespace-pre-wrap" />
                            ),
                          }}
                        >
                          {m.content}
                        </ReactMarkdown>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                        <span>
                          {new Date().toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        <button
                          onClick={() => {
                            navigator.clipboard
                              .writeText(m.content)
                              .then(() => {
                                Swal.fire({
                                  toast: true,
                                  position: "top-end",
                                  icon: "success",
                                  title: "คัดลอกข้อความเรียบร้อยแล้ว!",
                                  showConfirmButton: false,
                                  timer: 1200,
                                  timerProgressBar: true,
                                });
                              });
                          }}
                          className="flex items-center gap-1 hover:text-blue-500"
                        >
                          <Copy size={15} />
                          คัดลอก
                        </button>
                      </div>
                    </div>

                    {m.role === "user" && (
                      <div>
                        <img
                          src={
                            userData?.profile_image
                              ? `${API_BASEURL}${userData.profile_image}`
                              : "/userProfile.png"
                          }
                          alt="avatar"
                          className="w-10 h-10 ml-2 rounded-full border border-blue-500/40 object-cover"
                        />
                      </div>
                    )}
                  </div>
                ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-200 text-gray-700 text-sm px-4 py-2 rounded-2xl shadow max-w-[60%] animate-pulse">
                    <div className="flex items-center">
                      <img
                        src="/Logo4.png"
                        alt="AI"
                        className="w-10 h-10 mr-2 rounded-full border border-blue-500/40"
                      />
                      <div>
                        <div className="font-semibold">AI</div>
                        <div className="text-gray-500">กำลังพิมพ์...</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* ✅ กล่องพิมพ์ข้อความ */}
            <div className="flex items-center" data-aos-delay="200">
              <input
                type="text"
                className="flex-1 text-black bg-gray-100 p-2 mr-2 border border-blue-9 rounded-xl shadow dark:border-gray-500"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="พิมพ์ข้อความ..."
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-xl shadow"
                onClick={sendMessage}
              >
                <Send />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatApp;
