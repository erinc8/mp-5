
import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function POST(req: Request) {
    try {
        const { url, alias } = await req.json()


        if (!url || !alias) {
            return NextResponse.json(
                { error: "URL and alias are required" },
                { status: 400 }
            )
        }

        const client = await clientPromise
        const db = client.db('url-shortener')


        const exists = await db.collection('urls').findOne({ alias })
        if (exists) {
            return NextResponse.json(
                { error: "Alias 'erin' already exists" },
                { status: 409 }
            )
        }

        // Insert new URL
        await db.collection('urls').insertOne({
            url,
            alias,
            clicks: 0,
            createdAt: new Date()
        })

        return NextResponse.json({
            shortUrl: `${process.env.NEXT_PUBLIC_HOST}/r/${alias}`
        })

    } catch (error) {
        console.error('API error:', error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}
