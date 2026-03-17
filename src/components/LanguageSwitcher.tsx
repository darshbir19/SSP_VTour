import { useState } from 'react'
import { useLanguage, type AppLanguage } from '../context/LanguageContext'

const languageOptions: { id: AppLanguage; label: string }[] = [
  { id: 'en', label: 'English' },
  { id: 'zh', label: '中文' },
  { id: 'hi', label: 'हिन्दी' },
]

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()
  const [open, setOpen] = useState(false)

  return (
    <div className="pointer-events-auto fixed right-5 top-4 z-[100] sm:right-6 sm:top-5">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="group inline-flex h-10 min-w-10 items-center justify-center gap-1 rounded-xl border border-white/25 bg-black/55 px-2 text-sm text-white backdrop-blur hover:bg-black/75"
        aria-label="Language"
        title="Language"
      >
        🌐
        <span className="hidden text-xs sm:inline">
          {languageOptions.find((o) => o.id === language)?.label}
        </span>
        <span className="pointer-events-none absolute -bottom-8 right-0 rounded bg-black/70 px-2 py-1 text-[11px] text-slate-100 opacity-0 transition-opacity group-hover:opacity-100">
          Language
        </span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 min-w-36 max-w-[calc(100vw-1.5rem)] rounded-xl border border-white/15 bg-[#0b101a]/95 p-1 text-sm text-white shadow-[0_8px_24px_rgba(0,0,0,0.45)] backdrop-blur">
          {languageOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => {
                setLanguage(option.id)
                setOpen(false)
              }}
              className={`block min-h-[44px] w-full cursor-pointer rounded-lg px-3 py-2 text-left ${
                language === option.id ? 'bg-white/15 text-white ring-1 ring-white/30' : 'hover:bg-white/10'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

