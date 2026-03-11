import { useEffect, useState, useCallback } from 'react'
import { useViewStore } from '../../store/viewStore'
interface TwoDPin {
  id: string
  nodeId: string
  label: string
  x: number
  y: number
}

const TRANSITION_MS = 700
const TILE_SIZE = 256
const TILE_GRID = 6
const TILE_ZOOM = 17
const SSP_CENTER = { lat: 22.3308, lon: 114.1622 }
const IMAGERY_TILE_URL =
  'https://mapapi.geodata.gov.hk/gs/api/v1.0.0/xyz/imagery/WGS84/{z}/{x}/{y}.png'

const mapPins: TwoDPin[] = [
  { id: 'apliu', nodeId: 'apliu-day', label: 'Apliu St 鴨寮街', x: 49, y: 54 },
  { id: 'fuk-wing', nodeId: 'fuk-wing', label: 'Fuk Wing St 福榮街', x: 56, y: 50 },
  { id: 'pei-ho', nodeId: 'pei-ho', label: 'Pei Ho St 北河街', x: 44, y: 58 },
  { id: 'golden', nodeId: 'golden-arcade', label: 'Golden Computer 金電腦商場', x: 51, y: 43 },
  { id: 'mtr-a2', nodeId: 'apliu-night', label: 'MTR Exit A2 港鐵A2出口', x: 53, y: 61 },
  { id: 'yen-chow', nodeId: 'apliu-day', label: 'Yen Chow St 欽州街', x: 41, y: 49 },
]

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
  return IMAGERY_TILE_URL.replace('{z}', String(z)).replace('{x}', String(x)).replace('{y}', String(y))
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

// ─── Exported Map Scene ──────────────────────────────
interface MapSceneProps {
  onEnterImmersive: (nodeId: string) => void
}

export function MapScene({ onEnterImmersive }: MapSceneProps) {
  const [fading, setFading] = useState(false)
  const [visible, setVisible] = useState(false)
  const [selectedPin, setSelectedPin] = useState<string | null>(null)
  const [loadedTiles, setLoadedTiles] = useState(0)
  const backToLanding = useViewStore((s) => s.backToLanding)

  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(id)
  }, [])

  const handlePinClick = useCallback(
    (nodeId: string, pinId: string) => {
      if (fading) return
      setSelectedPin(pinId)
      setFading(true)
      window.setTimeout(() => onEnterImmersive(nodeId), TRANSITION_MS)
    },
    [fading, onEnterImmersive],
  )

  const cancelTransition = useCallback(() => {
    if (fading) return
    setSelectedPin(null)
  }, [fading])

  const handleTileLoaded = useCallback(() => {
    setLoadedTiles((n) => n + 1)
  }, [])

  const handleBack = useCallback(() => {
    if (fading) return
    cancelTransition()
    backToLanding()
  }, [backToLanding, cancelTransition, fading])

  const overlayClass = `pointer-events-none absolute inset-0 z-10 transition-all duration-700 ${
    selectedPin ? 'scale-[1.03] opacity-95' : 'scale-100 opacity-100'
  }`
  const mapLoaded = loadedTiles > 0

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#07070d]">
      <div
        className={`absolute top-1/2 left-1/2 grid -translate-x-1/2 -translate-y-1/2 transition-transform duration-700 ${
          selectedPin ? 'scale-[1.06]' : 'scale-100'
        }`}
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
            onLoad={handleTileLoaded}
            loading="eager"
            className="h-64 w-64"
            style={{
              gridColumnStart: tile.x + 1,
              gridRowStart: tile.y + 1,
              imageRendering: 'auto',
            }}
          />
        ))}
      </div>

      <div className="absolute inset-0">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#05050a]/70 via-[#07070d]/45 to-[#05050a]/80" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_20%,rgba(255,40,40,0.2),transparent_32%),radial-gradient(circle_at_82%_24%,rgba(34,197,94,0.18),transparent_30%),radial-gradient(circle_at_52%_72%,rgba(34,211,238,0.12),transparent_35%)]" />
      </div>

      <div className={overlayClass}>
        <div className="pointer-events-auto absolute top-5 left-1/2 -translate-x-1/2 text-center sm:top-6">
          <h2 className="font-neon text-2xl font-bold tracking-wide text-white drop-shadow-[0_0_18px_rgba(34,211,238,0.35)] sm:text-3xl">
            深水埗 <span className="text-cyan-300">Sham Shui Po</span>
          </h2>
          <p className="mt-1 text-[11px] tracking-[0.24em] text-slate-200/90 uppercase sm:text-xs">
            Map Mode - Click a pin to enter 360
          </p>
        </div>

        {mapPins.map((pin) => {
          const active = selectedPin === pin.id
          return (
            <button
              key={pin.id}
              onClick={() => handlePinClick(pin.nodeId, pin.id)}
              className={`group pointer-events-auto absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer ${
                fading ? 'pointer-events-none' : ''
              }`}
              style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
              aria-label={pin.label}
            >
              <span
                className={`block h-4 w-4 rounded-full border border-cyan-100/80 bg-cyan-300 shadow-[0_0_0_2px_rgba(6,182,212,0.25),0_0_14px_rgba(34,211,238,0.95),0_0_30px_rgba(56,189,248,0.65)] transition-all duration-300 ${
                  active ? 'scale-125' : 'group-hover:scale-125'
                }`}
              />
              <span className="pointer-events-none absolute top-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-slate-400/40 bg-[#090b14]/85 px-2.5 py-1 text-[10px] font-medium text-cyan-100 shadow-[0_0_12px_rgba(34,211,238,0.2)] backdrop-blur sm:text-xs">
                {pin.label}
              </span>
            </button>
          )
        })}

        <button
          onClick={handleBack}
          className="pointer-events-auto absolute bottom-6 left-6 flex cursor-pointer items-center gap-2 rounded-lg border border-slate-500/60 bg-ssp-panel/85 px-4 py-2 text-sm text-slate-100 backdrop-blur transition hover:border-cyan-400/70 hover:text-cyan-200"
        >
          ← Back
        </button>

        <div className="pointer-events-auto absolute right-4 bottom-4 max-w-xs rounded-lg border border-slate-600/70 bg-[#0a0d16]/85 px-3 py-2 text-[11px] text-slate-300 backdrop-blur sm:right-6 sm:bottom-6 sm:max-w-sm sm:text-xs">
          Basemap: HK GeoData Store Imagery API (Lands Department). Pins use approximate positions.
        </div>
        <a
          className="pointer-events-auto absolute right-4 bottom-20 rounded border border-slate-600/70 bg-[#0a0d16]/80 px-2 py-1 text-[10px] text-slate-300 underline underline-offset-2 backdrop-blur hover:text-white sm:right-6 sm:bottom-20"
          href="https://geodata.gov.hk/gs/"
          target="_blank"
          rel="noreferrer"
        >
          Map data © Lands Department, HKSAR
        </a>
      </div>

      <div
        className={`pointer-events-none absolute inset-0 z-50 bg-black transition-opacity duration-700 ${
          !visible || !mapLoaded || fading ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  )
}
