import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma.js';

export async function GET(_request, { params }) {
  const { id } = params;
  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      author: { select: { id: true, name: true } },
      comments: {
        orderBy: { createdAt: 'asc' },
        include: { author: { select: { id: true, name: true } } }
      }
    }
  });
  if (!post) {
    return NextResponse.json({ message: 'Post not found.' }, { status: 404 });
  }
  return NextResponse.json(post);
} 