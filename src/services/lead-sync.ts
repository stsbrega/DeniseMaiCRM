import { loftyApiService } from '@/services/lofty-api';
import { supabase } from '@/lib/supabaseClient';
import { LoftyLead } from '@/types/lofty';

export class LeadSyncEngine {
  async syncAllLeads(): Promise<{ synced: number; updated: number; errors: any[] }> {
    let currentPage = 1;
    let lastPage = 1;
    let syncedCount = 0;
    let updatedCount = 0;
    const errors: any[] = [];

    console.log('Starting lead synchronization...');

    try {
      do {
        const response = await loftyApiService.getLeads({ page: currentPage });
        const { data: leads, meta } = response;
        lastPage = meta.last_page;

        console.log(`Syncing page ${currentPage} of ${lastPage}...`);

        for (const lead of leads) {
          try {
            const syncResult = await this.upsertLead(lead);
            if (syncResult === 'inserted') syncedCount++;
            else if (syncResult === 'updated') updatedCount++;
          } catch (err) {
            console.error(`Error syncing lead ${lead.id}:`, err);
            errors.push({ leadId: lead.id, error: err });
          }
        }

        currentPage++;
      } while (currentPage <= lastPage);

    } catch (err) {
      console.error('Fatal error during lead synchronization:', err);
      errors.push({ fatal: true, error: err });
    }

    console.log(`Sync complete. Synced: ${syncedCount}, Updated: ${updatedCount}, Errors: ${errors.length}`);
    return { synced: syncedCount, updated: updatedCount, errors };
  }

  private async upsertLead(loftyLead: LoftyLead): Promise<'inserted' | 'updated'> {
    // Check if lead already exists
    const { data: existingLead, error: fetchError } = await supabase
      .from('leads')
      .select('id')
      .eq('lofty_lead_id', loftyLead.id)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError;
    }

    const leadData: {
      lofty_lead_id: string;
      first_name: string;
      last_name: string;
      email: string;
      phone: string;
      pipeline_stage: string;
      updated_at: string;
      assigned_agent_id?: string;
    } = {
      lofty_lead_id: loftyLead.id,
      first_name: loftyLead.first_name,
      last_name: loftyLead.last_name,
      email: loftyLead.email,
      phone: loftyLead.phone,
      pipeline_stage: loftyLead.pipeline_stage,
      updated_at: new Date().toISOString(),
    };

    // Map assigned_agent_id if we can resolve it to a Supabase profile ID
    // For now, we assume a mapping exists or handle it later
    if (loftyLead.assigned_agent_id) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('lofty_user_id', loftyLead.assigned_agent_id)
        .single();

      if (profile) {
        leadData.assigned_agent_id = profile.id;
      }
    }

    const { error: upsertError } = await supabase
      .from('leads')
      .upsert(leadData, { onConflict: 'lofty_lead_id' });

    if (upsertError) throw upsertError;

    return existingLead ? 'updated' : 'inserted';
  }
}

export const leadSyncEngine = new LeadSyncEngine();
