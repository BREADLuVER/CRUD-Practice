import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from '../../../../../lib/prisma.js';

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

export async function POST(request, { params }) {
  const user = await getAuthUser(request);
  if (!user) {
    return NextResponse.json({ message: 'Not authenticated.' }, { status: 401 });
  }
  const { id: postId } = params;
  const { content } = await request.json();
  if (!content) {
    return NextResponse.json({ message: 'Content required.' }, { status: 400 });
  }
  // Validate post exists
  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) {
    return NextResponse.json({ message: 'Post not found.' }, { status: 404 });
  }
  const comment = await prisma.comment.create({
    data: {
      content,
      postId,
      authorId: user.id,
    },
    include: { author: { select: { id: true, name: true } } }
  });

  return NextResponse.json(comment, { status: 201 });
} 