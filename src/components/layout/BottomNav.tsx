import { useExperience } from '../../context/ExperienceContext'
import { nodes } from '../../data/nodes'

export function BottomNav() {
  const { currentNodeId, goToNode, language } = useExperience()

  return (
    <div className="pointer-events-auto absolute bottom-0 left-0 z-30 flex w-full items-end justify-center gap-2 bg-gradient-to-t from-black/80 to-transparent px-4 pb-3 pt-10">
      {nodes.map((node) => {
        const active = node.id === currentNodeId
        const name = language === 'en' ? node.nameEn : node.nameZh
        return (
          <button
            key={node.id}
            onClick={() => goToNode(node.id)}
            className={`group flex cursor-pointer flex-col items-center gap-1 transition-transform ${
              active ? 'scale-110' : 'opacity-70 hover:opacity-100'
            }`}
          >
            <div
              className="h-14 w-20 overflow-hidden rounded-md border-2 bg-cover bg-center sm:h-16 sm:w-24"
              style={{
                backgroundImage: `url(${node.thumbnailUrl})`,
                borderColor: active ? node.accentColor : 'rgba(255,255,255,0.15)',
                boxShadow: active ? `0 0 12px ${node.accentColor}` : 'none',
              }}
            />
            <span
              className="max-w-[6rem] truncate text-center text-[10px] leading-tight text-slate-300 sm:text-xs"
              style={{ color: active ? node.accentColor : undefined }}
            >
              {name}
            </span>
          </button>
        )
      })}
    </div>
  )
}
