import { NextRequest, NextResponse } from 'next/server';
import { API_URL } from '@/lib/api';

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const authHeader = request.headers.get('authorization');

    // Forward the FormData to the backend
    const response = await fetch(`${API_URL}/api/upload`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader || '',
        // Note: Don't set Content-Type header when sending FormData
        // The browser will set it automatically with the correct boundary
      },
      body: data,
    });

    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json(result, { status: response.status });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}
