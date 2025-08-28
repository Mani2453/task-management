import { MongoClient } from 'mongodb';

const uri = process.env.DATABASE_URL || 'mongodb://localhost:27017/taskmanager';
const options = {};

let client: MongoClient;

declare global {
	var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (!global._mongoClientPromise) {
	client = new MongoClient(uri, options);
	global._mongoClientPromise = client.connect();
}
	const clientPromise = global._mongoClientPromise!;

export { MongoClient, clientPromise };
