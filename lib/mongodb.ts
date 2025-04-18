// lib/mongodb.ts
import { MongoClient } from 'mongodb'


declare global {

    var _mongoClientPromise: Promise<MongoClient> | undefined
}

const uri = process.env.MONGODB_URI
if (!uri) throw new Error('MONGODB_URI not set in environment variables')

let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromise) {
        global._mongoClientPromise = new MongoClient(uri).connect()
    }
    clientPromise = global._mongoClientPromise
} else {
    clientPromise = new MongoClient(uri).connect()
}

export default clientPromise
