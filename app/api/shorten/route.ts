// app/api/shorten/route.ts
import { NextResponse } from 'next/server'
import { connect } from '@/lib/mongodb'
import { isValidUrl } from '@/utils/validation'

export async function POST(req: Request) {
    const { originalUrl, alias } = await req.json()
    const db = await connect()

    if (!isValidUrl(originalUrl)) {
        return NextResponse.json(
            { error: 'Invalid URL format' },
            { status: 400 }
        )
    }

    const exists = await db.collection('urls').findOne({ alias })
    if (exists) {
        return NextResponse.json(
            { error: 'Alias already exists' },
            { status: 409 }
        )
    }

    await db.collection('urls').insertOne({
        originalUrl,
        alias,
        createdAt: new Date()
    })

    return NextResponse.json({
        shortUrl: `${process.env.NEXT_PUBLIC_HOST}/r/${alias}`
    })
}
