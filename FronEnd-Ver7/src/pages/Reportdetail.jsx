import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FileText, Clock, Mail, ArrowLeft } from 'lucide-react';
import Swal from 'sweetalert2';
import { API_BASEURL } from "../../lib/api"; 


const ReportDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReportDetail();
  }, [id]);

  const fetchReportDetail = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASEURL}/api/data/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReport(response.data);
      setLoading(false);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: error.response?.data?.message || 'ไม่สามารถดึงข้อมูลรายงานได้'
      });
      navigate('/my-reports');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
    <div className="min-h-screen pt-[230px] py-8 dark:bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto   bg-black/20 backdrop-blur-sm rounded-xl shadow-xl p-8 border border-blue-500/40 dark:bg-black/10">
          {/* Back Button */}
          <button
            onClick={() => navigate('/my-reports')}
            className="flex items-center text-white bg-transparent mb-6 hover:text-gray-300 transition dark:text-gray-500 dark:hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            กลับไปหน้ารายการ
          </button>

          {/* Report Header */}
          <div className="flex items-start justify-between mb-6 ">
            <div className="flex items-center space-x-4">
              <FileText className="w-8 h-8  text-white dark:text-gray-600" />
              <div>
                <h1 className="text-2xl font-bold text-white dark:text-gray-600">{report.title}</h1>
                <p className="text-gray-300 flex items-center mt-1 dark:text-gray-500">
                  <Clock className="w-4 h-4 mr-2" />
                  {formatDate(report.created_at)}
                </p>
              </div>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm ${
              report.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              report.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
              report.status === 'resolved' ? 'bg-green-100 text-green-800' :
              'bg-red-100 text-red-800'
            }`}>
              {report.status === 'pending' ? 'รอดำเนินการ' :
               report.status === 'in_progress' ? 'กำลังดำเนินการ' :
               report.status === 'resolved' ? 'แก้ไขแล้ว' : 'ปฏิเสธ'}
            </span>
          </div>

          {/* Report Content */}
          <div className="space-y-6 ">
            <div className="bg-white/10 rounded-lg p-6 border border-blue-500/40 dark:bg-black/10 ">
              <h2 className="text-lg font-semibold text-white mb-2 dark:text-gray-600">ประเภทปัญหา</h2>
              <p className="text-gray-300 dark:text-gray-500">
                {report.category === 'technical' ? 'ปัญหาทางเทคนิค' :
                 report.category === 'account' ? 'ปัญหาเกี่ยวกับบัญชี' :
                 report.category === 'suggestion' ? 'ข้อเสนอแนะ' : 'อื่นๆ'}
              </p>
            </div>

            <div className="bg-white/10 rounded-lg p-6 border border-blue-500/40 dark:bg-black/10">
              <h2 className="text-lg font-semibold text-white mb-2 dark:text-gray-600">รายละเอียด</h2>
              <p className="text-gray-300 whitespace-pre-line dark:text-gray-500">{report.description}</p>
            </div>

            <div className="bg-white/10 rounded-lg p-6 border border-blue-500/40 dark:bg-black/10">
              <h2 className="text-lg font-semibold text-white mb-2 dark:text-gray-600">ข้อมูลติดต่อ</h2>
              <div className="flex items-center text-gray-300 dark:text-gray-500">
                <Mail className="w-5 h-5 mr-2" />
                {report.email}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportDetail;