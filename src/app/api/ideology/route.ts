import { NextResponse } from 'next/server';
import { getRepository } from '@/lib/db/index';

export async function GET() {
  try {
    const repository = getRepository();
    const ideologies = await repository.listIdeologies();
    return NextResponse.json({
      success: true,
      ideologies
    });
  } catch (error: any) {
    console.error('Error listing ideologies:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
