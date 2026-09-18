import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const leadId = formData.get('leadId') as string;

    if (!file || !leadId) {
      return NextResponse.json({ error: 'Missing file or leadId' }, { status: 400 });
    }

    // 1. Upload file to Supabase Storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = `leads/${leadId}/${fileName}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('lead-documents')
      .upload(filePath, file, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    // 2. Save metadata to documents table
    const { data: docData, error: dbError } = await supabase
      .from('documents')
      .insert({
        lead_id: leadId,
        file_name: file.name,
        file_path: filePath,
        file_type: file.type,
        file_size: file.size,
      })
      .select()
      .single();

    if (dbError) {
      // Try to clean up the uploaded file if DB insert fails
      await supabase.storage.from('lead-documents').remove([filePath]);
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    return NextResponse.json(docData);
  } catch (err) {
    console.error('Document upload error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
