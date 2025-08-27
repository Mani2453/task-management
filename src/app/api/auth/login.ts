import {clientPromise} from '@/lib/db';
import { comparePassword, signJwt } from '@/lib/auth';
import { loginSchema } from '@/lib/validations';

export async function POST(req: Request) {
  const body = await req.json();
  const parse = loginSchema.safeParse(body);
  if (!parse.success) {
    return new Response(JSON.stringify({ error: 'Invalid input' }), { status: 400 });
  }
  const { email, password } = parse.data;
  const client = await clientPromise;
  const db = client.db();
  const user = await db.collection('users').findOne({ email });
  if (!user || !(await comparePassword(password, user.password))) {
    return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 });
  }
  const token = await signJwt({ userId: user._id, email: user.email });
  return new Response(JSON.stringify({ token }), { status: 200 });
}
