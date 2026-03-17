import { useEffect, useMemo, useRef, useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { mapLocations } from '../data/mapLocations'
import type { MapLocation } from '../types/mapLocation'
import { GoogleStreetView } from './GoogleStreetView'

interface MapTourProps {
  onBack: () => void
}

const TILE_SIZE = 256
const TILE_GRID = 4
const TILE_ZOOM = 18
const SSP_CENTER = { lat: 22.3312, lon: 114.1634 }
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
type LocalizedText = { en: string; zh: string; hi: string }

const locationLocalized: Record<
  string,
  {
    name: LocalizedText
    summary: LocalizedText
    shortDescription: LocalizedText
    details: LocalizedText
  }
> = {
  apliu: {
    name: {
      en: 'Apliu Street Electronics Market',
      zh: '鴨寮街電子市場',
      hi: 'अपलियू स्ट्रीट इलेक्ट्रॉनिक्स मार्केट',
    },
    summary: {
      en: 'Apliu Street - A legendary electronics market known for bargains and repair culture.',
      zh: '鴨寮街——以講價與維修文化聞名的傳奇電子市場。',
      hi: 'अपलियू स्ट्रीट - मोलभाव और रिपेयर संस्कृति के लिए प्रसिद्ध इलेक्ट्रॉनिक्स मार्केट।',
    },
    shortDescription: {
      en: 'Vintage gadgets, cables, and busy bargaining stalls.',
      zh: '复古电子产品、电线与热闹讲价摊位。',
      hi: 'विंटेज गैजेट्स, केबल्स और मोलभाव से भरे स्टॉल।',
    },
    details: {
      en: 'A famous street market for second-hand electronics where bargain culture and repair culture are both alive.',
      zh: '这里是著名的二手电子街市，讲价文化与维修文化并存，充满本地生活气息。',
      hi: 'यहाँ सेकंड-हैंड इलेक्ट्रॉनिक्स का मशहूर बाजार है, जहाँ मोलभाव और रिपेयर संस्कृति दोनों जीवित हैं।',
    },
  },
  'fuk-wing': {
    name: {
      en: 'Fuk Wing Street (Toy Street)',
      zh: '福榮街（玩具街）',
      hi: 'फुक विंग स्ट्रीट (टॉय स्ट्रीट)',
    },
    summary: {
      en: 'Fuk Wing Street - A nostalgic toy district full of color and childhood memory.',
      zh: '福榮街——充滿色彩與童年回憶的懷舊玩具街。',
      hi: 'फुक विंग स्ट्रीट - रंगों और यादों से भरा नॉस्टैल्जिक टॉय ज़ोन।',
    },
    shortDescription: {
      en: 'Hanging balloons, kites, and colorful toy chaos.',
      zh: '满街气球、风筝与色彩缤纷的玩具。',
      hi: 'लटकते गुब्बारे, पतंगें और रंग-बिरंगे खिलौनों की दुनिया।',
    },
    details: {
      en: 'A nostalgic toy district where wholesale and retail stores preserve childhood memories across generations.',
      zh: '充满怀旧气氛的玩具街，批发与零售店并存，承载几代人的童年回忆。',
      hi: 'यह एक नॉस्टैल्जिक टॉय ज़ोन है, जहाँ थोक और खुदरा दुकानों में पीढ़ियों की यादें बसती हैं।',
    },
  },
  'pei-ho': {
    name: {
      en: 'Pei Ho Street Wet Market',
      zh: '北河街街市',
      hi: 'पेई हो स्ट्रीट वेट मार्केट',
    },
    summary: {
      en: 'Pei Ho Street - A traditional wet market pulse of daily neighborhood life.',
      zh: '北河街——展現日常社區節奏的傳統街市。',
      hi: 'पेई हो स्ट्रीट - रोजमर्रा की स्थानीय ज़िंदगी का पारंपरिक वेट मार्केट केंद्र।',
    },
    shortDescription: {
      en: 'Food stalls, fish vendors, and loud morning bustle.',
      zh: '食物摊档、鱼贩叫卖与早晨喧闹节奏。',
      hi: 'खाने के स्टॉल, मछली विक्रेता और सुबह की चहल-पहल।',
    },
    details: {
      en: 'A traditional wet market soundscape where daily food trade reflects everyday neighborhood life.',
      zh: '传统街市的声音景观，展现深水埗日常买菜与社区生活的真实节奏。',
      hi: 'यह पारंपरिक वेट मार्केट रोजमर्रा के भोजन व्यापार और स्थानीय जीवन की असली धड़कन दिखाता है।',
    },
  },
  golden: {
    name: {
      en: 'Golden Computer Centre Entrance',
      zh: '黃金電腦商場入口',
      hi: 'गोल्डन कंप्यूटर सेंटर प्रवेश',
    },
    summary: {
      en: 'Golden Computer Arcade - A dense hub for affordable electronics and gaming culture.',
      zh: '黃金電腦商場——平價電子產品與遊戲文化的高密度熱點。',
      hi: 'गोल्डन कंप्यूटर आर्केड - किफायती इलेक्ट्रॉनिक्स और गेमिंग संस्कृति का घना केंद्र।',
    },
    shortDescription: {
      en: '',
      zh: '',
      hi: '',
    },
    details: {
      en: 'Golden Computer Arcade is a popular tech marketplace in Sham Shui Po, Hong Kong, known for its wide range of affordable electronics, computer hardware, gaming gear, and accessories. Packed with small independent shops, it’s a go-to destination for tech enthusiasts looking for great deals and the latest gadgets.',
      zh: '深水埗黃金電腦商場是香港著名科技市集，提供大量價格實惠的電子產品、電腦硬件、遊戲設備與配件。商場內聚集許多小型獨立店舖，是科技愛好者尋找優惠與最新產品的熱門地點。',
      hi: 'गोल्डन कंप्यूटर आर्केड, शाम शुई पो (हांगकांग) का एक लोकप्रिय टेक बाज़ार है, जो किफायती इलेक्ट्रॉनिक्स, कंप्यूटर हार्डवेयर, गेमिंग गियर और एक्सेसरीज़ की बड़ी रेंज के लिए जाना जाता है। छोटी-छोटी स्वतंत्र दुकानों से भरा यह स्थान अच्छे सौदों और नए गैजेट्स की तलाश करने वालों के लिए पसंदीदा जगह है।',
    },
  },
}

export function MapTour({ onBack }: MapTourProps) {
  const { language } = useLanguage()
  const [activeId, setActiveId] = useState<string>(mapLocations[0].id)
  const [view, setView] = useState<'map' | 'location'>('map')
  const [loadedTiles, setLoadedTiles] = useState(0)

  const mapCopy = {
    en: {
      title: 'Real Sham Shui Po map · Click a pin',
      loading: 'Loading Sham Shui Po map...',
      backHome: 'Back to Home',
      dataAttribution: 'Map data © Lands Department, HKSAR',
    },
    zh: {
      title: '真实深水埗地图 · 点击标记',
      loading: '正在加载深水埗地图...',
      backHome: '返回主页',
      dataAttribution: '地图数据 © 香港地政总署',
    },
    hi: {
      title: 'रियल शाम शुई पो मैप · पिन पर क्लिक करें',
      loading: 'शाम शुई पो मैप लोड हो रहा है...',
      backHome: 'होम पर वापस जाएं',
      dataAttribution: 'मैप डेटा © Lands Department, HKSAR',
    },
  }[language]

  const activeLocation = useMemo<MapLocation>(
    () => mapLocations.find((location) => location.id === activeId) ?? mapLocations[0],
    [activeId],
  )
  const getLocationName = (location: MapLocation) =>
    (locationLocalized[location.id]?.name[language] ??
      (language === 'zh' ? location.nameZh : location.nameEn))

  if (view === 'location') {
    return (
      <LocationPage
        location={activeLocation}
        language={language}
        onBackToMap={() => setView('map')}
      />
    )
  }

  return (
    <div className="fade-in relative h-full w-full overflow-hidden bg-[#07080f]">
      <section className="absolute inset-0 overflow-hidden bg-[#101421]">
          <div className="absolute inset-0 grid" style={{ gridTemplateColumns: `repeat(${TILE_GRID}, 1fr)`, gridTemplateRows: `repeat(${TILE_GRID}, 1fr)` }}>
            {shamShuiPoTiles.map((tile) => (
              <img
                key={tile.key}
                src={tile.url}
                alt=""
                loading="eager"
                onLoad={() => setLoadedTiles((n) => n + 1)}
                className="h-full w-full object-cover"
                style={{
                  gridColumnStart: tile.x + 1,
                  gridRowStart: tile.y + 1,
                  imageRendering: 'auto',
                }}
              />
            ))}
          </div>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/45" />

          {mapLocations.map((location) => {
            const active = activeId === location.id
            return (
              <button
                key={location.id}
                onClick={() => {
                  setActiveId(location.id)
                  setView('location')
                }}
                className="group absolute flex -translate-x-1/2 -translate-y-1/2 cursor-pointer flex-col items-center justify-center min-h-[44px] min-w-[44px]"
                style={{ left: `${location.xPercent}%`, top: `${location.yPercent}%` }}
                aria-label={location.nameEn}
              >
                <span className={`absolute inline-flex h-7 w-7 rounded-full bg-red-500/20 blur-sm transition-opacity ${
                  active ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                }`} />
                <svg
                  viewBox="0 0 24 24"
                  className={`h-8 w-8 drop-shadow-[0_0_10px_rgba(0,0,0,0.55)] transition-all ${
                    active
                      ? 'scale-110 drop-shadow-[0_0_14px_rgba(255,51,85,0.35)]'
                      : 'group-hover:scale-110 group-hover:drop-shadow-[0_0_12px_rgba(255,51,85,0.3)]'
                  }`}
                  aria-hidden="true"
                >
                  <path
                    d="M12 2C7.58 2 4 5.58 4 10c0 5.33 6.22 11.49 7.08 12.32a1.3 1.3 0 0 0 1.84 0C13.78 21.49 20 15.33 20 10c0-4.42-3.58-8-8-8z"
                    fill="#ff3355"
                  />
                  <circle cx="12" cy="10" r="3" fill="#ffffff" />
                </svg>
                <span className={`pointer-events-none mt-2 block rounded-xl bg-black/65 px-2 py-1 text-[11px] text-slate-100 transition-opacity ${
                  active ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                }`}>
                  {getLocationName(location)}
                </span>
                <span className="pointer-events-none absolute left-1/2 top-9 -translate-x-1/2 rounded-md bg-black/75 px-2 py-1 text-[10px] text-slate-100 opacity-0 transition-opacity group-hover:opacity-100">
                  Click to explore
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
            {mapCopy.dataAttribution}
          </a>

          {loadedTiles === 0 && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/70 text-sm text-slate-200">
              {mapCopy.loading}
            </div>
          )}
      </section>

      <button
        onClick={onBack}
        className="absolute left-4 top-4 z-30 inline-flex h-10 min-w-10 items-center justify-center gap-1 rounded-xl border border-white/25 bg-black/55 px-3 text-sm text-white backdrop-blur hover:bg-black/75"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
          <path
            d="M12 3 3 10h2v10h5v-6h4v6h5V10h2L12 3z"
            fill="currentColor"
          />
        </svg>
        {mapCopy.backHome}
      </button>
    </div>
  )
}

interface LocationPageProps {
  location: MapLocation
  language: 'en' | 'zh' | 'hi'
  onBackToMap: () => void
}

function LocationPage({
  location,
  language,
  onBackToMap,
}: LocationPageProps) {
  const [masterVolume, setMasterVolume] = useState(0.8)
  const [muted, setMuted] = useState(false)
  const [activeSoundId, setActiveSoundId] = useState<string | null>(null)
  const [infoOpenId, setInfoOpenId] = useState<string | null>(null)
  const [hoveredInfoId, setHoveredInfoId] = useState<string | null>(null)
  const soundRefs = useRef<Record<string, HTMLAudioElement | null>>({})

  const locationCopy = {
    en: {
      pageLabel: 'Location Page',
      backToMap: '← Back to Map',
      mute: 'Mute',
      unmute: 'Unmute',
      demoSounds: 'Explore local soundscape',
      clickToPlay: 'Click to play',
      clickToStop: 'Playing - click to stop',
      headphones: 'Headphones recommended for stronger immersion.',
      infoLabel: (title: string) => `Show info for ${title}`,
    },
    zh: {
      pageLabel: '地点页面',
      backToMap: '← 返回地图',
      mute: '静音',
      unmute: '取消静音',
      demoSounds: '探索在地声音景观',
      clickToPlay: '点击播放',
      clickToStop: '播放中 - 点击停止',
      headphones: '建议佩戴耳机以获得更强沉浸感。',
      infoLabel: (title: string) => `显示 ${title} 的说明`,
    },
    hi: {
      pageLabel: 'लोकेशन पेज',
      backToMap: '← मैप पर वापस जाएं',
      mute: 'म्यूट',
      unmute: 'अनम्यूट',
      demoSounds: 'स्थानीय साउंडस्केप एक्सप्लोर करें',
      clickToPlay: 'चलाने के लिए क्लिक करें',
      clickToStop: 'चल रहा है - रोकने के लिए क्लिक करें',
      headphones: 'बेहतर इमर्शन के लिए हेडफ़ोन इस्तेमाल करें।',
      infoLabel: (title: string) => `${title} की जानकारी दिखाएं`,
    },
  }[language]
  const localizedLocation = locationLocalized[location.id]
  const displayName = localizedLocation?.name[language] ?? (language === 'zh' ? location.nameZh : location.nameEn)
  const displaySummary = localizedLocation?.summary[language] ?? location.summary
  const displayDetails = localizedLocation?.details[language] ?? location.detailsEn

  const demoSounds = [
    {
      id: 'crowd-chatter',
      title: {
        en: 'Street Crowd Chatter',
        zh: '街头人群交谈声',
        hi: 'सड़क की भीड़भाड़ भरी बातचीत',
      },
      subtitle: {
        en: 'This captures the dense social energy of Sham Shui Po sidewalks, where conversations overlap in Cantonese, Mandarin, and other dialects. The constant human texture is culturally important because street-level interaction is central to neighborhood life: buying, bargaining, greeting regulars, and exchanging local news all happen in this shared sonic space.',
        zh: '这段声音呈现深水埗街道上密集的人际互动：粤语、普通话与多种口音交织在一起。它的文化意义在于，街头交流正是社区生活核心，买卖、讲价、寒暄与本地消息都在这片声音场中发生。',
        hi: 'यह ध्वनि शाम शुई पो के फुटपाथों की सामाजिक ऊर्जा दिखाती है, जहाँ कैंटोनीज़, मंदारिन और अन्य बोलियाँ एक साथ सुनाई देती हैं। इसका सांस्कृतिक महत्व इसलिए है क्योंकि यहीं खरीदारी, मोलभाव, परिचय और स्थानीय खबरों का आदान-प्रदान होता है।',
      },
      url: 'https://cdn.freesound.org/previews/462/462087_8386274-lq.mp3',
    },
    {
      id: 'vendor-calls',
      title: {
        en: 'Vendor Calls',
        zh: '小贩叫卖声',
        hi: 'विक्रेताओं की पुकार',
      },
      subtitle: {
        en: 'Vendor calls are a signature of traditional Hong Kong market culture. In Sham Shui Po, these rhythmic announcements are not just sales tactics; they are part of the area’s identity, signaling what is fresh, cheap, or newly stocked. The voices create a living sound map that helps people navigate stalls and reinforces the district’s grassroots trading character.',
        zh: '叫卖声是香港传统街市文化的标志。在深水埗，这些有节奏的吆喝不仅是销售方式，更是地区身份的一部分，告诉路人哪里有新货、平货、当季货，构成可被“听见”的市集地图。',
        hi: 'विक्रेताओं की आवाज़ें पारंपरिक हांगकांग मार्केट संस्कृति की पहचान हैं। शाम शुई पो में यह केवल बिक्री का तरीका नहीं, बल्कि इलाके की पहचान है—क्या ताज़ा है, क्या सस्ता है, क्या नया आया है, सब ध्वनि से पता चलता है।',
      },
      url: 'https://cdn.freesound.org/previews/415/415209_5121236-lq.mp3',
    },
    {
      id: 'electronics-beeps',
      title: {
        en: 'Electronics Beeps',
        zh: '电子提示音',
        hi: 'इलेक्ट्रॉनिक बीप्स',
      },
      subtitle: {
        en: 'Electronic test tones, notification pings, and gadget beeps reflect Sham Shui Po’s reputation as a tech-hunting district, especially around Apliu Street and Golden Computer Centre. These sounds represent a culture of repair, resale, and experimentation, where old and new devices coexist and technology remains accessible to everyday people.',
        zh: '电子测试声、提示音与设备蜂鸣声，体现了深水埗作为“科技淘宝区”的城市印象，尤其在鸭寮街与黄金商场一带。这些声音象征维修、转售与改装文化，让科技保持在大众可及范围内。',
        hi: 'टेस्ट टोन, नोटिफिकेशन पिंग और गैजेट बीप्स शाम शुई पो की टेक-हंटिंग पहचान को दर्शाते हैं, खासकर अपलियू स्ट्रीट और गोल्डन कंप्यूटर सेंटर के आसपास। यह रिपेयर, रिसेल और एक्सपेरिमेंट की संस्कृति का प्रतीक है।',
      },
      url: 'https://cdn.freesound.org/previews/521/521974_7724935-lq.mp3',
    },
    {
      id: 'footsteps',
      title: {
        en: 'Footsteps + Pavement',
        zh: '脚步与路面声',
        hi: 'कदमों और फुटपाथ की ध्वनि',
      },
      subtitle: {
        en: 'The steady rhythm of footsteps on crowded pavement reflects the district’s high pedestrian flow and layered street economy. In Sham Shui Po, people move quickly between MTR exits, curbside stalls, markets, and side streets. This movement sound is culturally meaningful because it conveys how the neighborhood functions as a lived, walkable ecosystem rather than a static tourist site.',
        zh: '密集脚步声反映了深水埗高人流与分层街道经济。人们在地铁口、街边摊、市场与横街之间快速穿梭。这种“移动的声音”体现了社区是可步行、可生活的真实生态，而非静态观光景点。',
        hi: 'भीड़भरे फुटपाथ पर कदमों की स्थिर लय इस इलाके के तेज़ पैदल प्रवाह और परतदार स्ट्रीट इकॉनमी को दर्शाती है। एमटीआर निकास, स्टॉल और गलियों के बीच लगातार आवाजाही इस पड़ोस को एक जीवंत, वॉकएबल इकोसिस्टम बनाती है।',
      },
      url: 'https://cdn.freesound.org/previews/250/250200_4486188-lq.mp3',
    },
    {
      id: 'cantonese-radio',
      title: {
        en: 'Cantonese Radio Texture',
        zh: '粤语电台氛围',
        hi: 'कैंटोनीज़ रेडियो माहौल',
      },
      subtitle: {
        en: 'Cantonese radio drifting from shopfronts is a familiar auditory backdrop across older Kowloon districts. In Sham Shui Po, it ties together generations through shared pop songs, talk programs, and local language cadence. The sound is culturally important because it preserves everyday linguistic identity and gives the street a distinctly Hong Kong sense of place.',
        zh: '店铺传出的粤语电台，是九龙旧区常见背景声。在深水埗，它透过流行歌、清谈节目与语调节奏连接不同世代。这种声音保留了日常语言身份，也让街道拥有鲜明的香港在地感。',
        hi: 'दुकानों से आती कैंटोनीज़ रेडियो आवाज़ पुराने कौलून इलाकों की पहचान है। शाम शुई पो में यह गानों, टॉक शो और स्थानीय लहजे के माध्यम से पीढ़ियों को जोड़ती है। यह ध्वनि स्थानीय भाषाई पहचान और जगह की अनुभूति को बनाए रखती है।',
      },
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
    <div className="fade-in h-full w-full overflow-auto bg-[#06080f] px-4 py-5 sm:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs tracking-widest text-slate-400 uppercase">{locationCopy.pageLabel}</p>
            <h2 className="text-2xl font-semibold text-white">{displayName}</h2>
            <p className="break-words text-sm text-slate-300">{displaySummary}</p>
          </div>
          <button
            onClick={onBackToMap}
            className="btn-secondary cursor-pointer text-sm"
          >
            {locationCopy.backToMap}
          </button>
        </div>

        <div className="w-full overflow-hidden rounded-lg bg-black">
          {location.liveViewType === 'embed' ? (
            <iframe
              src={location.liveViewUrl}
              title={displayName}
              className="h-full min-h-[380px] w-full"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          ) : location.streetView ? (
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
                alt={displayName}
              className="h-full min-h-[380px] w-full object-cover"
            />
          )}
        </div>

        <div className="w-full py-2">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p
                className={`mt-1 break-words leading-relaxed text-slate-300 ${
                  location.id === 'golden' ? 'text-sm sm:text-[0.95rem]' : 'text-sm sm:text-base'
                }`}
              >
                {displayDetails}
              </p>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-black/25 px-3 py-2">
              <button
                onClick={() => setMuted((m) => !m)}
                className="btn-secondary cursor-pointer px-3 py-1 text-xs"
              >
                {muted ? locationCopy.unmute : locationCopy.mute}
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
            {locationCopy.demoSounds}
          </h3>

          <div className="flex flex-col gap-3">
            {demoSounds.map((sound) => {
              const isActive = activeSoundId === sound.id
              const showInfo = infoOpenId === sound.id || hoveredInfoId === sound.id
              return (
                <div key={sound.id} className="relative">
                  <button
                    onClick={() => void handleToggleSound(sound.id)}
                    className={`group w-full cursor-pointer rounded-lg border p-3 pr-12 text-left transition ${
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
                        <p className="text-sm font-medium text-white">{sound.title[language]}</p>
                      </div>
                    </div>
                    <p className="mt-2 text-xs font-semibold text-neon-yellow">
                      {isActive ? `⏸ ${locationCopy.clickToStop}` : `▶ ${locationCopy.clickToPlay}`}
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

                  <button
                    onMouseEnter={() => setHoveredInfoId(sound.id)}
                    onMouseLeave={() => setHoveredInfoId((current) => (current === sound.id ? null : current))}
                    onClick={() =>
                      setInfoOpenId((current) => (current === sound.id ? null : sound.id))
                    }
                    className="absolute right-3 top-3 inline-flex min-h-[32px] min-w-[32px] items-center justify-center rounded-full border border-white/20 bg-black/40 px-2 text-[11px] text-slate-200 hover:bg-black/70"
                    aria-label={locationCopy.infoLabel(sound.title[language])}
                    type="button"
                  >
                    i
                  </button>

                  {showInfo && (
                    <div className="absolute right-0 top-full z-20 mt-2 w-80 max-w-[calc(100vw-2rem)] rounded-xl border border-white/15 bg-[#0b101a]/95 p-4 text-sm leading-7 text-slate-100 shadow-[0_8px_24px_rgba(0,0,0,0.45)] backdrop-blur">
                      {sound.subtitle[language]}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
          <p className="mt-3 text-xs text-slate-400">{locationCopy.headphones}</p>
        </div>
      </div>
    </div>
  )
}

