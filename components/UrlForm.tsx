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

        let processedUrl = url
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            processedUrl = `https://${url}`
            setUrl(processedUrl)
        }

        try {
            const urlObj = new URL(processedUrl)
            if (!urlObj.protocol.startsWith('http')) {
                throw new Error('URL must start with http:// or https://')
            }
        } catch (err) {
            setError('Please enter a valid URL including http:// or https://')
            setLoading(false)
            return
        }

        try {
            const res = await fetch('/api/shorten', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ url: processedUrl, alias })
            });

            const contentType = res.headers.get('content-type') || '';
            if (contentType.includes('application/json')) {
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || 'Request failed');
                setResult(data.shortUrl);
            } else {
                const text = await res.text();
                setError('Server returned a non-JSON response');
            }
        } catch (err: any) {
            setError(err.message)
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
