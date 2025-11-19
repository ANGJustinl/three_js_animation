'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function VolumetricLight() {
  const coneRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (coneRef.current) {
      coneRef.current.rotation.z = state.clock.elapsedTime * 0.5
      const mat = Array.isArray(coneRef.current.material) ? coneRef.current.material[0] : coneRef.current.material
      ;(mat as THREE.Material).opacity = 0.15 + Math.sin(state.clock.elapsedTime * 2) * 0.05
    }
  })

  return (
    <group>
      {/* Volumetric cone from above */}
      <mesh ref={coneRef} position={[0, 20, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[8, 30, 32, 1, true]} />
        <meshBasicMaterial
          color="#00d9ff"
          transparent
          opacity={0.15}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Horizontal light disk */}
      <mesh position={[0, -8, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[15, 64]} />
        <meshBasicMaterial
          color="#00d9ff"
          transparent
          opacity={0.1}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  )
}
