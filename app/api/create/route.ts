// app/api/create/route.ts
import clientPromise from '@/lib/mongodb'

export async function POST(req: Request) {
    const { url, alias } = await req.json()
    const client = await clientPromise
    const db = client.db('url-shortener')

    // Check existing alias
    const existing = await db.collection('urls').findOne({ alias })
    if (existing) return Response.json({ error: 'Alias exists' }, { status: 409 })

    // Insert new entry
    await db.collection('urls').insertOne({
        url,
        alias,
        created: new Date()
    })

    return Response.json({ success: true })
}
