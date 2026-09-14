import { NextRequest, NextResponse } from 'next/server';
import { generateFlashcardsWithGemini, generateMermaidDiagramWithGemini } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { subjectName, moduleTitle, topics, type } = body;

    if (!subjectName || !moduleTitle) {
      return NextResponse.json({ error: 'Missing subjectName or moduleTitle' }, { status: 400 });
    }

    const topicsArray = Array.isArray(topics) ? topics : [moduleTitle];

    if (type === 'diagram') {
      const diagram = await generateMermaidDiagramWithGemini(subjectName, moduleTitle, topicsArray);
      return NextResponse.json({ success: true, data: diagram });
    }

    // Default: flashcards or both
    const flashcards = await generateFlashcardsWithGemini(subjectName, moduleTitle, topicsArray);
    const diagram = await generateMermaidDiagramWithGemini(subjectName, moduleTitle, topicsArray);

    return NextResponse.json({
      success: true,
      data: {
        flashcards,
        diagram,
      },
    });
  } catch (error: any) {
    console.error('Error in generate-study-pack API:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to generate AI study packs' },
      { status: 500 }
    );
  }
}
