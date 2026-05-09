import L, { type LatLngBoundsExpression, type LatLngExpression, type LayerGroup, type Map as LeafletMap } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { mapLocations } from '../data/mapLocations'
import { isSupabaseConfigured, supabase, type SubmissionRow } from '../lib/supabase'
import type { MapLocation } from '../types/mapLocation'
import { FieldworkInterviewsSection } from './FieldworkInterviewsSection'
import { GoogleStreetView } from './GoogleStreetView'
import { immersiveTimelineLocationIds, locationTimelineItems } from '../data/locationTimelineMemories'
import { TimelineScroll } from './TimelineScroll'

type LocalizedText = { en: string; zh: string; hi: string }

const SSP_CENTER: LatLngExpression = [22.3312, 114.1634]
const SSP_BOUNDS: LatLngBoundsExpression = [
  [22.3258, 114.1553],
  [22.3372, 114.1711],
]
const SSP_LEAFLET_BOUNDS = L.latLngBounds(SSP_BOUNDS)
const CARTO_LIGHT_TILE_URL =
  'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
const SHOW_CONTRIBUTION_MARKERS = true

const STATIC_CONTRIBUTIONS: SubmissionRow[] = [
  {
    id: 'local-wheel-cart-driving',
    title: 'Wheel Cart Driving',
    description: 'Fuk Wa Street',
    image_url: '/audio/wheel-cart-driving.m4a',
    place_name: 'Fuk Wa Street',
    latitude: 22.33081,
    longitude: 114.16327,
    created_at: '2026-05-05T00:00:00.000Z',
  },
  {
    id: 'fieldtrip-01',
    title: 'Apliu Street Stall Front',
    description: 'A close street-level glimpse of everyday trade and display culture in Sham Shui Po.',
    image_url: '/images/fieldtrip/fieldtrip-01.jpg',
    place_name: 'Apliu Street',
    latitude: 22.33045,
    longitude: 114.1621,
    created_at: '2026-05-05T00:01:00.000Z',
  },
  {
    id: 'fieldtrip-02',
    title: 'Fuk Wing Shop Display',
    description: null,
    image_url: '/images/fieldtrip/fieldtrip-02.jpg',
    place_name: 'Fuk Wing Street',
    latitude: 22.33125,
    longitude: 114.16385,
    created_at: '2026-05-05T00:02:00.000Z',
  },
  {
    id: 'fieldtrip-03',
    title: 'Pei Ho Market Corner',
    description: null,
    image_url: '/images/fieldtrip/fieldtrip-03.jpg',
    place_name: 'Pei Ho Street',
    latitude: 22.32995,
    longitude: 114.16095,
    created_at: '2026-05-05T00:03:00.000Z',
  },
  {
    id: 'fieldtrip-04',
    title: 'Golden Arcade Entrance',
    description: null,
    image_url: '/images/fieldtrip/fieldtrip-04.jpg',
    place_name: 'Golden Computer Arcade',
    latitude: 22.3323,
    longitude: 114.1615,
    created_at: '2026-05-05T00:04:00.000Z',
  },
  {
    id: 'fieldtrip-05',
    title: 'Fuk Wa Street Crossing',
    description: 'Street movement, signage, and shopfronts overlap in a compact neighborhood rhythm.',
    image_url: '/images/fieldtrip/fieldtrip-05.jpg',
    place_name: 'Fuk Wa Street',
    latitude: 22.33081,
    longitude: 114.16327,
    created_at: '2026-05-05T00:05:00.000Z',
  },
  {
    id: 'fieldtrip-06',
    title: 'Sham Shui Po Shop Signs',
    description: null,
    image_url: '/images/fieldtrip/fieldtrip-06.jpg',
    place_name: 'Sham Shui Po',
    latitude: 22.3319,
    longitude: 114.1646,
    created_at: '2026-05-05T00:06:00.000Z',
  },
  {
    id: 'fieldtrip-07',
    title: 'Sidewalk Goods Display',
    description: null,
    image_url: '/images/fieldtrip/fieldtrip-07.jpg',
    place_name: 'Sham Shui Po',
    latitude: 22.3302,
    longitude: 114.1652,
    created_at: '2026-05-05T00:07:00.000Z',
  },
  {
    id: 'fieldtrip-08',
    title: 'Neighborhood Street Texture',
    description: null,
    image_url: '/images/fieldtrip/fieldtrip-08.jpg',
    place_name: 'Sham Shui Po',
    latitude: 22.3327,
    longitude: 114.1627,
    created_at: '2026-05-05T00:08:00.000Z',
  },
  {
    id: 'fieldtrip-09',
    title: 'Field Trip Walkthrough Video',
    description: 'A moving snapshot captures the pace and density of walking through Sham Shui Po.',
    image_url: '/videos/fieldtrip/fieldtrip-09.mov',
    place_name: 'Sham Shui Po',
    latitude: 22.3291,
    longitude: 114.1618,
    created_at: '2026-05-05T00:09:00.000Z',
  },
  {
    id: 'fieldtrip-10',
    title: 'Market Lane Moment',
    description: null,
    image_url: '/images/fieldtrip/fieldtrip-10.jpg',
    place_name: 'Sham Shui Po',
    latitude: 22.33155,
    longitude: 114.1607,
    created_at: '2026-05-05T00:10:00.000Z',
  },
  {
    id: 'fieldtrip-11',
    title: 'Street Corner Detail',
    description: null,
    image_url: '/images/fieldtrip/fieldtrip-11.jpg',
    place_name: 'Sham Shui Po',
    latitude: 22.3331,
    longitude: 114.1641,
    created_at: '2026-05-05T00:11:00.000Z',
  },
  {
    id: 'fieldtrip-12',
    title: 'Everyday Shopfront',
    description: null,
    image_url: '/images/fieldtrip/fieldtrip-12.jpg',
    place_name: 'Sham Shui Po',
    latitude: 22.3287,
    longitude: 114.1599,
    created_at: '2026-05-05T00:12:00.000Z',
  },
  {
    id: 'fieldtrip-13',
    title: 'Street-Level Memory',
    description: null,
    image_url: '/images/fieldtrip/fieldtrip-13.jpg',
    place_name: 'Sham Shui Po',
    latitude: 22.3309,
    longitude: 114.166,
    created_at: '2026-05-05T00:13:00.000Z',
  },
  {
    id: 'fieldtrip-14',
    title: 'Jenny Field Trip Photo',
    description: null,
    image_url: '/images/fieldtrip/fieldtrip-14.jpeg',
    place_name: 'Sham Shui Po',
    latitude: 22.332,
    longitude: 114.1655,
    created_at: '2026-05-05T00:14:00.000Z',
  },
  {
    id: 'fieldtrip-15',
    title: 'Xuyan Field Trip Photo',
    description: null,
    image_url: '/images/fieldtrip/fieldtrip-15.jpeg',
    place_name: 'Sham Shui Po',
    latitude: 22.3296,
    longitude: 114.1639,
    created_at: '2026-05-05T00:15:00.000Z',
  },
  {
    id: 'fieldtrip-16',
    title: 'Onwa Lingsum Field Trip Photo',
    description: null,
    image_url: '/images/fieldtrip/fieldtrip-16.jpeg',
    place_name: 'Sham Shui Po',
    latitude: 22.331,
    longitude: 114.1612,
    created_at: '2026-05-05T00:16:00.000Z',
  },
  {
    id: 'fieldtrip-17',
    title: 'Kelvin Chan Street Photo',
    description: null,
    image_url: '/images/fieldtrip/fieldtrip-17.jpg',
    place_name: 'Sham Shui Po',
    latitude: 22.3334,
    longitude: 114.1602,
    created_at: '2026-05-05T00:17:00.000Z',
  },
]

interface MapTourProps {
  onBackToHome?: () => void
  onLocationViewChange?: (open: boolean) => void
  /** Increment from App to reset MapTour from location view back to map (navbar Home, etc.). */
  navigateHomeSignal?: number
  /** Increment from App to show map and scroll to #research-overview (navbar Research Overview). */
  scrollToResearchOverviewSignal?: number
  /** Increment from App to show map and scroll to #fieldwork-interviews. */
  scrollToFieldworkInterviewsSignal?: number
  /** Increment from App to show map and scroll to #gentrification-memory. */
  scrollToGentrificationMemorySignal?: number
  /** Highlights Research dropdown items while corresponding sections are in view (map + scroll stack only). */
  onResearchNavSectionChange?: (section: 'overview' | 'fieldwork' | 'gentrification' | null) => void
  submissionRefreshKey?: number
  directLocationId?: string | null
  directLocationRequestKey?: number
}

