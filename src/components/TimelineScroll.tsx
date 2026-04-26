import { useEffect, useMemo, useRef, useState } from 'react'

export interface TimelineItem {
  year: string
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
  { year: '1980', image: '/images/1980.jpg', text: 'Old market streets...' },
  { year: '2000', image: '/images/2000.jpg', text: 'Growing electronics hub...' },
  { year: '2025', image: '/images/2025.jpg', text: 'Modern dense district...' },
]

export function TimelineScroll({
  items,
  title = 'Neighborhood Timeline',
  subtitle,
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

    const observer = new IntersectionObserver(
      (entries) => {
        let bestVisible = entries[0]

        for (const entry of entries) {
          if (
            entry.isIntersecting &&
            (!bestVisible || entry.intersectionRatio > bestVisible.intersectionRatio)
          ) {
            bestVisible = entry
          }
        }

        if (!bestVisible?.isIntersecting) return
        const nextIndex = Number((bestVisible.target as HTMLElement).dataset.index)
        if (!Number.isNaN(nextIndex)) {
          setActiveIndex(nextIndex)
        }
      },
      {
        threshold: [0.25, 0.5, 0.75],
        rootMargin: '-15% 0px -35% 0px',
      },
    )

    const currentRefs = sectionRefs.current.filter(Boolean) as HTMLElement[]
    currentRefs.forEach((section) => observer.observe(section))

    return () => observer.disconnect()
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

  const activeItem = items[activeIndex] ?? items[0]
  const activePoints = activeItem.text
    .split(/[.!?]\s+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 3)

  return (
    <section className={`w-full rounded-3xl border border-[#e5e7eb] bg-[#fdfaf6] text-[#1f2937] shadow-sm ${className}`}>
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-8 px-5 py-10 md:px-8 lg:grid-cols-[minmax(320px,1fr)_minmax(380px,1fr)] lg:gap-12 lg:px-10 lg:py-14">
        <aside className="lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)]">
          <div className="h-full rounded-2xl border border-[#e5e7eb] bg-[#fdfaf6] p-5 shadow-sm sm:p-6">
            <p className="text-sm tracking-widest text-amber-700 uppercase">{title}</p>
            <h3 className="mt-2 text-4xl font-semibold text-[#1f2937] sm:text-5xl">{activeItem.year}</h3>
            {subtitle ? <p className="mt-2 text-base leading-relaxed text-[#6b7280]">{subtitle}</p> : null}

            <div className="relative mt-5 overflow-hidden rounded-2xl border border-[#e5e7eb] bg-[#f5f1e8]">
              <div className="relative aspect-[16/10] w-full">
                {items.map((item, index) => (
                  <img
                    key={item.year}
                    src={item.image}
                    alt={`${item.year} timeline`}
                    className={`absolute inset-0 h-full w-full object-cover transition-all duration-500 ease-in-out ${
                      index === activeIndex ? 'scale-100 opacity-100' : 'scale-105 opacity-0'
                    }`}
                  />
                ))}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                {activeItem.imageLabel ? (
                  <span className="absolute left-3 top-3 rounded-full border border-[#e5e7eb] bg-[#fdfaf6]/90 px-2.5 py-1 text-[10px] tracking-wide text-amber-700 uppercase">
                    {activeItem.imageLabel}
                  </span>
                ) : null}
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-[#e5e7eb] bg-[#f5f1e8]/60 p-4">
              <ul className="space-y-2 text-base leading-relaxed text-[#6b7280]">
                {activePoints.map((line, idx) => (
                  <li key={`${activeItem.year}-point-${idx}`} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-700" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              type="button"
              className="mt-5 inline-flex items-center gap-2 rounded-xl border border-[#e5e7eb] bg-[#fdfaf6] px-3 py-2 text-xs text-[#6b7280] transition-all duration-300 ease-in-out hover:scale-[1.02] hover:text-[#1f2937]"
            >
              Compare (Then vs Now)
              <span className="rounded bg-amber-50 px-1.5 py-0.5 text-[10px] text-amber-700">Soon</span>
            </button>
          </div>
        </aside>

        <div className="relative">
          <div className="absolute bottom-0 left-4 top-0 w-px bg-gradient-to-b from-transparent via-amber-300/70 to-transparent" />
          <div className="space-y-10">
            {items.map((item, index) => {
              const active = index === activeIndex
              const lines = item.text
                .split(/[.!?]\s+/)
                .map((line) => line.trim())
                .filter(Boolean)
                .slice(0, 3)
              return (
                <article
                  key={item.year}
                  ref={(el) => {
                    sectionRefs.current[index] = el
                  }}
                  data-index={index}
                  className="relative min-h-[55vh] pl-10"
                >
                  <span
                    className={`absolute left-4 top-8 h-3.5 w-3.5 -translate-x-1/2 rounded-full border transition-all duration-300 ease-in-out ${
                      active
                        ? 'h-4 w-4 border-amber-700 bg-amber-700'
                        : 'border-[#d1d5db] bg-[#fdfaf6]'
                    }`}
                  />

                  <div className="group relative mb-4 overflow-hidden rounded-2xl border border-[#e5e7eb] bg-[#f5f1e8] shadow-sm">
                    <img
                      src={item.image}
                      alt={`${item.year} timeline preview`}
                      className="h-auto w-full object-contain transition-all duration-300 ease-in-out group-hover:scale-[1.02]"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    {item.imageLabel ? (
                      <span className="absolute left-3 top-3 rounded-full border border-[#e5e7eb] bg-[#fdfaf6]/90 px-2 py-1 text-[10px] tracking-wide text-amber-700 uppercase">
                        {item.imageLabel}
                      </span>
                    ) : null}
                  </div>

                  <div
                    className={`rounded-2xl border bg-[#fdfaf6] p-6 shadow-sm transition-all duration-300 ease-in-out ${
                      active
                        ? 'translate-y-0 border-amber-700/60'
                        : 'translate-y-1 border-[#e5e7eb]'
                    }`}
                  >
                    <p
                      className={`text-sm tracking-widest uppercase transition-all duration-300 ${
                        active ? 'text-amber-700' : 'text-[#6b7280]'
                      }`}
                    >
                      {item.year}
                    </p>
                    <ul className="mt-3 space-y-2 text-base leading-relaxed text-[#6b7280]">
                      {lines.map((line, idx) => (
                        <li key={`${item.year}-line-${idx}`} className="flex gap-2">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-700" />
                          <span>{line}</span>
                        </li>
                      ))}
                    </ul>
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
