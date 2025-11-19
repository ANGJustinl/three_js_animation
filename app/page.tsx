'use client'

import { DimensionGateScene } from '@/components/dimension-gate/scene'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Page() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const handleNavigate = (category: string) => {
    setActiveCategory(category)
    console.log(`Navigating to ${category}`)
  }

  return (
    <main className="w-full min-h-screen">
      <DimensionGateScene onNavigate={handleNavigate} />
      
      <AnimatePresence>
        {activeCategory && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-background/95 z-50 backdrop-blur-md"
            onClick={() => setActiveCategory(null)}
          >
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', damping: 20 }}
              className="relative p-12 border-2 border-primary bg-card max-w-2xl"
              style={{
                boxShadow: '0 0 50px rgba(0, 217, 255, 0.3), inset 0 0 50px rgba(0, 217, 255, 0.05)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Corner decorations */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-secondary" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-secondary" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-secondary" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-secondary" />
              
              <div className="text-center space-y-6">
                <div className="inline-block px-4 py-1 bg-primary/20 border border-primary/50 text-primary text-xs font-mono tracking-widest mb-4">
                  DIMENSION TRAVERSAL INITIATED
                </div>
                
                <h2 className="text-5xl font-bold text-foreground font-mono tracking-wider"
                    style={{ textShadow: '0 0 20px rgba(0, 217, 255, 0.5)' }}>
                  {activeCategory.toUpperCase()}
                </h2>
                
                <div className="w-full h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
                
                <p className="text-muted-foreground text-lg leading-relaxed max-w-md mx-auto">
                  You are entering the archive. Here lies knowledge beyond the void—design patterns, code fragments, and dimensional insights.
                </p>
                
                <button 
                  className="mt-8 px-8 py-3 bg-primary text-primary-foreground font-bold font-mono tracking-widest hover:bg-primary/80 transition-all border-2 border-primary hover:shadow-[0_0_20px_rgba(0,217,255,0.5)]"
                  onClick={() => setActiveCategory(null)}
                >
                  ← RETURN TO GATE
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
