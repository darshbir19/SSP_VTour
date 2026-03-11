import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Keyboard-driven first-person WASD movement on the horizontal (XZ) plane.
 * Works when pointer lock is active; disabled automatically on mobile.
 */
export function useFirstPersonControls(speed = 4) {
  const { camera } = useThree()
  const keys = useRef<Record<string, boolean>>({})

  useEffect(() => {
    const down = (e: KeyboardEvent) => { keys.current[e.code] = true }
    const up   = (e: KeyboardEvent) => { keys.current[e.code] = false }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
    }
  }, [])

  const direction = useRef(new THREE.Vector3())

  useFrame((_, delta) => {
    const k = keys.current
    const dir = direction.current.set(0, 0, 0)

    if (k['KeyW'] || k['ArrowUp'])    dir.z -= 1
    if (k['KeyS'] || k['ArrowDown'])  dir.z += 1
    if (k['KeyA'] || k['ArrowLeft'])  dir.x -= 1
    if (k['KeyD'] || k['ArrowRight']) dir.x += 1

    if (dir.lengthSq() === 0) return

    dir.normalize()
    // Transform direction from camera-local to world space (XZ only)
    dir.applyEuler(new THREE.Euler(0, camera.rotation.y, 0, 'YXZ'))
    camera.position.addScaledVector(dir, speed * delta)
  })
}
