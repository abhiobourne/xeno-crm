import mongoose from 'mongoose';
export async function connectDB() {
  if (mongoose.connections[0].readyState) return;
  const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://asd:asd@cluster0.vmxzq.mongodb.net/xeno-crm?retryWrites=true&w=majority&appName=Cluster0"
  await mongoose.connect(MONGODB_URI);
  console.log('MongoDB connected');
  mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
  });
  mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
  });
 
}
