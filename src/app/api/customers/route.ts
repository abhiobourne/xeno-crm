import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Customer from '@/lib/models/Customer';

export async function POST(req: NextRequest) {
  await connectDB();
  const data = await req.json();
  const customer = await Customer.create(data);
  return NextResponse.json(customer);
}

export async function GET() {
  await connectDB();
  const customers = await Customer.find().sort({ createdAt: -1 });
  return NextResponse.json(customers);
}
