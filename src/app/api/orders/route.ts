import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Order from '@/lib/models/Order';

export async function POST(req: NextRequest) {
  await connectDB();
  const data = await req.json();
  const order = await Order.create(data);
  return NextResponse.json(order);
}

export async function GET() {
  await connectDB();
  const orders = await Order.find().populate('customerId');
  return NextResponse.json(orders);
}
