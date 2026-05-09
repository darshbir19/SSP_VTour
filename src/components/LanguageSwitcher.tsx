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
        className="group inline-flex h-10 min-w-10 max-w-[45vw] items-center justify-center gap-1 rounded-xl border border-[#2563eb]/60 bg-[#ffffff] px-3 text-sm text-[#0f172a] shadow-sm transition-all duration-300 ease-in-out hover:scale-[1.02] hover:border-[#2563eb]"
        aria-label="Language"
        title="Language"
      >
        🌐
        <span className="truncate text-xs">
          {languageOptions.find((o) => o.id === language)?.label}
        </span>
        <span className="pointer-events-none absolute -bottom-8 right-0 rounded border border-[#ffffff]/70 bg-[#ffffff] px-2 py-1 text-[11px] text-[#0f172a] opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
          Language
        </span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 min-w-36 max-w-[calc(100vw-1.5rem)] rounded-xl border border-[#ffffff]/70 bg-[#ffffff] p-1 text-sm text-[#0f172a] shadow-sm">
          {languageOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => {
                setLanguage(option.id)
                setOpen(false)
              }}
              className={`block min-h-[44px] w-full cursor-pointer rounded-lg px-3 py-2 text-left ${
                language === option.id ? 'bg-[#2563eb] text-white ring-1 ring-[#2563eb]/40' : 'hover:bg-[#ffffff]/60'
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



