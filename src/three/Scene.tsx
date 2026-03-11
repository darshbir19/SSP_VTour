import { Suspense, useRef, useMemo } from 'react'
import { Canvas, useLoader, useThree } from '@react-three/fiber'
import { PointerLockControls, Html, useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { useExperience } from '../context/ExperienceContext'
import { nodes } from '../data/nodes'
import { useFirstPersonControls } from './hooks/useFirstPersonControls'
import { AudioManager } from '../audio/AudioManager'

// ─── Panorama Sphere ──────────────────────────────────────────
// Renders a large inverted sphere textured with the current node's equirectangular
// panorama. The sphere surrounds the camera so the user sees a full 360° view.
function PanoramaSphere() {
  const { currentNodeId } = useExperience()
  const node = nodes.find((n) => n.id === currentNodeId)!

  const texture = useLoader(THREE.TextureLoader, node.panoramaUrl)
  texture.colorSpace = THREE.SRGBColorSpace

  return (
    <mesh scale={[-1, 1, 1]}>
      <sphereGeometry args={[50, 64, 32]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  )
}

// ─── Hotspots ─────────────────────────────────────────────────
// Clickable portals that transport the user to another node.
function Hotspots() {
  const { currentNodeId, goToNode, language } = useExperience()
  const node = nodes.find((n) => n.id === currentNodeId)!

  return (
    <group>
      {node.hotspots.map((hs) => (
        <group key={hs.targetNodeId} position={hs.position}>
          {/* Glowing orb */}
          <mesh onClick={() => goToNode(hs.targetNodeId)}>
            <sphereGeometry args={[0.45, 16, 16]} />
            <meshBasicMaterial color="#3cff8f" transparent opacity={0.55} />
          </mesh>
          {/* Label billboard */}
          <Html center distanceFactor={10} style={{ pointerEvents: 'none' }}>
            <div className="whitespace-nowrap rounded bg-black/70 px-2 py-1 text-center text-xs font-semibold text-neon-green backdrop-blur select-none">
              {language === 'en' ? hs.labelEn : hs.labelZh}
            </div>
          </Html>
        </group>
      ))}
    </group>
  )
}

// ─── Player rig (WASD + pointer lock) ─────────────────────────
function Player() {
  useFirstPersonControls(4)
  return null
}

// ─── Inner scene contents ─────────────────────────────────────
function SceneContents() {
  return (
    <>
      <Player />
      <PanoramaSphere />
      <Hotspots />
      <AudioManager />
      <PointerLockControls />
    </>
  )
}

// ─── Exported canvas wrapper ──────────────────────────────────
export function Scene() {
  return (
    <Canvas
      className="!absolute inset-0"
      camera={{ fov: 75, near: 0.1, far: 1000, position: [0, 0, 0] }}
      gl={{ antialias: true }}
    >
      <Suspense fallback={null}>
        <SceneContents />
      </Suspense>
    </Canvas>
  )
}
