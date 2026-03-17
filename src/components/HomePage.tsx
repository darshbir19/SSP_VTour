import { useLanguage } from '../context/LanguageContext'

interface HomePageProps {
  onStart: () => void
}

export function HomePage({ onStart }: HomePageProps) {
  const { language } = useLanguage()
  const copy = {
    en: {
      subtitle: 'Sham Shui Po Virtual Tour',
      description: 'More than a map—feel the vibe of Sham Shui Po.',
      guide: 'Explore the neighborhood through interactive locations, sounds, and stories.',
      cta: 'Experience Sham Shui Po',
      contribute: 'Contribute Your SSP Experience',
    },
    zh: {
      subtitle: '深水埗虚拟导览',
      description: '不只是地图——感受深水埗的独特氛围。',
      guide: '通过互动地点、声音与故事探索这个社区。',
      cta: '体验深水埗',
      contribute: '提交你的深水埗体验',
    },
    hi: {
      subtitle: 'शाम शुई पो वर्चुअल टूर',
      description: 'यह सिर्फ नक्शा नहीं—शाम शुई पो की असली वाइब महसूस करें।',
      guide: 'इंटरैक्टिव लोकेशन, ध्वनियों और कहानियों के जरिए इलाके को एक्सप्लोर करें।',
      cta: 'शाम शुई पो का अनुभव करें',
      contribute: 'अपना SSP अनुभव साझा करें',
    },
  }[language]

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
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

      <div className="fade-in relative z-10 flex w-[min(92vw,980px)] flex-col items-center gap-4 px-6 text-center">
        <h1 className="w-full text-4xl font-semibold tracking-wide text-white sm:text-6xl lg:text-7xl">{copy.subtitle}</h1>
        <p className="w-full text-base font-medium text-slate-100 sm:text-lg">
          {copy.description}
        </p>
        <p className="max-w-2xl text-sm text-slate-300 sm:text-base">{copy.guide}</p>
        <button onClick={onStart} className="btn-primary mt-2 cursor-pointer px-8">
          {copy.cta}
        </button>
        <a
          href="https://docs.google.com/forms/d/1rjHiUY27ZrwFb02XWUk8EKTwtPh2dtq4nC7ky3tZW8Q/edit"
          target="_blank"
          rel="noreferrer"
          className="btn-secondary mt-1 inline-flex cursor-pointer items-center justify-center px-6 text-sm"
        >
          {copy.contribute}
        </a>
      </div>

      <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce text-xs tracking-wider text-white/80">
        Scroll to explore
      </div>
    </div>
  )
}

