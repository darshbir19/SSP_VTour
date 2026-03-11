export interface NodePositionalAudio {
  id: string
  label: string
  labelZh: string
  url: string
  /** 3D position [x, y, z] relative to the scene origin */
  position: [number, number, number]
  refDistance?: number
  rolloffFactor?: number
  volume?: number
}

export interface NodeHotspot {
  targetNodeId: string
  /** 3D position of the clickable portal in the scene */
  position: [number, number, number]
  labelEn: string
  labelZh: string
}

export interface ExperienceNode {
  id: string
  nameEn: string
  nameZh: string
  descriptionEn: string
  descriptionZh: string
  /** Equirectangular 360° panorama image URL */
  panoramaUrl: string
  /** Thumbnail for the bottom nav */
  thumbnailUrl: string
  /** Looping ambient background audio URL */
  ambientLoopUrl: string
  /** Positional audio sources placed in 3D space */
  audioSources: NodePositionalAudio[]
  /** Portals / links to other nodes */
  hotspots: NodeHotspot[]
  /** Optional info popup content */
  infoEn?: string
  infoZh?: string
  /** Gradient fallback colour when panorama is loading */
  accentColor: string
}
