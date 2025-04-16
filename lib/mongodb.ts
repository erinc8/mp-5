// lib/db.ts
import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI
if (!uri) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local')
}
const client = new MongoClient(uri)

export async function connect() {
    await client.connect()
    return client.db('url_shortener')
}
