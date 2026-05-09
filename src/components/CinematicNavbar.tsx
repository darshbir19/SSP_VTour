import { useState } from 'react'

type DropdownItem = {
  label: string
  onClick?: () => void
  /** When set, this row is highlighted while the matching research scroll section is in view. */
  researchNavHighlight?: 'overview' | 'fieldwork' | 'gentrification'
}

type NavSection = {
  label: string
  kicker: string
  items: DropdownItem[]
}

interface CinematicNavbarProps {
  onOpenLocation: (locationId: string) => void
  onOpenContribute: () => void
  onScrollToMap: () => void
  onNavigateHome?: () => void
  onScrollToResearchOverview?: () => void
  onScrollToFieldworkInterviews?: () => void
  onOpenGentrificationMemory?: () => void
  activeResearchNavItem?: 'overview' | 'fieldwork' | 'gentrification' | null
}

export function CinematicNavbar({
  onOpenLocation,
  onOpenContribute,
  onScrollToMap,
  onNavigateHome,
  onScrollToResearchOverview,
  onScrollToFieldworkInterviews,
  onOpenGentrificationMemory,
  activeResearchNavItem = null,
}: CinematicNavbarProps) {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)

  const dropdownSections: NavSection[] = [
    {
      label: 'Places to Explore',
      kicker: 'Sensory field sites',
      items: [
        {
          label: 'Fuk Wing Street',
          onClick: () => onOpenLocation('fuk-wing'),
        },
        {
          label: 'Apliu Street',
          onClick: () => onOpenLocation('apliu'),
        },
        {
          label: 'Golden Computer Arcade',
          onClick: () => onOpenLocation('golden'),
        },
        {
          label: 'Pei Ho Street Market',
          onClick: () => onOpenLocation('pei-ho'),
        },
      ],
    },
    {
      label: 'Research',
      kicker: 'Ethnographic foundation',
      items: [
        {
          label: 'Research Overview',
          onClick: onScrollToResearchOverview,
          researchNavHighlight: 'overview',
        },
        {
          label: 'Fieldwork & Interviews',
          onClick: onScrollToFieldworkInterviews,
          researchNavHighlight: 'fieldwork',
        },
        {
          label: 'Gentrification & Memory',
          onClick: onOpenGentrificationMemory,
          researchNavHighlight: 'gentrification',
        },
      ],
    },
  ]

  const navTabClass =
    'group relative flex h-full items-center px-3 text-[0.78rem] font-medium uppercase tracking-[0.14em] text-white transition duration-300 hover:bg-white/[0.06] xl:px-4 xl:text-[0.82rem]'

  const handleItemClick = (item: DropdownItem) => {
    item.onClick?.()
    setActiveDropdown(null)
    setMobileOpen(false)
  }

  const goHome = () => {
    setActiveDropdown(null)
    setMobileOpen(false)
    ;(onNavigateHome ?? (() => window.scrollTo({ top: 0, behavior: 'auto' })))()
  }

  return (
    <nav
      data-archive-navbar
      className="fixed top-0 left-0 right-0 z-[100] w-full border-b border-white/15 bg-[#082852] text-white shadow-[0_8px_28px_rgba(8,40,82,0.35)]"
    >
      <div className="mx-auto flex h-12 w-full max-w-[1440px] items-center justify-between px-4 sm:px-7 lg:px-9">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={goHome}
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center border border-white/25 text-white transition hover:border-white/45 hover:bg-white/10"
            aria-label="Back to homepage"
            title="Home"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </button>
          <button type="button" onClick={goHome} className="group min-w-0 text-left" aria-label="Go to homepage">
            <span className="block truncate text-[0.95rem] font-semibold tracking-[-0.02em] text-white transition sm:text-[1.02rem]">
              Sham Shui Po Sensory Archive
            </span>
          </button>
        </div>

        <div className="hidden h-full items-center lg:flex">
          {dropdownSections.map((section) => {
            const isActive = activeDropdown === section.label
            return (
              <div
                key={section.label}
                className="relative flex h-full items-center"
                onMouseEnter={() => setActiveDropdown(section.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button
                  type="button"
                  onFocus={() => setActiveDropdown(section.label)}
                  onClick={() => setActiveDropdown(isActive ? null : section.label)}
                  className={`group relative flex h-full items-center px-3 text-[0.78rem] font-medium uppercase tracking-[0.14em] text-white transition duration-300 xl:px-4 xl:text-[0.82rem]`}
                >
                  {section.label}
                  <span
                    className={`absolute inset-x-3 bottom-0 h-[2px] origin-center bg-white/90 shadow-[0_0_12px_rgba(255,255,255,0.35)] transition duration-300 ${
                      isActive ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-90'
                    }`}
                  />
                </button>

                <div
                  className={`absolute right-0 top-full w-[20rem] origin-top border border-white/15 border-t-white/35 bg-[#082852] p-2 text-white shadow-[0_24px_70px_rgba(8,40,82,0.5)] transition duration-300 ${
                    isActive
                      ? 'pointer-events-auto translate-y-0 opacity-100'
                      : 'pointer-events-none -translate-y-2 opacity-0'
                  }`}
                >
                  <p className="border-b border-white/10 px-3 py-2 text-[0.62rem] font-medium uppercase tracking-[0.28em] text-white">
                    {section.kicker}
                  </p>
                  <div className="py-1">
                    {section.items.map((item) => {
                      const researchActive =
                        section.label === 'Research' &&
                        item.researchNavHighlight &&
                        activeResearchNavItem === item.researchNavHighlight
                      return (
                        <button
                          key={item.label}
                          type="button"
                          onClick={() => handleItemClick(item)}
                          className={`flex w-full items-center px-4 py-3 text-left text-[1rem] font-medium leading-snug text-white transition duration-300 hover:bg-white/10 xl:text-[1.0625rem] ${
                            researchActive ? 'bg-white/14 ring-1 ring-inset ring-white/35' : ''
                          }`}
                        >
                          {item.label}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            )
          })}
          <button
            type="button"
            onClick={() => {
              setActiveDropdown(null)
              onScrollToMap()
            }}
            className={navTabClass}
            aria-label="Open map tour"
          >
            MAP TOUR
            <span className="pointer-events-none absolute inset-x-3 bottom-0 h-[2px] origin-center scale-x-0 bg-white/90 opacity-0 shadow-[0_0_12px_rgba(255,255,255,0.35)] transition duration-300 group-hover:scale-x-100 group-hover:opacity-90" />
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveDropdown(null)
              onOpenContribute()
            }}
            className={navTabClass}
            aria-label="Contribute your experience"
          >
            CONTRIBUTE
            <span className="pointer-events-none absolute inset-x-3 bottom-0 h-[2px] origin-center scale-x-0 bg-white/90 opacity-0 shadow-[0_0_12px_rgba(255,255,255,0.35)] transition duration-300 group-hover:scale-x-100 group-hover:opacity-90" />
          </button>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="inline-flex h-8 w-8 items-center justify-center border border-white/25 bg-white/5 text-white transition hover:border-white/40 hover:bg-white/10 lg:hidden"
          aria-label="Open navigation menu"
          aria-expanded={mobileOpen}
        >
          <span className="space-y-1.5">
            <span className="block h-px w-5 bg-current" />
            <span className="block h-px w-5 bg-current" />
            <span className="block h-px w-5 bg-current" />
          </span>
        </button>
      </div>

      <div
        className={`fixed inset-0 z-[60] bg-slate-950/50 transition duration-300 lg:hidden ${
          mobileOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setMobileOpen(false)}
      />
      <aside
        className={`fixed left-0 top-0 z-[70] h-dvh w-[min(22rem,86vw)] border-r border-white/15 bg-[#082852] text-white shadow-[18px_0_60px_rgba(8,40,82,0.45)] transition-transform duration-300 lg:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-12 items-center gap-2 border-b border-white/10 px-4">
            <button
              type="button"
              onClick={goHome}
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center border border-white/25 text-white transition hover:border-white/45 hover:bg-white/10"
              aria-label="Back to homepage"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </button>
            <p className="min-w-0 flex-1 truncate text-[0.95rem] font-semibold text-white sm:text-[1.02rem]">Sham Shui Po Sensory Archive</p>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="text-2xl leading-none text-white transition hover:text-white"
              aria-label="Close navigation menu"
            >
              ×
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-4">
            {dropdownSections.map((section) => {
              const isActive = activeDropdown === section.label
              return (
                <div key={section.label} className="border-b border-white/10">
                  <button
                    type="button"
                    onClick={() => setActiveDropdown(isActive ? null : section.label)}
                    className="flex w-full items-center justify-between gap-3 px-3 py-4 text-left"
                  >
                    <span>
                      <span className="block text-[0.95rem] font-semibold uppercase tracking-[0.14em] text-white">
                        {section.label}
                      </span>
                      <span className="mt-1 block text-[0.68rem] font-medium uppercase tracking-[0.22em] text-white/85">
                        {section.kicker}
                      </span>
                    </span>
                    <span className={`text-lg text-white transition ${isActive ? 'rotate-45' : ''}`}>+</span>
                  </button>
                  <div className={`grid transition-all duration-300 ${isActive ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                    <div className="overflow-hidden">
                      <div className="pb-3">
                        {section.items.map((item) => {
                          const researchActive =
                            section.label === 'Research' &&
                            item.researchNavHighlight &&
                            activeResearchNavItem === item.researchNavHighlight
                          return (
                            <button
                              key={item.label}
                              type="button"
                              onClick={() => handleItemClick(item)}
                              className={`flex w-full px-4 py-3.5 text-left text-base font-medium leading-snug text-white transition hover:bg-white/10 ${
                                researchActive ? 'bg-white/12 ring-1 ring-inset ring-white/30' : ''
                              }`}
                            >
                              {item.label}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false)
                onScrollToMap()
              }}
              className="flex w-full items-center border-b border-white/10 px-3 py-4 text-left transition hover:bg-white/[0.06]"
            >
              <span className="text-[0.95rem] font-semibold uppercase tracking-[0.14em] text-white">MAP TOUR</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false)
                onOpenContribute()
              }}
              className="flex w-full items-center border-b border-white/10 px-3 py-4 text-left transition hover:bg-white/[0.06]"
            >
              <span className="text-[0.95rem] font-semibold uppercase tracking-[0.14em] text-white">CONTRIBUTE</span>
            </button>
          </div>
        </div>
      </aside>
    </nav>
  )
}
