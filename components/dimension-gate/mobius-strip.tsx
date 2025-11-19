'use client'

import { useRef, useMemo, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { shaderMaterial, Outlines } from '@react-three/drei'
import { extend } from '@react-three/fiber'

// --- 1. Custom Shader Material for Moebius/Comic Style ---

const MoebiusMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor: new THREE.Color('#00d9ff'), // Bright cyan for more impact
    uShadowColor: new THREE.Color('#0a0e1a'), // Darker shadow for stronger contrast
    uAccentColor: new THREE.Color('#ff006e'), // Added accent color for energy pulses
    uLightDir: new THREE.Vector3(1, 1, 1).normalize(),
    uHover: 0,
    uResolution: new THREE.Vector2(800, 600),
  },
  // Vertex Shader
  `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying float vNoise;
    varying vec3 vWorldPosition;
    
    uniform float uTime;
    uniform float uHover;

    // Simplex noise function (simplified)
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
    float snoise(vec3 v) {
      const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
      const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
      vec3 i  = floor(v + dot(v, C.yyy) );
      vec3 x0 = v - i + dot(i, C.xxx) ;
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min( g.xyz, l.zxy );
      vec3 i2 = max( g.xyz, l.zxy );
      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy;
      vec3 x3 = x0 - D.yyy;
      i = mod289(i);
      vec4 p = permute( permute( permute(
                i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
              + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
              + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
      float n_ = 0.142857142857;
      vec3  ns = n_ * D.wyz - D.xzx;
      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_ );
      vec4 x = x_ *ns.x + ns.yyyy;
      vec4 y = y_ *ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);
      vec4 b0 = vec4( x.xy, y.xy );
      vec4 b1 = vec4( x.zw, y.zw );
      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
      vec3 p0 = vec3(a0.xy,h.x);
      vec3 p1 = vec3(a0.zw,h.y);
      vec3 p2 = vec3(a1.xy,h.z);
      vec3 p3 = vec3(a1.zw,h.w);
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
      p0 *= norm.x;
      p1 *= norm.y;
      p2 *= norm.z;
      p3 *= norm.w;
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                    dot(p2,x2), dot(p3,x3) ) );
    }

    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      
      float noiseVal = snoise(position * 2.0 + uTime * 0.5);
      vNoise = noiseVal;
      
      vec3 pos = position;
      
      float deconstruct = smoothstep(0.0, 1.0, uHover);
      
      // Explode vertices outward along normals
      pos += normal * noiseVal * deconstruct * 0.8;
      
      // Add pulsing scale effect
      float pulse = sin(uTime * 3.0 + position.y * 2.0) * 0.1 + 1.0;
      pos *= mix(1.0, pulse, deconstruct);
      
      // Add slight twist distortion
      float twist = deconstruct * sin(position.y * 3.0 + uTime * 2.0) * 0.3;
      float c = cos(twist);
      float s = sin(twist);
      mat2 rot = mat2(c, -s, s, c);
      pos.xz = rot * pos.xz;

      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      vViewPosition = -mvPosition.xyz;
      vWorldPosition = (modelMatrix * vec4(pos, 1.0)).xyz;
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  // Fragment Shader
  `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying float vNoise;
    varying vec3 vWorldPosition;
    
    uniform vec3 uColor;
    uniform vec3 uShadowColor;
    uniform vec3 uAccentColor;
    uniform vec3 uLightDir;
    uniform float uHover;
    uniform float uTime;

    // Procedural hatching function
    float hatch(vec2 uv, float scale, float thickness) {
      float val = sin((uv.x + uv.y) * scale * 3.14159);
      return step(thickness, val);
    }

    void main() {
      vec3 normal = normalize(vNormal);
      vec3 lightDir = normalize(uLightDir);
      
      float NdotL = dot(normal, lightDir);
      float lightIntensity = smoothstep(-0.2, 0.2, NdotL) * 0.5 + 0.5;
      
      vec2 hatchUv = vUv * vec2(25.0, 6.0);
      vec2 hatchUv2 = vUv * vec2(30.0, 5.0) + vec2(0.5, 0.5);
      
      float hatch1 = hatch(hatchUv, 1.0, 0.0);
      float hatch2 = hatch(hatchUv, 1.5, -0.5);
      float cross = hatch(hatchUv2, 1.5, -0.5);
      
      vec3 finalColor = uColor;
      
      if (lightIntensity < 0.25) {
        // Deepest shadow - dense cross-hatching
        if (hatch2 * cross < 0.5) {
          finalColor = uShadowColor;
        } else {
          finalColor = mix(uShadowColor, uColor * 0.4, 0.5);
        }
      } else if (lightIntensity < 0.5) {
        // Medium shadow - single diagonal hatch
        if (hatch1 < 0.5) {
          finalColor = mix(uShadowColor, uColor * 0.6, 0.7);
        } else {
          finalColor = uColor * 0.8;
        }
      } else if (lightIntensity < 0.75) {
        // Mid-tone - sparse hatching
        if (hatch1 < 0.3) {
          finalColor = mix(uColor, uColor * 1.2, 0.5);
        } else {
          finalColor = uColor;
        }
      } else {
        // Highlight - pure color with bright accent
        finalColor = uColor * 1.3;
      }
      
      float pulseStripe = sin(vUv.x * 50.0 + uTime * 2.0) * 0.5 + 0.5;
      pulseStripe *= sin(vUv.y * 10.0 - uTime * 3.0) * 0.5 + 0.5;
      pulseStripe = step(0.95, pulseStripe);
      finalColor = mix(finalColor, uAccentColor, pulseStripe * 0.8);
      
      if (uHover > 0.0) {
        // Digital glitch color shift
        float glitchMask = step(0.97, sin(vUv.y * 80.0 + uTime * 10.0 + vNoise * 5.0));
        vec3 glitchColor = vec3(1.0) - finalColor;
        finalColor = mix(finalColor, glitchColor, glitchMask * uHover);
        
        // Add chromatic aberration effect
        float aberration = sin(vUv.y * 100.0 + uTime * 15.0) * uHover * 0.3;
        finalColor.r += aberration;
        finalColor.b -= aberration;
        
        // Pixelation/mosaic effect
        vec2 pixelUv = floor(vUv * mix(100.0, 20.0, uHover)) / mix(100.0, 20.0, uHover);
        float pixelNoise = fract(sin(dot(pixelUv, vec2(12.9898, 78.233))) * 43758.5453);
        finalColor = mix(finalColor, finalColor * pixelNoise, uHover * 0.2);
        
        // Add scanning interference
        float scan = sin(vWorldPosition.y * 30.0 - uTime * 20.0) * 0.5 + 0.5;
        finalColor += vec3(scan * uHover * 0.15);
      }
      
      vec3 viewDir = normalize(vWorldPosition - cameraPosition);
      float fresnel = pow(1.0 - abs(dot(normal, viewDir)), 3.0);
      finalColor += uColor * fresnel * 0.5;

      gl_FragColor = vec4(finalColor, 1.0);
      
      gl_FragColor.rgb = pow(gl_FragColor.rgb, vec3(1.0/2.2));
    }
  `
)

extend({ MoebiusMaterial })

// --- 2. Geometry Generation ---

function createMobiusGeometry() {
  const geometry = new THREE.BufferGeometry()
  const vertices = []
  const uvs = []
  const indices = []

  const uSteps = 200 // Doubled for smoother curves
  const vSteps = 40  // Doubled for finer cross-section
  const radius = 2
  const width = 0.8

  for (let i = 0; i <= uSteps; i++) {
    const u = (i / uSteps) * Math.PI * 2
    for (let j = 0; j <= vSteps; j++) {
      const v = (j / vSteps) * 2 - 1
      
      const vScaled = width * v / 2
      const cosU2 = Math.cos(u / 2)
      const sinU2 = Math.sin(u / 2)
      
      const displacement = Math.sin(u * 15) * Math.cos(v * 8) * 0.03
      const techGroove = Math.abs(Math.sin(u * 25)) < 0.1 ? -0.02 : 0
      
      const x = (radius + vScaled * cosU2 + displacement + techGroove) * Math.cos(u)
      const y = (radius + vScaled * cosU2 + displacement + techGroove) * Math.sin(u)
      const z = vScaled * sinU2 + displacement

      vertices.push(x, y, z)
      uvs.push(i / uSteps, j / vSteps)
    }
  }

  for (let i = 0; i < uSteps; i++) {
    for (let j = 0; j < vSteps; j++) {
      const a = i * (vSteps + 1) + j
      const b = (i + 1) * (vSteps + 1) + j
      const c = (i + 1) * (vSteps + 1) + (j + 1)
      const d = i * (vSteps + 1) + (j + 1)

      indices.push(a, b, d)
      indices.push(b, c, d)
    }
  }

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
  geometry.setIndex(indices)
  geometry.computeVertexNormals()
  
  return geometry
}

function TechRings() {
  const ringsRef = useRef<THREE.Group>(null)
  
  useFrame((state, delta) => {
    if (ringsRef.current) {
      ringsRef.current.rotation.z += delta * 0.3
      ringsRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2
    }
  })

  return (
    <group ref={ringsRef}>
      {[3.5, 4.2, 5.0].map((radius, i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[radius, 0.015, 8, 64]} />
          <meshBasicMaterial 
            color={i === 1 ? "#00d9ff" : "#334155"} 
            transparent 
            opacity={0.6}
          />
        </mesh>
      ))}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2
        const radius = 4.2
        return (
          <mesh
            key={`segment-${i}`}
            position={[Math.cos(angle) * radius, 0, Math.sin(angle) * radius]}
            rotation={[Math.PI / 2, 0, angle]}
          >
            <boxGeometry args={[0.1, 0.05, 0.05]} />
            <meshBasicMaterial color="#00d9ff" />
          </mesh>
        )
      })}
    </group>
  )
}

// --- 3. Component ---

export function MobiusStrip({ onClickCategory }: { onClickCategory?: (category: string) => void }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<any>(null)
  const [hovered, setHover] = useState(false)
  
  const geometry = useMemo(() => createMobiusGeometry(), [])

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.08
      meshRef.current.rotation.y += delta * 0.12
      
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3
    }
    if (materialRef.current) {
      materialRef.current.uTime = state.clock.elapsedTime
      materialRef.current.uHover = THREE.MathUtils.lerp(
        materialRef.current.uHover,
        hovered ? 1 : 0,
        delta * 4
      )
    }
  })

  return (
    <group>
      <TechRings />
      
      <mesh
        ref={meshRef}
        geometry={geometry}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
        onClick={() => onClickCategory?.('Featured')}
        scale={1.8}
      >
        {/* @ts-ignore - custom material */}
        <moebiusMaterial
          ref={materialRef}
          transparent
          side={THREE.DoubleSide}
        />
        <Outlines thickness={0.12} color="black" opacity={0.9} />
      </mesh>
      
      <Particles count={80} />
    </group>
  )
}

function Particles({ count }: { count: number }) {
  const mesh = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  
  const particles = useMemo(() => {
    const temp = []
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100
      const factor = 20 + Math.random() * 100
      const speed = 0.01 + Math.random() / 200
      const xFactor = -50 + Math.random() * 100
      const yFactor = -50 + Math.random() * 100
      const zFactor = -50 + Math.random() * 100
      temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 })
    }
    return temp
  }, [count])

  useFrame((state) => {
    if (!mesh.current) return
    particles.forEach((particle, i) => {
      let { t, factor, speed, xFactor, yFactor, zFactor } = particle
      t = particle.t += speed / 2
      const a = Math.cos(t) + Math.sin(t * 1) / 10
      const b = Math.sin(t) + Math.cos(t * 2) / 10
      const s = Math.cos(t)
      
      dummy.position.set(
        (particle.mx / 10) * a + xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10,
        (particle.my / 10) * b + yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10,
        (particle.my / 10) * b + zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10
      )
      dummy.scale.set(s, s, s)
      dummy.rotation.set(s * 5, s * 5, s * 5)
      dummy.updateMatrix()
      mesh.current!.setMatrixAt(i, dummy.matrix)
    })
    mesh.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <dodecahedronGeometry args={[0.12, 0]} />
      <meshBasicMaterial color="#94a3b8" wireframe />
    </instancedMesh>
  )
}
