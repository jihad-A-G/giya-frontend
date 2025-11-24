import { NextRequest, NextResponse } from 'next/server';
import { fetchFromBackend } from '@/lib/api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const response = await fetchFromBackend('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error during login:', error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