const locationHeroDescriptions: Record<string, LocalizedText> = {
  golden: {
    en: 'Once a fashion wholesale hub in the 1970s, Golden Computer Arcade has evolved into a dense marketplace at the heart of Sham Shui Po - now known for its tightly packed stores offering video games, computer hardware, and electronic goods.',
    zh: '黃金電腦商場曾是1970年代的服裝批發熱點，如今演變成深水埗核心的高密度科技市集，以遊戲、電腦硬件與電子產品聞名。',
    hi: '1970 के दशक में फैशन होलसेल केंद्र रहा Golden Computer Arcade अब शाम शुई पो का घना टेक बाज़ार है, जहाँ गेम, कंप्यूटर हार्डवेयर और इलेक्ट्रॉनिक सामान मिलते हैं।',
  },
  apliu: {
    en: 'Apliu Street is an open-air electronics market shaped by bargaining, repair culture, and second-hand exchange. Its stalls turn cables, radios, tools, and spare parts into a living archive of Hong Kong street technology.',
    zh: '鴨寮街是由講價、維修文化與二手交易塑造的露天電子市集。電線、收音機、工具與零件在這裡構成香港街頭科技的生活檔案。',
    hi: 'Apliu Street मोलभाव, रिपेयर संस्कृति और सेकंड-हैंड विनिमय से बना खुला इलेक्ट्रॉनिक्स बाज़ार है। केबल, रेडियो, औज़ार और पुर्जे यहाँ सड़क-स्तर की तकनीक का जीवित आर्काइव बनाते हैं।',
  },
  'pei-ho': {
    en: 'Pei Ho Street Wet Market captures the everyday pulse of Sham Shui Po through food stalls, vendors, regular customers, and morning movement. It is a social infrastructure where daily shopping becomes memory, routine, and neighborhood connection.',
    zh: '北河街街市透過食物攤檔、檔主、熟客與早晨人流，呈現深水埗的日常脈搏。這裡不只是買菜的地方，也是記憶、習慣與社區連結的生活基礎。',
    hi: 'Pei Ho Street Wet Market खाने के स्टॉलों, विक्रेताओं, नियमित ग्राहकों और सुबह की आवाजाही से शाम शुई पो की रोज़मर्रा धड़कन दिखाता है। यह खरीदारी, स्मृति और पड़ोस के रिश्तों का सामाजिक ढांचा है।',
  },
  'fuk-wing': {
    en: 'Fuk Wing Street, known as Toy Street, turns color, play, and nostalgia into a compact retail landscape. Its toy shops connect childhood memory with family routines, seasonal festivals, and small moments of discovery.',
    zh: '福榮街又稱玩具街，把色彩、玩樂與懷舊濃縮成緊密的零售景觀。玩具店連結童年記憶、家庭日常、節慶用品與小小的探索時刻。',
    hi: 'Fuk Wing Street, जिसे Toy Street कहा जाता है, रंग, खेल और यादों को एक छोटे रिटेल परिदृश्य में बदलती है। इसकी खिलौना दुकानें बचपन, परिवार, त्योहारों और खोज के छोटे पलों को जोड़ती हैं।',
  },
}

const locationCommunityMemories: Record<string, { quote: LocalizedText; attribution: LocalizedText }> = {
  golden: {
    quote: {
      en: 'After school, we would take the MTR to Sham Shui Po and head straight to Golden. We rarely bought anything because we did not have the money, but we would spend hours walking through the aisles, watching demo screens and checking prices.',
      zh: '放學後，我們會坐港鐵到深水埗，直接去黃金。其實很少買東西，因為沒有太多錢，但會在通道裡走很久，看試玩畫面、比較價錢。',
      hi: 'स्कूल के बाद हम MTR से शाम शुई पो जाते और सीधे Golden पहुंचते। पैसे कम होते थे इसलिए कुछ खरीदते नहीं थे, लेकिन गलियों में घूमते, स्क्रीन देखते और दाम मिलाते रहते थे।',
    },
    attribution: {
      en: 'Anonymous Community Member, Memory (Before COVID)',
      zh: '匿名社區成員，記憶（疫情前）',
      hi: 'अनाम समुदाय सदस्य, स्मृति (COVID से पहले)',
    },
  },
  apliu: {
    quote: {
      en: 'I used to come here with a small list of parts, but I always left with more questions and more things to look for. The vendors knew what each cable or old radio could still become.',
      zh: '我以前會帶著一張零件清單來，但每次離開時都會有更多問題、更多想找的東西。檔主知道每條電線、每部舊收音機還可以變成什麼。',
      hi: 'मैं यहाँ छोटे से पुर्जों की सूची लेकर आता था, लेकिन हमेशा और सवालों और खोजों के साथ लौटता था। दुकानदार जानते थे कि हर केबल या पुराना रेडियो अभी क्या बन सकता है।',
    },
    attribution: {
      en: 'Anonymous Community Member, Repair Memory',
      zh: '匿名社區成員，維修記憶',
      hi: 'अनाम समुदाय सदस्य, रिपेयर स्मृति',
    },
  },
  'pei-ho': {
    quote: {
      en: 'The market was loud, but every sound had a place. Vendors calling prices, water running, bags opening, people greeting each other - it was how the neighborhood started its day.',
      zh: '街市很吵，但每種聲音都有位置。檔主叫價、水聲、膠袋聲、人們互相打招呼，這就是街坊一天開始的方式。',
      hi: 'बाज़ार शोरगुल वाला था, लेकिन हर आवाज़ की अपनी जगह थी। दाम पुकारते विक्रेता, पानी की आवाज़, थैले खुलना, लोगों का अभिवादन - इसी से मोहल्ले का दिन शुरू होता था।',
    },
    attribution: {
      en: 'Anonymous Community Member, Market Memory',
      zh: '匿名社區成員，街市記憶',
      hi: 'अनाम समुदाय सदस्य, बाज़ार स्मृति',
    },
  },
  'fuk-wing': {
    quote: {
      en: 'Even if we only looked, Toy Street felt exciting. The colors, hanging toys, and small shop displays made the street feel like a place where childhood was stored in public.',
      zh: '即使只是看看，玩具街也很令人興奮。顏色、掛滿的玩具和小店陳列，讓整條街像是把童年公開收藏起來的地方。',
      hi: 'अगर हम सिर्फ देखते भी थे, Toy Street रोमांचक लगती थी। रंग, लटके हुए खिलौने और छोटी दुकानों की सजावट सड़क को ऐसा बनाते थे जैसे बचपन सार्वजनिक रूप से संजोया गया हो।',
    },
    attribution: {
      en: 'Anonymous Community Member, Childhood Memory',
      zh: '匿名社區成員，童年記憶',
      hi: 'अनाम समुदाय सदस्य，童年記憶',
    },
  },
}

interface SoundLayer {
  id: string
  category: string
  icon: string
  title: LocalizedText
  subtitle: LocalizedText
  interpretation?: LocalizedText
  url: string
}

interface LocationSoundscape {
  identity: LocalizedText
  description?: LocalizedText
  layers: SoundLayer[]
}

