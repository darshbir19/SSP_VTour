import { useEffect, useMemo, useRef, useState } from 'react'
import { mapLocations } from '../data/mapLocations'
import type { MapLocation } from '../types/mapLocation'
import { GoogleStreetView } from './GoogleStreetView'

interface MapTourProps {
  onBack: () => void
}

const TILE_SIZE = 256
const TILE_GRID = 5
const TILE_ZOOM = 17
const SSP_CENTER = { lat: 22.3308, lon: 114.1622 }
const HK_IMAGERY_TILE_URL =
  'https://mapapi.geodata.gov.hk/gs/api/v1.0.0/xyz/imagery/WGS84/{z}/{x}/{y}.png'

interface TileCoord {
  x: number
  y: number
  key: string
  url: string
}

function lon2tileX(lon: number, zoom: number) {
  return Math.floor(((lon + 180) / 360) * 2 ** zoom)
}

function lat2tileY(lat: number, zoom: number) {
  const latRad = (lat * Math.PI) / 180
  return Math.floor(((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * 2 ** zoom)
}

function makeTileUrl(z: number, x: number, y: number) {
  return HK_IMAGERY_TILE_URL.replace('{z}', String(z)).replace('{x}', String(x)).replace('{y}', String(y))
}

function buildShamShuiPoTiles(): TileCoord[] {
  const centerX = lon2tileX(SSP_CENTER.lon, TILE_ZOOM)
  const centerY = lat2tileY(SSP_CENTER.lat, TILE_ZOOM)
  const half = Math.floor(TILE_GRID / 2)
  const tiles: TileCoord[] = []

  for (let row = 0; row < TILE_GRID; row += 1) {
    for (let col = 0; col < TILE_GRID; col += 1) {
      const x = centerX - half + col
      const y = centerY - half + row
      tiles.push({
        x: col,
        y: row,
        key: `${TILE_ZOOM}-${x}-${y}`,
        url: makeTileUrl(TILE_ZOOM, x, y),
      })
    }
  }

  return tiles
}

const shamShuiPoTiles = buildShamShuiPoTiles()

export function MapTour({ onBack }: MapTourProps) {
  const [activeId, setActiveId] = useState<string>(mapLocations[0].id)
  const [view, setView] = useState<'map' | 'location'>('map')
  const [loadedTiles, setLoadedTiles] = useState(0)

  const activeLocation = useMemo<MapLocation>(
    () => mapLocations.find((location) => location.id === activeId) ?? mapLocations[0],
    [activeId],
  )

  if (view === 'location') {
    return (
      <LocationPage
        location={activeLocation}
        onBackToMap={() => setView('map')}
      />
    )
  }

  return (
    <div className="h-full w-full bg-[#07080f] px-4 py-4 sm:px-6 sm:py-6">
      <div className="mx-auto flex h-full max-w-7xl flex-col gap-4 lg:flex-row">
        <section className="relative min-h-[380px] flex-1 overflow-hidden rounded-xl border border-white/10 bg-[#101421]">
          <div
            className="absolute left-1/2 top-1/2 grid -translate-x-1/2 -translate-y-1/2"
            style={{
              gridTemplateColumns: `repeat(${TILE_GRID}, ${TILE_SIZE}px)`,
              gridTemplateRows: `repeat(${TILE_GRID}, ${TILE_SIZE}px)`,
              width: TILE_GRID * TILE_SIZE,
              height: TILE_GRID * TILE_SIZE,
            }}
          >
            {shamShuiPoTiles.map((tile) => (
              <img
                key={tile.key}
                src={tile.url}
                alt=""
                loading="eager"
                onLoad={() => setLoadedTiles((n) => n + 1)}
                className="h-64 w-64"
                style={{
                  gridColumnStart: tile.x + 1,
                  gridRowStart: tile.y + 1,
                  imageRendering: 'auto',
                }}
              />
            ))}
          </div>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/45" />

          <div className="absolute left-4 top-4 z-10 rounded bg-black/50 px-3 py-2 text-xs tracking-wide text-slate-200">
            Real Sham Shui Po map · Click a pin
          </div>

          {mapLocations.map((location) => {
            const active = activeId === location.id
            return (
              <button
                key={location.id}
                onClick={() => {
                  setActiveId(location.id)
                  setView('location')
                }}
                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                style={{ left: `${location.xPercent}%`, top: `${location.yPercent}%` }}
                aria-label={location.nameEn}
              >
                <span
                  className={`block h-4 w-4 rounded-full border border-white/80 transition-all ${
                    active
                      ? 'bg-neon-green shadow-[0_0_16px_rgba(60,255,143,0.9)]'
                      : 'bg-neon-red shadow-[0_0_12px_rgba(255,51,85,0.7)]'
                  }`}
                />
                <span className="mt-2 block rounded bg-black/70 px-2 py-1 text-[11px] text-slate-100">
                  {location.nameEn}
                </span>
              </button>
            )
          })}

          <a
            className="absolute bottom-3 right-3 z-10 rounded bg-black/50 px-2 py-1 text-[10px] text-slate-300 underline underline-offset-2"
            href="https://geodata.gov.hk/gs/"
            target="_blank"
            rel="noreferrer"
          >
            Map data © Lands Department, HKSAR
          </a>

          {loadedTiles === 0 && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/70 text-sm text-slate-200">
              Loading Sham Shui Po map...
            </div>
          )}
        </section>

        <aside className="flex w-full flex-col gap-3 rounded-xl border border-white/10 bg-[#121621] p-4 lg:w-[420px]">
          <h2 className="text-xl font-semibold text-white">Select a Street Point</h2>
          <p className="text-sm text-slate-300">
            Click any of the 4 map pointers to open a dedicated location page with its live view and
            soundscape.
          </p>
          <div className="mt-2 rounded-md border border-white/10 bg-black/20 p-3 text-sm text-slate-300">
            Current selection: <span className="text-white">{activeLocation.nameEn}</span>
          </div>
          <button
            onClick={onBack}
            className="mt-auto cursor-pointer rounded-lg border border-white/20 px-4 py-2 text-sm text-white hover:bg-white/10"
          >
            Back to Home
          </button>
        </aside>
      </div>
    </div>
  )
}

interface LocationPageProps {
  location: MapLocation
  onBackToMap: () => void
}

function LocationPage({
  location,
  onBackToMap,
}: LocationPageProps) {
  const [masterVolume, setMasterVolume] = useState(0.8)
  const [muted, setMuted] = useState(false)
  const [activeSoundId, setActiveSoundId] = useState<string | null>(null)
  const soundRefs = useRef<Record<string, HTMLAudioElement | null>>({})

  const demoSounds = [
    {
      id: 'crowd-chatter',
      title: 'Street Crowd Chatter',
      subtitle: 'Voices and movement',
      url: 'https://cdn.freesound.org/previews/462/462087_8386274-lq.mp3',
    },
    {
      id: 'vendor-calls',
      title: 'Vendor Calls',
      subtitle: 'Market selling voice',
      url: 'https://cdn.freesound.org/previews/415/415209_5121236-lq.mp3',
    },
    {
      id: 'electronics-beeps',
      title: 'Electronics Beeps',
      subtitle: 'Arcade gadget sounds',
      url: 'https://cdn.freesound.org/previews/521/521974_7724935-lq.mp3',
    },
    {
      id: 'footsteps',
      title: 'Footsteps + Pavement',
      subtitle: 'Busy walking rhythm',
      url: 'https://cdn.freesound.org/previews/250/250200_4486188-lq.mp3',
    },
    {
      id: 'cantonese-radio',
      title: 'Cantonese Radio Texture',
      subtitle: 'Shopfront broadcast vibe',
      url: 'https://cdn.freesound.org/previews/354/354563_4748617-lq.mp3',
    },
  ]

  useEffect(() => {
    Object.values(soundRefs.current).forEach((audio) => {
      if (!audio) return
      audio.volume = muted ? 0 : masterVolume
    })
  }, [masterVolume, muted])

  useEffect(() => {
    return () => {
      Object.values(soundRefs.current).forEach((audio) => {
        if (!audio) return
        audio.pause()
        audio.currentTime = 0
      })
    }
  }, [])

  const handleToggleSound = async (soundId: string) => {
    if (activeSoundId === soundId) {
      const playing = soundRefs.current[soundId]
      if (playing) {
        playing.pause()
        playing.currentTime = 0
      }
      setActiveSoundId(null)
      return
    }

    Object.entries(soundRefs.current).forEach(([id, audio]) => {
      if (!audio) return
      if (id !== soundId) {
        audio.pause()
        audio.currentTime = 0
      }
    })

    const target = soundRefs.current[soundId]
    if (!target) return
    target.volume = muted ? 0 : masterVolume
    try {
      await target.play()
      setActiveSoundId(soundId)
    } catch {
      setActiveSoundId(null)
    }
  }

  return (
    <div className="h-full w-full overflow-auto bg-[#06080f] px-4 py-5 sm:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs tracking-widest text-slate-400 uppercase">Location Page</p>
            <h2 className="text-2xl font-semibold text-white">{location.nameEn}</h2>
            <p className="text-sm text-slate-300">{location.nameZh}</p>
          </div>
          <button
            onClick={onBackToMap}
            className="cursor-pointer rounded-lg border border-white/20 px-4 py-2 text-sm text-white hover:bg-white/10"
          >
            ← Back to Map
          </button>
        </div>

        <div className="w-full overflow-hidden rounded-lg bg-black">
          {location.streetView ? (
            <GoogleStreetView
              lat={location.streetView.lat}
              lng={location.streetView.lng}
              heading={location.streetView.heading}
              pitch={location.streetView.pitch}
              zoom={location.streetView.zoom}
            />
          ) : location.liveViewType === 'video' ? (
            <video
              src={location.liveViewUrl}
              controls
              autoPlay
              muted
              loop
              className="h-full min-h-[380px] w-full object-cover"
            />
          ) : (
            <img
              src={location.liveViewUrl}
              alt={location.nameEn}
              className="h-full min-h-[380px] w-full object-cover"
            />
          )}
        </div>

        <div className="w-full py-2">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm text-slate-300">{location.shortDescription}</p>
              <p className="mt-1 text-sm leading-relaxed text-slate-400">{location.detailsEn}</p>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-black/25 px-3 py-2">
              <button
                onClick={() => setMuted((m) => !m)}
                className="cursor-pointer rounded border border-white/20 px-3 py-1 text-xs text-white hover:bg-white/10"
              >
                {muted ? 'Unmute' : 'Mute'}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={masterVolume}
                onChange={(event) => setMasterVolume(Number(event.target.value))}
                className="w-36 accent-neon-green"
              />
            </div>
          </div>

          <h3 className="mb-3 text-sm font-semibold tracking-wider text-neon-green uppercase">
            Demo Sounds
          </h3>

          <div className="flex flex-col gap-3">
            {demoSounds.map((sound) => {
              const isActive = activeSoundId === sound.id
              return (
                <button
                  key={sound.id}
                  onClick={() => void handleToggleSound(sound.id)}
                  className={`group cursor-pointer rounded-lg border p-3 text-left transition ${
                    isActive
                      ? 'border-neon-green bg-neon-green/10 shadow-[0_0_16px_rgba(60,255,143,0.25)]'
                      : 'border-white/10 bg-black/20 hover:border-white/30'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs ${
                        isActive
                          ? 'border-neon-green text-neon-green bg-neon-green/10'
                          : 'border-white/25 text-slate-200 bg-white/5'
                      }`}
                      aria-hidden="true"
                    >
                      {isActive ? '■' : '▶'}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white">{sound.title}</p>
                      <p className="mt-1 text-xs text-slate-400">{sound.subtitle}</p>
                    </div>
                  </div>
                  <p className="mt-2 text-xs font-semibold text-neon-yellow">
                    {isActive ? 'Playing - click to stop' : 'Click to play'}
                  </p>
                  <audio
                    ref={(el) => {
                      soundRefs.current[sound.id] = el
                    }}
                    src={sound.url}
                    loop
                    preload="none"
                  />
                </button>
              )
            })}
          </div>
          <p className="mt-3 text-xs text-slate-400">Headphones recommended for stronger immersion.</p>
        </div>
      </div>
    </div>
  )
}

