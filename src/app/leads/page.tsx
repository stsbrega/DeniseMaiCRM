import { supabase } from '@/lib/supabaseClient';
import { LeadList } from '@/components/leads/lead-list';

export const dynamic = 'force-dynamic';

export default async function LeadsPage() {
  const { data: leads, error } = await supabase
    .from('leads')
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) {
    return (
      <div className="p-6 text-red-500">
        Error loading leads: {error.message}
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
          <p className="text-gray-500">Manage and track your Lofty synchronized leads.</p>
        </div>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium"
          onClick={() => {}} // Sync trigger will be implemented later
        >
          Sync Leads
        </button>
      </div>

      <LeadList initialLeads={leads || []} />
    </div>
  );
}
