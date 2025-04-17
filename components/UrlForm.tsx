'use client'
import { useState } from 'react'

export default function UrlForm() {
    const [url, setUrl] = useState('')
    const [alias, setAlias] = useState('')
    const [result, setResult] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setResult('')
        setLoading(true)

        try {

            let processedUrl = url.trim()
            if (!/^https?:\/\//i.test(processedUrl)) {
                processedUrl = `https://${processedUrl}`
            }


            new URL(processedUrl)


            const res = await fetch('/api/shorten', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    url: processedUrl,
                    alias: alias.trim()
                })
            })


            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'Failed to create short URL')
            }


            setResult(`${window.location.origin}/${data.alias}`)

        } catch (err: any) {
            setError(
                err.message || 'An error occurred while shortening the URL'
            )
        } finally {
            setLoading(false)
        }
    }
    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 bg-white rounded shadow">
            <div className="mb-4">
                <label htmlFor="url-input" className="block mb-1 font-medium text-black">URL to shorten</label>
                <input
                    id="url-input"
                    type="text"
                    value={url}
                    onChange={e => setUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full p-2 border rounded text-black"
                    required
                />
                <p className="text-sm text-gray-500 mt-1">Must include http:// or https://</p>
            </div>

            <div className="mb-4">
                <label htmlFor="alias-input" className="block mb-1 font-medium text-black">Custom alias</label>
                <input
                    id="alias-input"
                    type="text"
                    value={alias}
                    onChange={e => setAlias(e.target.value)}
                    placeholder="my-custom-link"
                    className="w-full p-2 border rounded text-black"
                    required
                />
            </div>

            <button
                type="submit"
                className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                disabled={loading}
            >
                {loading ? 'Processing...' : 'Shorten URL'}
            </button>

            {result && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded text-black">
                    <p className="font-medium">Short URL:</p>
                    <div className="flex mt-2">
                        <input
                            type="text"
                            value={result}
                            readOnly
                            className="flex-1 border rounded-l p-2 text-black"
                        />
                        <button
                            type="button"
                            onClick={() => navigator.clipboard.writeText(result)}
                            className="bg-gray-100 px-4 rounded-r border-t border-r border-b text-black"
                        >
                            Copy
                        </button>
                    </div>
                </div>
            )}

            {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-700">
                    {error}
                </div>
            )}
        </form>
    )
}
