// API route to create shortened URLs (POST handler)
import { NextResponse } from 'next/server'
import { connect } from '@/lib/mongodb'
import { isValidUrl } from '@/utils/validation'

export async function POST(request: Request) {
    try {

        const { url, alias } = await request.json()

        if (!url || !alias) {
            return NextResponse.json(
                { error: "Both URL and alias are required" },
                { status: 400 }
            )
        }


        if (!isValidUrl(url)) {
            return NextResponse.json(
                { error: "Invalid URL format" },
                { status: 400 }
            )
        }

        const db = await connect()

        // Check alias availability
        const existing = await db.collection('urls').findOne({ alias })
        if (existing) {
            return NextResponse.json(
                { error: "Alias already exists" },
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
        console.error('API Error:', error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}
