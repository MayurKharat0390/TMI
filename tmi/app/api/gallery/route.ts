import { NextResponse } from 'next/server';
import { verifySessionToken } from '@/lib/auth';
import { rateLimiter, getClientIp } from '@/lib/rate-limiter';
import fs from 'fs/promises';
import path from 'path';
import { cookies } from 'next/headers';

import { readData, writeData } from '@/lib/db';

async function readGallery() {
  return readData<any>('gallery_catalog', 'data/gallery.json', {});
}

async function writeGallery(gallery: any) {
  await writeData<any>('gallery_catalog', 'data/gallery.json', gallery);
}

async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get('tmi_session')?.value;
  return !!(token && verifySessionToken(token));
}

// GET handler — fetches full gallery catalogs
export async function GET() {
  const gallery = await readGallery();
  return NextResponse.json(gallery);
}

// POST handler — adds an image (Admin only)
export async function POST(request: Request) {
  try {
    if (!await isAuthenticated()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const ip = getClientIp(request);
    const rateLimitResult = rateLimiter(ip, 30, 60000);
    if (!rateLimitResult.success) {
      return NextResponse.json({ error: 'Too many requests. Please slow down.' }, { status: 429 });
    }

    const { year, src, alt } = await request.json();

    if (!year || !src) {
      return NextResponse.json({ error: 'Missing year or src parameter' }, { status: 400 });
    }

    const cleanYear = year.trim();
    const cleanSrc = src.trim();
    const cleanAlt = (alt || `Image ${cleanYear}`).trim();

    const galleryData = await readGallery();
    if (!galleryData[cleanYear]) {
      galleryData[cleanYear] = [];
    }

    const yearImages = galleryData[cleanYear];
    const maxId = yearImages.reduce((max: number, img: any) => Math.max(max, img.id || 0), 0);

    const newImage = {
      id: maxId + 1,
      src: cleanSrc,
      alt: cleanAlt
    };

    yearImages.push(newImage);
    await writeGallery(galleryData);

    return NextResponse.json({ success: true, image: newImage });
  } catch (error) {
    console.error('Gallery image publish error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// DELETE handler — removes an image (Admin only)
export async function DELETE(request: Request) {
  try {
    if (!await isAuthenticated()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const year = url.searchParams.get('year');
    const id = url.searchParams.get('id');

    if (!year || !id) {
      return NextResponse.json({ error: 'Missing year or id parameter' }, { status: 400 });
    }

    const galleryData = await readGallery();
    const yearImages = galleryData[year];

    if (!yearImages) {
      return NextResponse.json({ error: 'Year catalog not found' }, { status: 404 });
    }

    const filteredImages = yearImages.filter((img: any) => img.id !== Number(id));
    if (yearImages.length === filteredImages.length) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    galleryData[year] = filteredImages;
    
    // If year has no more images, clean up the key
    if (filteredImages.length === 0) {
      delete galleryData[year];
    }

    await writeGallery(galleryData);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Gallery image delete error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
