'use client'
import { useState, useEffect } from 'react'

export default function UrlShortenerForm() {
    const [origin, setOrigin] = useState('')
    const [url, setUrl] = useState('')
    const [alias, setAlias] = useState('')
    const [shortUrl, setShortUrl] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setOrigin(window.location.origin)
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setShortUrl('')
        setLoading(true)

        // Basic frontend URL validation
        try {
            new URL(url)
        } catch {
            setError('Please enter a valid URL.')
            setLoading(false)
            return
        }

        const res = await fetch('/api/shorten', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url, alias }),
        })

        const data = await res.json()
        if (!res.ok) {
            setError(data.error || 'Something went wrong.')
        } else {
            setShortUrl(`${origin}/${alias}`)
            setUrl('')
            setAlias('')
        }
        setLoading(false)
    }

    const copyToClipboard = () => {
        if (shortUrl) {
            navigator.clipboard.writeText(shortUrl)
        }
    }

    return (
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-md mx-auto">
            <h1 className="text-3xl font-bold text-center mb-6 text-gray-300">URL Shortener</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1 text-gray-300">Long URL</label>
                    <input
                        type="text"
                        value={url}
                        onChange={e => setUrl(e.target.value)}
                        placeholder="https://example.com/very/long/url"
                        className="w-full p-2 border rounded text-gray-700"
                        required
                        disabled={loading}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1 text-gray-300">Custom Alias</label>
                    <div className="flex">
            <span className="bg-gray-100 p-2 rounded-l border border-r-0 text-gray-400">
              {origin ? `${origin}/` : 'Loading...'}
            </span>
                        <input
                            type="text"
                            value={alias}
                            onChange={e => setAlias(e.target.value)}
                            placeholder="your-alias"
                            className="flex-1 p-2 border rounded-r text-gray-700"
                            required
                            disabled={loading}
                        />
                    </div>
                </div>
                {error && <div className="text-red-500 text-sm">{error}</div>}
                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full p-2 text-white font-medium rounded ${loading ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'}`}
                >
                    {loading ? 'Shortening...' : 'Shorten URL'}
                </button>
            </form>
            {shortUrl && (
                <div className="mt-6 p-4 bg-green-50 rounded">
                    <p className="font-medium mb-2 text-gray-700">Your shortened URL:</p>
                    <div className="flex items-center">
                        <input
                            type="text"
                            value={shortUrl}
                            readOnly
                            className="flex-1 p-2 border rounded-l text-gray-700"
                        />
                        <button
                            onClick={copyToClipboard}
                            className="bg-blue-500 text-white p-2 rounded-r"
                        >
                            Copy
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