const soundscapes: Record<string, LocationSoundscape> = {
  golden: {
    identity: {
      en: 'Compressed Digital Noise',
      zh: '压缩的数字噪音',
      hi: 'संपीड़ित डिजिटल शोर',
    },
    description: {
      en: 'A layered soundscape of sales voices, device noise, and dense movement reflecting the intensity of indoor tech marketplaces.',
      zh: '由销售人声、设备噪音与密集移动组成的声音层次，呈现室内科技市场的强度。',
      hi: 'बिक्री की आवाज़ों, डिवाइस शोर और घनी आवाजाही की परतें इनडोर टेक बाज़ार की तीव्रता दिखाती हैं।',
    },
    layers: [
      {
        id: 'golden-sales-pitch',
        category: 'Voices',
        icon: '🏷',
        title: {
          en: 'Sales Pitch Voices',
          zh: '销售叫卖声',
          hi: 'बिक्री की आवाज़ें',
        },
        subtitle: {
          en: 'Fast, persuasive shop voices echo through narrow aisles, reflecting the arcade’s bargaining culture.',
          zh: '快速而有说服力的店铺叫卖，呈现平价、优惠与粤语销售节奏。',
          hi: 'तेज़ दुकानी आवाज़ें मोलभाव, सस्ते दाम और बेहतर सौदे की संस्कृति दिखाती हैं।',
        },
        interpretation: {
          en: 'These interactions highlight the human intensity of commerce, where negotiation and competition shape the experience.',
          zh: '这些互动突显商业活动中的人际强度，协商与竞争共同塑造这里的体验。',
          hi: 'ये बातचीत व्यापार की मानवीय तीव्रता दिखाती है, जहाँ मोलभाव और प्रतिस्पर्धा अनुभव को आकार देते हैं।',
        },
        url: '/audio/bargaining-sound.m4a',
      },
      {
        id: 'golden-electronic-sounds',
        category: 'Digital Layer',
        icon: '⌨',
        title: {
          en: 'Electronic Sounds',
          zh: '电子声响',
          hi: 'इलेक्ट्रॉनिक ध्वनियाँ',
        },
        subtitle: {
          en: 'Keyboard clicks, system beeps, and device noise fill the space with a constant digital hum.',
          zh: '键盘声、系统提示音与设备噪音，反映商场的维修与电子生态。',
          hi: 'कीबोर्ड क्लिक, बीप और डिवाइस आवाज़ें तकनीकी बाज़ार का माहौल बनाती हैं।',
        },
        interpretation: {
          en: 'These sounds represent the shift from repair culture to continuous consumption, where technology is constantly upgraded and replaced.',
          zh: '这些声音代表从维修文化走向持续消费的转变，科技不断被升级与替换。',
          hi: 'ये आवाज़ें रिपेयर संस्कृति से लगातार खपत की ओर बदलाव दिखाती हैं, जहाँ तकनीक बार-बार अपग्रेड और बदली जाती है।',
        },
        url: '/audio/computer-arcade.m4a',
      },
      {
        id: 'golden-tech-media',
        category: 'Digital Layer',
        icon: '▶',
        title: {
          en: 'Faint Tech Media',
          zh: '微弱媒体声',
          hi: 'हल्की टेक मीडिया ध्वनि',
        },
        subtitle: {
          en: 'Sounds from screens, games, and videos leak into the background, layering the environment with digital media.',
          zh: '屏幕、游戏与影片外泄的声音，构成商场层叠的数字背景。',
          hi: 'स्क्रीन, गेम और वीडियो की हल्की आवाज़ डिजिटल माहौल को परतदार बनाती है।',
        },
        interpretation: {
          en: 'This creates a fragmented soundscape, reflecting the saturation of media and overlapping digital experiences in modern tech spaces.',
          zh: '这形成破碎而层叠的声音景观，反映现代科技空间中媒体饱和与数字体验重叠。',
          hi: 'यह एक बिखरा हुआ साउंडस्केप बनाता है, जो आधुनिक टेक स्थानों में मीडिया की अधिकता और ओवरलैप होते डिजिटल अनुभवों को दिखाता है।',
        },
        url: '/audio/talking-inside-golden-computer-arcade.m4a',
      },
    ],
  },
  apliu: {
    identity: {
      en: 'Negotiation & Street Hustle',
      zh: '讲价与街头活力',
      hi: 'मोलभाव और सड़क की हलचल',
    },
    description: {
      en: 'A layered street soundscape of vendor calls, bargaining voices, and object handling that reflects Apliu Street’s repair and resale culture.',
      zh: '由小販叫賣、講價對話與物件碰撞組成的街頭聲景，反映鴨寮街的維修與二手交易文化。',
      hi: 'विक्रेताओं की पुकार, मोलभाव और सामान की खनक से बना यह सड़क साउंडस्केप Apliu Street की रिपेयर और रीसेल संस्कृति दिखाता है।',
    },
    layers: [
      {
        id: 'apliu-vendor-calls',
        category: 'Voices',
        icon: '喊',
        title: {
          en: 'Vendor Calls',
          zh: '小贩叫卖声',
          hi: 'विक्रेताओं की पुकार',
        },
        subtitle: {
          en: 'Loud rhythmic shouting marks the street as an open-air marketplace where sound pulls people toward stalls.',
          zh: '有节奏的叫卖声让街道成为开放市集，并吸引路人靠近摊档。',
          hi: 'तालबद्ध पुकार सड़क बाज़ार की ऊर्जा और स्टॉलों की दिशा बताती है।',
        },
        url: '/audio/kwelin-st-selling-tv.m4a',
      },
      {
        id: 'apliu-bargaining',
        category: 'Voices',
        icon: '$',
        title: {
          en: 'Bargaining Conversations',
          zh: '讲价对话',
          hi: 'मोलभाव की बातचीत',
        },
        subtitle: {
          en: 'Back-and-forth negotiation tones capture the social performance of price, trust, and street knowledge.',
          zh: '来回讲价体现价格、信任与街头经验之间的互动。',
          hi: 'आगे-पीछे की बातचीत कीमत, भरोसे और स्थानीय ज्ञान को दिखाती है।',
        },
        url: '/audio/bargaining-sound.m4a',
      },
      {
        id: 'apliu-metal-handling',
        category: 'Environment',
        icon: '⚙',
        title: {
          en: 'Metal & Object Handling',
          zh: '金属与物件碰撞',
          hi: 'धातु और सामान की खनक',
        },
        subtitle: {
          en: 'Tools, cables, and small objects clinking point to repair culture and second-hand electronics trade.',
          zh: '工具、电线与小物件碰撞声，指向维修文化与二手电子买卖。',
          hi: 'औज़ार, तार और छोटी चीज़ों की खनक रिपेयर और रिसेल संस्कृति दिखाती है।',
        },
        url: 'https://cdn.freesound.org/previews/521/521974_7724935-lq.mp3',
      },
    ],
  },
  'pei-ho': {
    identity: {
      en: 'Rhythms of Daily Life',
      zh: '日常生活的节奏',
      hi: 'रोज़मर्रा जीवन की लय',
    },
    description: {
      en: 'A daily market soundscape of vendor voices, food preparation, and community chatter that reveals the social rhythm of neighborhood food culture.',
      zh: '由檔主聲音、食物處理與街坊閒談構成的日常街市聲景，呈現社區食物文化的社交節奏。',
      hi: 'विक्रेताओं की आवाज़, भोजन तैयारी और सामुदायिक बातचीत से बना यह बाज़ार साउंडस्केप पड़ोस की खाद्य संस्कृति की सामाजिक लय दिखाता है।',
    },
    layers: [
      {
        id: 'pei-ho-vendor-voices',
        category: 'Voices',
        icon: '市',
        title: {
          en: 'Vendor Voices',
          zh: '街市档主声音',
          hi: 'विक्रेताओं की आवाज़ें',
        },
        subtitle: {
          en: 'Softer repetitive selling tones create the everyday rhythm of a neighborhood wet market.',
          zh: '较柔和、重复的售卖声，构成街市日常节奏。',
          hi: 'धीमी दोहराई जाने वाली आवाज़ें रोज़ के बाज़ार की लय बनाती हैं।',
        },
        url: '/audio/pei-ho-wet-market.m4a',
      },
      {
        id: 'pei-ho-food-prep',
        category: 'Environment',
        icon: '刀',
        title: {
          en: 'Food Preparation',
          zh: '食物处理声',
          hi: 'भोजन तैयारी की आवाज़ें',
        },
        subtitle: {
          en: 'Chopping, washing, and preparation sounds reveal the market as a working food infrastructure.',
          zh: '切菜、清洗与处理声，展现街市作为食物基础设施的工作状态。',
          hi: 'काटने, धोने और तैयारी की आवाज़ें बाज़ार को जीवित भोजन प्रणाली बनाती हैं।',
        },
        url: '/audio/pei-ho-wet-market.m4a',
      },
      {
        id: 'pei-ho-community-chatter',
        category: 'Voices',
        icon: '話',
        title: {
          en: 'Older Community Chatter',
          zh: '长者社区闲谈',
          hi: 'समुदाय की धीमी बातचीत',
        },
        subtitle: {
          en: 'Slower conversational voices suggest long-term relationships between residents, vendors, and regulars.',
          zh: '较慢的闲谈声呈现居民、档主与熟客之间的长期关系。',
          hi: 'धीमी बातचीत निवासियों, विक्रेताओं और नियमित ग्राहकों के रिश्ते दिखाती है।',
        },
        url: '/audio/pei-ho-wet-market.m4a',
      },
    ],
  },
  'fuk-wing': {
    identity: {
      en: 'Echoes of Play & Nostalgia',
      zh: '玩乐与怀旧回声',
      hi: 'खेल और यादों की गूंज',
    },
    description: {
      en: 'A playful soundscape of toy noises and excited voices that turns retail into childhood memory.',
      zh: '由玩具聲與興奮人聲構成的玩樂聲景，把零售空間轉化為童年記憶。',
      hi: 'खिलौनों की आवाज़ और उत्साहित आवाजें मिलकर रिटेल को बचपन की स्मृति में बदलते हैं।',
    },
    layers: [
      {
        id: 'fuk-wing-toy-sounds',
        category: 'Digital Layer',
        icon: '★',
        title: {
          en: 'Toy Sounds',
          zh: '玩具声响',
          hi: 'खिलौनों की आवाज़ें',
        },
        subtitle: {
          en: 'Beeps, mechanical clicks, and playful sounds recall the sensory overload of toy shops.',
          zh: '哔声、机械点击与玩乐声，唤起玩具店的感官记忆。',
          hi: 'बीप, क्लिक और खिलौनों की ध्वनियाँ बचपन की यादें जगाती हैं।',
        },
        url: '/audio/toy-1.m4a',
      },
      {
        id: 'fuk-wing-excited-voices',
        category: 'Voices',
        icon: '!',
        title: {
          en: 'Excited Voices',
          zh: '兴奋人声',
          hi: 'उत्साहित आवाज़ें',
        },
        subtitle: {
          en: 'Children and energetic reactions frame the street as a place of discovery and small delights.',
          zh: '儿童与兴奋反应，让街道成为发现与小快乐的空间。',
          hi: 'बच्चों और उत्साहित प्रतिक्रियाओं की आवाज़ सड़क को आनंदमय बनाती है।',
        },
        url: '/audio/children-voices-huma.m4a',
      },
    ],
  },
}

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
      en: 'Golden Computer Arcade',
      zh: '黃金電腦商場',
      hi: 'गोल्डन कंप्यूटर आर्केड',
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

function createLocationMarkerElement(label: string) {
  const marker = document.createElement('button')
  marker.type = 'button'
  marker.className = 'leaflet-media-marker'
  marker.setAttribute('aria-label', label)
  marker.innerHTML = `
    <span class="leaflet-media-marker-label">${escapeHtml(label)}</span>
    <span class="leaflet-media-marker-glow"></span>
    <span class="leaflet-media-marker-pin">
      <span class="leaflet-media-marker-dot"></span>
    </span>
  `
  return marker
}

