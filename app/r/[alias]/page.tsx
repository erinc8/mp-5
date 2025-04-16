// app/r/[alias]/page.tsx
import { redirect } from 'next/navigation'
import { connect } from '@/lib/mongodb'

export default async function RedirectPage({
                                               params
                                           }: {
    params: { alias: string }
}) {
    const db = await connect()
    const urlDoc = await db.collection('urls').findOne({
        alias: params.alias
    })

    if (!urlDoc) return <h1>URL not found</h1>
    redirect(urlDoc.originalUrl)
}
