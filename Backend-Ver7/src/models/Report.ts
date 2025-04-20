import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // อ้างอิงกับ User model
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['technical', 'account', 'suggestion', 'other']
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: 'pending',
    enum: ['pending', 'in_progress', 'resolved', 'rejected']
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

const Report = mongoose.model('Report', reportSchema);
export default Report;