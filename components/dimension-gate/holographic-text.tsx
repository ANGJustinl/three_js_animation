'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'

export function HolographicText({ onNavigate }: { onNavigate?: (path: string) => void }) {
  const textRefs = useRef<THREE.Mesh[]>([])
  
  const categories = [
    { text: 'DESIGN', position: [4, 2, 0] as [number, number, number], color: '#00d9ff' },
    { text: 'CODE', position: [-4, 1, 0] as [number, number, number], color: '#8b5cf6' },
    { text: 'AI', position: [3, -1, 2] as [number, number, number], color: '#ff006e' },
    { text: 'ART', position: [-3, -2, 2] as [number, number, number], color: '#00d9ff' },
  ]

  useFrame((state) => {
    textRefs.current.forEach((text, i) => {
      if (text) {
        text.position.y += Math.sin(state.clock.elapsedTime * 2 + i) * 0.002
        const mat = Array.isArray(text.material) ? text.material[0] : text.material
        ;(mat as THREE.Material).opacity = 0.6 + Math.sin(state.clock.elapsedTime * 3 + i) * 0.2
      }
    })
  })

  return (
    <group>
      {categories.map((cat, i) => (
        <Text
          key={cat.text}
          ref={(el) => {
            if (el) textRefs.current[i] = el as any
          }}
          position={cat.position}
          fontSize={0.5}
          color={cat.color}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000000"
          onClick={() => onNavigate?.(cat.text)}
        >
          {cat.text}
          <meshBasicMaterial transparent opacity={0.7} />
        </Text>
      ))}
    </group>
  )
}
