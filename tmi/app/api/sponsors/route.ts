import { NextResponse } from 'next/server';
import { verifySessionToken } from '@/lib/auth';
import { rateLimiter, getClientIp } from '@/lib/rate-limiter';
import fs from 'fs/promises';
import path from 'path';
import { cookies } from 'next/headers';

import { readData, writeData } from '@/lib/db';

async function readSponsors() {
  return readData<any[]>('sponsors_list', 'data/sponsors.json', []);
}

async function writeSponsors(sponsors: any[]) {
  await writeData<any[]>('sponsors_list', 'data/sponsors.json', sponsors);
}

async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get('tmi_session')?.value;
  return !!(token && verifySessionToken(token));
}

// GET handler — public sponsors catalog
export async function GET() {
  const sponsors = await readSponsors();
  return NextResponse.json(sponsors);
}

// POST handler — adds a sponsor (Admin only)
export async function POST(request: Request) {
  try {
    if (!await isAuthenticated()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const ip = getClientIp(request);
    const rateLimitResult = rateLimiter(ip, 30, 60000);
    if (!rateLimitResult.success) {
      return NextResponse.json({ error: 'Too many requests. Please wait.' }, { status: 429 });
    }

    const { name, logo, link, tier } = await request.json();

    if (!name || !logo || !tier) {
      return NextResponse.json({ error: 'Missing mandatory fields' }, { status: 400 });
    }

    const allowedTiers = ['platinum', 'gold', 'silver', 'bronze'];
    if (!allowedTiers.includes(tier)) {
      return NextResponse.json({ error: 'Invalid tier type' }, { status: 400 });
    }

    const sponsors = await readSponsors();
    const maxId = sponsors.reduce((max: number, s: any) => Math.max(max, s.id || 0), 0);

    const newSponsor = {
      id: maxId + 1,
      name: name.trim(),
      logo: logo.trim(),
      link: (link || '').trim(),
      tier
    };

    sponsors.push(newSponsor);
    await writeSponsors(sponsors);

    return NextResponse.json({ success: true, sponsor: newSponsor });
  } catch (error) {
    console.error('Add sponsor error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// PUT handler — edits a sponsor (Admin only)
export async function PUT(request: Request) {
  try {
    if (!await isAuthenticated()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, name, logo, link, tier } = await request.json();

    if (id === undefined || !name || !logo || !tier) {
      return NextResponse.json({ error: 'Missing mandatory fields' }, { status: 400 });
    }

    const allowedTiers = ['platinum', 'gold', 'silver', 'bronze'];
    if (!allowedTiers.includes(tier)) {
      return NextResponse.json({ error: 'Invalid tier type' }, { status: 400 });
    }

    const sponsors = await readSponsors();
    const index = sponsors.findIndex((s: any) => s.id === Number(id));

    if (index === -1) {
      return NextResponse.json({ error: 'Sponsor not found' }, { status: 404 });
    }

    sponsors[index] = {
      id: Number(id),
      name: name.trim(),
      logo: logo.trim(),
      link: (link || '').trim(),
      tier
    };

    await writeSponsors(sponsors);
    return NextResponse.json({ success: true, sponsor: sponsors[index] });
  } catch (error) {
    console.error('Edit sponsor error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// DELETE handler — removes a sponsor (Admin only)
export async function DELETE(request: Request) {
  try {
    if (!await isAuthenticated()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing id parameter' }, { status: 400 });
    }

    const sponsors = await readSponsors();
    const filteredSponsors = sponsors.filter((s: any) => s.id !== Number(id));

    if (sponsors.length === filteredSponsors.length) {
      return NextResponse.json({ error: 'Sponsor not found' }, { status: 404 });
    }

    await writeSponsors(filteredSponsors);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete sponsor error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
