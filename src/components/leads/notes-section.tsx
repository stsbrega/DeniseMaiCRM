'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { NoteForm } from './note-form';

interface Note {
  id: string;
  content: string;
  created_at: string;
}

interface NotesSectionProps {
  leadId: string;
}

export function NotesSection({ leadId }: NotesSectionProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  async function fetchNotes() {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('lead_id', leadId)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setNotes(data);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    fetchNotes();
  }, [leadId]);

  return (
    <div className="space-y-4">
      <h3 className="text-md font-semibold text-gray-900">Internal Notes</h3>
      <NoteForm leadId={leadId} onNoteAdded={fetchNotes} />
      <div className="space-y-3 mt-4">
        {isLoading ? (
          <p className="text-sm text-gray-500">Loading notes...</p>
        ) : notes.length === 0 ? (
          <p className="text-sm text-gray-500 italic">No notes yet.</p>
        ) : (
          notes.map((note) => (
            <div key={note.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-800">{note.content}</p>
              <p className="text-xs text-gray-400 mt-2">
                {new Date(note.created_at).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
