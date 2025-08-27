import {clientPromise} from '../../../lib/db';
import { hashPassword } from '../../../lib/auth';
import { registerSchema } from '../../../lib/validations';

export async function POST(req: Request) {
  const body = await req.json();
    console.log('No existing user found, proceeding to hash password and create user.',body);

  const parse = registerSchema.safeParse(body);
  if (!parse.success) {
    return new Response(JSON.stringify({ error: 'Invalid input' }), { status: 400 });
  }
  const { name, email, password } = parse.data;
  const client = await clientPromise;
  const db = client.db();
  const existing = await db.collection('users').findOne({ email });
  if (existing) {
    return new Response(JSON.stringify({ error: 'Email already exists' }), { status: 409 });
  }
  console.log('No existing user found, proceeding to hash password and create user.');
  const hashed = await hashPassword(password);
  await db.collection('users').insertOne({ name, email, password: hashed, createdAt: new Date(), updatedAt: new Date() });
  return new Response(JSON.stringify({ success: true }), { status: 201 });
}
