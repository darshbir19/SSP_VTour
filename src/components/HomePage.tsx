import { useLanguage } from '../context/LanguageContext'

interface HomePageProps {
  onStart: () => void
}

export function HomePage({ onStart }: HomePageProps) {
  const { language } = useLanguage()
  const copy = {
    en: {
      subtitle: 'Sham Shui Po Sensory Tour',
      description:
        'Start simple: open a 2D district map, click a location pin, and hear a location-based soundscape while viewing that street.',
      cta: 'Open 2D Map Experience',
    },
    zh: {
      subtitle: '深水埗感官之旅',
      description: '从简单开始：打开二维地图，点击地点标记，在观看街景时聆听该地点的声音景观。',
      cta: '打开二维地图体验',
    },
    hi: {
      subtitle: 'शाम शुई पो सेंसरी टूर',
      description:
        'सरल शुरुआत करें: 2D जिला मानचित्र खोलें, किसी लोकेशन पिन पर क्लिक करें, और उस सड़क को देखते हुए उसी जगह की साउंडस्केप सुनें।',
      cta: '2D मैप अनुभव खोलें',
    },
  }[language]

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1536599018102-9f803c979981?w=1920&q=80)',
        }}
      />
      <div className="absolute inset-0 bg-black/65" />

      <div className="relative z-10 flex max-w-2xl flex-col items-center gap-5 px-6 text-center">
        <h1 className="neon-title font-neon text-3xl font-bold tracking-wide text-white sm:text-5xl">
          FeelSSP
        </h1>
        <p className="text-lg text-slate-200">{copy.subtitle}</p>
        <p className="max-w-lg text-sm text-slate-300 sm:text-base">
          {copy.description}
        </p>
        <button
          onClick={onStart}
          className="shadow-neon-red hover:shadow-neon-green mt-2 cursor-pointer rounded-lg border border-neon-red/70 bg-neon-red/20 px-8 py-3 font-semibold text-white transition-all hover:border-neon-green/70 hover:bg-neon-green/20"
        >
          {copy.cta}
        </button>
      </div>
    </div>
  )
}

