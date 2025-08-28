import { clientPromise } from '../../../../lib/db';
import { ObjectId } from 'mongodb';
import { taskSchema } from '../../../../lib/validations';
import { getUserFromRequest } from '../../../../lib/auth';
import { NextRequest } from 'next/server';

interface TaskRouteContext {
	params: Promise<{ id: string }>;
}

export async function PUT(req: NextRequest, context: TaskRouteContext) {
	try {
		if (!req.headers.get('content-type')?.includes('application/json')) {
			return new Response(JSON.stringify({ error: 'Content-Type must be application/json' }), { status: 415 });
		}

		// Get authenticated user
		const user = await getUserFromRequest(req);
		if (!user) {
			return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
		}

		const body = await req.json();
		const parse = taskSchema.safeParse(body);
		if (!parse.success) {
			return new Response(JSON.stringify({ error: 'Invalid input', issues: parse.error.issues }), { status: 400 });
		}
		const { title, description, status, priority, dueDate, projectId } = parse.data;
		if (!title || !status || !priority || !projectId) {
			return new Response(JSON.stringify({ error: 'Title, status, priority, and projectId are required.' }), { status: 400 });
		}
		const { id } = await context.params;

		const client = await clientPromise;
		const db = client.db();
		const result = await db.collection('tasks').updateOne(
			{ _id: new ObjectId(id), userId: user.userId },
			{ $set: { title, description, status, priority, dueDate, userId: user.userId, projectId, updatedAt: new Date() } }
		);
		if (result.matchedCount === 0) {
			return new Response(JSON.stringify({ error: 'Task not found.' }), { status: 404 });
		}
		return new Response(JSON.stringify({ success: true }), { status: 200 });
	} catch (error) {
		return new Response(JSON.stringify({ error: 'Failed to update task', details: error instanceof Error ? error.message : error }), { status: 500 });
	}
}

export async function DELETE(_req: Request, context: TaskRouteContext) {
	try {
        const { id } = await context.params;

		const client = await clientPromise;
		const db = client.db();
		const result = await db.collection('tasks').deleteOne({ _id: new ObjectId(id) });
		if (result.deletedCount === 0) {
			return new Response(JSON.stringify({ error: 'Task not found.' }), { status: 404 });
		}
		return new Response(JSON.stringify({ success: true }), { status: 200 });
	} catch (error) {
		return new Response(JSON.stringify({ error: 'Failed to delete task', details: error instanceof Error ? error.message : error }), { status: 500 });
	}
}
