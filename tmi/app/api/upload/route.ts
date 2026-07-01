import { NextResponse } from 'next/server';
import { verifySessionToken } from '@/lib/auth';
import { rateLimiter, getClientIp } from '@/lib/rate-limiter';
import { cookies } from 'next/headers';
import { put } from '@vercel/blob';
import fs from 'fs/promises';
import path from 'path';

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

    // 2. Rate limit uploads
    const ip = getClientIp(request);
    const rateLimitResult = rateLimiter(ip, 15, 60000);
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
      return NextResponse.json({ error: 'Invalid file type. Only images are allowed.' }, { status: 400 });
    }

    // 5. Upload handling
    // If running locally without Vercel Blob configured, fall back to local disk storage
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      const uploadsDir = path.join(process.cwd(), 'public', 'images', 'uploads');
      
      await fs.mkdir(uploadsDir, { recursive: true });

      const fileExt = path.extname(file.name) || '.webp';
      const cleanBase = path.basename(file.name, fileExt).replace(/[^a-zA-Z0-9_-]/g, '');
      const fileName = `${cleanBase}_${Date.now()}${fileExt}`;
      const filePath = path.join(uploadsDir, fileName);

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      await fs.writeFile(filePath, buffer);

      return NextResponse.json({ success: true, url: `/images/uploads/${fileName}` });
    }

    // Production Mode: Upload directly to Vercel Blob CDN
    const fileExt = path.extname(file.name) || '.webp';
    const cleanBase = path.basename(file.name, fileExt).replace(/[^a-zA-Z0-9_-]/g, '');
    const blobPath = `uploads/${cleanBase}_${Date.now()}${fileExt}`;

    const blob = await put(blobPath, file, {
      access: 'public',
      addRandomSuffix: false
    });

    return NextResponse.json({ success: true, url: blob.url });

  } catch (error) {
    console.error('File upload API error:', error);
    return NextResponse.json({ error: 'An error occurred during file upload' }, { status: 500 });
  }
}
