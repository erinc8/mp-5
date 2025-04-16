// components/UrlForm.tsx
'use client'
import { useState } from 'react'

export default function UrlForm() {
    const [url, setUrl] = useState('')
    const [alias, setAlias] = useState('')
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Frontend validation
        const urlRegex = /^(https?:\/\/)/i
        if (!urlRegex.test(url)) {
            setError('Invalid URL format')
            return
        }

        const response = await fetch('/api/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url, alias })
        })

        if (!response.ok) {
            const { error } = await response.json()
            setError(error || 'Failed to create short URL')
        } else {
            // Success handling
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter URL"
            />
            <input
                type="text"
                value={alias}
                onChange={(e) => setAlias(e.target.value)}
                placeholder="Custom alias (optional)"
            />
            {error && <p className="text-red-500">{error}</p>}
            <button type="submit">Shorten</button>
        </form>
    )
}
