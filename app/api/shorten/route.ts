
import { NextResponse } from 'next/server'
import { MongoServerError } from 'mongodb'
import clientPromise from '@/lib/mongodb'



export async function GET() {
    try {
        const client = await clientPromise
        const db = client.db('your-database-name')
        const data = await db.collection('your-collection').find().toArray()
        return new Response(JSON.stringify(data))
    } catch (error) {
        console.error('Database error:', error)
        return new Response('Internal Server Error', { status: 500 })
    }
}

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
        const db = client.db('url-shortener') // Use your actual DB name


        const result = await db.collection('urls').insertOne({
            url,
            alias,
            clicks: 0,
            createdAt: new Date()
        })

        if (!result.acknowledged) {
            throw new Error('Failed to create URL entry')
        }

        return NextResponse.json({
            shortUrl: `${process.env.NEXT_PUBLIC_HOST}/r/${alias}`
        })

    } catch (error) {
        console.error('API error:', error)


        if (error instanceof MongoServerError && error.code === 11000) {
            return NextResponse.json(
                { error: "Alias already exists" },
                { status: 409 }
            )
        }


        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }


}