function createContributionMarkerElement(label: string) {
  const marker = document.createElement('button')
  marker.type = 'button'
  marker.className = 'leaflet-user-marker'
  marker.setAttribute('aria-label', label)
  marker.innerHTML = `
    <span class="leaflet-user-marker-glow"></span>
    <span class="leaflet-user-marker-icon">+</span>
  `
  return marker
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function getSubmissionMediaType(url: string) {
  const cleanUrl = url.split('?')[0].toLowerCase()
  const extension = cleanUrl.split('.').pop() ?? ''

  if (cleanUrl.includes('/audio/')) return 'audio'
  if (cleanUrl.includes('/video/')) return 'video'
  if (cleanUrl.includes('/image/')) return 'image'
  if (['mp4', 'webm', 'mov', 'm4v'].includes(extension)) return 'video'
  if (['mp3', 'wav', 'm4a', 'aac', 'flac', 'oga', 'ogg'].includes(extension)) return 'audio'
  return 'image'
}

function buildContributionPopupHtml(submission: SubmissionRow) {
  const safeTitle = escapeHtml(submission.title)
  const safeDescription = submission.description ? escapeHtml(submission.description) : ''
  const safeMediaUrl = escapeHtml(submission.image_url)
  const mediaType = getSubmissionMediaType(submission.image_url)
  const popupClass =
    mediaType === 'audio'
      ? 'leaflet-contribution-popup leaflet-contribution-popup-audio-card'
      : 'leaflet-contribution-popup'

  const mediaHtml =
    mediaType === 'video'
      ? `<video class="leaflet-contribution-popup-preview" controls playsinline src="${safeMediaUrl}"></video>`
      : mediaType === 'audio'
        ? `<audio class="leaflet-contribution-popup-audio" controls preload="none" src="${safeMediaUrl}"></audio>`
        : `<img class="leaflet-contribution-popup-preview" src="${safeMediaUrl}" alt="${safeTitle}" />`

  return `
    <article class="${popupClass}">
      <div class="leaflet-contribution-popup-header">
        <h3>${safeTitle}</h3>
      </div>
      ${safeDescription ? `<p class="leaflet-contribution-popup-description">${safeDescription}</p>` : ''}
      <div class="leaflet-contribution-popup-media">
        ${mediaHtml}
      </div>
    </article>
  `
}

function resolveSubmissionCoordinates(submission: SubmissionRow) {
  if (
    typeof submission.latitude === 'number' &&
    typeof submission.longitude === 'number' &&
    SSP_LEAFLET_BOUNDS.contains([submission.latitude, submission.longitude])
  ) {
    return {
      id: submission.id,
      lat: submission.latitude,
      lng: submission.longitude,
    }
  }
  return null
}

function getContributionOffset(index: number, total: number) {
  if (total <= 1) return { lat: 0, lng: 0 }

  const angle = (Math.PI * 2 * index) / total
  const radius = 0.00008 + Math.floor(index / 8) * 0.000035
  return {
    lat: Math.sin(angle) * radius,
    lng: Math.cos(angle) * radius,
  }
}

interface ShamShuiPoLeafletMapProps {
  activeId: string
  language: 'en' | 'zh' | 'hi'
  locations: MapLocation[]
  submissions: SubmissionRow[]
  getLocationName: (location: MapLocation) => string
  onLocationSelect: (locationId: string) => void
}

function ShamShuiPoLeafletMap({
  activeId,
  language,
  locations,
  submissions,
  getLocationName,
  onLocationSelect,
}: ShamShuiPoLeafletMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<LeafletMap | null>(null)
  const markerLayerRef = useRef<LayerGroup | null>(null)
  const contributionLayerRef = useRef<LayerGroup | null>(null)
  const markerElementRefs = useRef<Record<string, HTMLElement>>({})

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return undefined

    const map = L.map(containerRef.current, {
      center: SSP_CENTER,
      zoom: 17,
      minZoom: 15,
      maxZoom: 19,
      maxBounds: SSP_BOUNDS,
      maxBoundsViscosity: 0.7,
      zoomControl: false,
    })

    L.control.zoom({ position: 'bottomright' }).addTo(map)
    L.tileLayer(CARTO_LIGHT_TILE_URL, {
      maxZoom: 20,
      subdomains: 'abcd',
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    }).addTo(map)

    mapRef.current = map
    window.requestAnimationFrame(() => map.invalidateSize())

    return () => {
      markerLayerRef.current?.remove()
      contributionLayerRef.current?.remove()
      markerLayerRef.current = null
      contributionLayerRef.current = null
      markerElementRefs.current = {}
      map.remove()
      mapRef.current = null
    }
  }, [])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return undefined

    markerLayerRef.current?.remove()
    markerElementRefs.current = {}
    const markerLayer = L.layerGroup().addTo(map)
    markerLayerRef.current = markerLayer

    locations.forEach((location) => {
      const label = getLocationName(location)
      const markerElement = createLocationMarkerElement(label)
      markerElementRefs.current[location.id] = markerElement
      markerElement.classList.toggle('leaflet-media-marker-active', location.id === activeId)

      const icon = L.divIcon({
        className: 'leaflet-media-marker-wrapper',
        html: markerElement.outerHTML,
        iconSize: [200, 88],
        iconAnchor: [100, 84],
        popupAnchor: [0, -72],
      })

      const marker = L.marker([location.lat, location.lng], {
        icon,
        title: label,
        keyboard: true,
        zIndexOffset: 5000,
      })
        .addTo(markerLayer)

      const syncMarkerElement = () => {
        const element = marker.getElement()?.querySelector<HTMLElement>('.leaflet-media-marker')
        if (!element) return
        markerElementRefs.current[location.id] = element
        element.classList.toggle('leaflet-media-marker-active', location.id === activeId)
      }

      marker.on('add', syncMarkerElement)
      marker.on('click', () => {
        onLocationSelect(location.id)
      })

      syncMarkerElement()
    })

    return () => {
      markerLayer.remove()
      if (markerLayerRef.current === markerLayer) {
        markerLayerRef.current = null
      }
      markerElementRefs.current = {}
    }
  }, [getLocationName, language, locations, onLocationSelect])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return undefined

    contributionLayerRef.current?.remove()
    contributionLayerRef.current = null
    if (!SHOW_CONTRIBUTION_MARKERS) return undefined

    const contributionLayer = L.layerGroup().addTo(map)
    contributionLayerRef.current = contributionLayer

    const groupedSubmissions = new Map<string, Array<{ submission: SubmissionRow; lat: number; lng: number }>>()
    submissions.forEach((submission) => {
      const coordinates = resolveSubmissionCoordinates(submission)
      if (!coordinates) return

      const coordinateKey = `${coordinates.lat.toFixed(5)},${coordinates.lng.toFixed(5)}`
      const existing = groupedSubmissions.get(coordinateKey) ?? []
      existing.push({ submission, lat: coordinates.lat, lng: coordinates.lng })
      groupedSubmissions.set(coordinateKey, existing)
    })

    groupedSubmissions.forEach((locationSubmissions) => {
      locationSubmissions.forEach(({ submission, lat, lng }, index) => {
        const offset = getContributionOffset(index, locationSubmissions.length)
        const markerElement = createContributionMarkerElement(submission.title)
        const icon = L.divIcon({
          className: 'leaflet-user-marker-wrapper',
          html: markerElement.outerHTML,
          iconSize: [38, 38],
          iconAnchor: [19, 19],
          popupAnchor: [0, -18],
        })

        L.marker([lat + offset.lat, lng + offset.lng], {
          icon,
          title: submission.title,
          keyboard: true,
          zIndexOffset: 1000 + index,
        })
          .addTo(contributionLayer)
          .bindPopup(buildContributionPopupHtml(submission), {
            className: 'leaflet-contribution-popup-shell',
            autoPan: true,
            autoPanPadding: [24, 24],
            keepInView: true,
            maxWidth: 300,
            minWidth: 220,
          })
      })
    })

    return () => {
      contributionLayer.remove()
      if (contributionLayerRef.current === contributionLayer) {
        contributionLayerRef.current = null
      }
    }
  }, [submissions])

  useEffect(() => {
    Object.entries(markerElementRefs.current).forEach(([locationId, markerElement]) => {
      markerElement.classList.toggle('leaflet-media-marker-active', locationId === activeId)
    })
  }, [activeId])

  return <div ref={containerRef} className="absolute inset-0" aria-label="Leaflet Sham Shui Po media map" />
}

/** Scroll so the map stage clears the viewport and Research Overview sits below the archive navbar. */
function scrollWindowPastMapToResearchOverview(): boolean {
  const stage = document.getElementById('map-tour-map-stage')
  const research = document.getElementById('research-overview')
  if (!stage || !research) return false

  const nav = document.querySelector('[data-archive-navbar]')
  const navH = nav instanceof HTMLElement ? Math.ceil(nav.getBoundingClientRect().height) : 0

  const docScroll = window.scrollY || document.documentElement.scrollTop
  const stageBottomDoc = stage.getBoundingClientRect().bottom + docScroll

  const gapPx = 24
  window.scrollTo({ top: Math.max(0, stageBottomDoc + navH + gapPx), behavior: 'auto' })
  return true
}

/** Scroll so `#elementId` aligns below the fixed archive navbar (sections below the map column). */
function scrollDocumentToElementBelowArchiveNav(elementId: string): boolean {
  const el = document.getElementById(elementId)
  if (!el) return false

  const nav = document.querySelector('[data-archive-navbar]')
  const navH = nav instanceof HTMLElement ? Math.ceil(nav.getBoundingClientRect().height) : 0

  const docScroll = window.scrollY || document.documentElement.scrollTop
  const topDoc = el.getBoundingClientRect().top + docScroll

  const gapPx = 24
  window.scrollTo({ top: Math.max(0, topDoc - navH - gapPx), behavior: 'auto' })
  return true
}

interface ResearchOverviewSectionProps {
  onNavigateHome?: () => void
  homeAriaLabel: string
  homeCaption: string
  onScrollToFieldwork?: () => void
  scrollToFieldworkAria: string
  scrollDownLabel: string
}

