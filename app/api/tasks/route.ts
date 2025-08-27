import {clientPromise} from '../../../lib/db';
import { taskSchema } from '../../../lib/validations';

export async function GET() {
  const client = await clientPromise;
  const db = client.db();
  const tasks = await db.collection('tasks').find({}).toArray();
  return new Response(JSON.stringify(tasks), { status: 200 });
}

export async function POST(req: Request) {
  const body = await req.json();
  const parse = taskSchema.safeParse(body);
  if (!parse.success) {
    return new Response(JSON.stringify({ error: 'Invalid input' }), { status: 400 });
  }
  const { title, description, status, priority, dueDate, projectId } = parse.data;
  const client = await clientPromise;
  const db = client.db();
  await db.collection('tasks').insertOne({ title, description, status, priority, dueDate, projectId, createdAt: new Date(), updatedAt: new Date() });
  return new Response(JSON.stringify({ success: true }), { status: 201 });
}
