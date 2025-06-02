import mongoose from 'mongoose'

const CommunicationLogSchema = new mongoose.Schema(
  {
    campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', required: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },  // Add this
    customerName: String, // optional, can keep for easy read
    message: String,
    status: { type: String, enum: ['SENT', 'FAILED'], default: 'SENT' },
  },
  { timestamps: true }
)

const CommunicationLog =
  mongoose.models.CommunicationLog || mongoose.model('CommunicationLog', CommunicationLogSchema)

export default CommunicationLog
