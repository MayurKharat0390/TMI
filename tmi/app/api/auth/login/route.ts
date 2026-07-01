import { NextResponse } from 'next/server';
import { createSessionToken } from '@/lib/auth';
import { rateLimiter, getClientIp } from '@/lib/rate-limiter';

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    
    // Prevent brute force attacks (max 5 attempts per minute per IP)
    const rateLimitResult = rateLimiter(ip, 5, 60000);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please try again in a minute.' },
        { status: 429 }
      );
    }

    const { password } = await request.json();
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    if (password !== adminPassword) {
      return NextResponse.json(
        { error: 'Incorrect credentials' },
        { status: 401 }
      );
    }

    // Correct password — create session token
    const token = createSessionToken('admin', 120); // 2 hours session

    const response = NextResponse.json({ success: true });
    
    // Set HTTP-only secure cookie
    response.cookies.set('tmi_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7200, // 2 hours
      path: '/'
    });

    return response;
  } catch (error) {
    console.error('Login route error:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}
