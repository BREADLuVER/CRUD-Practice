import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

let users = global.users || [];
if (!global.users) global.users = users;

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

export async function GET(request) {
  const token = request.cookies.get('token')?.value;
  if (!token) {
    return NextResponse.json({ message: 'Not authenticated.' }, { status: 401 });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = users.find(u => u.id === decoded.id);
    if (!user) {
      return NextResponse.json({ message: 'User not found.' }, { status: 404 });
    }
    return NextResponse.json({ id: user.id, name: user.name, email: user.email });
  } catch (err) {
    return NextResponse.json({ message: 'Invalid or expired token.' }, { status: 401 });
  }
} 