import { NextResponse } from 'next/server';
import { verifySessionToken } from '@/lib/auth';
import { rateLimiter, getClientIp } from '@/lib/rate-limiter';
import fs from 'fs/promises';
import path from 'path';

import { cookies } from 'next/headers';

const postsFilePath = path.join(process.cwd(), 'data', 'forum_posts.json');

// Helper to read posts from JSON file
async function readPosts() {
  try {
    const data = await fs.readFile(postsFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Helper to write posts to JSON file
async function writePosts(posts: any[]) {
  await fs.writeFile(postsFilePath, JSON.stringify(posts, null, 2), 'utf8');
}

// Helper to check if request is authenticated
async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get('tmi_session')?.value;
  return !!(token && verifySessionToken(token));
}

// GET handler — fetches posts
export async function GET() {
  const posts = await readPosts();
  return NextResponse.json(posts);
}

// POST handler — creates a new post (Admin only)
export async function POST(request: Request) {
  try {
    // 1. Auth check
    if (!await isAuthenticated()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Rate limit (Admin operations)
    const ip = getClientIp(request);
    const rateLimitResult = rateLimiter(ip, 20, 60000); // 20 admin edits/min
    if (!rateLimitResult.success) {
      return NextResponse.json({ error: 'Too many edits. Please slow down.' }, { status: 429 });
    }

    const { title, category, description } = await request.json();

    // 3. Input sanitation and validation
    if (!title || !category || !description) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const cleanTitle = title.trim().substring(0, 100);
    const cleanCategory = category.trim().substring(0, 50);
    const cleanDescription = description.trim().substring(0, 1000);

    const posts = await readPosts();
    const newPost = {
      id: Date.now().toString(),
      title: cleanTitle,
      category: cleanCategory,
      date: new Date().toISOString().split('T')[0],
      description: cleanDescription
    };

    posts.unshift(newPost); // Add to beginning of array
    await writePosts(posts);

    return NextResponse.json({ success: true, post: newPost });
  } catch (error) {
    console.error('Forum post creation error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// DELETE handler — removes a post by ID (Admin only)
export async function DELETE(request: Request) {
  try {
    if (!await isAuthenticated()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID parameter missing' }, { status: 400 });
    }

    const posts = await readPosts();
    const filteredPosts = posts.filter((post: any) => post.id !== id);

    if (posts.length === filteredPosts.length) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    await writePosts(filteredPosts);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Forum post deletion error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// PUT handler — updates an existing post (Admin only)
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

    const { id, title, category, description } = await request.json();

    if (!id || !title || !category || !description) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const posts = await readPosts();
    const postIndex = posts.findIndex((post: any) => post.id === id);

    if (postIndex === -1) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Update fields
    posts[postIndex].title = title.trim().substring(0, 100);
    posts[postIndex].category = category.trim().substring(0, 50);
    posts[postIndex].description = description.trim().substring(0, 1000);

    await writePosts(posts);
    return NextResponse.json({ success: true, post: posts[postIndex] });
  } catch (error) {
    console.error('Forum post update error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
