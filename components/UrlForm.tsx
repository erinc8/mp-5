
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

        try {
            // Basic client-side validation
            new URL(url)

            const res = await fetch('/api/shorten', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url, alias })
            })

            const text = await res.text()
            const data = text ? JSON.parse(text) : {}

            if (!res.ok) throw new Error(data.error || 'Request failed')

            setResult(data.shortUrl)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error')
        }
    }

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1 text-black">URL to shorten</label>
                    <input
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://example.com"
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1 text-black">Custom alias</label>
                    <input
                        type="text"
                        value={alias}
                        onChange={(e) => setAlias(e.target.value)}
                        placeholder="my-custom-alias"
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-500 accent-black p-2 rounded hover:bg-blue-600"
                >
                    Shorten URL
                </button>

                {error && <p className="text-red-500 text-sm">{error}</p>}
                {result && (
                    <div className="mt-4 p-3 accent-black rounded">
                        <p className="font-medium">Short URL:</p>
                        <div className="flex items-center gap-2 mt-2">
                            <input
                                type="text"
                                value={result}
                                readOnly
                                className="flex-1 p-2 border rounded text-black"
                            />
                            <button
                                onClick={() => navigator.clipboard.writeText(result)}
                                className="bg-gray-200 p-2 rounded"
                            >
                                Copy
                            </button>
                        </div>
                    </div>
                )}
            </form>
        </div>
    )
}
