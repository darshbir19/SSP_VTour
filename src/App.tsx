import { useCallback, useEffect, useRef, useState } from 'react'
import { HomePage } from './components/HomePage'
import { CinematicNavbar } from './components/CinematicNavbar'
import { MapTour } from './components/MapTour'
import { ContributionForm } from './components/ContributionForm'
import { LanguageProvider } from './context/LanguageContext'

export function App() {
  const homeSectionRef = useRef<HTMLElement | null>(null)
  const mapSectionRef = useRef<HTMLElement | null>(null)
  const [locationDetailOpen, setLocationDetailOpen] = useState(false)
  const [contributeOpen, setContributeOpen] = useState(false)
  const [submissionRefreshKey, setSubmissionRefreshKey] = useState(0)
  const [homepageLocationRequest, setHomepageLocationRequest] = useState({
    locationId: null as string | null,
    requestKey: 0,
  })
  const [navigateHomeSignal, setNavigateHomeSignal] = useState(0)
  const [mapSectionReachedTop, setMapSectionReachedTop] = useState(false)

  useEffect(() => {
    const NAVBAR_OFFSET_PX = 52

    const updateMapSectionTop = () => {
      const mapEl = mapSectionRef.current
      if (!mapEl) return

      const mapTop = mapEl.getBoundingClientRect().top
      setMapSectionReachedTop(mapTop <= NAVBAR_OFFSET_PX)
    }

    updateMapSectionTop()
    window.addEventListener('scroll', updateMapSectionTop, { passive: true })
    window.addEventListener('resize', updateMapSectionTop)
    return () => {
      window.removeEventListener('scroll', updateMapSectionTop)
      window.removeEventListener('resize', updateMapSectionTop)
    }
  }, [locationDetailOpen])

  const showArchiveNavbar = locationDetailOpen || !mapSectionReachedTop

  const handleNavigateHome = () => {
    setNavigateHomeSignal((n) => n + 1)
    setLocationDetailOpen(false)
    setHomepageLocationRequest((request) => ({
      locationId: null,
      requestKey: request.requestKey + 1,
    }))
    window.requestAnimationFrame(() => {
      homeSectionRef.current?.scrollIntoView({ behavior: 'smooth' })
    })
  }

  const handleOpenHomepageLocation = (locationId: string) => {
    setLocationDetailOpen(true)
    setHomepageLocationRequest((request) => ({
      locationId,
      requestKey: request.requestKey + 1,
    }))
    window.requestAnimationFrame(() => {
      mapSectionRef.current?.scrollIntoView({ behavior: 'smooth' })
    })
  }

  const handleLocationViewChange = useCallback((open: boolean) => {
    setLocationDetailOpen((was) => (was === open ? was : open))
    if (!open) {
      setHomepageLocationRequest((request) =>
        request.locationId === null ? request : { ...request, locationId: null },
      )
    }
  }, [])

  return (
    <LanguageProvider>
      <div className="relative min-h-screen w-full overflow-x-hidden bg-[#ffffff] text-[#0f172a] scroll-smooth">
        {showArchiveNavbar && (
          <>
            <CinematicNavbar
              onOpenLocation={handleOpenHomepageLocation}
              onOpenContribute={() => setContributeOpen(true)}
              onScrollToMap={() => mapSectionRef.current?.scrollIntoView({ behavior: 'smooth' })}
              onNavigateHome={handleNavigateHome}
            />
            <div className="h-12 w-full shrink-0" aria-hidden />
          </>
        )}
        <section
          ref={homeSectionRef}
          className={locationDetailOpen ? 'hidden' : 'min-h-screen w-full'}
        >
          <HomePage
            onOpenLocation={handleOpenHomepageLocation}
            onOpenContribute={() => setContributeOpen(true)}
            onScrollToMap={() => mapSectionRef.current?.scrollIntoView({ behavior: 'smooth' })}
          />
        </section>
        <section ref={mapSectionRef} className="min-h-screen w-full">
          <MapTour
            onBackToHome={handleNavigateHome}
            onLocationViewChange={handleLocationViewChange}
            navigateHomeSignal={navigateHomeSignal}
            submissionRefreshKey={submissionRefreshKey}
            directLocationId={homepageLocationRequest.locationId}
            directLocationRequestKey={homepageLocationRequest.requestKey}
          />
        </section>

        {contributeOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm">
            <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl">
              <button
                type="button"
                onClick={() => setContributeOpen(false)}
                className="absolute right-3 top-3 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#2563eb]/40 bg-[#ffffff] text-sm text-[#0f172a] transition-all duration-300 hover:scale-105 hover:bg-[#1d4ed8] hover:text-white"
                aria-label="Close contribution form"
              >
                ✕
              </button>
              <ContributionForm
                onSubmitted={() => {
                  setSubmissionRefreshKey((key) => key + 1)
                  setContributeOpen(false)
                }}
              />
            </div>
          </div>
        )}
      </div>
    </LanguageProvider>
  )
}


