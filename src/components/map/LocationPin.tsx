import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'

interface LocationPinProps {
  position: [number, number, number]
  label: string
  onClick: () => void
}

export function LocationPin({ position, label, onClick }: LocationPinProps) {
  const [px, pinY, pz] = position
  const pinRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const bobY = pinY + Math.sin(t * 2) * 0.3

    if (pinRef.current) pinRef.current.position.y = bobY
    if (glowRef.current) {
      glowRef.current.position.y = bobY
      glowRef.current.scale.setScalar(1 + Math.sin(t * 3) * 0.2)
    }
  })

  return (
    <group>
      {/* Stem from ground to pin */}
      <mesh position={[px, pinY / 2, pz]}>
        <cylinderGeometry args={[0.04, 0.04, pinY, 8]} />
        <meshBasicMaterial color="#4dc9f6" transparent opacity={0.3} />
      </mesh>

      {/* Outer glow pulse */}
      <mesh ref={glowRef} position={[px, pinY, pz]}>
        <sphereGeometry args={[0.8, 16, 16]} />
        <meshBasicMaterial color="#4dc9f6" transparent opacity={0.1} />
      </mesh>

      {/* Core sphere — clickable */}
      <mesh
        ref={pinRef}
        position={[px, pinY, pz]}
        onClick={(e) => {
          e.stopPropagation()
          onClick()
        }}
        onPointerOver={() => {
          setHovered(true)
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          setHovered(false)
          document.body.style.cursor = 'auto'
        }}
      >
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshStandardMaterial
          color="#4dc9f6"
          emissive="#4dc9f6"
          emissiveIntensity={hovered ? 3 : 1.5}
          toneMapped={false}
        />
      </mesh>

      {/* Point light for real blue glow on surroundings */}
      <pointLight position={[px, pinY, pz]} color="#4dc9f6" intensity={0.8} distance={15} />

      {/* Ground ring */}
      <mesh position={[px, 0.05, pz]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.5, 0.8, 32]} />
        <meshBasicMaterial color="#4dc9f6" transparent opacity={0.2} />
      </mesh>

      {/* HTML bilingual label */}
      <Html
        position={[px, pinY + 1.8, pz]}
        center
        distanceFactor={25}
        style={{ pointerEvents: 'none' }}
      >
        <div
          className={`map-pin-label whitespace-nowrap transition-all duration-300 ${
            hovered ? 'opacity-100 scale-105' : 'opacity-80 scale-95'
          }`}
        >
          <span className="text-sm font-semibold text-cyan-300">{label}</span>
        </div>
      </Html>
    </group>
  )
}
