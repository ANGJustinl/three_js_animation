import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

const validCategories = ['design', 'code', 'ai', 'art', 'featured']

export const metadata: Metadata = {
  title: 'Archive',
  description: 'Dimensional archive category',
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const { slug } = params
  const normalized = slug?.toLowerCase()
  if (!validCategories.includes(normalized)) {
    notFound()
  }

  return (
    <main className="min-h-screen w-full flex items-center justify-center">
      <div
        className="relative p-12 border-2 border-primary bg-card max-w-2xl text-center"
        style={{ boxShadow: '0 0 50px rgba(0, 217, 255, 0.3), inset 0 0 50px rgba(0, 217, 255, 0.05)' }}
      >
        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-secondary" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-secondary" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-secondary" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-secondary" />

        <div className="inline-block px-4 py-1 bg-primary/20 border border-primary/50 text-primary text-xs font-mono tracking-widest mb-4">
          DIMENSION ARCHIVE
        </div>

        <h1
          className="text-5xl font-bold text-foreground font-mono tracking-wider"
          style={{ textShadow: '0 0 20px rgba(0, 217, 255, 0.5)' }}
        >
          {normalized.toUpperCase()}
        </h1>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-primary to-transparent my-6" />

        <p className="text-muted-foreground text-lg leading-relaxed max-w-md mx-auto">
          This is the {normalized} archive. Populate this section with posts, projects,
          and references relevant to the selected dimension.
        </p>
      </div>
    </main>
  )
}
