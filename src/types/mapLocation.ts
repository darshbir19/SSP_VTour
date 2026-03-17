export interface MapLocation {
  id: string
  nameEn: string
  nameZh: string
  summary: string
  shortDescription: string
  detailsEn: string
  xPercent: number
  yPercent: number
  liveViewUrl: string
  liveViewType: 'image' | 'video' | 'embed'
  soundscapeUrl: string
  streetView?: {
    lat: number
    lng: number
    heading?: number
    pitch?: number
    zoom?: number
  }
}

