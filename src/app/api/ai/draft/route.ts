import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { aiService } from '@/services/ai-service';

export async function POST(request: Request) {
  try {
    const { leadId, context } = await request.json();

    if (!leadId) {
      return NextResponse.json({ error: 'Missing leadId' }, { status: 400 });
    }

    // 1. Fetch lead data
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .select('*')
      .eq('id', leadId)
      .single();

    if (leadError || !lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    // 2. Fetch recent communications for context
    const { data: communications } = await supabase
      .from('communications')
      .select('*')
      .eq('lead_id', leadId)
      .order('sent_at', { ascending: false })
      .limit(5);

    // 3. Generate draft using AI service
    const draft = await aiService.generateMessageDraft(lead, communications || [], context || 'follow-up');

    return NextResponse.json({ draft });
  } catch (err) {
    console.error('AI draft error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
