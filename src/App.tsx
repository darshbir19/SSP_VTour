import { useState } from 'react'
import { HomePage } from './components/HomePage'
import { LanguageSwitcher } from './components/LanguageSwitcher'
import { MapTour } from './components/MapTour'
import { LanguageProvider } from './context/LanguageContext'

type ViewMode = 'home' | 'map'

export function App() {
  const [view, setView] = useState<ViewMode>('home')

  return (
    <LanguageProvider>
      <div className="relative h-screen w-screen bg-ssp-bg text-slate-100">
        <LanguageSwitcher />
        {view === 'home' ? (
          <HomePage onStart={() => setView('map')} />
        ) : (
          <MapTour onBack={() => setView('home')} />
        )}
      </div>
    </LanguageProvider>
  )
}

