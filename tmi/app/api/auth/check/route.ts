import { NextResponse } from 'next/server';
import { verifySessionToken } from '@/lib/auth';

export async function GET(request: Request) {
  const cookieHeader = request.headers.get('cookie') || '';
  
  // Find cookie 'tmi_session' value
  const cookies = cookieHeader.split(';').reduce<Record<string, string>>((acc, c) => {
    const [key, ...val] = c.trim().split('=');
    acc[key] = val.join('=');
    return acc;
  }, {});
  
  const token = cookies['tmi_session'];
  
  if (!token || !verifySessionToken(token)) {
    return NextResponse.json({ authenticated: false });
  }

  return NextResponse.json({ authenticated: true });
}
