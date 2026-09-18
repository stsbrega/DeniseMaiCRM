import { supabase } from '@/lib/supabaseClient';
import { LeadDetail } from '@/components/leads/lead-detail';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: { id: string };
}

export default async function LeadDetailPage({ params }: PageProps) {
  const { id } = params;

  const { data: lead, error: leadError } = await supabase
    .from('leads')
    .select('*')
    .eq('id', id)
    .single();

  if (leadError || !lead) {
    notFound();
  }

  const { data: communications, error: commsError } = await supabase
    .from('communications')
    .select('*')
    .eq('lead_id', id)
    .order('sent_at', { ascending: false });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="mb-6">
        <a href="/leads" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
          ← Back to Lead List
        </a>
      </div>
      <LeadDetail lead={lead} communications={communications || []} />
    </div>
  );
}
