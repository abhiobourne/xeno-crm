import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { logId, customerName, message } = await req.json();

    const status = Math.random() < 0.9 ? 'SENT' : 'FAILED';

    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/vendor/receipt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ logId, status })
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
