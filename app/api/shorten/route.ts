
import { NextResponse } from 'next/server'
import { connect } from '@/lib/mongodb'
import { MongoServerError } from 'mongodb'

export async function POST(req: Request) {
    try {
        const { url, alias } = await req.json()

        // Validate inputs
        if (!url || !alias) {
            return NextResponse.json(
                { error: "URL and alias required" },
                { status: 400 }
            )
        }

        const db = await connect()

        const exists = await db.collection('urls').findOne({
            alias: { $regex: new RegExp(`^${alias}$`, 'i') }
        })

        if (exists) {
            return NextResponse.json(
                { error: "Alias already exists" },
                { status: 409 }
            )
        }


        const result = await db.collection('urls').insertOne({
            url,
            alias,
            clicks: 0,
            createdAt: new Date()
        })

        if (!result.acknowledged) {
            throw new Error('Failed to insert document')
        }

        return NextResponse.json({
            shortUrl: `${process.env.NEXT_PUBLIC_HOST}/r/${alias}`
        })

    } catch (error) {
        console.error('API error:', error)

        // Handle duplicate key errors specifically
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
