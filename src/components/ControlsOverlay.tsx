import { useEffect, useState } from 'react'
import { isTouchDevice } from '../utils/device'

export function ControlsOverlay() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 6000)
    return () => clearTimeout(t)
  }, [])

  if (!visible) return null

  return (
    <div className="pointer-events-none absolute bottom-28 left-1/2 z-20 -translate-x-1/2 rounded-lg bg-black/60 px-5 py-3 text-center text-xs text-slate-400 backdrop-blur">
      {isTouchDevice() ? (
        <span>Drag to look around · Use joystick to move</span>
      ) : (
        <span>Click to lock cursor · WASD to move · Mouse to look · ESC to unlock</span>
      )}
    </div>
  )
}
