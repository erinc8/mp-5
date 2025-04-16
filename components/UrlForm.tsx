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

        try {
            const response = await fetch('/api/shorten', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ originalUrl: url, alias })
            })

            const data = await response.json()
            if (!response.ok) throw new Error(data.error)

            setResult(data.shortUrl)
            setError('')
        } catch (err) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            setError(err.message)
            setResult('')
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
