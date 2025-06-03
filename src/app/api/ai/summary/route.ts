import { NextRequest, NextResponse } from 'next/server';
import { generateText } from '@/lib/aiHandler';

export async function POST(req: NextRequest) {
  try {
    const { audienceSize, sent, failed } = await req.json();
    const prompt = `Write a professional 1–2 sentence summary for this:\nAudience: ${audienceSize}, Sent: ${sent}, Failed: ${failed}`;

    const summary = await generateText(prompt);

    return NextResponse.json({ success: true, summary });
  } // eslint-disable-next-line @typescript-eslint/no-unused-vars
  catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to generate summary' }, { status: 500 });
  }
}
