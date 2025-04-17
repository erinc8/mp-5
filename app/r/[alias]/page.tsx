// app/r/[alias]/page.tsx
import { redirect } from 'next/navigation'
import clientPromise from '@/lib/mongodb'

export default async function Page({
                                       params
                                   }: {
    params: { alias: string }
}) {
    const client = await clientPromise
    const db = client.db('url-shortener')
    const entry = await db.collection('urls').findOne({ alias: params.alias })

    if (!entry) redirect('/not-found')
    redirect(entry.url)
}
