

import { redirect } from 'next/navigation'
import clientPromise from '@/lib/mongodb'

export default async function Page({
                                       params
                                   }: {
    params: Promise<{ alias: string }>
}) {
    const { alias } = await params
    const client = await clientPromise
    const db = client.db('url-shortener')
    const entry = await db.collection('urls').findOne({ alias })

    if (!entry) redirect('/not-found')
    redirect(entry.url)
}
