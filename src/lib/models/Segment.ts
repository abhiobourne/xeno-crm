import mongoose from 'mongoose'

const segmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  rules: [{
    field: {
      type: String,
      required: true
    },
    operator: {
      type: String,
      required: true
    },
    value: {
      type: String,
      required: true
    }
  }],
  logic: {
    type: String,
    enum: ['AND', 'OR'],
    default: 'AND'
  },
  audienceSize: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
})

const Segment = mongoose.models.Segment || mongoose.model('Segment', segmentSchema)

export default Segment