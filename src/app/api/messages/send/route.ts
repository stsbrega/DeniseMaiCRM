import { NextResponse } from 'next/server';
import { loftyApiService } from '@/services/lofty-api';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request: Request) {
  try {
    const { leadId, content, type } = await request.json();

    if (!leadId || !content || !type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Send via Lofty API
    // Depending on type ('email' or 'sms'), we would call different Lofty endpoints.
    // For now, we'll use the updateLead as a proxy or assume a messaging endpoint.
    // As per PHASE_0_DISCOVERY.md: /v1.0/message/email/send and /v1.0/message/sms/send

    // Note: LoftyApiService needs to be extended to support these.
    // Since I don't have the exact spec for the body of those endpoints,
    // I'll implement a generic call.

    const endpoint = type === 'email' ? '/v1.0/message/email/send' : '/v1.0/message/sms/send';

    // We'll add a generic request method to LoftyApiService if it doesn't have one
    // But since I wrote LoftyApiService, I can just use its internal logic or extend it.

    // For the purpose of the MVP, let's assume we have a send method.
    // I'll update LoftyApiService in a moment.

    const response = await fetch(`https://api.lofty.com${endpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.LOFTY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        lead_id: leadId,
        message: content,
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Lofty API send failed' }, { status: 500 });
    }

    // 2. Log the communication in our local DB
    await supabase.from('communications').insert({
      lead_id: leadId,
      type: type,
      direction: 'outbound',
      content: content,
      sent_at: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Message send error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
