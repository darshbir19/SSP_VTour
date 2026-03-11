interface Props {
  onEnter: () => void
}

export function HeroLanding({ onEnter }: Props) {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
      {/* Background image with overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1536599018102-9f803c979981?w=1920&q=80)',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />

      {/* Content */}
      <div className="relative z-10 flex max-w-2xl flex-col items-center gap-6 px-6 text-center">
        <h1 className="neon-title font-neon text-3xl leading-tight font-bold tracking-wide text-white sm:text-5xl">
          深水埗感官之旅
          <br />
          <span className="text-neon-green text-2xl sm:text-4xl">
            FeelSSP – Sham Shui Po Sensory Experience
          </span>
        </h1>

        <p className="max-w-md text-lg text-slate-300 italic">
          Walk the streets. Hear the soul. Feel the real Hong Kong.
        </p>

        <button
          onClick={onEnter}
          className="shadow-neon-red hover:shadow-neon-green mt-4 cursor-pointer rounded-lg border border-neon-red/60 bg-neon-red/20 px-10 py-4 font-neon text-lg font-semibold text-white backdrop-blur transition-all duration-300 hover:bg-neon-green/20 hover:border-neon-green/60"
        >
          Enter the Experience
        </button>

        <p className="mt-2 text-xs tracking-widest text-slate-500 uppercase">
          Start from Sham Shui Po MTR Exit A2
        </p>
      </div>
    </div>
  )
}
