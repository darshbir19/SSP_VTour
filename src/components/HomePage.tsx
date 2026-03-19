import { useLanguage } from '../context/LanguageContext'

interface HomePageProps {
  onScrollToMap: () => void
}

export function HomePage({ onScrollToMap }: HomePageProps) {
  const { language } = useLanguage()
  const copy = {
    en: {
      subtitle: 'Sham Shui Po Virtual Tour',
      description: 'More than a map—feel the vibe of Sham Shui Po.',
      guide: 'Explore the neighborhood through interactive locations, sounds, and stories.',
    },
    zh: {
      subtitle: '深水埗虚拟导览',
      description: '不只是地图——感受深水埗的独特氛围。',
      guide: '通过互动地点、声音与故事探索这个社区。',
    },
    hi: {
      subtitle: 'शाम शुई पो वर्चुअल टूर',
      description: 'यह सिर्फ नक्शा नहीं—शाम शुई पो की असली वाइब महसूस करें।',
      guide: 'इंटरैक्टिव लोकेशन, ध्वनियों और कहानियों के जरिए इलाके को एक्सप्लोर करें।',
    },
  }[language]

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden px-2 pt-16 sm:px-0 sm:pt-0">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            'url(/images/Pei-Ho-Street_Wet-Market.jpg)',
          filter: 'blur(7px) brightness(0.6)',
          transform: 'scale(1.06)',
        }}
      />
      <div className="absolute inset-0 bg-black/30" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-b from-transparent via-black/35 to-[#07080f]" />

      <div className="fade-in relative z-10 flex w-[min(94vw,980px)] flex-col items-center gap-3 px-4 text-center sm:gap-4 sm:px-6">
        <h1 className="w-full text-3xl font-semibold leading-tight tracking-wide text-white sm:text-6xl lg:text-7xl">{copy.subtitle}</h1>
        <p className="w-full text-sm font-medium text-slate-100 sm:text-lg">
          {copy.description}
        </p>
        <p className="max-w-2xl text-xs text-slate-300 sm:text-base">{copy.guide}</p>
      </div>

      <div className="pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 animate-bounce text-[11px] tracking-wider text-white/80 sm:bottom-6 sm:text-xs">
        Scroll to explore
      </div>

      <button
        type="button"
        onClick={onScrollToMap}
        aria-label="Scroll to map"
        className="absolute bottom-4 right-4 z-20 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/18 bg-[rgba(15,23,42,0.45)] p-0 text-lg text-slate-50 backdrop-blur transition hover:bg-white/12 sm:bottom-6 sm:right-6 sm:h-12 sm:w-12"
      >
        ↓
      </button>
    </div>
  )
}

