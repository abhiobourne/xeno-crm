import { connectToDB } from '@/lib/db';
import CommunicationLog from '@/lib/models/CommunicationLog';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await connectToDB();
    const logs = await CommunicationLog.find().populate('campaignId customerId').sort({ createdAt: -1 });
    return NextResponse.json(logs);
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
