import { Suspense } from 'react';
import { prisma } from '../../../lib/prisma';
import PostContent from './PostContent';

// Simulate delay for loading state
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export async function generateStaticParams() {
  const posts = await prisma.post.findMany({
    select: { id: true }
  });
  
  return posts.map((post) => ({
    id: post.id,
  }));
}

export default async function PostDetailPage({ params }) {
  // Simulate delay to show loading state
  await delay(2000);
  
  const post = await prisma.post.findUnique({
    where: { id: params.id },
    include: {
      author: {
        select: { name: true }
      },
      comments: {
        include: {
          author: {
            select: { name: true }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      }
    }
  });

  if (!post) {
    return <main style={{ padding: 32 }}><p>Post not found.</p></main>;
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PostContent post={post} />
    </Suspense>
  );
} 