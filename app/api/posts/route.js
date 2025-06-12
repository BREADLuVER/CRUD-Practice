import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from '../../../lib/prisma.js';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

async function getAuthUser(request) {
  const token = request.cookies.get('token')?.value;
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    return user;
  } catch {
    return null;
  }
}

// GET /api/posts – list all posts
export async function GET() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
    include: { author: { select: { id: true, name: true } } }
  });
  return NextResponse.json(posts);
}

// POST /api/posts – create a new post
export async function POST(request) {
  const user = await getAuthUser(request);
  if (!user) {
    return NextResponse.json({ message: 'Not authenticated.' }, { status: 401 });
  }

  const { title, content } = await request.json();
  if (!title || !content) {
    return NextResponse.json({ message: 'Title and content required.' }, { status: 400 });
  }

  const post = await prisma.post.create({
    data: {
      title,
      content,
      authorId: user.id,
    },
    include: { author: { select: { id: true, name: true } } }
  });

  return NextResponse.json(post, { status: 201 });
} 