function ResearchOverviewSection({
  onNavigateHome,
  homeAriaLabel,
  homeCaption,
  onScrollToFieldwork,
  scrollToFieldworkAria,
  scrollDownLabel,
}: ResearchOverviewSectionProps) {
  return (
    <section
      id="research-overview"
      aria-labelledby="research-overview-heading"
      className="relative scroll-mt-[calc(3rem+32px)] border-t border-[#2563eb]/25 bg-gradient-to-b from-[#f8fafc] to-[#ffffff] px-4 pb-24 pt-10 text-left text-[#0f172a] sm:px-8 sm:pb-28 sm:pt-14 lg:pb-[7.5rem]"
    >
      {onNavigateHome && (
        <div className="pointer-events-none absolute right-4 top-3 z-20 flex flex-col items-center gap-1 sm:right-8 sm:top-6">
          <button
            type="button"
            onClick={onNavigateHome}
            aria-label={homeAriaLabel}
            title={homeAriaLabel}
            className="group pointer-events-auto flex h-14 w-14 shrink-0 cursor-pointer items-center justify-center rounded-full border border-[#2563eb]/45 bg-white/92 text-[#2563eb] shadow-[0_14px_40px_rgba(15,23,42,0.14)] backdrop-blur transition duration-300 hover:border-[#2563eb] hover:bg-[#2563eb] hover:text-white hover:shadow-[0_18px_48px_rgba(37,99,235,0.22)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </button>
          <span className="pointer-events-none text-center text-[0.62rem] font-bold uppercase tracking-[0.2em] text-[#334155] drop-shadow-sm">
            {homeCaption}
          </span>
        </div>
      )}

      <div className="mx-auto max-w-3xl">
        <h2
          id="research-overview-heading"
          className="font-['Georgia',serif] text-3xl font-black leading-[1.15] tracking-tight text-[#082852] sm:text-4xl lg:text-[2.75rem]"
        >
          Research Overview
        </h2>
        <div className="mt-6 space-y-5 font-['Montserrat',sans-serif] text-base leading-relaxed text-[#334155] sm:mt-7 sm:text-lg">
          <p>
            This project explores Sham Shui Po through the lens of sensorial urbanism, examining how urban life is
            experienced through sound, smell, touch, movement, memory, and everyday interaction rather than through
            vision alone. As redevelopment and gentrification continue to transform the district, the research
            investigates how these changes reshape the sensory identity, collective memory, and lived experiences of the
            community.
          </p>
          <p className="font-medium text-[#0f172a]">
            Using interviews, field recordings, photography, participant observation, and community contributions, the
            study is guided by four central research questions:
          </p>
          <ol className="mt-1 list-decimal space-y-3 pl-6 marker:font-semibold marker:text-[#2563eb] sm:space-y-4">
            <li className="pl-2">
              How do the five senses shape the urban experience of residents in Sham Shui Po?
            </li>
            <li className="pl-2">
              How do sensory memories of older residents differ from the experiences of younger individuals?
            </li>
            <li className="pl-2">
              In what ways does redevelopment and gentrification reshape the sensory identity of the district?
            </li>
            <li className="pl-2">
              How can sensory richness and sensory memory be considered in future urban planning?
            </li>
          </ol>
        </div>
      </div>

      {onScrollToFieldwork && (
        <button
          type="button"
          onClick={onScrollToFieldwork}
          aria-label={scrollToFieldworkAria}
          title={scrollToFieldworkAria}
          className="group absolute bottom-6 right-5 z-20 inline-flex flex-row-reverse items-center gap-2 rounded-full border border-[#2563eb]/45 bg-white/90 py-0 pr-0 pl-4 shadow-[0_18px_50px_rgba(15,23,42,0.18)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-[#2563eb] hover:bg-[#2563eb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-4 focus-visible:ring-offset-white sm:bottom-7 sm:gap-3 sm:pl-5 lg:bottom-8"
        >
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-2xl text-[#2563eb] transition duration-300 group-hover:text-white">
            ↓
          </span>
          <span className="max-w-[6.5rem] text-right text-[0.74rem] font-black uppercase leading-tight tracking-[0.2em] antialiased text-[#1d4ed8] transition duration-300 group-hover:text-white sm:max-w-[11rem] sm:text-[0.82rem] sm:tracking-[0.22em]">
            {scrollDownLabel}
          </span>
        </button>
      )}
    </section>
  )
}

export function MapTour({
  onBackToHome,
  onLocationViewChange,
  navigateHomeSignal = 0,
  scrollToResearchOverviewSignal = 0,
  scrollToFieldworkInterviewsSignal = 0,
  scrollToGentrificationMemorySignal = 0,
  onResearchNavSectionChange,
  submissionRefreshKey = 0,
  directLocationId,
  directLocationRequestKey = 0,
}: MapTourProps) {
  const { language } = useLanguage()
  const [activeId, setActiveId] = useState<string>(mapLocations[0].id)
  const [view, setView] = useState<'map' | 'location'>('map')
  const [submissions, setSubmissions] = useState<SubmissionRow[]>(STATIC_CONTRIBUTIONS)
  const lastNavigateHomeSignalRef = useRef(0)
  const lastResearchOverviewSignalRef = useRef(0)
  const lastResearchOverviewScrollDoneRef = useRef(0)
  const lastFieldworkInterviewsSignalRef = useRef(0)
  const lastFieldworkInterviewsScrollDoneRef = useRef(0)
  const lastGentrificationMemorySignalRef = useRef(0)
  const lastGentrificationMemoryScrollDoneRef = useRef(0)

  useLayoutEffect(() => {
    if (navigateHomeSignal > lastNavigateHomeSignalRef.current) {
      lastNavigateHomeSignalRef.current = navigateHomeSignal
      setView('map')
      onLocationViewChange?.(false)
      return
    }

    if (scrollToResearchOverviewSignal > lastResearchOverviewSignalRef.current) {
      lastResearchOverviewSignalRef.current = scrollToResearchOverviewSignal
      setView('map')
      onLocationViewChange?.(false)
      return
    }

    if (scrollToFieldworkInterviewsSignal > lastFieldworkInterviewsSignalRef.current) {
      lastFieldworkInterviewsSignalRef.current = scrollToFieldworkInterviewsSignal
      setView('map')
      onLocationViewChange?.(false)
      return
    }

    if (scrollToGentrificationMemorySignal > lastGentrificationMemorySignalRef.current) {
      lastGentrificationMemorySignalRef.current = scrollToGentrificationMemorySignal
      setView('map')
      onLocationViewChange?.(false)
      return
    }

    if (directLocationId) {
      const locationExists = mapLocations.some((location) => location.id === directLocationId)
      if (locationExists) {
        setActiveId(directLocationId)
        setView('location')
        onLocationViewChange?.(true)
        return
      }
    }
    onLocationViewChange?.(view === 'location')
  }, [
    navigateHomeSignal,
    scrollToResearchOverviewSignal,
    scrollToFieldworkInterviewsSignal,
    scrollToGentrificationMemorySignal,
    directLocationId,
    directLocationRequestKey,
    view,
    onLocationViewChange,
  ])

  useEffect(() => {
    if (scrollToResearchOverviewSignal <= 0) return
    if (scrollToResearchOverviewSignal <= lastResearchOverviewScrollDoneRef.current) return
    if (view !== 'map') return

    let cancelled = false

    const scrollResearchIntoView = () => {
      if (cancelled) return
      if (scrollWindowPastMapToResearchOverview()) {
        lastResearchOverviewScrollDoneRef.current = scrollToResearchOverviewSignal
      }
    }

    let outerRaf = 0
    let innerRaf = 0

    outerRaf = window.requestAnimationFrame(() => {
      innerRaf = window.requestAnimationFrame(() => {
        scrollResearchIntoView()
      })
    })

    return () => {
      cancelled = true
      window.cancelAnimationFrame(outerRaf)
      window.cancelAnimationFrame(innerRaf)
    }
  }, [scrollToResearchOverviewSignal, view])

  useEffect(() => {
    if (scrollToFieldworkInterviewsSignal <= 0) return
    if (scrollToFieldworkInterviewsSignal <= lastFieldworkInterviewsScrollDoneRef.current) return
    if (view !== 'map') return

    let cancelled = false

    const runScroll = () => {
      if (cancelled) return
      if (scrollDocumentToElementBelowArchiveNav('fieldwork-interviews')) {
        lastFieldworkInterviewsScrollDoneRef.current = scrollToFieldworkInterviewsSignal
      }
    }

    let outerRaf = 0
    let innerRaf = 0

    outerRaf = window.requestAnimationFrame(() => {
      innerRaf = window.requestAnimationFrame(() => {
        runScroll()
      })
    })

    return () => {
      cancelled = true
      window.cancelAnimationFrame(outerRaf)
      window.cancelAnimationFrame(innerRaf)
    }
  }, [scrollToFieldworkInterviewsSignal, view])

  useEffect(() => {
    if (scrollToGentrificationMemorySignal <= 0) return
    if (scrollToGentrificationMemorySignal <= lastGentrificationMemoryScrollDoneRef.current) return
    if (view !== 'map') return

    let cancelled = false

    const runScroll = () => {
      if (cancelled) return
      if (scrollDocumentToElementBelowArchiveNav('gentrification-memory')) {
        lastGentrificationMemoryScrollDoneRef.current = scrollToGentrificationMemorySignal
      }
    }

    let outerRaf = 0
    let innerRaf = 0

    outerRaf = window.requestAnimationFrame(() => {
      innerRaf = window.requestAnimationFrame(() => {
        runScroll()
      })
    })

    return () => {
      cancelled = true
      window.cancelAnimationFrame(outerRaf)
      window.cancelAnimationFrame(innerRaf)
    }
  }, [scrollToGentrificationMemorySignal, view])

  useEffect(() => {
    if (!SHOW_CONTRIBUTION_MARKERS) {
      setSubmissions([])
      return
    }

    if (!supabase || !isSupabaseConfigured) {
      setSubmissions(STATIC_CONTRIBUTIONS)
      return
    }

    const client = supabase
    let cancelled = false

    const fetchSubmissions = async () => {
      const { data, error } = await client
        .from('submissions')
        .select('id, title, description, image_url, place_name, latitude, longitude, created_at')
        .order('created_at', { ascending: false })

      if (cancelled) return
      if (error) {
        console.warn('[MapTour] Failed to load submissions:', error.message)
        setSubmissions(STATIC_CONTRIBUTIONS)
        return
      }

      setSubmissions([...STATIC_CONTRIBUTIONS, ...((data ?? []) as SubmissionRow[])])
    }

    void fetchSubmissions()

    return () => {
      cancelled = true
    }
  }, [submissionRefreshKey])

  const mapCopy = {
    en: {
      backToHomeAria: 'Go to homepage',
      homepageLabel: 'Homepage',
      scrollToResearchAria: 'Scroll to Research Overview',
      scrollToFieldworkAria: 'Scroll to Fieldwork and Interviews',
      scrollDownLabel: 'Scroll Down',
    },
    zh: {
      backToHomeAria: '返回主頁',
      homepageLabel: '主頁',
      scrollToResearchAria: '前往研究概覽',
      scrollToFieldworkAria: '前往田野調查與訪談',
      scrollDownLabel: '向下捲動',
    },
    hi: {
      backToHomeAria: 'होमपेज पर जाएँ',
      homepageLabel: 'होमपेज',
      scrollToResearchAria: 'अनुसंधान अवलोकन पर जाएँ',
      scrollToFieldworkAria: 'फ़ील्डवर्क और साक्षात्कार पर जाएँ',
      scrollDownLabel: 'नीचे स्क्रॉल करें',
    },
  }[language]

  const activeLocation = useMemo<MapLocation>(
    () => mapLocations.find((location) => location.id === activeId) ?? mapLocations[0],
    [activeId],
  )
  const getLocationName = useCallback(
    (location: MapLocation) =>
      (locationLocalized[location.id]?.name[language] ??
        (language === 'zh' ? location.nameZh : location.nameEn)),
    [language],
  )

  const handleLocationSelect = useCallback((locationId: string) => {
    setActiveId(locationId)
    setView('location')
  }, [])

  useEffect(() => {
    if (!onResearchNavSectionChange) return

    if (view !== 'map') {
      onResearchNavSectionChange(null)
      return
    }

    const overview = document.getElementById('research-overview')
    const fieldwork = document.getElementById('fieldwork-interviews')
    const gentrification = document.getElementById('gentrification-memory')
    const nav = document.querySelector('[data-archive-navbar]')
    const navH = nav instanceof HTMLElement ? Math.ceil(nav.getBoundingClientRect().height) : 52

    const ratios = new Map<string, number>()
    const rootMarginTop = Math.min(navH + 20, Math.round(window.innerHeight * 0.38))
    const rootMargin = `-${rootMarginTop}px 0px -44% 0px`

    const publish = () => {
      const ro = ratios.get('research-overview') ?? 0
      const rf = ratios.get('fieldwork-interviews') ?? 0
      const rg = ratios.get('gentrification-memory') ?? 0
      const t = 0.08
      let next: 'overview' | 'fieldwork' | 'gentrification' | null = null
      if (rg >= 0.16) next = 'gentrification'
      else if (rf >= t && rf >= ro - 0.04) next = 'fieldwork'
      else if (ro >= t) next = 'overview'
      onResearchNavSectionChange(next)
    }

    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          ratios.set((e.target as HTMLElement).id, e.intersectionRatio)
        }
        publish()
      },
      {
        threshold: [0, 0.05, 0.1, 0.15, 0.22, 0.35, 0.5, 0.65, 0.8, 1],
        rootMargin,
      },
    )

    if (overview) obs.observe(overview)
    if (fieldwork) obs.observe(fieldwork)
    if (gentrification) obs.observe(gentrification)

    const onScrollResize = () => publish()
    window.addEventListener('scroll', onScrollResize, { passive: true })
    window.addEventListener('resize', onScrollResize)
    publish()

    return () => {
      obs.disconnect()
      window.removeEventListener('scroll', onScrollResize)
      window.removeEventListener('resize', onScrollResize)
    }
  }, [view, onResearchNavSectionChange])

  if (view === 'location') {
    return (
      <LocationPage location={activeLocation} language={language} />
    )
  }

  return (
    <div className="fade-in w-full bg-[#ffffff] text-[#0f172a]">
      <div id="map-tour-map-stage" className="relative min-h-[100svh] w-full lg:min-h-screen">
        <section className="absolute inset-0 overflow-hidden bg-[#ffffff]">
          <ShamShuiPoLeafletMap
            activeId={activeId}
            language={language}
            locations={mapLocations}
            submissions={submissions}
            getLocationName={getLocationName}
            onLocationSelect={handleLocationSelect}
          />
          <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle_at_20%_15%,rgba(37,99,235,0.18),transparent_38%),radial-gradient(circle_at_80%_78%,rgba(219,234,254,0.34),transparent_36%)]" />
          <div className="pointer-events-none absolute bottom-6 left-4 z-[1000] flex max-w-[min(24rem,calc(100%-2rem))] items-center gap-3 rounded-2xl border border-[#2563eb]/20 bg-white/92 px-5 py-4 text-sm font-semibold leading-relaxed text-[#0f172a] shadow-sm backdrop-blur sm:left-8 sm:text-base">
            <span className="relative inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#2563eb] text-xl font-black leading-none text-white shadow-[0_0_0_6px_rgba(37,99,235,0.16)]">
              +
            </span>
            <span>Click on community contributed media in order to view them.</span>
          </div>
          <div className="pointer-events-none absolute bottom-5 right-5 z-[1000]">
            <button
              type="button"
              onClick={() => scrollWindowPastMapToResearchOverview()}
              aria-label={mapCopy.scrollToResearchAria}
              title={mapCopy.scrollToResearchAria}
              className="group pointer-events-auto inline-flex flex-row-reverse items-center gap-2 rounded-full border border-[#2563eb]/45 bg-white/90 py-0 pr-0 pl-4 shadow-[0_18px_50px_rgba(15,23,42,0.18)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-[#2563eb] hover:bg-[#2563eb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-4 focus-visible:ring-offset-white sm:gap-3 sm:pl-5"
            >
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-2xl text-[#2563eb] transition duration-300 group-hover:text-white">
                ↓
              </span>
              <span className="max-w-[6.5rem] text-right text-[0.74rem] font-black uppercase leading-tight tracking-[0.2em] antialiased text-[#1d4ed8] transition duration-300 group-hover:text-white sm:max-w-[11rem] sm:text-[0.82rem] sm:tracking-[0.22em]">
                {mapCopy.scrollDownLabel}
              </span>
            </button>
          </div>
          <div className="pointer-events-none absolute top-4 right-4 z-[1000] flex flex-col items-center gap-1 sm:top-6 sm:right-8">
            {onBackToHome && (
              <>
                <button
                  type="button"
                  onClick={onBackToHome}
                  aria-label={mapCopy.backToHomeAria}
                  title={mapCopy.backToHomeAria}
                  className="group pointer-events-auto flex h-14 w-14 shrink-0 cursor-pointer items-center justify-center rounded-full border border-[#2563eb]/45 bg-white/92 text-[#2563eb] shadow-[0_14px_40px_rgba(15,23,42,0.14)] backdrop-blur transition duration-300 hover:border-[#2563eb] hover:bg-[#2563eb] hover:text-white hover:shadow-[0_18px_48px_rgba(37,99,235,0.22)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                </button>
                <span className="pointer-events-none text-center text-[0.62rem] font-bold uppercase tracking-[0.2em] text-[#334155] drop-shadow-sm">
                  {mapCopy.homepageLabel}
                </span>
              </>
            )}
          </div>
        </section>
      </div>

      <ResearchOverviewSection
        onNavigateHome={onBackToHome}
        homeAriaLabel={mapCopy.backToHomeAria}
        homeCaption={mapCopy.homepageLabel}
        onScrollToFieldwork={() => scrollDocumentToElementBelowArchiveNav('fieldwork-interviews')}
        scrollToFieldworkAria={mapCopy.scrollToFieldworkAria}
        scrollDownLabel={mapCopy.scrollDownLabel}
      />
      <FieldworkInterviewsSection
        onNavigateHome={onBackToHome}
        homeAriaLabel={mapCopy.backToHomeAria}
        homeCaption={mapCopy.homepageLabel}
      />
    </div>
  )
}

