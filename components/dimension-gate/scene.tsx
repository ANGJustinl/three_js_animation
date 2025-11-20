'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Stars, Float, Effects } from '@react-three/drei'
import { MobiusStrip } from './mobius-strip'
import { GridFloor } from './grid-floor'
import { FloatingRings } from './floating-rings'
import { EnergyBeams } from './energy-beams'
import { ParticleField } from './particle-field'
import { MegastructureRings } from './megastructure-rings'
import { VolumetricLight } from './volumetric-light'
import { Suspense } from 'react'
import { motion } from 'framer-motion'
import { UnrealBloomPass, FilmPass } from 'three-stdlib'
import { extend } from '@react-three/fiber'
import { HolographicText } from './holographic-text'

extend({ UnrealBloomPass, FilmPass })

export function DimensionGateScene({ onNavigate }: { onNavigate?: (path: string) => void }) {
  return (
    <div className="w-full h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#020408] via-[#050814] to-[#0a0e1a]" />
      
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, rgba(0, 217, 255, 0.15) 0%, transparent 50%)',
          animation: 'pulse 8s ease-in-out infinite'
        }}
      />

      <div className="absolute inset-0 opacity-30 pointer-events-none mix-blend-screen">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/40 to-transparent h-[300px] animate-[scan-line_8s_ease-in-out_infinite]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/30 to-transparent h-[200px] animate-[scan-line_12s_ease-in-out_infinite] delay-500" />
      </div>

      <div className="absolute inset-0 opacity-20 pointer-events-none" 
           style={{
             backgroundImage: `
               linear-gradient(rgba(0, 217, 255, 0.4) 1px, transparent 1px),
               linear-gradient(90deg, rgba(0, 217, 255, 0.4) 1px, transparent 1px)
             `,
             backgroundSize: '40px 40px',
             animation: 'grid-move 20s linear infinite',
             perspective: '500px',
             transform: 'rotateX(60deg) translateZ(-100px)'
           }} />
      
      <Canvas className="z-10" dpr={[1, 2]} gl={{ antialias: true }}>
        <PerspectiveCamera makeDefault position={[0, 3, 14]} fov={65} />
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          minPolarAngle={Math.PI / 3} 
          maxPolarAngle={Math.PI / 1.8}
          autoRotate
          autoRotateSpeed={0.3}
        />
        
        <ambientLight intensity={0.1} />
        <directionalLight position={[10, 15, 5]} intensity={3} color="#00d9ff" castShadow />
        <directionalLight position={[-10, -10, -5]} intensity={1} color="#8b5cf6" />
        <pointLight position={[0, 0, 0]} intensity={100} color="#ff006e" distance={25} decay={2} />
        <spotLight position={[0, 20, 0]} angle={0.5} intensity={50} color="#00d9ff" distance={50} />
        
        <Suspense fallback={null}>
          <Float speed={1} rotationIntensity={0.2} floatIntensity={0.5}>
            <MobiusStrip onClickCategory={(cat) => onNavigate?.(cat)} />
          </Float>
          
          <HolographicText onNavigate={(cat) => onNavigate?.(cat)} />
          
          <VolumetricLight />
          <EnergyBeams />
          <MegastructureRings />
          <ParticleField />
          <FloatingRings />
          <GridFloor />
          
          <Stars radius={150} depth={80} count={8000} factor={5} saturation={0} fade speed={1.5} />
        </Suspense>

        <Effects>
          {/* @ts-ignore */}
          <unrealBloomPass args={[undefined, 0.6, 0.5, 0]} />
        </Effects>
      </Canvas>
      
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="absolute top-8 left-8 font-mono text-xs space-y-2 z-20"
          style={{ color: '#cbd5e1' }}
        >
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full animate-[pulse-glow_2s_ease-in-out_infinite]" style={{ background: '#cbd5e1' }} />
            <span className="tracking-widest">GATEWAY: ACTIVE</span>
          </div>
          <div className="pl-4 space-y-0.5">
            <div style={{ color: '#cbd5e1', opacity: 0.8 }}>COORDINATES: [0, 0, ∞]</div>
            <div style={{ color: '#cbd5e1', opacity: 0.8, userSelect: 'none' }}>DIMENSION: MOEBIUS-01</div>
            <div style={{ color: '#cbd5e1', opacity: 0.8 }}>ENERGY FLUX: 147.3 TW</div>
            <div style={{ color: '#cbd5e1', opacity: 0.8 }}>STABILITY: 99.8%</div>
          </div>
          <div className="mt-4 pt-2 border-t border-primary/30 space-y-0.5">
            <div style={{ color: '#cbd5e1', opacity: 0.8 }}>QUANTUM THREADS: 42</div>
            <div style={{ color: '#cbd5e1', opacity: 0.6 }}>TACHYON FLOW: NOMINAL</div>
          </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="absolute top-8 right-8 font-mono text-xs text-right space-y-2 z-20"
          style={{ color: '#cbd5e1' }}
          >
          <div className="tracking-widest border-b border-primary/30 pb-2">
            DIMENSIONAL INTEGRITY
          </div>
          <div className="space-y-1">
            {[
              { label: 'SPATIAL', value: 98 },
              { label: 'TEMPORAL', value: 95 },
              { label: 'QUANTUM', value: 100 },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-end gap-3">
                <span style={{ color: '#cbd5e1', opacity: 0.8, fontSize: '10px' }}>{item.label}</span>
                <div className="w-24 h-1.5 bg-background border border-primary/30 relative overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.value}%` }}
                    transition={{ duration: 2, delay: 1 }}
                    className="h-full"
                    style={{ background: '#cbd5e1', borderRadius: '2px' }}
                  />
                </div>
                <span style={{ color: '#cbd5e1', fontSize: '10px', width: '2em', textAlign: 'right' }}>{item.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.3 }}
          className="absolute bottom-24 left-0 right-0 text-center"
        >
          <div className="relative inline-block">
            <h1 className="text-8xl md:text-9xl font-bold text-foreground tracking-tighter font-mono relative z-10" 
                style={{ 
                  textShadow: '0 0 30px rgba(0, 217, 255, 0.8), 0 0 60px rgba(0, 217, 255, 0.5), 0 0 90px rgba(0, 217, 255, 0.3)',
                  letterSpacing: '0.15em',
                  WebkitTextStroke: '2px rgba(0, 217, 255, 0.3)'
                }}>
              DIMENSION
            </h1>
            <div className="absolute -bottom-2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-primary/80 tracking-[0.3em] mt-2 font-mono"
              style={{ textShadow: '0 0 20px currentColor' }}>
            GATE
          </h2>
          
          <div className="flex items-center justify-center gap-6 text-muted-foreground text-xs uppercase tracking-[0.4em] mt-8">
            <span className="border border-primary/30 px-4 py-2">HOVER: DECONSTRUCT</span>
            <div className="w-px h-4 bg-primary/50" />
            <span className="border border-secondary/30 px-4 py-2">CLICK: TRAVERSE</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <div className="absolute top-8 right-8 w-24 h-24 border-t-2 border-r-2 border-primary/60">
            <div className="absolute -top-0.5 right-0 w-8 h-0.5 bg-primary animate-[pulse-glow_2s_ease-in-out_infinite]" />
          </div>
          <div className="absolute bottom-8 left-8 w-24 h-24 border-b-2 border-l-2 border-secondary/60">
            <div className="absolute -bottom-0.5 left-0 w-8 h-0.5 bg-secondary animate-[pulse-glow_2s_ease-in-out_infinite]" />
          </div>
          <div className="absolute top-8 left-8 w-16 h-16 border-t border-l border-primary/30" />
          <div className="absolute bottom-8 right-8 w-16 h-16 border-b border-r border-secondary/30" />
        </motion.div>

        <div className="absolute left-0 top-1/2 -translate-y-1/2 space-y-4 pl-8">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 0.3 - i * 0.05, x: 0 }}
              transition={{ duration: 1, delay: 0.8 + i * 0.1 }}
              className="w-12 h-px bg-gradient-to-r from-primary to-transparent"
              style={{ marginLeft: `${i * 8}px` }}
            />
          ))}
        </div>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 space-y-4 pr-8">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 0.3 - i * 0.05, x: 0 }}
              transition={{ duration: 1, delay: 0.8 + i * 0.1 }}
              className="w-12 h-px bg-gradient-to-l from-secondary to-transparent"
              style={{ marginRight: `${i * 8}px` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
