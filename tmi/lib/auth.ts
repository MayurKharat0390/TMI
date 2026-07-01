import crypto from 'crypto';

// Secret key for signing session tokens (fallback if not specified in env)
const JWT_SECRET = process.env.JWT_SECRET || 'tmi-super-secure-secret-key-1092830';

// Creates a cryptographically secure token that expires
export function createSessionToken(userId: string, expiresInMinutes = 60): string {
  const expiresAt = Date.now() + expiresInMinutes * 60 * 1000;
  const payload = JSON.stringify({ userId, expiresAt });
  
  const hmac = crypto.createHmac('sha256', JWT_SECRET);
  hmac.update(payload);
  const signature = hmac.digest('hex');
  
  // Return payload and signature base64 encoded
  return Buffer.from(JSON.stringify({ payload, signature })).toString('base64');
}

// Verifies the session token signature and checks if it's expired
export function verifySessionToken(token: string): { userId: string } | null {
  try {
    const raw = Buffer.from(token, 'base64').toString('utf8');
    const { payload, signature } = JSON.parse(raw);
    
    const hmac = crypto.createHmac('sha256', JWT_SECRET);
    hmac.update(payload);
    const expectedSignature = hmac.digest('hex');
    
    if (signature !== expectedSignature) {
      return null; // Invalid signature (tampered token)
    }
    
    const { userId, expiresAt } = JSON.parse(payload);
    if (Date.now() > expiresAt) {
      return null; // Token expired
    }
    
    return { userId };
  } catch (error) {
    return null;
  }
}
