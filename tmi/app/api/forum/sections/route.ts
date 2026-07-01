import { NextResponse } from 'next/server';
import { verifySessionToken } from '@/lib/auth';
import { rateLimiter, getClientIp } from '@/lib/rate-limiter';
import fs from 'fs/promises';
import path from 'path';
import { cookies } from 'next/headers';

const sectionsFilePath = path.join(process.cwd(), 'data', 'forum_sections.json');

async function readSections() {
  try {
    const data = await fs.readFile(sectionsFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function writeSections(sections: any[]) {
  await fs.writeFile(sectionsFilePath, JSON.stringify(sections, null, 2), 'utf8');
}

async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get('tmi_session')?.value;
  return !!(token && verifySessionToken(token));
}

// GET handler — fetches the 4 categories
export async function GET() {
  const sections = await readSections();
  return NextResponse.json(sections);
}

// PUT handler — edits a category's description (Admin only)
export async function PUT(request: Request) {
  try {
    if (!await isAuthenticated()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const ip = getClientIp(request);
    const rateLimitResult = rateLimiter(ip, 20, 60000);
    if (!rateLimitResult.success) {
      return NextResponse.json({ error: 'Too many edits. Please slow down.' }, { status: 429 });
    }

    const { id, description } = await request.json();

    if (!id || !description) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const sections = await readSections();
    const sectionIndex = sections.findIndex((s: any) => s.id === id);

    if (sectionIndex === -1) {
      return NextResponse.json({ error: 'Section not found' }, { status: 404 });
    }

    // Update only the description
    sections[sectionIndex].description = description.trim().substring(0, 1000);
    await writeSections(sections);

    return NextResponse.json({ success: true, section: sections[sectionIndex] });
  } catch (error) {
    console.error('Section edit error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
