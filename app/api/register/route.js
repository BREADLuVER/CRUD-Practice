import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

// In-memory users for now (should be replaced with DB or shared state in production)
let users = global.users || [];
if (!global.users) global.users = users;

export async function POST(request) {
  const { name, email, password } = await request.json();
  if (!name || !email || !password) {
    return NextResponse.json({ message: 'All fields required.' }, { status: 400 });
  }
  if (users.find(u => u.email === email)) {
    return NextResponse.json({ message: 'Email already exists.' }, { status: 409 });
  }
  const passwordHash = await bcrypt.hash(password, 10);
  users.push({ id: users.length + 1, name, email, passwordHash });
  return NextResponse.json({ message: 'User registered successfully.' }, { status: 201 });
} 