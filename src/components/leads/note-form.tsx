'use client';

import React, { useState } from 'react';

interface NoteFormProps {
  leadId: string;
  onNoteAdded: () => void;
}

export function NoteForm({ leadId, onNoteAdded }: NoteFormProps) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId, content }),
      });

      if (!response.ok) throw new Error('Failed to save note');

      setContent('');
      onNoteAdded();
    } catch (err) {
      console.error('Error saving note:', err);
      alert('Failed to save note. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <textarea
        className="w-full p-3 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Add a new internal note..."
        rows={3}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />
      <button
        type="submit"
        disabled={isSubmitting || !content.trim()}
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium disabled:bg-gray-400"
      >
        {isSubmitting ? 'Saving...' : 'Save Note'}
      </button>
    </form>
  );
}
