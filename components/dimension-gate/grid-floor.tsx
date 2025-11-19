'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function GridFloor() {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      // Slowly move grid forward for infinite depth illusion
      meshRef.current.position.z = (state.clock.elapsedTime * 0.5) % 2
    }
  })

  return (
    <mesh 
      ref={meshRef}
      rotation={[-Math.PI / 2, 0, 0]} 
      position={[0, -5, 0]}
    >
      <planeGeometry args={[100, 100, 50, 50]} />
      <meshBasicMaterial 
        color="#00d9ff"
        wireframe
        transparent
        opacity={0.15}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}
