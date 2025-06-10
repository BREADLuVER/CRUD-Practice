import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

let users = global.users || [];
if (!global.users) global.users = users;

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

export async function POST(request) {
  const { email, password } = await request.json();
  const user = users.find(u => u.email === email);
  if (!user) {
    return NextResponse.json({ message: 'Invalid credentials.' }, { status: 401 });
  }
  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    return NextResponse.json({ message: 'Invalid credentials.' }, { status: 401 });
  }
  const token = jwt.sign({ id: user.id, name: user.name }, JWT_SECRET, { expiresIn: '1h' });
  const response = NextResponse.json({ message: 'Login successful.' });
  response.cookies.set('token', token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60, // 1 hour
  });
  return response;
} 