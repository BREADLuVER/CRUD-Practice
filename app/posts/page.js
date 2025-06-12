'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function PostsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/posts').then(async res => {
      if (!res.ok) {
        setError('Failed to load posts.');
        setLoading(false);
        return;
      }
      const data = await res.json();
      setPosts(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <main style={{ padding: 32 }}><p>Loading...</p></main>;
  }

  if (error) {
    return <main style={{ padding: 32 }}><p style={{ color: 'red' }}>{error}</p></main>;
  }

  return (
    <main style={{ padding: 32 }}>
      <h1>Blog Posts</h1>
      {posts.length === 0 ? (
        <p>No posts yet.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {posts.map(post => (
            <li key={post.id} style={{ marginBottom: 24, borderBottom: '1px solid #ccc', paddingBottom: 12 }}>
              <h3 style={{ margin: 0 }}>
                <Link href={`/posts/${post.id}`}>{post.title}</Link>
              </h3>
              <p style={{ margin: '4px 0 0 0', fontSize: 14 }}>by {post.author.name} on {new Date(post.createdAt).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
} 