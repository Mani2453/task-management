import {clientPromise} from '../../../lib/db';
import { projectSchema } from '../../../lib/validations';

export async function GET() {
  const client = await clientPromise;
  const db = client.db();
  const projects = await db.collection('projects').find({}).toArray();
  return new Response(JSON.stringify(projects), { status: 200 });
}

export async function POST(req: Request) {
  const body = await req.json();
  const parse = projectSchema.safeParse(body);
  if (!parse.success) {
    return new Response(JSON.stringify({ error: 'Invalid input' }), { status: 400 });
  }
  const { title, description, color } = parse.data;
  const client = await clientPromise;
  const db = client.db();
  await db.collection('projects').insertOne({ title, description, color, createdAt: new Date(), updatedAt: new Date() });
  return new Response(JSON.stringify({ success: true }), { status: 201 });
}
