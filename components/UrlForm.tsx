'use client'
import { useState } from 'react'

export default function UrlForm() {
    const [url, setUrl] = useState('')
    const [alias, setAlias] = useState('')
    const [result, setResult] = useState('')
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setResult('')

        // Optional: Basic frontend URL validation
        try {
            new URL(url)
        } catch {
            setError('Please enter a valid URL.')
            return
        }

        try {
            const res = await fetch('/api/shorten', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url, alias })
            })

            const contentType = res.headers.get('content-type') || ''
            if (!contentType.includes('application/json')) {
                const text = await res.text()
                throw new Error(text)
            }

            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Request failed')
            setResult(data.shortUrl)
        } catch (err: any) {
            setError(err.message)
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={url}
                onChange={e => setUrl(e.target.value)}
                placeholder="Enter URL"
                required
            />
            <input
                type="text"
                value={alias}
                onChange={e => setAlias(e.target.value)}
                placeholder="Custom alias"
                required
            />
            <button type="submit">Shorten URL</button>
            {result && <div>Short URL: {result}</div>}
            {error && <div style={{ color: 'red' }}>{error}</div>}
        </form>
    )
}
