import { NextRequest, NextResponse } from 'next/server';
import { parseSyllabusWithGemini } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { rawText } = body;

    if (!rawText || typeof rawText !== 'string' || rawText.trim().length === 0) {
      return NextResponse.json({ error: 'Please provide valid syllabus text.' }, { status: 400 });
    }

    const result = await parseSyllabusWithGemini(rawText);
    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    console.error('Error in parse-syllabus API:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to parse syllabus with Gemini AI' },
      { status: 500 }
    );
  }
}
