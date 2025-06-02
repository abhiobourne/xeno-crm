import mongoose from 'mongoose';

const CustomerSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  totalSpend: Number,
  visitCount: Number,
  lastActive: Date
});

export default mongoose.models.Customer || mongoose.model("Customer", CustomerSchema);
