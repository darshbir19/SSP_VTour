import { Suspense, lazy, useCallback } from 'react'
import { TopBar } from './layout/TopBar'
import { BottomNav } from './layout/BottomNav'
import { InfoPanel } from './InfoPanel'
import { ControlsOverlay } from './ControlsOverlay'
import { LoadingScreen } from './LoadingScreen'
import { isTouchDevice } from '../utils/device'

const Scene = lazy(() => import('../three/Scene').then((m) => ({ default: m.Scene })))
const TouchControls = lazy(() =>
  import('./TouchControls').then((m) => ({ default: m.TouchControls })),
)

interface Props {
  onExit: () => void
}

export function ExperienceLayout({ onExit }: Props) {
  const touch = isTouchDevice()
  const noopMove = useCallback(() => {}, [])

  return (
    <div className="relative h-full w-full overflow-hidden bg-ssp-bg">
      <Suspense fallback={<LoadingScreen />}>
        <Scene />
      </Suspense>

      {/* Overlay UI — pointer-events on children only */}
      <div className="pointer-events-none absolute inset-0 z-20">
        <TopBar onExit={onExit} />
        <InfoPanel />
        <ControlsOverlay />
        <BottomNav />
        {touch && (
          <Suspense fallback={null}>
            <TouchControls onMove={noopMove} />
          </Suspense>
        )}
      </div>
    </div>
  )
}
