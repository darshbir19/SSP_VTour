interface HomePageProps {
  onOpenLocation: (locationId: string) => void
  onOpenContribute: () => void
  onScrollToMap: () => void
}

const primaryLocations = [
  {
    id: 'apliu',
    title: 'Apliu Street Electronics Market',
    imageUrl: '/images/Apliu_2025.jpg',
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
    imageUrl: '/images/fieldtrip/fieldtrip-03.jpg',
    tag: 'Soundscape',
    storyCount: 'Stories: 21',
  },
  {
    id: 'golden',
    title: 'Golden Computer Arcade',
    imageUrl: '/images/fieldtrip/fieldtrip-04.jpg',
    tag: '360 View',
    storyCount: 'Stories: 16',
  },
]

export function HomePage({ onOpenLocation, onOpenContribute, onScrollToMap }: HomePageProps) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[rgba(255,255,255,1)] px-4 pb-10 pt-0 text-[#0f172a] sm:px-6 lg:px-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.22),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(219,234,254,0.78),transparent_42%),linear-gradient(180deg,rgba(255,255,255,0.98),rgba(239,246,255,0.94))]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#ffffff] to-transparent" />

      <div className="fade-in relative z-10 mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-7xl flex-col justify-center gap-8 pt-6 pb-4 sm:min-h-[calc(100vh-3.5rem)] sm:pt-8 lg:pt-10">
        <header className="mx-auto flex w-full max-w-5xl flex-col items-center gap-4 text-center">
          <h1 className="font-serif text-4xl font-semibold tracking-[-0.04em] text-[#0f172a] sm:text-6xl lg:text-7xl">
            Explore Sham Shui Po
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-[#334155] sm:text-base">
            Choose a place to experience.
          </p>
        </header>

        <div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            {primaryLocations.map((location) => (
              <button
                key={location.title}
                type="button"
                onClick={() => onOpenLocation(location.id)}
                className="group relative h-[58vh] min-h-[360px] cursor-pointer overflow-hidden rounded-[1.65rem] bg-[#ffffff] text-left shadow-[0_28px_80px_rgba(15,23,42,0.18)] outline-none ring-1 ring-[#2563eb]/35 transition duration-500 hover:-translate-y-1 hover:ring-[#2563eb] hover:shadow-[0_34px_95px_rgba(37,99,235,0.28)] focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-4 focus-visible:ring-offset-[#ffffff] md:h-[48vh] lg:h-[62vh]"
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
        className="absolute bottom-5 right-5 z-20 inline-flex h-14 w-14 items-center justify-center rounded-full border border-[#2563eb]/45 bg-white/90 text-2xl text-[#2563eb] shadow-[0_18px_50px_rgba(15,23,42,0.18)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-[#2563eb] hover:bg-[#2563eb] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-4 focus-visible:ring-offset-white"
      >
        ↓
      </button>
    </div>
  )
}


