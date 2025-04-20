// routes/report.js
import express, { Request, Response } from 'express';
import { verifyToken } from '../../middleware/auth';
import Report from '../../models/Report';

const data = express.Router();

data.post('/create', verifyToken, async (req: Request, res: Response) => {
  try {
    console.log("🔥 req.user:", req.user);

    if (!req.user?.userId) {
      return res.status(401).json({ message: "Token ไม่พบ userId" });
    }

    const { category, title, description, email } = req.body;

    if (!category || !title || !description || !email) {
      return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบถ้วน" });
    }

    const newReport = new Report({
      user_id: req.user.id,
      category,
      title,
      description,
      email,
    });

    await newReport.save();
    res.status(201).json({
      message: "บันทึกรายงานปัญหาสำเร็จ",
      report: newReport,
    });

  } catch (error) {
    console.error("❌ ERROR ใน /create:", error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการบันทึกข้อมูล" });
  }
});



// ดึงรายการปัญหาทั้งหมดของผู้ใช้
data.get('/my-reports', verifyToken, async (req, res) => {
  try {
    const reports = await Report.find({ user_id: req.user.id })
      .sort({ created_at: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการดึงข้อมูล" });
  }
});

// ดูรายละเอียดปัญหา
data.get('/:id', verifyToken, async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
if (!report) {
  return res.status(404).json({ message: "ไม่พบรายงานปัญหานี้" });
}

// 👇 เพิ่มการตรวจสอบว่าเป็นของ user นี้เท่านั้น
if (report.user_id.toString() !== req.user.id) {
  return res.status(403).json({ message: "คุณไม่มีสิทธิ์เข้าถึงรายงานนี้" });
}


res.json(report);

  } catch (error) {
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการดึงข้อมูล" });
  }
}); 





export default data;