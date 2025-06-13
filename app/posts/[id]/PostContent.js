'use client';
import { useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '../../providers/AuthProvider';

export default function PostContent({ post }) {
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const [comment, setComment] = useState('');
  const [commentError, setCommentError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(post.title);
  const [editContent, setEditContent] = useState(post.content);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setCommentError('');
    const res = await fetch(`/api/posts/${post.id}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: comment })
    });
    if (!res.ok) {
      const data = await res.json();
      setCommentError(data.message || 'Failed to add comment.');
      return;
    }
    router.refresh();
    setComment('');
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    const res = await fetch(`/api/posts/${post.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: editTitle, content: editContent })
    });
    if (!res.ok) {
      alert('Failed to update post');
      return;
    }
    setIsEditing(false);
    router.refresh();
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    
    setIsDeleting(true);
    const res = await fetch(`/api/posts/${post.id}`, {
      method: 'DELETE'
    });
    if (!res.ok) {
      alert('Failed to delete post');
      setIsDeleting(false);
      return;
    }
    router.push('/posts');
  };

  const isAuthor = user?.id === post.authorId;

  return (
    <main style={{ padding: 32 }}>
      {isEditing ? (
        <form onSubmit={handleEdit}>
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            style={{ width: '100%', marginBottom: '16px', padding: '8px' }}
            required
          />
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            style={{ width: '100%', minHeight: '200px', marginBottom: '16px', padding: '8px' }}
            required
          />
          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="submit">Save</button>
            <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        </form>
      ) : (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h1>{post.title}</h1>
            {isAuthor && (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => setIsEditing(true)}>Edit</button>
                <button 
                  onClick={handleDelete} 
                  disabled={isDeleting}
                  style={{ backgroundColor: '#ff4444', color: 'white' }}
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            )}
          </div>
          <p style={{ fontSize: 14, marginTop: 0 }}>
            by {post.author.name} on {new Date(post.createdAt).toLocaleString()}
          </p>
          <p>{post.content}</p>
        </>
      )}

      <hr />
      <h3>Comments</h3>
      {post.comments.length === 0 ? (
        <p>No comments yet.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {post.comments.map(c => (
            <li key={c.id} style={{ marginBottom: 12 }}>
              <p style={{ margin: '4px 0' }}>{c.content}</p>
              <p style={{ fontSize: 12, color: '#555', margin: 0 }}>
                by {c.author.name} on {new Date(c.createdAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}

      {user ? (
        <form onSubmit={handleCommentSubmit} style={{ marginTop: 24 }}>
          <textarea
            placeholder="Add a comment..."
            value={comment}
            onChange={e => setComment(e.target.value)}
            required
            rows={4}
            cols={50}
          />
          <br />
          <button type="submit">Submit Comment</button>
        </form>
      ) : (
        <p>You must be logged in to comment.</p>
      )}
      {commentError && <div style={{ color: 'red' }}>{commentError}</div>}
    </main>
  );
} 