interface LocationPageProps {
  location: MapLocation
  language: 'en' | 'zh' | 'hi'
}

interface WaveformProgressBarProps {
  progress: number
  currentTime: number
  duration: number
}

function formatAudioTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds <= 0) return '0:00'

  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)
  return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`
}

function WaveformProgressBar({ progress, currentTime, duration }: WaveformProgressBarProps) {
  const bars = useMemo(
    () =>
      Array.from({ length: 72 }, (_, index) => {
        const wave = Math.sin(index * 0.82) * 0.45 + Math.sin(index * 0.23) * 0.35
        return 16 + Math.round((Math.abs(wave) + ((index * 13) % 7) / 18) * 18)
      }),
    [],
  )
  const safeProgress = Math.max(0, Math.min(1, progress))

  return (
    <div className="flex w-full items-center gap-2 text-[11px] font-medium tabular-nums text-[#334155]">
      <span className="w-9 text-right">{formatAudioTime(currentTime)}</span>
      <div
        className="relative flex h-8 min-w-0 flex-1 items-center gap-[2px] rounded-full border border-stone-200/80 bg-white/55 px-2"
        aria-hidden="true"
      >
        {bars.map((height, index) => {
          const barProgress = index / Math.max(1, bars.length - 1)
          const filled = barProgress <= safeProgress

          return (
            <span
              key={index}
              className={`w-0.5 flex-1 rounded-full opacity-75 transition-colors duration-150 ${
                filled ? 'bg-[#2563eb]/80' : 'bg-[#ffffff]/30'
              }`}
              style={{ height: `${height}%` }}
            />
          )
        })}
        <span
          className="absolute top-1.5 bottom-1.5 w-px rounded-full bg-stone-700/35 transition-[left] duration-100"
          style={{ left: `calc(0.5rem + ${safeProgress} * (100% - 1rem))` }}
        />
      </div>
      <span className="w-9">{formatAudioTime(duration)}</span>
    </div>
  )
}

function LocationPage({ location, language }: LocationPageProps) {
  const [masterVolume, setMasterVolume] = useState(0.8)
  const [muted, setMuted] = useState(false)
  const [activeSoundId, setActiveSoundId] = useState<string | null>(null)
  const [activeProgress, setActiveProgress] = useState(0)
  const [activeTime, setActiveTime] = useState(0)
  const [activeDuration, setActiveDuration] = useState(0)
  const soundRefs = useRef<Record<string, HTMLAudioElement | null>>({})

  const locationCopy = {
    en: {
      pageLabel: 'Location Page',
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
  const communityMemory = locationCommunityMemories[location.id] ?? locationCommunityMemories.golden
  const timelineItems = locationTimelineItems[location.id] ?? locationTimelineItems.golden

  const soundscape = soundscapes[location.id] ?? soundscapes.apliu
  const demoSounds = soundscape.layers
  const categoryOrder = ['Voices', 'Environment', 'Digital Layer']
  const soundGroups = categoryOrder
    .map((category) => ({
      category,
      layers: demoSounds.filter((sound) => sound.category === category),
    }))
    .filter((group) => group.layers.length > 0)

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

  useEffect(() => {
    if (!activeSoundId) return undefined

    let animationFrame = 0
    const updateProgress = () => {
      const audio = soundRefs.current[activeSoundId]
      if (audio && Number.isFinite(audio.duration) && audio.duration > 0) {
        setActiveProgress(audio.currentTime / audio.duration)
        setActiveTime(audio.currentTime)
        setActiveDuration(audio.duration)
      }
      animationFrame = requestAnimationFrame(updateProgress)
    }

    updateProgress()
    return () => cancelAnimationFrame(animationFrame)
  }, [activeSoundId])

  const handleToggleSound = async (soundId: string) => {
    if (activeSoundId === soundId) {
      const playing = soundRefs.current[soundId]
      if (playing) {
        playing.pause()
        playing.currentTime = 0
      }
      setActiveSoundId(null)
      setActiveProgress(0)
      setActiveTime(0)
      setActiveDuration(0)
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
      setActiveTime(target.currentTime)
      setActiveDuration(Number.isFinite(target.duration) ? target.duration : 0)
      setActiveProgress(
        Number.isFinite(target.duration) && target.duration > 0
          ? target.currentTime / target.duration
          : 0,
      )
    } catch {
      setActiveSoundId(null)
      setActiveProgress(0)
      setActiveTime(0)
      setActiveDuration(0)
    }
  }

  const heroDescription = locationHeroDescriptions[location.id]?.[language] ?? displaySummary
  const immersiveLocationIds = new Set<string>(immersiveTimelineLocationIds)
  const usesImmersiveLayout = immersiveLocationIds.has(location.id)
  const sectionIds = {
    details: `${location.id}-details`,
    soundscapes: `${location.id}-soundscapes`,
    memoryScroll: `${location.id}-memory-scroll`,
  } as const
  const standardLocationViewClass =
    'h-full min-h-[320px] w-full transition-transform duration-500 ease-in-out hover:scale-[1.01] sm:min-h-[460px] lg:min-h-[560px]'

  const renderLocationView = (className: string) => {
    if (location.liveViewType === 'embed') {
      return (
        <iframe
          src={location.liveViewUrl}
          title={displayName}
          className={className}
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      )
    }

    if (location.streetView) {
      return (
        <div className={className}>
          <GoogleStreetView
            lat={location.streetView.lat}
            lng={location.streetView.lng}
            heading={location.streetView.heading}
            pitch={location.streetView.pitch}
            zoom={location.streetView.zoom}
          />
        </div>
      )
    }

    if (location.liveViewType === 'video') {
      return (
        <video
          src={location.liveViewUrl}
          controls
          autoPlay
          muted
          loop
          className={`${className} object-cover`}
        />
      )
    }

    return (
      <img
        src={location.liveViewUrl}
        alt={displayName}
        className={`${className} object-cover`}
      />
    )
  }

  if (usesImmersiveLayout) {
    return (
      <div className="fade-in min-h-screen w-full overflow-auto bg-[#ffffff] text-[#0f172a]">
        <section className="relative px-4 pb-8 pt-8 sm:px-8 sm:pb-10 sm:pt-12">
          <div className="relative mx-auto h-[68vh] min-h-[420px] max-w-6xl overflow-hidden rounded-[2rem] border border-[#ffffff]/60 bg-black shadow-[0_28px_70px_rgba(0,0,0,0.34),0_8px_18px_rgba(37,99,235,0.14)]">
            {renderLocationView('h-full w-full')}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/55 to-transparent" />
            <div className="pointer-events-none absolute bottom-5 left-1/2 z-20 -translate-x-1/2 text-center text-[0.64rem] font-semibold uppercase tracking-[0.32em] text-white/80">
              Scroll to explore
            </div>
            <div className="absolute bottom-10 right-4 z-20 flex flex-col gap-2 sm:right-6">
              <a
                href={`#${sectionIds.details}`}
                className="rounded-full border border-white/35 bg-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white shadow-lg backdrop-blur transition hover:bg-white/25"
              >
                Details ↓
              </a>
              <a
                href={`#${sectionIds.soundscapes}`}
                className="rounded-full border border-white/35 bg-[#2563eb] px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white shadow-lg backdrop-blur transition hover:bg-[#ffffff] hover:text-[#0f172a]"
              >
                Soundscape ↓
              </a>
            </div>
          </div>
        </section>

        <section id={sectionIds.details} className="scroll-mt-6 px-4 pb-12 pt-4 sm:px-8 sm:pb-16">
          <div className="mx-auto max-w-6xl rounded-[2rem] border border-[#2563eb]/50 bg-[#ffffff] px-6 py-10 shadow-[0_28px_80px_rgba(37,99,235,0.18)] sm:px-8 sm:py-14 lg:px-10 lg:py-16">
            <p className="text-sm tracking-widest text-[#2563eb] uppercase">{locationCopy.pageLabel}</p>
            <h2 className="mt-2 break-words font-['Georgia',serif] text-4xl font-black leading-tight text-[#0f172a] sm:text-5xl lg:text-[3.75rem]">
              {displayName}
            </h2>
            <p className="mt-5 max-w-3xl break-words font-['Montserrat',sans-serif] text-lg leading-relaxed text-[#334155] sm:text-xl">
              {heroDescription}
            </p>
          </div>
        </section>

        <section id={sectionIds.soundscapes} className="scroll-mt-6 px-4 pb-12 sm:px-8 sm:pb-16">
          <div className="mx-auto max-w-6xl">
            <div className="mb-6 rounded-2xl border border-[#2563eb]/50 bg-[#ffffff] p-5 shadow-sm">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-2xl font-semibold tracking-widest text-[#2563eb] uppercase">
                    {locationCopy.demoSounds}
                  </p>
                  <p className="mt-2 max-w-2xl text-base italic leading-relaxed text-[#334155]">
                    {soundscape.description?.[language] ??
                      'A layered soundscape of social voices, environmental texture, and local movement that reflects this place’s identity.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {soundGroups.map((group) => (
                <section key={group.category}>
                  <p className="mb-3 text-xs font-semibold tracking-widest text-[#2563eb] uppercase">
                    {group.category}
                  </p>
                  <div className="grid gap-3">
                    {group.layers.map((sound) => {
                      const isActive = activeSoundId === sound.id
                      return (
                        <div
                          key={sound.id}
                          className={`group relative overflow-hidden rounded-2xl border p-4 transition-all duration-200 ease-in-out hover:-translate-y-1 hover:shadow-md ${
                            isActive
                              ? 'border-[#2563eb] bg-[#2563eb]/30 shadow-sm'
                              : 'border-[#ffffff]/80 bg-[#ffffff]/70 hover:border-[#2563eb]/70'
                          }`}
                        >
                          {isActive && (
                            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,rgba(37,99,235,0.24),transparent_34%)]" />
                          )}
                          <div className="flex min-w-0 items-start gap-4">
                            <button
                              type="button"
                              onClick={() => void handleToggleSound(sound.id)}
                              className={`inline-flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-full text-lg transition-all duration-200 ease-in-out hover:scale-105 ${
                                isActive
                                  ? 'bg-[#2563eb] text-white hover:bg-[#ffffff] hover:text-[#0f172a]'
                                  : 'bg-[#ffffff] text-[#0f172a] hover:bg-[#2563eb] hover:text-white'
                              }`}
                              aria-label={isActive ? `Pause ${sound.title[language]}` : `Play ${sound.title[language]}`}
                            >
                              {isActive ? '⏸' : '▶'}
                            </button>
                            <div className="min-w-0 flex-1">
                              <p className="font-semibold text-[#0f172a]">{sound.title[language]}</p>
                              <p className="mt-2 text-sm italic leading-relaxed text-[#334155]">
                                {sound.subtitle[language]}
                              </p>
                              {sound.interpretation && (
                                <p className="mt-2 text-sm italic leading-relaxed text-[#475569]">
                                  {sound.interpretation[language]}
                                </p>
                              )}
                              <div className={`mt-3 transition-all duration-300 ease-out ${
                                isActive
                                  ? 'max-h-12 opacity-100'
                                  : 'max-h-0 overflow-hidden opacity-0'
                              }`}>
                                {isActive && (
                                  <WaveformProgressBar
                                    progress={activeProgress}
                                    currentTime={activeTime}
                                    duration={activeDuration}
                                  />
                                )}
                              </div>
                              {isActive && (
                                <p className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-[#2563eb]">
                                  <span className="h-2 w-2 animate-pulse rounded-full bg-[#2563eb]" />
                                  Now Playing
                                </p>
                              )}
                            </div>
                          </div>
                          <audio
                            ref={(el) => {
                              soundRefs.current[sound.id] = el
                            }}
                            src={sound.url}
                            loop
                            preload="none"
                            onLoadedMetadata={(event) => {
                              if (activeSoundId === sound.id) {
                                setActiveDuration(event.currentTarget.duration)
                              }
                            }}
                            onTimeUpdate={(event) => {
                              const audio = event.currentTarget
                              if (activeSoundId === sound.id && Number.isFinite(audio.duration) && audio.duration > 0) {
                                setActiveProgress(audio.currentTime / audio.duration)
                                setActiveTime(audio.currentTime)
                                setActiveDuration(audio.duration)
                              }
                            }}
                            onEnded={() => {
                              if (activeSoundId === sound.id) {
                                setActiveSoundId(null)
                                setActiveProgress(0)
                                setActiveTime(0)
                                setActiveDuration(0)
                              }
                            }}
                          />
                        </div>
                      )
                    })}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </section>

        <section id={sectionIds.memoryScroll} className="scroll-mt-6 px-4 pb-12 sm:px-8 sm:pb-16">
          <div className="mx-auto max-w-6xl border-t border-[#2563eb]/50 pt-8">
            <TimelineScroll
              title="Memory Scroll"
              items={timelineItems}
              className="bg-[#ffffff]"
            />
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="fade-in min-h-screen w-full overflow-auto bg-[#ffffff] px-4 py-8 text-[#0f172a] sm:px-8 sm:py-12">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4">
        <section className="rounded-[2rem] border border-[#2563eb]/50 bg-[#ffffff] px-6 py-10 shadow-sm sm:px-8 sm:py-14 lg:px-10 lg:py-16">
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[0.4fr_0.6fr] lg:gap-12">
            <div className="min-w-0">
              <p className="text-sm tracking-widest text-[#2563eb] uppercase">{locationCopy.pageLabel}</p>
              <h2 className="mt-2 break-words font-['Georgia',serif] text-4xl font-black leading-tight text-[#0f172a] sm:text-5xl lg:text-[3.75rem]">{displayName}</h2>
              <p className="mt-5 max-w-xl break-words font-['Montserrat',sans-serif] text-lg leading-relaxed text-[#334155] sm:text-xl">
                {heroDescription}
              </p>
            </div>

            <div className="relative w-full overflow-hidden rounded-[1.75rem] border border-[#2563eb]/50 bg-[#ffffff] shadow-[0_28px_70px_rgba(0,0,0,0.26),0_8px_18px_rgba(37,99,235,0.12)]">
              {renderLocationView(standardLocationViewClass)}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
          </div>
        </section>

        <div className="w-full py-2">
          <div className="mb-6 rounded-2xl border border-[#2563eb]/50 bg-[#ffffff] p-6 shadow-sm">
            <p className="mb-4 text-2xl font-semibold tracking-widest text-[#2563eb] uppercase">
              Community Memory
            </p>
            <div className="border-l-2 border-[#2563eb] pl-4">
              <blockquote className="font-['Montserrat',sans-serif] text-base italic leading-relaxed text-[#0f172a] sm:text-lg">
                “{communityMemory.quote[language]}”
              </blockquote>
              <p className="mt-2 text-sm text-[#334155]">
                — {communityMemory.attribution[language]}
              </p>
            </div>
          </div>

          <div className="mb-6 rounded-2xl border border-[#2563eb]/50 bg-[#ffffff] p-5 shadow-sm">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-2xl font-semibold tracking-widest text-[#2563eb] uppercase">
                  {locationCopy.demoSounds}
                </p>
                <p className="mt-2 max-w-2xl text-base italic leading-relaxed text-[#334155]">
                  {soundscape.description?.[language] ??
                    'A layered soundscape of social voices, environmental texture, and local movement that reflects this place’s identity.'}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {soundGroups.map((group) => (
              <section key={group.category}>
                <p className="mb-3 text-xs font-semibold tracking-widest text-[#2563eb] uppercase">
                  {group.category}
                </p>
                <div className="grid gap-3">
                  {group.layers.map((sound) => {
                    const isActive = activeSoundId === sound.id
                    return (
                      <div
                        key={sound.id}
                        className={`group relative overflow-hidden rounded-2xl border p-4 transition-all duration-200 ease-in-out hover:-translate-y-1 hover:shadow-md ${
                          isActive
                            ? 'border-[#2563eb] bg-[#2563eb]/30 shadow-sm'
                            : 'border-[#ffffff]/80 bg-[#ffffff]/70 hover:border-[#2563eb]/70'
                        }`}
                      >
                        {isActive && (
                          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,rgba(37,99,235,0.24),transparent_34%)]" />
                        )}
                        <div className="flex min-w-0 items-start gap-4">
                          <button
                            type="button"
                            onClick={() => void handleToggleSound(sound.id)}
                            className={`inline-flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-full text-lg transition-all duration-200 ease-in-out hover:scale-105 ${
                              isActive
                                ? 'bg-[#2563eb] text-white hover:bg-[#ffffff] hover:text-[#0f172a]'
                                : 'bg-[#ffffff] text-[#0f172a] hover:bg-[#2563eb] hover:text-white'
                            }`}
                            aria-label={isActive ? `Pause ${sound.title[language]}` : `Play ${sound.title[language]}`}
                          >
                            {isActive ? '⏸' : '▶'}
                          </button>
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-[#0f172a]">{sound.title[language]}</p>
                            <p className="mt-2 text-sm italic leading-relaxed text-[#334155]">
                              {sound.subtitle[language]}
                            </p>
                            {sound.interpretation && (
                              <p className="mt-2 text-sm italic leading-relaxed text-[#475569]">
                                {sound.interpretation[language]}
                              </p>
                            )}
                            <div className={`mt-3 transition-all duration-300 ease-out ${
                              isActive
                                ? 'max-h-12 opacity-100'
                                : 'max-h-0 overflow-hidden opacity-0'
                            }`}>
                              {isActive && (
                                <WaveformProgressBar
                                  progress={activeProgress}
                                  currentTime={activeTime}
                                  duration={activeDuration}
                                />
                              )}
                            </div>
                            {isActive && (
                              <p className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-[#2563eb]">
                                <span className="h-2 w-2 animate-pulse rounded-full bg-[#2563eb]" />
                                Now Playing
                              </p>
                            )}
                          </div>
                        </div>
                        <audio
                          ref={(el) => {
                            soundRefs.current[sound.id] = el
                          }}
                          src={sound.url}
                          loop
                          preload="none"
                          onLoadedMetadata={(event) => {
                            if (activeSoundId === sound.id) {
                              setActiveDuration(event.currentTarget.duration)
                            }
                          }}
                          onTimeUpdate={(event) => {
                            const audio = event.currentTarget
                            if (activeSoundId === sound.id && Number.isFinite(audio.duration) && audio.duration > 0) {
                              setActiveProgress(audio.currentTime / audio.duration)
                              setActiveTime(audio.currentTime)
                              setActiveDuration(audio.duration)
                            }
                          }}
                          onEnded={() => {
                            if (activeSoundId === sound.id) {
                              setActiveSoundId(null)
                              setActiveProgress(0)
                              setActiveTime(0)
                              setActiveDuration(0)
                            }
                          }}
                        />
                      </div>
                    )
                  })}
                </div>
              </section>
            ))}
          </div>
          <div className="mt-10 border-t border-[#2563eb]/50 pt-8">
            <TimelineScroll
              title="Memory Scroll"
              items={timelineItems}
              className="bg-[#ffffff]"
            />
          </div>
        </div>
      </div>
    </div>
  )
}



