import { NextResponse } from 'next/server';
import { generateResponse, getVirusInfectionLevel } from '@/lib/prophet-engine';
import { getRepository } from '@/lib/db/index';
import { pool } from '@/lib/dbClient';

export async function POST(request) {
  try {
    const { prophetId, messages } = await request.json();
    if (!prophetId || !messages || !messages.length) {
      return NextResponse.json({ error: 'Missing prophetId or messages' }, { status: 400 });
    }

    const lastUserMessage = messages[messages.length - 1].content;
    const messageCount = messages.filter(m => m.role === 'user').length;

    // Generate response using character engine
    const reply = generateResponse(prophetId, messageCount, lastUserMessage);

    // Save to Database
    try {
      const repository = getRepository();
      const ideologyId = `${prophetId}_ideology`;

      // 1. Record user message as event
      await repository.insertEvent({
        type: 'doctrine_change',
        ideologyId,
        payload: {
          action: 'chat_message',
          userMessage: lastUserMessage,
          reply: reply,
          role: 'user'
        },
        timestamp: new Date().toISOString()
      });

      // 2. Insert into feedback table for F4 Influence
      await pool.query(
        `INSERT INTO feedback (ideology_id, user_id, text) VALUES ($1, $2, $3)`,
        [ideologyId, 'anonymous_seeker', lastUserMessage]
      );

      // 3. Handle Virus Infection state tracking
      if (prophetId === 'virus') {
        const infectionLevel = getVirusInfectionLevel(messageCount);
        const status = infectionLevel >= 100 ? 'host_converted' : 'spreading';
        await repository.upsertInfection({
          conversationId: 'web_chat',
          prophetId,
          level: infectionLevel,
          status,
          updatedAt: new Date().toISOString()
        });
      }

    } catch (dbErr) {
      console.error('Database logging failed in Chat API:', dbErr);
    }

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Error in Chat API:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
