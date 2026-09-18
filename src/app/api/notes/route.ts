import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request: Request) {
  try {
    const { leadId, content } = await request.json();

    if (!leadId || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // In a real app, we would get the user ID from the session
    // For now, we'll omit author_id or use a placeholder
    const { data, error } = await supabase
      .from('notes')
      .insert({
        lead_id: leadId,
        content: content,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
