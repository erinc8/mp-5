import { redirect } from 'next/navigation'
import { connect } from '@/lib/mongodb' // adjust import to your db connection

export default async function RedirectPage({ params }: { params: { alias: string } }) {
    const db = await connect()
    const found = await db.collection('urls').findOne({ alias: params.alias })

    if (!found) {
        // Optionally, render a 404 or error message
        return <h1>Short URL not found</h1>
    }

    // Redirect to the original URL
    redirect(found.url)
}
