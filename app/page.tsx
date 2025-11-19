'use client'

import { DimensionGateScene } from '@/components/dimension-gate/scene'
import { useRouter } from 'next/navigation'

export default function Page() {
  const router = useRouter()

  const handleNavigate = (category: string) => {
    router.push(`/category/${category.toLowerCase()}`)
  }

  return (
    <main className="w-full min-h-screen">
      <DimensionGateScene onNavigate={handleNavigate} />
    </main>
  )
}
