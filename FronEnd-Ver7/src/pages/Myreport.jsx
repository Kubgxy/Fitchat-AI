import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AlertCircle, Clock, FileText, Mail } from "lucide-react";
import Swal from "sweetalert2";

const MyReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5000/api/data/my-reports",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setReports(response.data);
      setLoading(false);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถดึงข้อมูลรายงานได้",
      });
      setLoading(false);
    }
  };

  const getCategoryLabel = (category) => {
    const categories = {
      technical: "ปัญหาทางเทคนิค",
      account: "ปัญหาเกี่ยวกับบัญชี",
      suggestion: "ข้อเสนอแนะ",
      other: "อื่นๆ",
    };
    return categories[category] || category;
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      in_progress: "bg-blue-100 text-blue-800",
      resolved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen  flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-[170px] py-8 dark:bg-gray-100">
      <div className="container mx-auto px-4 ">
        <div className="max-w-4xl mx-auto overflow-y-auto scrollbar-thin">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <FileText className="w-8 h-8 text-white dark:text-black/70" />
              <h1 className="text-2xl font-bold text-white dark:text-black/80">
                รายงานปัญหาของฉัน
              </h1>
            </div>
            <button
              onClick={() => navigate("/report")}
              className="bg-white/10 hover:bg-white/20 border border-blue-500/40 text-white px-4 py-2 rounded-xl transition duration-200 dark:bg-white/10 dark:text-black/80 dark:hover:bg-black/40"
            >
              รายงานปัญหาใหม่
            </button>
          </div>

          {/* Reports List */}
          <div className="space-y-4 max-h-[700px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-700">
            {reports.length === 0 ? (
              <div className="bg-black/20 mt-[100px] backdrop-blur-sm rounded-xl p-8 text-center dark:bg-white/10 dark:text-black/80">
                <AlertCircle className="w-20 h-20 text-white mx-auto mb-4 dark:text-black/60" />
                <p className="text-white text-[30px] dark:text-black/60">
                  ยังไม่มีรายงานปัญหา
                </p>
              </div>
            ) : (
              reports.map((report) => (
                <div
                  key={report._id}
                  className="bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-blue-500/40 hover:bg-white/20 transition duration-200 cursor-pointer m-4 dark:bg-black/10 dark:hover:bg-black/40"
                  onClick={() => navigate(`/report/${report._id}`)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-white font-semibold text-lg mb-2 dark:text-black/60">
                        {report.title}
                      </h3>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm ${getStatusColor(
                          report.status
                        )}`}
                      >
                        {report.status === "pending"
                          ? "รอดำเนินการ"
                          : report.status === "in_progress"
                          ? "กำลังดำเนินการ"
                          : report.status === "resolved"
                          ? "แก้ไขแล้ว"
                          : "ปฏิเสธ"}
                      </span>
                    </div>
                    <span className="text-gray-300 text-sm flex items-center dark:text-gray-400">
                      <Clock className="w-4 h-4 mr-1" />
                      {formatDate(report.created_at)}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <p className="text-gray-300 text-sm dark:text-gray-700">
                      <span className="font-medium text-white dark:text-black/50">
                        ประเภท:
                      </span>{" "}
                      {getCategoryLabel(report.category)}
                    </p>
                    <p className="text-gray-300 text-sm line-clamp-2 dark:text-gray-600">
                      รายละเอียด: {report.description}
                    </p>
                    <p className="text-gray-300 text-sm flex items-center dark:text-gray-600">
                      <Mail className="w-4 h-4 mr-2" />
                      {report.email}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyReports;
