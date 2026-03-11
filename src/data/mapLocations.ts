import type { MapLocation } from '../types/mapLocation'

/**
 * 2D map points for the simplified FeelSSP flow.
 * Replace liveViewUrl / soundscapeUrl with your own captures.
 */
export const mapLocations: MapLocation[] = [
  {
    id: 'apliu',
    nameEn: 'Apliu Street Electronics Market',
    nameZh: '鴨寮街電子市場',
    shortDescription: 'Vintage gadgets, cables, and busy bargaining stalls.',
    detailsEn:
      'Famous for second-hand electronics, old radios, cables, and bargain-hunting culture. Street energy peaks in the late afternoon.',
    xPercent: 45,
    yPercent: 55,
    liveViewUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1600&h=900&fit=crop',
    liveViewType: 'image',
    soundscapeUrl: 'https://cdn.freesound.org/previews/462/462087_8386274-lq.mp3',
  },
  {
    id: 'fuk-wing',
    nameEn: 'Fuk Wing Street (Toy Street)',
    nameZh: '福榮街（玩具街）',
    shortDescription: 'Hanging balloons, kites, and colorful toy chaos.',
    detailsEn:
      'A nostalgic strip packed with wholesale and retail toy shops. You will see hanging model kits, balloons, and old-school childhood favorites.',
    xPercent: 58,
    yPercent: 48,
    liveViewUrl: 'https://images.unsplash.com/photo-1513415564515-763d91423bdd?w=1600&h=900&fit=crop',
    liveViewType: 'image',
    soundscapeUrl: 'https://cdn.freesound.org/previews/415/415209_5121236-lq.mp3',
  },
  {
    id: 'pei-ho',
    nameEn: 'Pei Ho Street Wet Market',
    nameZh: '北河街街市',
    shortDescription: 'Food stalls, fish vendors, and loud morning bustle.',
    detailsEn:
      'Traditional wet market atmosphere with fishmongers, produce stalls, and constant movement. Best experienced in morning and lunchtime hours.',
    xPercent: 40,
    yPercent: 64,
    liveViewUrl: 'https://images.unsplash.com/photo-1504457047772-27faf1c00561?w=1600&h=900&fit=crop',
    liveViewType: 'image',
    soundscapeUrl: 'https://cdn.freesound.org/previews/521/521974_7724935-lq.mp3',
  },
  {
    id: 'golden',
    nameEn: 'Golden Computer Centre Entrance',
    nameZh: '黃金電腦商場入口',
    shortDescription: 'Neon glow, PC shops, keyboards, and arcade energy.',
    detailsEn:
      'A landmark tech destination for gamers and PC builders, with dense rows of stores and a distinct electronic buzz at the entrance.',
    xPercent: 52,
    yPercent: 40,
    liveViewUrl: '/images/Sham-Shui-Po-MAIN.png',
    liveViewType: 'image',
    soundscapeUrl: 'https://cdn.freesound.org/previews/462/462087_8386274-lq.mp3',
  },
]

