import { NextResponse } from 'next/server';
import { verifySessionToken } from '@/lib/auth';
import { rateLimiter, getClientIp } from '@/lib/rate-limiter';
import fs from 'fs/promises';
import path from 'path';
import { cookies } from 'next/headers';

import { readData, writeData } from '@/lib/db';

async function readTeam() {
  return readData<any>('team_roster', 'data/team.json', { faculty: [], founding: [], members: [] });
}

async function writeTeam(team: any) {
  await writeData<any>('team_roster', 'data/team.json', team);
}

async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get('tmi_session')?.value;
  return !!(token && verifySessionToken(token));
}

// GET handler — public team roster
export async function GET() {
  const team = await readTeam();
  return NextResponse.json(team);
}

// POST handler — adds a member (Admin only)
export async function POST(request: Request) {
  try {
    if (!await isAuthenticated()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const ip = getClientIp(request);
    const rateLimitResult = rateLimiter(ip, 30, 60000);
    if (!rateLimitResult.success) {
      return NextResponse.json({ error: 'Too many edits. Please slow down.' }, { status: 429 });
    }

    const { type, name, role, year, image, email, linkedin, active, team: dept } = await request.json();

    if (!type || !name || !role) {
      return NextResponse.json({ error: 'Missing mandatory fields' }, { status: 400 });
    }

    const teamData = await readTeam();
    const targetList = teamData[type];

    if (!targetList) {
      return NextResponse.json({ error: 'Invalid list type' }, { status: 400 });
    }

    const maxId = targetList.reduce((max: number, item: any) => Math.max(max, item.id || 0), 0);
    const newMember = {
      id: maxId + 1,
      name: name.trim(),
      role: role.trim(),
      year: (year || '').trim(),
      image: (image || '/images/logo.png').trim(),
      email: (email || '').trim(),
      linkedin: (linkedin || '').trim(),
      active: active !== undefined ? active : true,
      team: (dept || '').trim()
    };

    targetList.push(newMember);
    await writeTeam(teamData);

    return NextResponse.json({ success: true, member: newMember });
  } catch (error) {
    console.error('Add team member error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// PUT handler — edits a member's info (Admin only)
export async function PUT(request: Request) {
  try {
    if (!await isAuthenticated()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { type, id, name, role, year, image, email, linkedin, active, team: dept } = await request.json();

    if (!type || id === undefined || !name || !role) {
      return NextResponse.json({ error: 'Missing mandatory fields' }, { status: 400 });
    }

    const teamData = await readTeam();
    const targetList = teamData[type];

    if (!targetList) {
      return NextResponse.json({ error: 'Invalid list type' }, { status: 400 });
    }

    const index = targetList.findIndex((item: any) => item.id === Number(id));
    if (index === -1) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    targetList[index] = {
      id: Number(id),
      name: name.trim(),
      role: role.trim(),
      year: (year || '').trim(),
      image: (image || '/images/logo.png').trim(),
      email: (email || '').trim(),
      linkedin: (linkedin || '').trim(),
      active: active !== undefined ? active : true,
      team: (dept || '').trim()
    };

    await writeTeam(teamData);
    return NextResponse.json({ success: true, member: targetList[index] });
  } catch (error) {
    console.error('Edit team member error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// DELETE handler — removes a member (Admin only)
export async function DELETE(request: Request) {
  try {
    if (!await isAuthenticated()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const type = url.searchParams.get('type');
    const id = url.searchParams.get('id');

    if (!type || !id) {
      return NextResponse.json({ error: 'Missing type or id parameters' }, { status: 400 });
    }

    const teamData = await readTeam();
    const targetList = teamData[type];

    if (!targetList) {
      return NextResponse.json({ error: 'Invalid list type' }, { status: 400 });
    }

    const filteredList = targetList.filter((item: any) => item.id !== Number(id));
    if (targetList.length === filteredList.length) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    teamData[type] = filteredList;
    await writeTeam(teamData);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete team member error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
