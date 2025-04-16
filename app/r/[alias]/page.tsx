// app/r/[alias]/page.tsx
import { redirect } from 'next/navigation'
import clientPromise from '@/lib/mongodb'

export default async function RedirectPage({
                                               params: { alias }
                                           }: {
    params: { alias: string }
}) {
    try {
        const client = await clientPromise
        const db = client.db('url_shortener')

        // Case-insensitive search with regex
        const urlDoc = await db.collection('urls').findOne({
            alias: { $regex: new RegExp(`^${alias}$`, 'i') }
        })

        if (!urlDoc) {
            redirect('/404') // Or return notFound() from next/navigation
        }

        redirect(urlDoc.url)
    } catch (error) {
        console.error('Redirect failed:', error)
        redirect('/error')
    }
}
