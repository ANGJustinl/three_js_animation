'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'

export function FloatingRings() {
  const group = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = state.clock.elapsedTime * 0.1
    }
  })

  // Create multiple concentric rings at different scales
  const rings = [
    { radius: 4, color: '#00d9ff', thickness: 0.05, opacity: 0.3 },
    { radius: 6, color: '#8b5cf6', thickness: 0.03, opacity: 0.2 },
    { radius: 8, color: '#ff006e', thickness: 0.02, opacity: 0.15 },
  ]

  return (
    <group ref={group}>
      {rings.map((ring, i) => (
        <Float 
          key={i} 
          speed={1 + i * 0.5} 
          rotationIntensity={0.5} 
          floatIntensity={0.5}
        >
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -i * 2]}>
            <torusGeometry args={[ring.radius, ring.thickness, 16, 64]} />
            <meshBasicMaterial 
              color={ring.color} 
              transparent 
              opacity={ring.opacity}
              side={THREE.DoubleSide}
            />
          </mesh>
        </Float>
      ))}
    </group>
  )
}
