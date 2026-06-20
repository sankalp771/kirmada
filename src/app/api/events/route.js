import { NextResponse } from 'next/server';
import { pool } from '@/lib/dbClient';

export async function GET() {
  try {
    const res = await pool.query(
      `SELECT e.*, i.name as ideology_name 
       FROM events e
       LEFT JOIN ideologies i ON e.ideology_id = i.id
       ORDER BY e.created_at DESC 
       LIMIT 15`
    );
    return NextResponse.json({
      success: true,
      events: res.rows
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
