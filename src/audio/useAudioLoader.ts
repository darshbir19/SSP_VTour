import { useRef, useEffect } from 'react'
import * as THREE from 'three'

const bufferCache = new Map<string, AudioBuffer>()
const loader = new THREE.AudioLoader()

/**
 * Loads an AudioBuffer for the given URL, caching results across calls.
 * Returns null while loading or on error.
 */
export function useAudioBuffer(url: string): AudioBuffer | null {
  const ref = useRef<AudioBuffer | null>(bufferCache.get(url) ?? null)
  const mounted = useRef(true)

  useEffect(() => {
    mounted.current = true
    if (bufferCache.has(url)) {
      ref.current = bufferCache.get(url)!
      return
    }
    loader.loadAsync(url).then((buf) => {
      bufferCache.set(url, buf)
      if (mounted.current) ref.current = buf
    }).catch((err) => {
      console.warn(`[AudioLoader] Failed to load ${url}:`, err)
    })
    return () => { mounted.current = false }
  }, [url])

  return ref.current
}
