import { NextRequest, NextResponse } from 'next/server';
import { fetchFromBackend } from '@/lib/api';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    
    const response = await fetchFromBackend('/api/auth/verify', {
      method: 'GET',
      headers: {
        'Authorization': authHeader || '',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error verifying token:', error);
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}
