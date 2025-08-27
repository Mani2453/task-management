// Native MongoDB client setup
import { MongoClient } from 'mongodb';

const uri = process.env.DATABASE_URL || 'mongodb://localhost:27017/taskmanager';
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (!global._mongoClientPromise) {
  client = new MongoClient(uri, options);
  global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise!;

export { MongoClient, clientPromise };
