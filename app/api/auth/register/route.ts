import { NextRequest, NextResponse } from 'next/server';
import { registerSchema } from '@/lib/validations';
import { clientPromise } from '@/lib/db';
import { hashPassword } from '@/lib/password';
import { signJwt } from '@/lib/jwt';

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const parsed = registerSchema.safeParse(body);
		if (!parsed.success) {
			return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
		}
		const { name, email, password } = parsed.data;
		const client = await clientPromise;
		const db = client.db();
		const existing = await db.collection('users').findOne({ email });
		if (existing) {
			return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
		}
		const hashed = await hashPassword(password);
		const user = {
			name,
			email,
			password: hashed,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		};
		const result = await db.collection('users').insertOne(user);
		const userId = result.insertedId.toString();
		const token = await signJwt({ userId, email, name });
		return NextResponse.json({ token, user: { _id: userId, email, name } });
		} catch {
			return NextResponse.json({ error: 'Server error' }, { status: 500 });
		}
}
