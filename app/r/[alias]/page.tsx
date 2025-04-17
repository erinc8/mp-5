import { redirect } from 'next/navigation'
import clientPromise from '@/lib/mongodb'

export default async function Page({
                                       params
                                   }: {
    params: Promise<{ alias: string }> // Correct type for Next.js 15
}) {
    // Await the params Promise first
    const { alias } = await params

    // Then handle database connection
    const client = await clientPromise
    const db = client.db('url-shortener')
    const entry = await db.collection('urls').findOne({ alias })

    if (!entry) redirect('/not-found')
    redirect(entry.url)
}
