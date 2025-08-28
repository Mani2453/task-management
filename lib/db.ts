import { MongoClient } from 'mongodb';


// Always read the connection string from the environment
const uri = process.env.DATABASE_URL || 'mongodb://localhost:27017/taskmanager';
const options = {};

let client: MongoClient;

declare global {
	// eslint-disable-next-line no-var
	var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (!global._mongoClientPromise) {
	client = new MongoClient(uri, options);
	global._mongoClientPromise = client.connect();
}
const clientPromise = global._mongoClientPromise!;

// Use a separate environment variable for the database name
const dbName = process.env.DB_NAME || 'taskmanager';

export { MongoClient, clientPromise, dbName };
