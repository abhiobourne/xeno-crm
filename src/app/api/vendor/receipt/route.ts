import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from '@/lib/db';
import CommunicationLog from '@/lib/models/CommunicationLog';

export async function POST(req: NextRequest) {
  try {
    await connectToDB();
    const { logId, status } = await req.json();

    await CommunicationLog.findByIdAndUpdate(logId, {
      status,
      updatedAt: new Date()
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
