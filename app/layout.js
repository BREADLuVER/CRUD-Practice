'use client';
import { AuthProvider, AuthContext } from './providers/AuthProvider';
import Link from 'next/link';
import { useContext } from 'react';

function GlobalHeader() {
  const { user, logout } = useContext(AuthContext);
  return (
    <header style={{ padding: 16, borderBottom: '1px solid #ccc', marginBottom: 24 }}>
      <nav style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        <Link href="/">Home</Link>
        <Link href="/posts">Posts</Link>
        {user && <Link href="/create">Create</Link>}
        {user ? (
          <>
            <span>Welcome, {user.name}</span>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link href="/login">Login</Link>
            <Link href="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <GlobalHeader />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
} 