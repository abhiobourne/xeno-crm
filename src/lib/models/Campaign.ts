// src/lib/models/Campaign.ts
import mongoose from 'mongoose'

const CampaignSchema = new mongoose.Schema({
  name: String,
  rules: Array,
  logic: String,
  audience: Number,
  sent: Number,
  failed: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.models.Campaign || mongoose.model('Campaign', CampaignSchema)
