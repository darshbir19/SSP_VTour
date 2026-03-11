import type { ExperienceNode } from '../types/nodes'

/**
 * FeelSSP — Sham Shui Po sensory tour node data.
 *
 * HOW TO ADD YOUR OWN ASSETS
 * ─────────────────────────────────────────────
 * 1. Place 360° equirectangular images (ideally 4096×2048 JPEG) in  public/panoramas/
 * 2. Place audio files (MP3 or OGG) in  public/audio/
 * 3. Update the URLs below to point at your files, e.g.  "/panoramas/apliu-day.jpg"
 *
 * Placeholder URLs below use freely-available demo images so the app boots immediately.
 * Replace them with real Sham Shui Po captures from 360cities.net, Google Street View
 * exports, or your own Ricoh Theta / Insta360 shots.
 *
 * For audio, try:
 *   - https://freetousesounds.bandcamp.com/album/market-sounds-hong-kong-sham-shui-po-market-ambience
 *   - https://freesound.org  (search "hong kong market", "street vendor", "cantonese")
 */

export const nodes: ExperienceNode[] = [
  {
    id: 'apliu-day',
    nameEn: 'Apliu Street Electronics Market',
    nameZh: '鴨寮街電子市場',
    descriptionEn: 'Bustling daytime stalls overflowing with vintage gadgets, cables, and haggling uncles.',
    descriptionZh: '熙熙攘攘的日間攤檔，滿佈舊電子產品、電線與討價還價的大叔。',
    panoramaUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=4096&h=2048&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=200&h=120&fit=crop',
    ambientLoopUrl: 'https://cdn.freesound.org/previews/462/462087_8386274-lq.mp3',
    audioSources: [
      {
        id: 'apliu-day-vendor1',
        label: 'Vendor haggling',
        labelZh: '小販討價還價',
        url: 'https://cdn.freesound.org/previews/462/462087_8386274-lq.mp3',
        position: [5, 0, -3],
        refDistance: 2,
        rolloffFactor: 1.5,
      },
      {
        id: 'apliu-day-radio',
        label: 'Radio playing',
        labelZh: '收音機播放',
        url: 'https://cdn.freesound.org/previews/415/415209_5121236-lq.mp3',
        position: [-4, 1, 2],
        refDistance: 3,
        rolloffFactor: 1,
      },
      {
        id: 'apliu-day-beeps',
        label: 'Electronic beeps',
        labelZh: '電子嗶嗶聲',
        url: 'https://cdn.freesound.org/previews/521/521974_7724935-lq.mp3',
        position: [2, 0, 5],
        refDistance: 2,
        rolloffFactor: 2,
      },
    ],
    hotspots: [
      { targetNodeId: 'apliu-night', position: [0, 0, -8], labelEn: 'Apliu Night →', labelZh: '鴨寮街夜景 →' },
      { targetNodeId: 'fuk-wing', position: [-7, 0, -3], labelEn: '← Toy Street', labelZh: '← 玩具街' },
    ],
    infoEn: 'Apliu Street is Hong Kong\'s legendary flea market for second-hand electronics, dating back to the 1930s. Bargain hard!',
    infoZh: '鴨寮街是香港傳奇的二手電子產品跳蚤市場，可追溯至1930年代。記得講價！',
    accentColor: '#ffd54a',
  },
  {
    id: 'fuk-wing',
    nameEn: 'Fuk Wing Street (Toy Street)',
    nameZh: '福榮街（玩具街）',
    descriptionEn: 'Colorful kites, balloons, and cheap toys dangling from every stall — a childhood dream.',
    descriptionZh: '色彩繽紛的風箏、氣球與便宜玩具掛滿每個攤位——兒時的夢。',
    panoramaUrl: 'https://images.unsplash.com/photo-1513415564515-763d91423bdd?w=4096&h=2048&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1513415564515-763d91423bdd?w=200&h=120&fit=crop',
    ambientLoopUrl: 'https://cdn.freesound.org/previews/462/462087_8386274-lq.mp3',
    audioSources: [
      {
        id: 'fuk-wing-kids',
        label: 'Children laughing',
        labelZh: '兒童笑聲',
        url: 'https://cdn.freesound.org/previews/415/415209_5121236-lq.mp3',
        position: [3, 1, -2],
        refDistance: 3,
        rolloffFactor: 1,
      },
      {
        id: 'fuk-wing-music',
        label: 'Toy music box',
        labelZh: '玩具音樂盒',
        url: 'https://cdn.freesound.org/previews/521/521974_7724935-lq.mp3',
        position: [-3, 0.5, 4],
        refDistance: 2,
        rolloffFactor: 1.5,
      },
    ],
    hotspots: [
      { targetNodeId: 'apliu-day', position: [7, 0, 2], labelEn: 'Apliu Street →', labelZh: '鴨寮街 →' },
      { targetNodeId: 'pei-ho', position: [-6, 0, -4], labelEn: '← Wet Market', labelZh: '← 街市' },
    ],
    infoEn: 'Fuk Wing Street has been the go-to wholesale toy hub since the 1950s. Great for quirky souvenirs.',
    infoZh: '福榮街自1950年代起就是批發玩具集散地。非常適合買古怪紀念品。',
    accentColor: '#ff3355',
  },
  {
    id: 'apliu-night',
    nameEn: 'Apliu Street Night',
    nameZh: '鴨寮街夜景',
    descriptionEn: 'Neon lights reflecting on wet streets, the evening crowd buzzing with energy.',
    descriptionZh: '霓虹燈映照在濕漉漉的街道上，夜晚人群充滿活力。',
    panoramaUrl: 'https://images.unsplash.com/photo-1536599018102-9f803c979981?w=4096&h=2048&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1536599018102-9f803c979981?w=200&h=120&fit=crop',
    ambientLoopUrl: 'https://cdn.freesound.org/previews/462/462087_8386274-lq.mp3',
    audioSources: [
      {
        id: 'apliu-night-chatter',
        label: 'Evening crowd chatter',
        labelZh: '夜間人群交談',
        url: 'https://cdn.freesound.org/previews/462/462087_8386274-lq.mp3',
        position: [0, 0, -5],
        refDistance: 4,
        rolloffFactor: 1,
      },
      {
        id: 'apliu-night-footsteps',
        label: 'Footsteps on wet ground',
        labelZh: '踩在濕地上的腳步聲',
        url: 'https://cdn.freesound.org/previews/415/415209_5121236-lq.mp3',
        position: [3, -0.5, 3],
        refDistance: 2,
        rolloffFactor: 2,
      },
      {
        id: 'apliu-night-neon',
        label: 'Neon buzz',
        labelZh: '霓虹燈嗡嗡聲',
        url: 'https://cdn.freesound.org/previews/521/521974_7724935-lq.mp3',
        position: [-2, 3, 0],
        refDistance: 3,
        rolloffFactor: 1.5,
      },
    ],
    hotspots: [
      { targetNodeId: 'apliu-day', position: [0, 0, 8], labelEn: '← Apliu Day', labelZh: '← 鴨寮街日景' },
      { targetNodeId: 'golden-arcade', position: [-7, 0, -2], labelEn: 'Golden Arcade →', labelZh: '黃金商場 →' },
    ],
    infoEn: 'After dark, Apliu Street transforms — neon signs flicker to life and bargain hunters come out in force.',
    infoZh: '天黑後，鴨寮街搖身一變——霓虹招牌亮起，淘寶客蜂擁而至。',
    accentColor: '#3cff8f',
  },
  {
    id: 'pei-ho',
    nameEn: 'Pei Ho Street Wet Market',
    nameZh: '北河街街市',
    descriptionEn: 'Morning bustle: food vendors, fresh fish splashing, and the aroma of roast meats.',
    descriptionZh: '早晨的喧鬧：食物攤販、鮮魚濺水聲、燒味的香氣。',
    panoramaUrl: 'https://images.unsplash.com/photo-1504457047772-27faf1c00561?w=4096&h=2048&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1504457047772-27faf1c00561?w=200&h=120&fit=crop',
    ambientLoopUrl: 'https://cdn.freesound.org/previews/462/462087_8386274-lq.mp3',
    audioSources: [
      {
        id: 'pei-ho-wok',
        label: 'Sizzling wok',
        labelZh: '鑊氣聲',
        url: 'https://cdn.freesound.org/previews/415/415209_5121236-lq.mp3',
        position: [4, 0, -2],
        refDistance: 2,
        rolloffFactor: 1.5,
      },
      {
        id: 'pei-ho-vendor',
        label: 'Fish vendor shouting',
        labelZh: '魚販叫賣',
        url: 'https://cdn.freesound.org/previews/462/462087_8386274-lq.mp3',
        position: [-3, 0, -4],
        refDistance: 3,
        rolloffFactor: 1,
      },
      {
        id: 'pei-ho-splash',
        label: 'Water splashing',
        labelZh: '潑水聲',
        url: 'https://cdn.freesound.org/previews/521/521974_7724935-lq.mp3',
        position: [1, -0.5, 5],
        refDistance: 2,
        rolloffFactor: 2,
      },
    ],
    hotspots: [
      { targetNodeId: 'fuk-wing', position: [6, 0, 3], labelEn: 'Toy Street →', labelZh: '玩具街 →' },
      { targetNodeId: 'golden-arcade', position: [-5, 0, -5], labelEn: 'Golden Arcade →', labelZh: '黃金商場 →' },
    ],
    infoEn: 'Pei Ho Street market is the real deal — a traditional wet market that\'s been feeding Sham Shui Po for decades.',
    infoZh: '北河街街市是真正的地道市場——數十年來一直餵養深水埗。',
    accentColor: '#ffd54a',
  },
  {
    id: 'golden-arcade',
    nameEn: 'Golden Computer Centre',
    nameZh: '黃金電腦商場',
    descriptionEn: 'Electronics heaven: rows of tiny shops glowing with screens, keyboards, and PC parts.',
    descriptionZh: '電子天堂：一排排小店閃爍著螢幕、鍵盤和電腦零件的光芒。',
    panoramaUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=4096&h=2048&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=200&h=120&fit=crop',
    ambientLoopUrl: 'https://cdn.freesound.org/previews/521/521974_7724935-lq.mp3',
    audioSources: [
      {
        id: 'golden-fans',
        label: 'PC fans whirring',
        labelZh: '電腦風扇嗡嗡聲',
        url: 'https://cdn.freesound.org/previews/521/521974_7724935-lq.mp3',
        position: [0, 1, -4],
        refDistance: 3,
        rolloffFactor: 1,
      },
      {
        id: 'golden-keyboard',
        label: 'Keyboard clicking',
        labelZh: '鍵盤敲擊聲',
        url: 'https://cdn.freesound.org/previews/415/415209_5121236-lq.mp3',
        position: [-4, 0, 2],
        refDistance: 2,
        rolloffFactor: 1.5,
      },
    ],
    hotspots: [
      { targetNodeId: 'apliu-night', position: [7, 0, 1], labelEn: '← Apliu Night', labelZh: '← 鴨寮街夜景' },
      { targetNodeId: 'pei-ho', position: [4, 0, -6], labelEn: 'Wet Market →', labelZh: '街市 →' },
    ],
    infoEn: 'Golden Computer Arcade opened in 1992 and remains THE destination for PC parts, retro games, and tech bargains.',
    infoZh: '黃金電腦商場於1992年開業，至今仍是電腦零件、懷舊遊戲和科技優惠的勝地。',
    accentColor: '#ffd54a',
  },
]
