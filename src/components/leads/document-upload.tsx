'use client';

import React, { useState } from 'react';

interface DocumentUploadProps {
  leadId: string;
  onUploadComplete: () => void;
}

export function DocumentUpload({ leadId, onUploadComplete }: DocumentUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('leadId', leadId);

      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      setFile(null);
      onUploadComplete();
    } catch (err) {
      console.error('Error uploading document:', err);
      alert('Failed to upload document. Please try again.');
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <form onSubmit={handleUpload} className="space-y-3">
      <div className="flex items-center gap-3">
        <input
          type="file"
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          required
        />
        <button
          type="submit"
          disabled={isUploading || !file}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium disabled:bg-gray-400 whitespace-nowrap"
        >
          {isUploading ? 'Uploading...' : 'Upload'}
        </button>
      </div>
    </form>
  );
}
