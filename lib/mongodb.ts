import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI environment variable not set');
}

const uri = process.env.MONGODB_URI;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

// Cast global to include _mongoClientPromise property
const globalWithMongo = global as typeof global & {
    _mongoClientPromise?: Promise<MongoClient>;
};

if (process.env.NODE_ENV === 'development') {
    if (!globalWithMongo._mongoClientPromise) {
        client = new MongoClient(uri, options);
        globalWithMongo._mongoClientPromise = client.connect();
    }
    clientPromise = globalWithMongo._mongoClientPromise;
} else {
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
}

export async function connect() {
    const client = await clientPromise;
    return client.db('your-database-name'); // Replace with your DB name
}
export default clientPromise;