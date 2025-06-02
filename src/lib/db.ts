import mongoose from 'mongoose'

declare global {
  // eslint-disable-next-line no-var
  var mongoose: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } | undefined;
}

const MONGODB_URI =  process.env.MONGODB_URI || "mongodb+srv://asd:asd@cluster0.vmxzq.mongodb.net/xeno-crm?retryWrites=true&w=majority&appName=Cluster0"

if (!MONGODB_URI) {
  throw new Error('Please define the DATABASE_URL environment variable inside .env.local')
}

let cached: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } = global.mongoose as any;

if (!cached) {
  cached = { conn: null, promise: null };
  (global as any).mongoose = cached;
}

export async function connectToDB() {
  if (cached!.conn) {
    return cached!.conn
  }

  if (!cached!.promise) {
    cached!.promise = mongoose.connect(MONGODB_URI, {
      dbName: 'xeno-crm', // optional, change if needed
      bufferCommands: false,
    }).then((mongooseInstance) => {
      cached!.conn = mongooseInstance;
      return mongooseInstance;
    });
  }

  await cached!.promise;
  return cached!.conn;
}
