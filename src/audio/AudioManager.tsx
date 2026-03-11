import { useRef, useEffect, useMemo } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useExperience } from '../context/ExperienceContext'
import { nodes } from '../data/nodes'

/**
 * AudioManager — attaches a single AudioListener to the camera and manages:
 *   1. Background ambient loop (cross-fades between nodes)
 *   2. Positional 3D audio sources placed at specific coordinates
 *
 * All audio decisions are driven by the ExperienceContext (current node,
 * muted, volume, ambient/effects toggles).
 *
 * Architecture notes:
 * - We use THREE.Audio for the ambient loop because it should be non-positional
 *   (constant volume regardless of camera rotation).
 * - Positional sources use THREE.PositionalAudio with configurable distance
 *   models so sounds attenuate naturally as the listener moves.
 * - Cross-fade is done by ramping gain over ~1 second using linear interpolation
 *   in the useFrame loop rather than Web Audio scheduled ramps, so we have full
 *   frame-level control and can cancel at any time.
 */
export function AudioManager() {
  const { camera } = useThree()
  const { currentNodeId, muted, volume, ambientEnabled, effectsEnabled } = useExperience()

  // ── Listener ────────────────────────────────────────────────
  const listener = useMemo(() => new THREE.AudioListener(), [])

  useEffect(() => {
    camera.add(listener)
    return () => { camera.remove(listener) }
  }, [camera, listener])

  // ── Master volume & mute ────────────────────────────────────
  useEffect(() => {
    listener.setMasterVolume(muted ? 0 : volume)
  }, [listener, muted, volume])

  // ── Ambient loop ────────────────────────────────────────────
  const ambientCur = useRef<THREE.Audio | null>(null)
  const ambientPrev = useRef<THREE.Audio | null>(null)
  const fadeProgress = useRef(1)  // 0 → 1 (1 = fully faded in)
  const loader = useMemo(() => new THREE.AudioLoader(), [])

  useEffect(() => {
    const node = nodes.find((n) => n.id === currentNodeId)
    if (!node) return

    // Move current ambient to "previous" slot and start fading it out
    if (ambientCur.current) {
      ambientPrev.current?.stop()
      ambientPrev.current = ambientCur.current
    }
    fadeProgress.current = 0

    const audio = new THREE.Audio(listener)
    ambientCur.current = audio

    loader.loadAsync(node.ambientLoopUrl).then((buffer) => {
      if (ambientCur.current !== audio) return  // stale load
      audio.setBuffer(buffer)
      audio.setLoop(true)
      audio.setVolume(0) // will fade in via useFrame
      if (ambientEnabled && !muted) audio.play()
    }).catch((err) => console.warn('[AudioManager] ambient load error:', err))

    return () => {
      audio.stop()
      ambientPrev.current?.stop()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentNodeId])

  // Smooth cross-fade each frame (~1 second duration)
  useFrame((_, delta) => {
    if (fadeProgress.current < 1) {
      fadeProgress.current = Math.min(1, fadeProgress.current + delta)
      const t = fadeProgress.current
      ambientCur.current?.setVolume(ambientEnabled ? t : 0)
      ambientPrev.current?.setVolume(ambientEnabled ? 1 - t : 0)
      if (t >= 1) {
        ambientPrev.current?.stop()
        ambientPrev.current = null
      }
    }
  })

  // Pause / resume ambient when toggle changes
  useEffect(() => {
    const a = ambientCur.current
    if (!a) return
    if (ambientEnabled && !muted) {
      if (!a.isPlaying && a.buffer) a.play()
    } else {
      if (a.isPlaying) a.pause()
    }
  }, [ambientEnabled, muted])

  // ── Positional audio sources ────────────────────────────────
  const positionalRefs = useRef<THREE.PositionalAudio[]>([])

  const node = nodes.find((n) => n.id === currentNodeId)

  useEffect(() => {
    // Clean up old sources
    positionalRefs.current.forEach((p) => { p.stop(); p.disconnect() })
    positionalRefs.current = []
    if (!node) return

    node.audioSources.forEach((src) => {
      const pa = new THREE.PositionalAudio(listener)
      pa.position.set(...src.position)
      pa.setRefDistance(src.refDistance ?? 2)
      pa.setRolloffFactor(src.rolloffFactor ?? 1)

      loader.loadAsync(src.url).then((buffer) => {
        pa.setBuffer(buffer)
        pa.setLoop(true)
        pa.setVolume(src.volume ?? 0.6)
        if (effectsEnabled && !muted) pa.play()
      }).catch((err) => console.warn(`[AudioManager] positional load error (${src.id}):`, err))

      positionalRefs.current.push(pa)
    })

    return () => {
      positionalRefs.current.forEach((p) => {
        if (p.isPlaying) p.stop()
        p.disconnect()
      })
      positionalRefs.current = []
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentNodeId])

  // Pause / resume positional when toggle or mute changes
  useEffect(() => {
    positionalRefs.current.forEach((p) => {
      if (effectsEnabled && !muted) {
        if (!p.isPlaying && p.buffer) p.play()
      } else {
        if (p.isPlaying) p.pause()
      }
    })
  }, [effectsEnabled, muted])

  // Render positional sources into the scene graph so Three.js updates their world matrix
  return (
    <group>
      {positionalRefs.current.map((pa, i) => (
        <primitive key={`${currentNodeId}-pa-${i}`} object={pa} />
      ))}
    </group>
  )
}
