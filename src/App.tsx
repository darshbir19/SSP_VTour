import { useRef } from 'react'
import { HomePage } from './components/HomePage'
import { LanguageSwitcher } from './components/LanguageSwitcher'
import { MapTour } from './components/MapTour'
import { LanguageProvider } from './context/LanguageContext'

export function App() {
  const homeSectionRef = useRef<HTMLElement | null>(null)
  const mapSectionRef = useRef<HTMLElement | null>(null)

  return (
    <LanguageProvider>
      <div className="relative h-[100dvh] w-screen snap-y snap-mandatory overflow-y-auto bg-ssp-bg text-slate-100 scroll-smooth">
        <div className="pointer-events-auto fixed left-3 right-3 top-3 z-[100] flex items-center justify-end gap-2 sm:left-auto sm:right-6 sm:top-5">
          <a
            href="https://docs.google.com/forms/d/1rjHiUY27ZrwFb02XWUk8EKTwtPh2dtq4nC7ky3tZW8Q/edit"
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-10 min-w-[96px] items-center justify-center gap-1 rounded-xl border border-white/25 bg-black/55 px-3 text-xs text-white backdrop-blur hover:bg-black/75 sm:min-w-10 sm:text-sm"
          >
            Contibute
          </a>
          <LanguageSwitcher />
        </div>
        <section ref={homeSectionRef} className="h-[100dvh] w-full snap-start">
          <HomePage onScrollToMap={() => mapSectionRef.current?.scrollIntoView({ behavior: 'smooth' })} />
        </section>
        <section ref={mapSectionRef} className="h-[100dvh] w-full snap-start">
          <MapTour onBack={() => homeSectionRef.current?.scrollIntoView({ behavior: 'smooth' })} />
        </section>
      </div>
    </LanguageProvider>
  )
}

