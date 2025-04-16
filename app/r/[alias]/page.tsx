
import { redirect } from 'next/navigation'
import { connect } from '@/lib/mongodb'

export default async function RedirectPage({
                                               params
                                           }: {
    params: { alias: string }
}) {
    try {
        const db = await connect()
        const urlDoc = await db.collection('urls').findOne({ alias: params.alias })

        if (!urlDoc) return <h1>URL not found</h1>
        redirect(urlDoc.url)

    } catch (error) {
        console.error('Redirect error:', error)

        throw error
    }
}
