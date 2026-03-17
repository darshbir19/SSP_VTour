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
    summary: 'Apliu Street – A legendary electronics market known for bargains and repair culture.',
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
    summary: 'Fuk Wing Street – A nostalgic toy district full of color and childhood memory.',
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
    summary: 'Pei Ho Street – A traditional wet market pulse of daily neighborhood life.',
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
    summary:
      'Golden Computer Arcade – A dense hub for affordable electronics and gaming culture.',
    shortDescription: 'Neon glow, PC shops, keyboards, and arcade energy.',
    detailsEn:
      'A landmark tech destination for gamers and PC builders, with dense rows of stores and a distinct electronic buzz at the entrance.',
    xPercent: 52,
    yPercent: 40,
    liveViewUrl:
      'https://www.google.com/maps/embed?pb=!4v1773712876342!6m8!1m7!1sCAoSFkNJSE0wb2dLRUlDQWdJQzRuS1AxWXc.!2m2!1d22.33169912593825!2d114.1625997870271!3f334.74807585572864!4f20.458204391868577!5f0.7820865974627469',
    liveViewType: 'embed',
    soundscapeUrl: 'https://cdn.freesound.org/previews/462/462087_8386274-lq.mp3',
  },
]

