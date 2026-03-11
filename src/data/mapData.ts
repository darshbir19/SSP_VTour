export interface MapPin {
  nodeId: string
  label: string
  position: [number, number, number]
}

export interface MapBuilding {
  position: [number, number, number]
  size: [number, number, number]
  color: string
  acUnits: number
}

export interface MapGrass {
  position: [number, number, number]
  size: [number, number, number]
}

/**
 * 5 blue pins at real Sham Shui Po locations.
 * nodeId must match the immersive node id in data/nodes.ts.
 */
export const mapPins: MapPin[] = [
  { nodeId: 'apliu-day', label: 'Apliu St 鴨寮街', position: [-5, 5, 0] },
  { nodeId: 'fuk-wing', label: 'Fuk Wing St 福榮街', position: [8, 5, -12] },
  { nodeId: 'pei-ho', label: 'Pei Ho St 北河街', position: [-15, 5, 15] },
  { nodeId: 'golden-arcade', label: 'Golden Computer', position: [20, 5, 8] },
  { nodeId: 'apliu-night', label: 'Apliu Night 霓虹夜', position: [5, 5, 25] },
]

/**
 * 18 tightly-packed narrow tall buildings — classic SSP tong-lau density.
 * Heights 8–25, widths/depths 2.5–4.
 * Colors: beige / light pink / off-white / gray residential palette.
 * Replace meshStandardMaterial color with real facade screenshots from Google Street View.
 */
export const buildings: MapBuilding[] = [
  // ── Apliu St cluster (around [-5, 0, 0]) ──
  { position: [-9, 0, -3], size: [3, 20, 3.5], color: '#e8d5c0', acUnits: 3 },
  { position: [-9, 0, 3], size: [2.5, 15, 3], color: '#e0c8c8', acUnits: 2 },
  { position: [-1, 0, -3], size: [3.5, 23, 3.5], color: '#d8d0c8', acUnits: 4 },
  { position: [-1, 0, 4], size: [3, 17, 3], color: '#b0b0b8', acUnits: 3 },

  // ── Fuk Wing cluster (around [8, 0, -12]) ──
  { position: [5, 0, -16], size: [3, 14, 3.5], color: '#dbc9a8', acUnits: 2 },
  { position: [4, 0, -8], size: [2.5, 25, 3], color: '#d8bfbf', acUnits: 4 },
  { position: [12, 0, -16], size: [3, 18, 3], color: '#e0dbd0', acUnits: 3 },
  { position: [12, 0, -8], size: [3.5, 11, 3.5], color: '#a8a8b0', acUnits: 2 },

  // ── Pei Ho cluster (around [-15, 0, 15]) ──
  { position: [-19, 0, 11], size: [3, 13, 3.5], color: '#e5cece', acUnits: 3 },
  { position: [-19, 0, 18], size: [2.5, 21, 3], color: '#d4c4a8', acUnits: 4 },
  { position: [-11, 0, 11], size: [3, 9, 3.5], color: '#bfbfbf', acUnits: 2 },
  { position: [-11, 0, 19], size: [3, 24, 3], color: '#e8d5c0', acUnits: 3 },

  // ── Golden Computer cluster (around [20, 0, 8]) ──
  { position: [17, 0, 4], size: [3, 12, 3.5], color: '#e0c8c8', acUnits: 2 },
  { position: [17, 0, 12], size: [2.5, 16, 3], color: '#d8d0c8', acUnits: 3 },
  { position: [24, 0, 4], size: [3, 22, 3.5], color: '#b0b0b8', acUnits: 4 },
  { position: [24, 0, 12], size: [3.5, 8, 3], color: '#dbc9a8', acUnits: 2 },

  // ── Night Neon / connecting area (around [5, 0, 25]) ──
  { position: [1, 0, 22], size: [3, 19, 3.5], color: '#d8bfbf', acUnits: 3 },
  { position: [9, 0, 28], size: [2.5, 13, 3], color: '#e0dbd0', acUnits: 2 },
]

/** Tiny green street-garden patches scattered between buildings */
export const grassPatches: MapGrass[] = [
  { position: [-5, 0.03, 8], size: [2, 0.06, 1.5] },
  { position: [14, 0.03, -4], size: [1.5, 0.06, 2] },
  { position: [-14, 0.03, 6], size: [2, 0.06, 1.5] },
  { position: [10, 0.03, 18], size: [1.5, 0.06, 2] },
  { position: [-7, 0.03, -8], size: [2, 0.06, 1.5] },
  { position: [20, 0.03, -3], size: [1.5, 0.06, 2] },
  { position: [0, 0.03, 15], size: [2, 0.06, 1.5] },
  { position: [-20, 0.03, -2], size: [1.5, 0.06, 2] },
]
