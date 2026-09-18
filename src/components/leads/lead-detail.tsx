import React from 'react';
import { NotesSection } from './notes-section';
import { TasksSection } from './tasks-section';

interface LeadDetailProps {
  lead: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    pipeline_stage: string;
    consent_type: string;
    consent_date: string;
  };
  communications: any[];
}

export function LeadDetail({ lead, communications }: LeadDetailProps) {
  return (
    <div className="space-y-6">
      {/* Lead Header Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {lead.first_name} {lead.last_name}
            </h1>
            <p className="text-gray-500">{lead.email} • {lead.phone}</p>
          </div>
          <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
            {lead.pipeline_stage}
          </span>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-400 uppercase font-semibold">Consent Type</p>
            <p className="text-sm text-gray-700">{lead.consent_type || 'Not specified'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase font-semibold">Consent Date</p>
            <p className="text-sm text-gray-700">{lead.consent_date ? new Date(lead.consent_date).toLocaleDateString() : 'N/A'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase font-semibold">Status</p>
            <p className="text-sm text-gray-700">Active</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Communications Timeline */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Communication History</h2>
          <div className="space-y-4">
            {communications.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300 text-gray-500">
                No communication history available.
              </div>
            ) : (
              communications.map((comm) => (
                <div key={comm.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded ${comm.type === 'email' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>
                        {comm.type}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(comm.sent_at).toLocaleString()}
                      </span>
                    </div>
                    <span className={`text-xs font-medium ${comm.direction === 'inbound' ? 'text-blue-600' : 'text-gray-600'}`}>
                      {comm.direction === 'inbound' ? 'Inbound' : 'Outbound'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-800 whitespace-pre-wrap">{comm.content}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Side Panel - Notes & Tasks */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <NotesSection leadId={lead.id} />
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <TasksSection leadId={lead.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
