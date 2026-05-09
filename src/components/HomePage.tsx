import gccHero from '../assets/gcc.jpeg'
import apliuHero from '../assets/apliu.jpeg'
import phsHero from '../assets/phs.jpg'
import { useLanguage } from '../context/LanguageContext'

interface HomePageProps {
  onOpenLocation: (locationId: string) => void
  onOpenContribute: () => void
  onScrollToMap: () => void
}

const primaryLocations = [
  {
    id: 'apliu',
    title: 'Apliu Street Electronics Market',
    imageUrl: apliuHero,
    tag: 'Archive',
    storyCount: 'Stories: 24',
  },
  {
    id: 'fuk-wing',
    title: 'Fuk Wing Street',
    imageUrl: '/images/toy2005.jpg',
    tag: 'Memory',
    storyCount: 'Stories: 18',
  },
  {
    id: 'pei-ho',
    title: 'Pei Ho Street Wet Market',
    imageUrl: phsHero,
    tag: 'Soundscape',
    storyCount: 'Stories: 21',
  },
  {
    id: 'golden',
    title: 'Golden Computer Arcade',
    imageUrl: gccHero,
    tag: '360 View',
    storyCount: 'Stories: 16',
  },
]

const scrollDownLabelByLang = {
  en: 'Scroll Down',
  zh: '向下捲動',
  hi: 'नीचे स्क्रॉल करें',
} as const

export function HomePage({ onOpenLocation, onOpenContribute, onScrollToMap }: HomePageProps) {
  const { language } = useLanguage()
  const scrollDownLabel = scrollDownLabelByLang[language]

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[rgba(255,255,255,1)] px-4 pb-6 pt-0 text-[#0f172a] sm:px-6 lg:min-h-full lg:px-10 lg:pb-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.22),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(219,234,254,0.78),transparent_42%),linear-gradient(180deg,rgba(255,255,255,0.98),rgba(239,246,255,0.94))]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#ffffff] to-transparent" />

      <div className="fade-in relative z-10 mx-auto flex w-full max-w-7xl flex-col justify-start gap-5 pb-28 pt-0 sm:gap-6 sm:pb-28 sm:pt-2 lg:gap-5 lg:pb-[8.5rem] lg:pt-1">
        <header className="mx-auto flex w-full max-w-5xl flex-col items-center gap-2 text-center sm:gap-3">
          <h1 className="font-serif text-4xl font-semibold tracking-[-0.04em] text-[#0f172a] sm:text-6xl lg:text-7xl">
            Explore Sham Shui Po
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-[#334155] sm:text-base">
            Choose a place to experience.
          </p>
        </header>

        <div className="-mt-0.5 sm:-mt-1 lg:-mt-2">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            {primaryLocations.map((location) => (
              <button
                key={location.title}
                type="button"
                onClick={() => onOpenLocation(location.id)}
                className="group relative h-[50vh] min-h-[300px] cursor-pointer overflow-hidden rounded-[1.65rem] bg-[#ffffff] text-left shadow-[0_28px_80px_rgba(15,23,42,0.18)] outline-none ring-1 ring-[#2563eb]/35 transition duration-500 hover:-translate-y-1 hover:ring-[#2563eb] hover:shadow-[0_34px_95px_rgba(37,99,235,0.28)] focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-4 focus-visible:ring-offset-[#ffffff] md:h-[42vh] md:min-h-[320px] lg:min-h-[260px] lg:h-[min(400px,calc(100svh-16rem))]"
                aria-label={`Explore ${location.title}`}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition duration-700 ease-out group-hover:scale-110"
                  style={{ backgroundImage: `url(${location.imageUrl})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/72 transition duration-500 group-hover:from-black/30 group-hover:via-black/18 group-hover:to-black/82" />
                <div className="absolute right-4 top-4 rounded-full border border-[#2563eb]/70 bg-[#0f172a]/45 px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-white backdrop-blur-md">
                  {location.tag}
                </div>

                <div className="absolute inset-x-0 bottom-0 flex translate-y-1 flex-col gap-2 p-5 text-white transition duration-500 group-hover:translate-y-0 sm:p-6">
                  <p className="text-[0.62rem] font-semibold uppercase tracking-[0.26em] text-white/70">
                    {location.storyCount}
                  </p>
                  <h2 className="max-w-[16rem] text-2xl font-semibold leading-tight tracking-[-0.03em] sm:text-3xl lg:text-2xl xl:text-3xl">
                    {location.title}
                  </h2>
                  <span className="mt-2 inline-flex items-center text-xs font-semibold uppercase tracking-[0.28em] text-white/70 opacity-0 transition duration-500 group-hover:opacity-100">
                    Enter location
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onScrollToMap}
        aria-label="Scroll down to map"
        className="group absolute bottom-6 right-5 z-20 inline-flex flex-row-reverse items-center gap-2 rounded-full border border-[#2563eb]/45 bg-white/90 py-0 pr-0 pl-4 shadow-[0_18px_50px_rgba(15,23,42,0.18)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-[#2563eb] hover:bg-[#2563eb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-4 focus-visible:ring-offset-white sm:bottom-7 sm:gap-3 sm:pl-5 lg:bottom-8"
      >
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-2xl text-[#2563eb] transition duration-300 group-hover:text-white">
          ↓
        </span>
        <span className="max-w-[6.5rem] text-right text-[0.74rem] font-black uppercase leading-tight tracking-[0.2em] antialiased text-[#1d4ed8] transition duration-300 group-hover:text-white sm:max-w-[11rem] sm:text-[0.82rem] sm:tracking-[0.22em]">
          {scrollDownLabel}
        </span>
      </button>
    </div>
  )
}


