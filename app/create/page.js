'use client';
import { useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '../providers/AuthProvider';

export default function CreatePostPage() {
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  if (!user) {
    return (
      <main style={{ padding: 32 }}>
        <h1>Create Post</h1>
        <p>You must be logged in to create a post.</p>
      </main>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content })
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.message || 'Failed to create post.');
      return;
    }
    const post = await res.json();
    router.push(`/posts/${post.id}`);
  };

  return (
    <main style={{ padding: 32 }}>
      <h1>Create Post</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required /><br />
        <textarea placeholder="Content" value={content} onChange={e => setContent(e.target.value)} required rows={10} cols={50}></textarea><br />
        <button type="submit">Publish</button>
      </form>
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </main>
  );
} 