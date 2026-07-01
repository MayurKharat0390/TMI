import { NextResponse } from 'next/server';
import { verifySessionToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('tmi_session')?.value;
  
  if (!token || !verifySessionToken(token)) {
    return NextResponse.json({ authenticated: false });
  }

  return NextResponse.json({ authenticated: true });
}
