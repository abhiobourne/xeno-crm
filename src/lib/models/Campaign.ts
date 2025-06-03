import mongoose from 'mongoose'

const campaignSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  segmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Segment',
    required: true
  },
  messageTemplate: {
    type: String,
    required: true
  },
  audienceSize: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['PENDING', 'COMPLETED', 'FAILED'],
    default: 'PENDING'
  }
}, {
  timestamps: true
})

const Campaign = mongoose.models.Campaign || mongoose.model('Campaign', campaignSchema)

export default Campaign