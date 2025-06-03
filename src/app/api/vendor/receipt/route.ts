import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from '@/lib/db';
import CommunicationLog from '@/lib/models/CommunicationLog';
import Campaign from '@/lib/models/Campaign';

export async function POST(req: NextRequest) {
  try {
    await connectToDB();
    const { logId, status } = await req.json();

    const log = await CommunicationLog.findByIdAndUpdate(logId, {
      status,
      updatedAt: new Date()
    });

    if (!log) return NextResponse.json({ success: false }, { status: 404 });

    const updateField = status === 'SENT' ? { $inc: { sent: 1 } } : { $inc: { failed: 1 } };
    await Campaign.findByIdAndUpdate(log.campaignId, updateField);

    return NextResponse.json({ success: true });
  } // eslint-disable-next-line @typescript-eslint/no-unused-vars
  catch (err) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
