import { NextResponse } from 'next/server';

interface RateLimitStore {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitStore>();

// Simple in-memory sliding/fixed window rate limiter
export function rateLimiter(ip: string, limit = 5, windowMs = 60000) {
  const now = Date.now();
  const clientStore = rateLimitMap.get(ip);

  if (!clientStore) {
    rateLimitMap.set(ip, {
      count: 1,
      resetTime: now + windowMs,
    });
    return { success: true, count: 1, limit, resetTime: now + windowMs };
  }

  if (now > clientStore.resetTime) {
    clientStore.count = 1;
    clientStore.resetTime = now + windowMs;
    return { success: true, count: 1, limit, resetTime: now + windowMs };
  }

  clientStore.count += 1;

  if (clientStore.count > limit) {
    return { success: false, count: clientStore.count, limit, resetTime: clientStore.resetTime };
  }

  return { success: true, count: clientStore.count, limit, resetTime: clientStore.resetTime };
}

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return req.headers.get('x-real-ip') || '127.0.0.1';
}
