import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
  amount: Number,
  date: Date,
  status: String
});

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
