import { NextRequest, NextResponse } from 'next/server';
import { clientPromise } from '@/lib/db';
import { taskSchema } from '@/lib/validations';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
	try {
		const user = await getUserFromRequest(req);
		if (!user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}
		const client = await clientPromise;
		const db = client.db();
		const tasks = await db.collection('tasks')
			.find({ userId: user.userId }, { projection: { title: 1, description: 1, status: 1, priority: 1, dueDate: 1, projectId: 1, userId: 1, createdAt: 1, updatedAt: 1 } })
			.sort({ createdAt: -1 })
			.limit(100)
			.toArray();
		return NextResponse.json(tasks);
	} catch (error) {
		return NextResponse.json({ error: 'Failed to fetch tasks', details: error instanceof Error ? error.message : error }, { status: 500 });
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
		const parse = taskSchema.safeParse(body);
		if (!parse.success) {
			return NextResponse.json({ error: 'Invalid input', issues: parse.error.issues }, { status: 400 });
		}
		const { title, description, status, priority, dueDate, projectId } = parse.data;
		if (!title || !status || !priority || !projectId) {
			return NextResponse.json({ error: 'Title, status, priority, and projectId are required.' }, { status: 400 });
		}
		const client = await clientPromise;
		const db = client.db();
		const result = await db.collection('tasks').insertOne({ title, description, status, priority, dueDate, userId: user.userId, projectId, createdAt: new Date(), updatedAt: new Date() });
		if (!result.acknowledged) {
			return NextResponse.json({ error: 'Failed to create task.' }, { status: 500 });
		}
		return NextResponse.json({ success: true, id: result.insertedId }, { status: 201 });
	} catch (error) {
		return NextResponse.json({ error: 'Failed to create task', details: error instanceof Error ? error.message : error }, { status: 500 });
	}
}
