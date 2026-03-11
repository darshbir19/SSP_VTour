import { useState, useEffect } from 'react'
import { isWebXRSupported } from '../utils/device'

/**
 * Renders a "VR" button that requests an immersive-vr WebXR session.
 * Only appears when the browser supports WebXR.
 *
 * Note: @react-three/xr provides its own <XR> wrapper and useXR hooks, but
 * for maximum compatibility we also expose a manual session request here
 * so it works even when the canvas isn't wrapped in <XR>.
 */
export function WebXRButton() {
  const [supported, setSupported] = useState(false)
  const [session, setSession] = useState<XRSession | null>(null)

  useEffect(() => {
    isWebXRSupported().then(setSupported)
  }, [])

  if (!supported) return null

  const toggle = async () => {
    if (session) {
      await session.end()
      setSession(null)
      return
    }
    try {
      const canvas = document.querySelector('canvas')
      if (!canvas) return
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl')
      if (!gl) return

      const xrSession = await (navigator as any).xr.requestSession('immersive-vr', {
        optionalFeatures: ['local-floor', 'bounded-floor'],
      })
      await (gl as any).makeXRCompatible?.()
      xrSession.addEventListener('end', () => setSession(null))
      setSession(xrSession)
    } catch (err) {
      console.warn('[WebXR] Could not start session:', err)
    }
  }

  return (
    <button
      onClick={toggle}
      className="flex h-8 min-w-[2rem] cursor-pointer items-center justify-center rounded border border-white/10 bg-ssp-panel/70 px-2 text-xs text-slate-300 backdrop-blur transition hover:bg-white/10 hover:text-white"
    >
      {session ? 'Exit VR' : 'VR'}
    </button>
  )
}
