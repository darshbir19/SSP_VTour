import { useRef, useState } from 'react'
import { HomePage } from './components/HomePage'
import { LanguageSwitcher } from './components/LanguageSwitcher'
import { MapTour } from './components/MapTour'
import { ContributionForm } from './components/ContributionForm'
import { LanguageProvider } from './context/LanguageContext'

export function App() {
  const homeSectionRef = useRef<HTMLElement | null>(null)
  const mapSectionRef = useRef<HTMLElement | null>(null)
  const [locationDetailOpen, setLocationDetailOpen] = useState(false)
  const [contributeOpen, setContributeOpen] = useState(false)

  const handleBackToHome = () => {
    setLocationDetailOpen(false)
    window.requestAnimationFrame(() => {
      homeSectionRef.current?.scrollIntoView({ behavior: 'smooth' })
    })
  }

  return (
    <LanguageProvider>
      <div className="relative min-h-screen w-full overflow-x-hidden bg-ssp-bg text-slate-100 scroll-smooth">
        <div className="pointer-events-auto fixed left-3 right-3 top-3 z-[100] flex items-center justify-end gap-2 sm:left-auto sm:right-6 sm:top-5">
          <button
            type="button"
            onClick={() => setContributeOpen(true)}
            className="inline-flex h-10 min-w-[96px] items-center justify-center gap-1 rounded-xl border border-white/25 bg-black/55 px-3 text-xs text-white backdrop-blur hover:bg-black/75 sm:min-w-10 sm:text-sm"
          >
            Contribute
          </button>
          <LanguageSwitcher />
        </div>

        <section
          ref={homeSectionRef}
          className={locationDetailOpen ? 'hidden' : 'min-h-screen w-full'}
        >
          <HomePage onScrollToMap={() => mapSectionRef.current?.scrollIntoView({ behavior: 'smooth' })} />
        </section>
        <section ref={mapSectionRef} className="min-h-screen w-full">
          <MapTour onBackToHome={handleBackToHome} onLocationViewChange={setLocationDetailOpen} />
        </section>

        {contributeOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm">
            <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl">
              <button
                type="button"
                onClick={() => setContributeOpen(false)}
                className="absolute right-3 top-3 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#e5e7eb] bg-[#fdfaf6] text-sm text-[#1f2937] transition-all duration-300 hover:scale-105"
                aria-label="Close contribution form"
              >
                ✕
              </button>
              <ContributionForm />
            </div>
          </div>
        )}
      </div>
    </LanguageProvider>
  )
}

