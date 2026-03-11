import { useRef, useCallback, useEffect, useState } from 'react'

interface Props {
  onMove: (dx: number, dy: number) => void
}

/**
 * Simple on-screen joystick for mobile / touch devices.
 * Renders a translucent circle in the bottom-left; dragging it emits
 * normalised dx/dy deltas via the onMove callback each animation frame.
 */
export function TouchControls({ onMove }: Props) {
  const stickRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)
  const origin = useRef({ x: 0, y: 0 })
  const delta = useRef({ x: 0, y: 0 })

  const handleStart = useCallback((e: React.TouchEvent) => {
    const t = e.touches[0]
    origin.current = { x: t.clientX, y: t.clientY }
    delta.current = { x: 0, y: 0 }
    setActive(true)
  }, [])

  const handleMove = useCallback((e: React.TouchEvent) => {
    if (!active) return
    const t = e.touches[0]
    const maxR = 40
    let dx = t.clientX - origin.current.x
    let dy = t.clientY - origin.current.y
    const dist = Math.sqrt(dx * dx + dy * dy)
    if (dist > maxR) {
      dx = (dx / dist) * maxR
      dy = (dy / dist) * maxR
    }
    delta.current = { x: dx / maxR, y: dy / maxR }
    if (stickRef.current) {
      stickRef.current.style.transform = `translate(${dx}px, ${dy}px)`
    }
  }, [active])

  const handleEnd = useCallback(() => {
    setActive(false)
    delta.current = { x: 0, y: 0 }
    if (stickRef.current) stickRef.current.style.transform = ''
  }, [])

  useEffect(() => {
    let raf = 0
    const tick = () => {
      if (active) onMove(delta.current.x, delta.current.y)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [active, onMove])

  return (
    <div
      className="pointer-events-auto absolute bottom-32 left-6 z-30 flex h-24 w-24 items-center justify-center rounded-full border border-white/10 bg-white/5 backdrop-blur"
      onTouchStart={handleStart}
      onTouchMove={handleMove}
      onTouchEnd={handleEnd}
    >
      <div
        ref={stickRef}
        className="h-10 w-10 rounded-full bg-white/20 transition-transform"
      />
    </div>
  )
}
