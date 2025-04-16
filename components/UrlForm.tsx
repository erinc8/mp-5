// components/UrlForm.tsx
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

        try {
            // Validate URL first
            new URL(url) // Throws error for invalid URLs
        } catch {
            setError('Please enter a valid URL')
            return
        }

        try {
            const res = await fetch('/api/shorten', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url, alias })
            })

            // Handle non-JSON responses
            const contentType = res.headers.get('content-type')
            if (!contentType?.includes('application/json')) {
                throw new Error('Invalid server response')
            }

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'Request failed')
            }

            setResult(`${window.location.origin}/${data.alias}`)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error')
        }
    }





    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter URL"
                required
            />
            <input
                type="text"
                value={alias}
                onChange={(e) => setAlias(e.target.value)}
                placeholder="Custom alias (optional)"
            />
            <button type="submit">Shorten</button>

            {result && (
                <div>
                    <p>Short URL: {result}</p>
                    <button onClick={() => navigator.clipboard.writeText(result)}>
                        Copy
                    </button>
                </div>
            )}

            {error && <p className="error">{error}</p>}
        </form>
    )
}
