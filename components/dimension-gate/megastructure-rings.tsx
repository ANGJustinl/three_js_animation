'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Outlines } from '@react-three/drei'

export function MegastructureRings() {
  const group1 = useRef<THREE.Group>(null)
  const group2 = useRef<THREE.Group>(null)
  const group3 = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (group1.current) group1.current.rotation.z = state.clock.elapsedTime * 0.1
    if (group2.current) group2.current.rotation.z = -state.clock.elapsedTime * 0.15
    if (group3.current) group3.current.rotation.z = state.clock.elapsedTime * 0.08
  })

  return (
    <>
      {/* Giant Background Ring 1 */}
      <group ref={group1} position={[0, 0, -50]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[60, 0.3, 6, 80]} />
          <meshBasicMaterial color="#00d9ff" wireframe />
        </mesh>
      </group>

      {/* Giant Background Ring 2 */}
      <group ref={group2} position={[0, 0, -80]} rotation={[0.3, 0, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[90, 0.5, 8, 100]} />
          <meshBasicMaterial color="#8b5cf6" wireframe opacity={0.3} transparent />
        </mesh>
      </group>

      {/* Sectioned Ring with Hatching */}
      <group ref={group3} position={[0, 0, -30]}>
        {[...Array(12)].map((_, i) => {
          const angle = (i / 12) * Math.PI * 2
          const gap = 0.2
          return (
            <mesh
              key={i}
              position={[
                Math.cos(angle + gap / 2) * 40,
                Math.sin(angle + gap / 2) * 40,
                0,
              ]}
              rotation={[0, 0, angle]}
            >
              <boxGeometry args={[8, 0.8, 0.5]} />
              <meshStandardMaterial color="#1a202c" roughness={0.8} metalness={0.2} />
              <Outlines thickness={0.02} color="#00d9ff" />
            </mesh>
          )
        })}
      </group>
    </>
  )
}
