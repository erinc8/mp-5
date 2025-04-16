// lib/db.ts
// lib/db.ts
import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI
if (!uri) {
    throw new Error('MONGODB_URI environment variable not defined')
}
// lib/db.ts
if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI environment variable not defined')
}

const client = new MongoClient(uri)
// ... rest of connection logic


export async function connect() {
    await client.connect()
    return client.db('url_shortener')
}
