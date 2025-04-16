// app/page.tsx
import UrlShortenerForm from '@/components/UrlShortenerForm'

export default function Home() {
  return (
      <main className="min-h-screen flex items-center justify-center bg-green-50">
        <UrlShortenerForm />
      </main>
  )
}
