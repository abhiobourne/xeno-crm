import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: String,
  totalSpend: { type: Number, default: 0 },
  visits: { type: Number, default: 0 },
  lastVisit: { type: Date, default: Date.now },
  segmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Segment' }
}, { timestamps: true });

export default mongoose.models.Customer || mongoose.model('Customer', customerSchema);