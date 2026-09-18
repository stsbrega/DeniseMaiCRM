'use client';

import React, { useState } from 'react';

interface AIDraftProps {
  leadId: string;
}

export function AIDraft({ leadId }: AIDraftProps) {
  const [draft, setDraft] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [context, setContext] = useState('follow-up');

  async function generateDraft() {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/ai/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId, context }),
      });

      if (!response.ok) throw new Error('Failed to generate draft');

      const data = await response.json();
      setDraft(data.draft);
    } catch (err) {
      console.error('Error generating draft:', err);
      alert('Failed to generate AI draft.');
    } finally {
      setIsGenerating(false);
    }
  }

  async function sendDraft() {
    if (!draft.trim()) return;

    setIsSending(true);
    try {
      const response = await fetch('/api/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId,
          content: draft,
          type: 'email', // Defaulting to email for AI drafts
        }),
      });

      if (!response.ok) throw new Error('Failed to send message');

      alert('Message sent successfully!');
      setDraft('');
    } catch (err) {
      console.error('Error sending draft:', err);
      alert('Failed to send message.');
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-md font-semibold text-gray-900">AI Message Assistant</h3>
        <select
          className="text-xs border border-gray-300 rounded px-1 py-1"
          value={context}
          onChange={(e) => setContext(e.target.value)}
        >
          <option value="follow-up">General Follow-up</option>
          <option value="re-engagement">Re-engagement</option>
          <option value="thank-you">Thank You</option>
        </select>
      </div>

      <div className="relative">
        <textarea
          className="w-full p-3 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Generate a draft to start..."
        />
        <div className="absolute bottom-3 right-3 flex gap-2">
          <button
            onClick={generateDraft}
            disabled={isGenerating || isSending}
            className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400"
          >
            {isGenerating ? 'Generating...' : 'Generate AI Draft'}
          </button>
          <button
            onClick={sendDraft}
            disabled={isSending || !draft.trim()}
            className="bg-green-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-green-700 transition-colors disabled:bg-gray-400"
          >
            {isSending ? 'Sending...' : 'Send Message'}
          </button>
        </div>
      </div>
    </div>
  );
}
