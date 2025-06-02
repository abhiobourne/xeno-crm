import { NextRequest, NextResponse } from 'next/server';
import { generateText } from '@/lib/aiHandler';

export async function POST(req: NextRequest) {
  try {
    const { objective } = await req.json();
    const prompt = `Generate 3 short marketing messages under 150 characters for the goal: "${objective}".`;

    const text = await generateText(prompt);

    const suggestions = text
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    return NextResponse.json({ success: true, suggestions });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to generate message suggestions' }, { status: 500 });
  }
}
