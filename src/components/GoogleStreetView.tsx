import { useEffect, useRef, useState } from 'react'

type GoogleWindow = Window & {
  google?: {
    maps?: {
      StreetViewPanorama: new (
        container: HTMLElement,
        options: Record<string, unknown>,
      ) => unknown
    }
  }
}

let streetViewScriptPromise: Promise<void> | null = null

function loadGoogleMapsScript(apiKey: string): Promise<void> {
  if (streetViewScriptPromise) return streetViewScriptPromise

  streetViewScriptPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      'script[data-google-maps-street-view="true"]',
    )
    if (existing) {
      existing.addEventListener('load', () => resolve(), { once: true })
      existing.addEventListener('error', () => reject(new Error('Failed to load Google Maps API')), {
        once: true,
      })
      return
    }

    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`
    script.async = true
    script.defer = true
    script.dataset.googleMapsStreetView = 'true'
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load Google Maps API'))
    document.head.appendChild(script)
  })

  return streetViewScriptPromise
}

interface GoogleStreetViewProps {
  lat: number
  lng: number
  heading?: number
  pitch?: number
  zoom?: number
}

export function GoogleStreetView({ lat, lng, heading = 90, pitch = 0, zoom = 0 }: GoogleStreetViewProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
    if (!apiKey) {
      setError('Missing Google Maps key. Add VITE_GOOGLE_MAPS_API_KEY to .env.local')
      return
    }

    loadGoogleMapsScript(apiKey)
      .then(() => {
        const googleWindow = window as GoogleWindow
        if (!containerRef.current || !googleWindow.google?.maps?.StreetViewPanorama) {
          setError('Google Maps Street View did not initialize.')
          return
        }

        new googleWindow.google.maps.StreetViewPanorama(containerRef.current, {
          position: { lat, lng },
          pov: { heading, pitch },
          zoom,
          motionTracking: false,
          showRoadLabels: true,
          addressControl: false,
          fullscreenControl: true,
        })
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Street View failed to load.')
      })
  }, [heading, lat, lng, pitch, zoom])

  if (error) {
    return (
      <div className="flex h-full min-h-[280px] items-center justify-center rounded-lg border border-[#2563eb]/50 bg-[#ffffff] p-5 text-center text-sm text-[#0f172a]">
        {error}
      </div>
    )
  }

  return <div ref={containerRef} className="h-full min-h-[280px] w-full" />
}



