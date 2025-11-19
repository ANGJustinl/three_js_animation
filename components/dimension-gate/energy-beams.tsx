'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function EnergyBeams() {
  const groupRef = useRef<THREE.Group>(null)
  const beamRefs = useRef<THREE.Mesh[]>([])

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2
    }
    beamRefs.current.forEach((beam, i) => {
      if (beam) {
        const mat = Array.isArray(beam.material) ? beam.material[0] : beam.material
        ;(mat as THREE.Material).opacity = 0.3 + Math.sin(state.clock.elapsedTime * 2 + i) * 0.2
      }
    })
  })

  return (
    <group ref={groupRef}>
      {[...Array(8)].map((_, i) => {
        const angle = (i / 8) * Math.PI * 2
        return (
          <mesh
            key={i}
            ref={(el) => {
              if (el) beamRefs.current[i] = el
            }}
            position={[Math.cos(angle) * 15, 0, Math.sin(angle) * 15]}
            rotation={[0, -angle, 0]}
          >
            <cylinderGeometry args={[0.02, 0.02, 30, 6]} />
            <meshBasicMaterial
              color="#00d9ff"
              transparent
              opacity={0.3}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        )
      })}
    </group>
  )
}
