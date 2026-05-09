import { mapLocations } from '../data/mapLocations'
import { immersiveTimelineLocationIds, locationTimelineItems } from '../data/locationTimelineMemories'
import { TimelineScroll } from './TimelineScroll'

const INTRO_PARAGRAPHS = [
  'Redevelopment and gentrification are gradually transforming the physical and sensory identity of Sham Shui Po. As older buildings, markets, and long-standing shops disappear, the district’s everyday sounds, rhythms, and social environments also begin to change. For many residents, these transformations affect not only the visual landscape of the neighbourhood, but also memory, attachment, and lived experience.',
  'Through interviews, sound recordings, photography, and field observation, this section explores how urban change reshapes the collective memory and multisensory identity of Sham Shui Po.',
]

/** Embedded in Fieldwork & Interviews: after Interviews media, before Key Findings. */
export function GentrificationMemorySection() {
  const locationById = Object.fromEntries(mapLocations.map((loc) => [loc.id, loc]))

  return (
    <section
      id="gentrification-memory"
      aria-labelledby="gentrification-memory-heading"
      className="scroll-mt-[calc(3rem+32px)] border-t border-[#082852]/15 bg-gradient-to-b from-[#f8fafc] to-[#ffffff] px-0 py-16 text-[#0f172a] sm:py-20"
    >
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-8">
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[#2563eb]">Research</p>
        <h2
          id="gentrification-memory-heading"
          className="mt-3 font-['Georgia',serif] text-[clamp(1.75rem,4vw,2.5rem)] font-semibold tracking-tight text-[#082852]"
        >
          Gentrification & memory
        </h2>
        <div className="mx-auto mt-8 max-w-none space-y-5 text-left font-['Montserrat',sans-serif] text-base leading-relaxed text-[#475569] sm:text-[1.05rem]">
          {INTRO_PARAGRAPHS.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-14 max-w-6xl px-4 sm:mt-16 sm:px-8">
        <div className="space-y-14 sm:space-y-16">
          {immersiveTimelineLocationIds.map((id) => {
            const loc = locationById[id]
            const items = locationTimelineItems[id]
            if (!loc || !items?.length) return null

            return (
              <div key={id} className="border-t border-[#082852]/10 pt-10 sm:pt-12">
                <div className="mb-8 max-w-3xl">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[#2563eb]/90">Field site</p>
                  <h3
                    id={`gent-memory-${id}-heading`}
                    className="mt-2 font-['Georgia',serif] text-2xl font-semibold text-[#082852] sm:text-3xl"
                  >
                    {loc.nameEn}
                  </h3>
                  {loc.nameZh ? <p className="mt-1 text-sm font-medium text-[#64748b]">{loc.nameZh}</p> : null}
                </div>
                <TimelineScroll title="Memory Scroll" items={items} className="border border-[#082852]/10 bg-white/80 shadow-none" />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
