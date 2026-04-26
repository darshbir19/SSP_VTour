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
    <div className="pointer-events-auto relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="group inline-flex h-10 min-w-10 max-w-[45vw] items-center justify-center gap-1 rounded-xl border border-[#e5e7eb] bg-[#fdfaf6] px-3 text-sm text-[#1f2937] shadow-sm transition-all duration-300 ease-in-out hover:scale-[1.02] hover:border-amber-700/40"
        aria-label="Language"
        title="Language"
      >
        🌐
        <span className="truncate text-xs">
          {languageOptions.find((o) => o.id === language)?.label}
        </span>
        <span className="pointer-events-none absolute -bottom-8 right-0 rounded border border-[#e5e7eb] bg-[#fdfaf6] px-2 py-1 text-[11px] text-[#1f2937] opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
          Language
        </span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 min-w-36 max-w-[calc(100vw-1.5rem)] rounded-xl border border-[#e5e7eb] bg-[#fdfaf6] p-1 text-sm text-[#1f2937] shadow-sm">
          {languageOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => {
                setLanguage(option.id)
                setOpen(false)
              }}
              className={`block min-h-[44px] w-full cursor-pointer rounded-lg px-3 py-2 text-left ${
                language === option.id ? 'bg-amber-50 text-amber-700 ring-1 ring-amber-700/20' : 'hover:bg-[#f5f1e8]'
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

