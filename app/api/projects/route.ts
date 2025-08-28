import { NextRequest, NextResponse } from 'next/server';
import { clientPromise, dbName } from '@/lib/db';
import { projectSchema } from '@/lib/validations';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
	try {
		const user = await getUserFromRequest(req);
		if (!user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}
		const client = await clientPromise;
		const db = client.db(dbName);
		const projects = await db.collection('projects')
			.find({ userId: user.userId }, { projection: { title: 1, description: 1, color: 1, userId: 1, createdAt: 1, updatedAt: 1 } })
			.sort({ createdAt: -1 })
			.limit(100)
			.toArray();
		return NextResponse.json(projects);
	} catch (error) {
		return NextResponse.json({ error: 'Failed to fetch projects', details: error instanceof Error ? error.message : error }, { status: 500 });
	}
}

export async function POST(req: NextRequest) {
	try {
		const user = await getUserFromRequest(req);
		if (!user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}
		if (!req.headers.get('content-type')?.includes('application/json')) {
			return NextResponse.json({ error: 'Content-Type must be application/json' }, { status: 415 });
		}
		const body = await req.json();
		const parse = projectSchema.safeParse(body);
		if (!parse.success) {
			return NextResponse.json({ error: 'Invalid input', issues: parse.error.issues }, { status: 400 });
		}
		const { title, description } = parse.data;
		if (!title ) {
			return NextResponse.json({ error: 'Title and color are required.' }, { status: 400 });
		}
		const client = await clientPromise;
		const db = client.db();
		const result = await db.collection('projects').insertOne({ title, description, userId: user.userId, createdAt: new Date(), updatedAt: new Date() });
		if (!result.acknowledged) {
			return NextResponse.json({ error: 'Failed to create project.' }, { status: 500 });
		}
		return NextResponse.json({ success: true, id: result.insertedId }, { status: 201 });
	} catch (error) {
		return NextResponse.json({ error: 'Failed to create project', details: error instanceof Error ? error.message : error }, { status: 500 });
	}
}
