import { clientPromise, dbName } from '../../../../lib/db';
import { ObjectId } from 'mongodb';
import { projectSchema } from '../../../../lib/validations';
import { NextRequest } from 'next/server';
import { getUserFromRequest } from '../../../../lib/auth';

interface ProjectRouteContext {
  params: Promise<{ id: string }>; // Changed: params is now a Promise
}

export async function PUT(req: NextRequest, context: ProjectRouteContext) {
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
		const parse = projectSchema.safeParse(body);
		if (!parse.success) {
			return new Response(JSON.stringify({ error: 'Invalid input', issues: parse.error.issues }), { status: 400 });
		}

		const { title, description } = parse.data;
		if (!title) {
			return new Response(JSON.stringify({ error: 'Title is required.' }), { status: 400 });
		}

		// Await the params Promise
		const { id } = await context.params;

		const client = await clientPromise;
		const db = client.db(dbName);
		const result = await db.collection('projects').updateOne(
			{ _id: new ObjectId(id), userId: user.userId },
			{ $set: { title, description, userId: user.userId, updatedAt: new Date() } }
		);

		if (result.matchedCount === 0) {
			return new Response(JSON.stringify({ error: 'Project not found.' }), { status: 404 });
		}

		return new Response(JSON.stringify({ success: true }), { status: 200 });
	} catch (error) {
		return new Response(JSON.stringify({ error: 'Failed to update project', details: error instanceof Error ? error.message : error }), { status: 500 });
	}
}

export async function DELETE(_req: NextRequest, context: ProjectRouteContext) {
	try {
		// Changed: await the params Promise
		const { id } = await context.params;
		
		const client = await clientPromise;
		const db = client.db(dbName);
		const result = await db.collection('projects').deleteOne({ _id: new ObjectId(id) }); // Changed: use the awaited id
		
		if (result.deletedCount === 0) {
			return new Response(JSON.stringify({ error: 'Project not found.' }), { status: 404 });
		}
		
		return new Response(JSON.stringify({ success: true }), { status: 200 });
	} catch (error) {
		return new Response(JSON.stringify({ error: 'Failed to delete project', details: error instanceof Error ? error.message : error }), { status: 500 });
	}
}