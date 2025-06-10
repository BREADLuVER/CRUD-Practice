'use client';
import { useContext } from 'react';
import { AuthContext } from './providers/AuthProvider';

export default function Home() {
  const { user } = useContext(AuthContext);
  return (
    <main style={{ padding: 32 }}>
      <h1>Home</h1>
      {user ? (
        <p>Welcome, {user.name}</p>
      ) : (
        <p>Please log in</p>
      )}
    </main>
  );
} 