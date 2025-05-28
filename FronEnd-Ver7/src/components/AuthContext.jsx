// src/components/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const fetchUser = async () => {
    const token = localStorage.getItem("token"); // ✅ ดึง token จาก localStorage
    if (!token) return;

    try {
      const res = await axios.get("https://eacf-35-229-174-85.ngrok-free.app", {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ แนบใน header
        },
      });
      setUser(res.data);
    } catch (err) {
      console.error("❌ ดึง user ไม่ได้:", err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
