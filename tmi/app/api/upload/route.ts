import { NextResponse } from 'next/server';
import { verifySessionToken } from '@/lib/auth';
import { rateLimiter, getClientIp } from '@/lib/rate-limiter';
import fs from 'fs/promises';
import path from 'path';
import { cookies } from 'next/headers';

const uploadsDir = path.join(process.cwd(), 'public', 'images', 'uploads');

async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get('tmi_session')?.value;
  return !!(token && verifySessionToken(token));
}

export async function POST(request: Request) {
  try {
    // 1. Auth check
    if (!await isAuthenticated()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Rate limit uploads (max 10 uploads per minute per admin)
    const ip = getClientIp(request);
    const rateLimitResult = rateLimiter(ip, 10, 60000);
    if (!rateLimitResult.success) {
      return NextResponse.json({ error: 'Too many uploads. Please wait.' }, { status: 429 });
    }

    // 3. Parse FormData
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // 4. Validate file type (Images only)
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Only JPEGs, PNGs, WebPs, AVIFs, and GIFs are allowed.' }, { status: 400 });
    }

    // 5. Ensure upload directory exists
    await fs.mkdir(uploadsDir, { recursive: true });

    // 6. Generate clean unique filename
    const fileExt = path.extname(file.name) || '.webp';
    const cleanBase = path.basename(file.name, fileExt).replace(/[^a-zA-Z0-9_-]/g, '');
    const fileName = `${cleanBase}_${Date.now()}${fileExt}`;
    const filePath = path.join(uploadsDir, fileName);

    // 7. Write file buffer to disk
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await fs.writeFile(filePath, buffer);

    // 8. Return the public URL path
    const fileUrl = `/images/uploads/${fileName}`;
    return NextResponse.json({ success: true, url: fileUrl });

  } catch (error) {
    console.error('File upload API error:', error);
    return NextResponse.json({ error: 'An error occurred during file upload' }, { status: 500 });
  }
}
