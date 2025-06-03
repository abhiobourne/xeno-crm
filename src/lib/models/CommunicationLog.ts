import mongoose from 'mongoose';

const communicationLogSchema = new mongoose.Schema({
  campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['SENT', 'FAILED', 'PENDING'], default: 'PENDING' }
}, { timestamps: true });

export default mongoose.models.CommunicationLog || mongoose.model('CommunicationLog', communicationLogSchema);