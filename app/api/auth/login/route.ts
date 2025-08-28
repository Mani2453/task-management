import { NextRequest, NextResponse } from 'next/server';
import { loginSchema } from '@/lib/validations';
import { clientPromise } from '@/lib/db';
import { comparePassword } from '@/lib/password';
import { signJwt } from '@/lib/jwt';

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const parsed = loginSchema.safeParse(body);
		if (!parsed.success) {
			return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
		}
		const { email, password } = parsed.data;
		const client = await clientPromise;
		const db = client.db();
		const user = await db.collection('users').findOne({ email });
		if (!user) {
			return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
		}
		const valid = await comparePassword(password, user.password);
		if (!valid) {
			return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
		}
		const token = await signJwt({ userId: user._id.toString(), email: user.email, name: user.name });
		return NextResponse.json({ token, user: { _id: user._id.toString(), email: user.email, name: user.name } });
		} catch {
			return NextResponse.json({ error: 'Server error' }, { status: 500 });
		}
}
