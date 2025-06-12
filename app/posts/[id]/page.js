'use client';
import { useEffect, useState, useContext } from 'react';
import { useParams } from 'next/navigation';
import { AuthContext } from '../../providers/AuthProvider';

export default function PostDetailPage() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [comment, setComment] = useState('');
  const [commentError, setCommentError] = useState('');

  useEffect(() => {
    fetch(`/api/posts/${id}`).then(async res => {
      if (!res.ok) {
        setError('Failed to load post.');
        setLoading(false);
        return;
      }
      const data = await res.json();
      setPost(data);
      setLoading(false);
    });
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setCommentError('');
    const res = await fetch(`/api/posts/${id}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: comment })
    });
    if (!res.ok) {
      const data = await res.json();
      setCommentError(data.message || 'Failed to add comment.');
      return;
    }
    const newComment = await res.json();
    setPost(prev => ({ ...prev, comments: [...prev.comments, newComment] }));
    setComment('');
  };

  if (loading) {
    return <main style={{ padding: 32 }}><p>Loading...</p></main>;
  }

  if (error) {
    return <main style={{ padding: 32 }}><p style={{ color: 'red' }}>{error}</p></main>;
  }

  return (
    <main style={{ padding: 32 }}>
      <h1>{post.title}</h1>
      <p style={{ fontSize: 14, marginTop: 0 }}>by {post.author.name} on {new Date(post.createdAt).toLocaleString()}</p>
      <p>{post.content}</p>
      <hr />
      <h3>Comments</h3>
      {post.comments.length === 0 ? (
        <p>No comments yet.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {post.comments.map(c => (
            <li key={c.id} style={{ marginBottom: 12 }}>
              <p style={{ margin: '4px 0' }}>{c.content}</p>
              <p style={{ fontSize: 12, color: '#555', margin: 0 }}>by {c.author.name} on {new Date(c.createdAt).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}

      {user ? (
        <form onSubmit={handleCommentSubmit} style={{ marginTop: 24 }}>
          <textarea placeholder="Add a comment..." value={comment} onChange={e => setComment(e.target.value)} required rows={4} cols={50}></textarea><br />
          <button type="submit">Submit Comment</button>
        </form>
      ) : (
        <p>You must be logged in to comment.</p>
      )}
      {commentError && <div style={{ color: 'red' }}>{commentError}</div>}
    </main>
  );
} 