import { useExperience } from '../context/ExperienceContext'
import { nodes } from '../data/nodes'

export function InfoPanel() {
  const { currentNodeId, language, infoOpen, setInfoOpen } = useExperience()
  const node = nodes.find((n) => n.id === currentNodeId)
  if (!node || !infoOpen) return null

  const info = language === 'en' ? node.infoEn : node.infoZh
  const name = language === 'en' ? node.nameEn : node.nameZh

  return (
    <div className="pointer-events-auto absolute right-0 top-16 z-40 m-4 max-w-sm rounded-lg border border-white/10 bg-ssp-panel/90 p-5 shadow-lg backdrop-blur-md">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-neon text-neon-green text-base">{name}</h3>
        <button
          onClick={() => setInfoOpen(false)}
          className="cursor-pointer text-slate-400 hover:text-white"
          aria-label="Close info"
        >
          ✕
        </button>
      </div>
      <p className="text-sm leading-relaxed text-slate-300">{info || '—'}</p>
    </div>
  )
}
