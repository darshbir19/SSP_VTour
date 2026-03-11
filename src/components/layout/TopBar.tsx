import { useState, useEffect, lazy, Suspense } from 'react'
import { useExperience } from '../../context/ExperienceContext'
import { enterFullscreen, exitFullscreen, isFullscreen } from '../../utils/fullscreen'
import { isWebXRSupported } from '../../utils/device'

const WebXRButton = lazy(() =>
  import('../../three/WebXRButton').then((m) => ({ default: m.WebXRButton })),
)

interface Props {
  onExit: () => void
}

export function TopBar({ onExit }: Props) {
  const { language, toggleLanguage, muted, toggleMute, volume, setVolume, infoOpen, setInfoOpen } =
    useExperience()

  const [fs, setFs] = useState(false)
  const [vrAvailable, setVrAvailable] = useState(false)

  useEffect(() => {
    isWebXRSupported().then(setVrAvailable)
    const h = () => setFs(isFullscreen())
    document.addEventListener('fullscreenchange', h)
    return () => document.removeEventListener('fullscreenchange', h)
  }, [])

  return (
    <div className="pointer-events-auto absolute top-0 right-0 z-30 flex items-center gap-2 p-3">
      <Btn onClick={toggleLanguage} label={language === 'en' ? '中文' : 'Eng'} />
      <Btn onClick={toggleMute} label={muted ? '🔇' : '🔊'} />

      <input
        type="range"
        min={0}
        max={1}
        step={0.05}
        value={volume}
        onChange={(e) => setVolume(Number(e.target.value))}
        className="hidden w-20 accent-neon-green sm:block"
        aria-label="Volume"
      />

      <Btn onClick={() => setInfoOpen(!infoOpen)} label="ℹ" />
      <Btn
        onClick={() => (fs ? exitFullscreen() : enterFullscreen())}
        label={fs ? '⊘' : '⛶'}
      />

      {vrAvailable && (
        <Suspense fallback={null}>
          <WebXRButton />
        </Suspense>
      )}

      <Btn onClick={onExit} label="✕" />
    </div>
  )
}

function Btn({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className="flex h-8 min-w-[2rem] cursor-pointer items-center justify-center rounded border border-white/10 bg-ssp-panel/70 px-2 text-xs text-slate-300 backdrop-blur transition hover:bg-white/10 hover:text-white"
    >
      {label}
    </button>
  )
}
