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
    <div className="pointer-events-auto fixed right-3 top-3 z-[100] sm:right-4 sm:top-4">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-black/55 text-sm text-white backdrop-blur hover:bg-black/75"
        aria-label="Change language"
      >
        🌐
      </button>

      {open && (
        <div className="absolute right-0 mt-2 min-w-36 rounded-lg border border-white/15 bg-[#0b101a]/95 p-1 text-sm text-white shadow-[0_8px_24px_rgba(0,0,0,0.45)] backdrop-blur">
          {languageOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => {
                setLanguage(option.id)
                setOpen(false)
              }}
              className={`block w-full cursor-pointer rounded px-3 py-2 text-left ${
                language === option.id ? 'bg-neon-green/20 text-neon-green' : 'hover:bg-white/10'
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

