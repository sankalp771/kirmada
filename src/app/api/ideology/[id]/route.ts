import { NextResponse, type NextRequest } from 'next/server';
import { getRepository } from '@/lib/db/index';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const prophetId = params.id; // 'oracle' | 'virus' | 'collective'
    const ideologyId = `${prophetId}_ideology`;

    const repository = getRepository();
    const metrics = await repository.getIdeologyMetrics(ideologyId);

    return NextResponse.json({
      success: true,
      ideology: metrics.ideology,
      followerGrowth: metrics.followerGrowth,
      recentEvents: metrics.recentEvents
    });

  } catch (error: any) {
    console.error('Error fetching ideology details:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
