// components/UrlShortenerForm.tsx

'use client'
import { useState } from 'react'

export default function UrlShortenerForm() {
    const [url, setUrl] = useState('')
    const [alias, setAlias] = useState('')
    const [error, setError] = useState('')
    const [shortUrl, setShortUrl] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setShortUrl('')

        // Basic frontend URL validation
        try {
            new URL(url)
        } catch {
            setError('Please enter a valid URL.')
            return
        }

        // Call your backend API to create the short URL
        const res = await fetch('/api/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url, alias }),
        })

        const data = await res.json()
        if (!res.ok) {
            setError(data.error || 'Something went wrong.')
        } else {
            setShortUrl(`${window.location.origin}/${alias}`)
            setUrl('')
            setAlias('')
        }
    }

    return (
        <div className="flex flex-col items-center min-h-screen bg-green-100">
            <h1 className="text-4xl font-mono font-bold mt-6 mb-2">CS391 URL Shortener</h1>
            <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8 mt-8">
                <h2 className="text-2xl font-mono font-bold mb-2 text-center">URL Shortener</h2>
                <p className="text-center text-gray-600 mb-6">
                    Shorten your long URLs into compact, shareable links
                </p>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <label className="font-semibold">URL</label>
                    <input
                        type="text"
                        className="border rounded px-3 py-2"
                        placeholder="https://example.com/very/long/url"
                        value={url}
                        onChange={e => setUrl(e.target.value)}
                        required
                    />
                    <label className="font-semibold">Custom Alias</label>
                    <div className="flex items-center">
            <span className="bg-gray-100 px-2 py-2 rounded-l text-gray-500 text-sm border border-r-0 border-gray-300">
              {typeof window !== 'undefined' ? window.location.origin : 'https://your-app.com'}/
            </span>
                        <input
                            type="text"
                            className="border rounded-r px-3 py-2 flex-1"
                            placeholder="your-custom-alias"
                            value={alias}
                            onChange={e => setAlias(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    {shortUrl && (
                        <p className="text-green-600 text-sm">
                            Shortened URL: <a href={shortUrl} className="underline" target="_blank" rel="noopener noreferrer">{shortUrl}</a>
                        </p>
                    )}
                    <button
                        type="submit"
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded mt-2"
                    >
                        Shorten
                    </button>
                </form>
            </div>
        </div>
    )
}
