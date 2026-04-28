import { useEffect, useMemo, useRef, useState } from 'react'

export interface TimelineItem {
  year: string
  title?: string
  image: string
  text: string
  imageLabel?: string
}

interface TimelineScrollProps {
  items: TimelineItem[]
  title?: string
  subtitle?: string
  className?: string
  initialYear?: string
}

export const sampleTimelineData: TimelineItem[] = [
  { year: '1980', title: 'Old Market Streets', image: '/images/1980.jpg', text: 'Old market streets...' },
  { year: '2000', title: 'Electronics Hub', image: '/images/2000.jpg', text: 'Growing electronics hub...' },
  { year: '2025', title: 'Modern Dense District', image: '/images/2025.jpg', text: 'Modern dense district...' },
]

export function TimelineScroll({
  items,
  title = 'Memory Scroll',
  className = '',
  initialYear,
}: TimelineScrollProps) {
  const startIndex = useMemo(() => {
    if (!items.length) return 0
    if (!initialYear) return 0
    const index = items.findIndex((item) => item.year === initialYear)
    return index >= 0 ? index : 0
  }, [initialYear, items])

  const [activeIndex, setActiveIndex] = useState(startIndex)
  const sectionRefs = useRef<Array<HTMLElement | null>>([])

  useEffect(() => {
    setActiveIndex(startIndex)
  }, [startIndex])

  useEffect(() => {
    if (!items.length) return

    const updateActiveItem = () => {
      const viewportCenter = window.innerHeight / 2
      let closestIndex = 0
      let closestDistance = Number.POSITIVE_INFINITY

      sectionRefs.current.forEach((section, index) => {
        if (!section) return
        const rect = section.getBoundingClientRect()
        const sectionCenter = rect.top + rect.height / 2
        const distance = Math.abs(sectionCenter - viewportCenter)

        if (distance < closestDistance) {
          closestDistance = distance
          closestIndex = index
        }
      })

      setActiveIndex(closestIndex)
    }

    updateActiveItem()
    window.addEventListener('scroll', updateActiveItem, { passive: true })
    window.addEventListener('resize', updateActiveItem)

    return () => {
      window.removeEventListener('scroll', updateActiveItem)
      window.removeEventListener('resize', updateActiveItem)
    }
  }, [items.length])

  if (!items.length) {
    return (
      <section
        className={`rounded-2xl border border-[#e5e7eb] bg-[#fdfaf6] p-8 text-center text-[#6b7280] ${className}`}
      >
        Add timeline items to render this component.
      </section>
    )
  }

  return (
    <section className={`w-full rounded-3xl border border-[#e5e7eb] bg-[#fdfaf6] text-[#1f2937] shadow-sm ${className}`}>
      <div className="mx-auto w-full max-w-6xl px-5 py-10 md:px-8 lg:px-10 lg:py-14">
        <p className="mb-8 text-2xl font-semibold tracking-widest text-amber-700 uppercase">
          {title}
        </p>
        <div className="relative">
          <div className="absolute bottom-10 left-1/2 top-10 hidden w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-amber-300/70 to-transparent lg:block" />
          <div className="space-y-14">
            {items.map((item, index) => {
              const active = index === activeIndex
              const reversed = index % 2 === 1
              return (
                <article
                  key={item.year}
                  ref={(el) => {
                    sectionRefs.current[index] = el
                  }}
                  data-index={index}
                  className={`relative flex flex-col gap-6 py-12 transition-all duration-500 ease-in-out lg:items-center lg:gap-12 ${
                    reversed ? 'lg:flex-row-reverse' : 'lg:flex-row'
                  } ${active ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-75'}`}
                >
                  <span
                    className={`absolute left-1/2 top-1/2 z-10 hidden -translate-x-1/2 -translate-y-1/2 rounded-full border transition-all duration-300 ease-in-out lg:block ${
                      active
                        ? 'h-5 w-5 border-amber-700 bg-amber-700 shadow-[0_0_0_8px_rgba(180,83,9,0.12)]'
                        : 'h-3.5 w-3.5 border-[#d1d5db] bg-[#fdfaf6]'
                    }`}
                  />

                  <div className="group relative w-full overflow-hidden rounded-xl border border-[#e5e7eb] bg-[#f5f1e8] shadow-md lg:w-1/2">
                    <img
                      src={item.image}
                      alt={`${item.year} timeline preview`}
                      className="h-auto w-full object-contain transition-all duration-300 ease-in-out group-hover:scale-[1.02]"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    {item.imageLabel ? (
                      <span className="absolute left-3 top-3 rounded-full border border-[#e5e7eb] bg-[#fdfaf6]/90 px-2 py-1 text-[10px] font-semibold tracking-wide text-[#b45309] uppercase">
                        {item.imageLabel}
                      </span>
                    ) : null}
                  </div>

                  <div
                    className={`w-full max-w-md rounded-2xl border bg-[#fdfaf6] p-6 shadow-sm transition-all duration-300 ease-in-out lg:w-1/2 ${
                      active
                        ? 'translate-y-0 border-amber-700/60'
                        : 'translate-y-1 border-[#e5e7eb]'
                    }`}
                  >
                    <p className="text-base font-semibold tracking-widest text-amber-700 uppercase transition-all duration-300">
                      {item.year}
                    </p>
                    {item.title ? (
                      <h3 className="mt-3 whitespace-nowrap text-xl font-semibold leading-tight text-[#1f2937] sm:text-2xl">
                        {item.title}
                      </h3>
                    ) : null}
                    <p className="mt-3 text-base leading-relaxed text-[#6b7280]">
                      {item.text}
                    </p>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
